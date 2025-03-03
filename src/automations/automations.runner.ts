// src/automations/automations.runner.ts

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsGateway } from './automations.gateway';
import { NodeVM, VMScript } from 'vm2';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { StatusType } from './automation.types';

@Injectable()
export class AutomationsRunner {
  private readonly logger = new Logger(AutomationsRunner.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AutomationsGateway,
  ) {}

  /**
   * Основной метод запуска автоматизации
   */
  async runAutomation(automationId: string, eventData: any) {
    // 1) Получаем автоматизацию + actions
    const automation = await this.prisma.automation.findUnique({
      where: { id: automationId },
      include: { actions: true },
    });
    if (!automation) {
      throw new Error(`Automation not found: ${automationId}`);
    }
    if (!automation.enabled) {
      this.logger.log(`Automation ${automationId} is disabled`);
      return null;
    }

    // 2) Создаём запись в логах
    let executionLog = await this.prisma.automationExecutionLog.create({
      data: {
        automationId: automation.id,
        eventData,
      },
    });

    // 3) Проверка conditions на уровне automation (общая)
    const automationPass = await this.checkConditions(automation.conditions, {
      eventData,
      record: eventData?.record, // часто передаём record
    });

    if (!automationPass) {
      this.logger.log(`Automation conditions not met, skipping actions`);
      executionLog = await this.prisma.automationExecutionLog.update({
        where: { id: executionLog.id },
        data: {
          status: 'success',
          result: { msg: 'Condition not met, no actions performed' },
        },
      });
      this.gateway.broadcastAutomationRun(executionLog);
      return executionLog;
    }

    // 4) Выполняем экшены по порядку
    const context = {
      eventData,
      record: eventData?.record || null,
    };
    let finalResult: any = null;
    let executionStatus: StatusType = 'success';
    let errorMessage: string | undefined;

    // Сортируем actions
    const actionsSorted = automation.actions.sort((a, b) => a.order - b.order);

    try {
      for (const action of actionsSorted) {
        // Сначала проверяем conditions для конкретного шага
        const stepPass = await this.checkConditions(action.conditions, context);
        if (!stepPass) {
          // Логируем пропуск
          await this.prisma.automationActionExecutionLog.create({
            data: {
              executionId: executionLog.id,
              actionId: action.id,
              status: 'success',
              result: { msg: 'Step skipped: condition not met' },
            },
          });
          continue;
        }

        let stepResult: any;
        let stepStatus: StatusType = 'success';
        let stepError: string | undefined;

        try {
          // Выполняем экшен
          stepResult = await this.runAction(action, context);
          // Сохраняем результат в context, чтобы последующие шаги могли его использовать
          context[`step_${action.id}_result`] = stepResult;
        } catch (err: any) {
          stepStatus = 'error';
          stepError = err.message || String(err);
        }

        // Записываем лог шага
        await this.prisma.automationActionExecutionLog.create({
          data: {
            executionId: executionLog.id,
            actionId: action.id,
            status: stepStatus,
            result: stepResult,
            error: stepError,
          },
        });

        // Если ошибка — выходим из цикла (можно настроить иначе)
        if (stepStatus === 'error') {
          throw new Error(stepError);
        }
      }

      finalResult = context; // всё, что насобирали
    } catch (error) {
      errorMessage = (error as Error).message || String(error);
      executionStatus = 'error';
    }

    // 5) Обновляем итоговый лог
    executionLog = await this.prisma.automationExecutionLog.update({
      where: { id: executionLog.id },
      data: {
        status: executionStatus,
        result: finalResult,
        error: errorMessage,
      },
    });

    // Уведомляем по WebSocket
    this.gateway.broadcastAutomationRun(executionLog);
    return executionLog;
  }

  /**
   * Выполнение одного экшена
   */
  private async runAction(action: any, context: any) {
    const { type, params } = action;

    switch (type) {
      case 'runScript': {
        return this.runScript(params?.script, context);
      }

      case 'callAPI': {
        const method = params?.method || 'POST';
        const url = params?.url;
        const payload = params?.payload || {};
        if (!url) {
          throw new Error(`callAPI missing url`);
        }
        const resp = await axios.request({ method, url, data: payload });
        return resp.data;
      }

      case 'sendNotification': {
        const message = params?.message || 'No message';
        this.logger.log(`[sendNotification] -> ${message}`);
        return { notificationSent: true, message };
      }

      case 'updateRecord': {
        // Пример: обновляем запись в таблице 'Field' или другой.
        const tableName = params?.tableName;
        const recordId = params?.recordId;
        const dataToUpdate = params?.data;
        if (!tableName || !recordId) {
          throw new Error(`updateRecord requires tableName and recordId`);
        }

        // Пример для 'Field'
        if (tableName === 'Field') {
          return this.prisma.field.update({
            where: { id: recordId },
            data: dataToUpdate,
          });
        }
        // Добавьте логику для других таблиц
        return { updated: false, msg: 'No real update performed' };
      }

      case 'sendEmail': {
        // Параметры: { to, subject, body } (+ любые дополнительные)
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: +process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Можно использовать шаблонизацию для subject/body
        const subjectTemplate = Handlebars.compile(params?.subject || '');
        const bodyTemplate = Handlebars.compile(params?.body || '');

        const mailOptions = {
          from: process.env.SMTP_FROM || 'no-reply@example.com',
          to: params?.to,
          subject: subjectTemplate(context),
          text: bodyTemplate(context), // или html: ...
        };

        const info = await transporter.sendMail(mailOptions);
        return { messageId: info.messageId, accepted: info.accepted };
      }

      case 'sendSlack': {
        // Параметры: { webhookUrl, text }
        const webhookUrl = params?.webhookUrl;
        if (!webhookUrl) {
          throw new Error(`sendSlack requires webhookUrl`);
        }
        const textTemplate = Handlebars.compile(params?.text || '');
        const text = textTemplate(context);

        const resp = await axios.post(webhookUrl, { text });
        return { ok: true, resp: resp.data };
      }

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  /**
   * Расширенная проверка условий
   * Поддерживаем логику:
   * {
   *   operator: "AND" | "OR",
   *   conditions: [ ... ]
   * }
   * или лист вида:
   * {
   *   field: "status",
   *   compare: "equals",
   *   value: "active"
   * }
   */
  private async checkConditions(conditions: any, context: any): Promise<boolean> {
    if (!conditions) return true;

    // Если это объект вида { operator, conditions: [...] }
    if (conditions.operator && Array.isArray(conditions.conditions)) {
      const subResults = await Promise.all(
        conditions.conditions.map((c: any) => this.checkConditions(c, context)),
      );

      if (conditions.operator === 'AND') {
        return subResults.every(Boolean);
      } else if (conditions.operator === 'OR') {
        return subResults.some(Boolean);
      }
      return true; // либо расширять поддержку NOT, и т.д.
    }

    // Если это "лист" условия
    const recordData = context?.record || context?.eventData;
    const field = conditions.field;
    const compare = conditions.compare;
    const value = conditions.value;

    const fieldValue = recordData?.[field];

    switch (compare) {
      case 'equals':
        return fieldValue === value;
      case 'not':
        return fieldValue !== value;
      case 'in':
        return Array.isArray(value) ? value.includes(fieldValue) : false;
      case 'gte':
        return fieldValue >= value;
      case 'lte':
        return fieldValue <= value;
      default:
        // при неизвестном операторе вернём true или false, на ваше усмотрение
        return true;
    }
  }

  /**
   * Запуск скрипта через vm2 (JS-код)
   */
  private runScript(scriptContent: string, context: any) {
    if (!scriptContent) {
      throw new Error(`No script content`);
    }
    const vm = new NodeVM({
      console: 'inherit',
      timeout: 3000,
      sandbox: {
        // Передаём данные, которые хотим сделать доступными внутри скрипта
        context,
        fetch: async (url: string, options?: any) => {
          const resp = await axios.request({
            method: options?.method || 'GET',
            url,
            data: options?.body,
          });
          return resp.data;
        },
      },
      require: false,
    });

    const script = new VMScript(scriptContent);
    return vm.run(script);
  }
}
