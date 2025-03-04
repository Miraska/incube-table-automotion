import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsGateway } from './automations.gateway';
import { NodeVM, VMScript } from 'vm2';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { StatusType } from './automation.types';
import { BaseApi } from 'src/automations-api/base-api';

/**
 * AutomationsRunner отвечает за непосредственный запуск автоматизации:
 * 1. Проверку условий (conditions),
 * 2. Выполнение шагов (actions),
 * 3. Ведение логов в базе (execution/action logs),
 * 4. Отправку уведомлений через WebSocket.
 */
@Injectable()
export class AutomationsRunner {
  private readonly logger = new Logger(AutomationsRunner.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AutomationsGateway,
  ) {}

  /**
   * Запустить автоматизацию (по её ID) с переданными eventData.
   * 1) Найти Automation в БД
   * 2) Создать запись executionLog
   * 3) Проверить conditions
   * 4) Выполнить Actions (каждый с conditions)
   * 5) Записать результаты и ошибку (если была)
   * 6) Отправить уведомление через WebSocket
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

    // 2) Создаём запись в логах (AutomationExecutionLog)
    let executionLog = await this.prisma.automationExecutionLog.create({
      data: {
        automationId: automation.id,
        eventData,
      },
    });

    // 3) Проверяем условия (conditions) самой автоматизации
    let automationPass = false;
    try {
      automationPass = await this.checkConditions(automation.conditions, {
        eventData,
        record: eventData?.record,
      });
    } catch (err) {
      // Если тут возникла ошибка — логируем и завершаемся
      this.logger.error(`Error checking automation conditions: ${err}`, (err as Error).stack);
      // Проставим статус error в executionLog и выйдем
      executionLog = await this.prisma.automationExecutionLog.update({
        where: { id: executionLog.id },
        data: {
          status: 'error',
          error: (err as Error).message || String(err),
        },
      });
      this.gateway.broadcastAutomationRun(executionLog);
      return executionLog;
    }

    if (!automationPass) {
      // Условие не выполнено — помечаем лог статусом success,
      // но говорим, что действия не выполнялись
      this.logger.log('Automation conditions not met, skipping actions');

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

    // 4) Выполняем экшены
    // Сортируем actions по order
    const actionsSorted = automation.actions.sort((a, b) => a.order - b.order);

    // Контекст, в котором скрипты могут обмениваться данными
    const context = {
      eventData,
      record: eventData?.record || null,
    };

    let finalResult: any = null;
    let executionStatus: StatusType = 'success';
    let errorMessage: string | undefined;

    try {
      for (const action of actionsSorted) {
        // 4.1) Проверяем conditions шага
        const stepPass = await this.checkConditions(action.conditions, context);
        if (!stepPass) {
          // Шаг пропускается
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

        // 4.2) Пытаемся выполнить action
        try {
          stepResult = await this.runAction(action.type, action.params, context);
          // Если нужно, сохраняем результат в контексте
          context[`step_${action.id}_result`] = stepResult;
        } catch (err: any) {
          stepStatus = 'error';
          stepError = err.message || String(err);
          this.logger.error(`Error in action ${action.id}: ${stepError}`, err.stack);
        }

        // 4.3) Записываем результат действия в БД
        await this.prisma.automationActionExecutionLog.create({
          data: {
            executionId: executionLog.id,
            actionId: action.id,
            status: stepStatus,
            result: stepStatus === 'success' ? stepResult : undefined,
            error: stepError,
          },
        });

        // 4.4) Если шаг упал с ошибкой — прерываем дальнейшее выполнение
        if (stepStatus === 'error') {
          throw new Error(stepError);
        }
      }

      finalResult = context;
    } catch (error) {
      // Общая ошибка в процессе выполнения actions
      errorMessage = (error as Error).message || String(error);
      executionStatus = 'error';
    }

    // 5) Финализируем лог
    executionLog = await this.prisma.automationExecutionLog.update({
      where: { id: executionLog.id },
      data: {
        status: executionStatus,
        result: finalResult,
        error: errorMessage,
      },
    });

    // 6) Уведомляем через WebSocket
    this.gateway.broadcastAutomationRun(executionLog);

    return executionLog;
  }

  /**
   * Запуск конкретного action (action.type / action.params).
   * Расширяйте это методом, если добавляются новые виды actions.
   */
  private async runAction(type: string, params: any, context: any) {
    switch (type) {
      case 'runScript':
        return this.runScript(params?.script, context);

      case 'callAPI':
        return this.callAPI(params);

      case 'sendNotification':
        return this.sendNotification(params);

      case 'updateRecord':
        return this.updateRecord(params);

      case 'sendEmail':
        return this.sendEmail(params, context);

      case 'sendSlack':
        return this.sendSlack(params, context);

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  /**
   * callAPI — делает HTTP-запрос по указанному URL c помощью axios.
   */
  private async callAPI(params: any) {
    const method = params?.method || 'POST';
    const url = params?.url;
    if (!url) throw new Error('callAPI missing url');

    const payload = params?.payload || {};
    const resp = await axios.request({ method, url, data: payload });
    return resp.data;
  }

  /**
   * sendNotification — простой лог-экшен (пример).
   */
  private sendNotification(params: any) {
    const message = params?.message || 'No message';
    this.logger.log(`[sendNotification] -> ${message}`);
    return { notificationSent: true, message };
  }

  /**
   * updateRecord — здесь можно обращаться к динамическим таблицам (Record),
   * или к любым вашим сущностям в БД (в зависимости от логики).
   */
  private async updateRecord(params: any) {
    // Пример для демонстрации: ничего не делает, только возвращает
    // Можно при необходимости внедрить логику prisma.record.update() и т.д.
    return { updated: false, msg: 'No real update performed (example)' };
  }

  /**
   * sendEmail — отправка e-mail через nodemailer,
   * поддержка Handlebars-шаблонов для subject/body.
   */
  private async sendEmail(params: any, context: any) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subjectTemplate = Handlebars.compile(params?.subject || '');
    const bodyTemplate = Handlebars.compile(params?.body || '');

    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to: params?.to,
      subject: subjectTemplate(context),
      text: bodyTemplate(context),
    };

    const info = await transporter.sendMail(mailOptions);
    return { messageId: info.messageId, accepted: info.accepted };
  }

  /**
   * sendSlack — отправка сообщения в Slack через Webhook,
   * тоже поддержка Handlebars-шаблона для текста.
   */
  private async sendSlack(params: any, context: any) {
    const webhookUrl = params?.webhookUrl;
    if (!webhookUrl) {
      throw new Error('sendSlack requires webhookUrl');
    }
    const textTemplate = Handlebars.compile(params?.text || '');
    const text = textTemplate(context);

    const resp = await axios.post(webhookUrl, { text });
    return { ok: true, resp: resp.data };
  }

  /**
   * runScript — запуск пользовательского JS-скрипта (action=runScript) через vm2.
   * В sandbox передаётся объект base (airtable-like API), fetch, context.
   */
  private runScript(scriptContent: string, context: any) {
    if (!scriptContent) {
      throw new Error('No script content');
    }
  
    const base = new BaseApi(this.prisma);
    const vm = new NodeVM({
      console: 'inherit',
      timeout: 30000,
      sandbox: {
        base,
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
    try {
      return vm.run(script);
    } catch (error) {
      this.logger.error('Error running script:', error);
      throw error;
    }
  }

  /**
   * checkConditions — рекурсивно проверяет условия (AND/OR, equals, not, in, gte, lte).
   */
  private async checkConditions(conditions: any, context: any): Promise<boolean> {
    // Если нет conditions, считаем что условие выполнено (true).
    if (!conditions) return true;

    // Если это объект вида { operator, conditions: [ ... ] }
    // (группа условий с логикой AND/OR)
    if (conditions.operator && Array.isArray(conditions.conditions)) {
      const subResults = await Promise.all(
        conditions.conditions.map((c: any) => this.checkConditions(c, context)),
      );
      if (conditions.operator === 'AND') {
        return subResults.every(Boolean);
      } else if (conditions.operator === 'OR') {
        return subResults.some(Boolean);
      }
      return true;
    }

    // Иначе предполагаем, что это "базовое" условие.
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
        // Если compare не известен, считаем что условие пройдено
        return true;
    }
  }
}
