// src/automations/automations.runner.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsGateway } from './automations.gateway';
import { NodeVM, VMScript } from 'vm2';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { StatusType } from './automation.types';
import { BaseApi } from 'src/automations-api/base-api';

@Injectable()
export class AutomationsRunner {
  private readonly logger = new Logger(AutomationsRunner.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AutomationsGateway,
  ) {}

  /**
   * Запустить автоматизацию с переданными eventData.
   * isTest = true => это тестовый запуск (сохраним isTest в логах).
   */
  async runAutomation(automationId: string, eventData: any, isTest = false) {
    // 1) Находим автоматизацию
    const automation = await this.prisma.automation.findUnique({
      where: { id: automationId },
      include: { actions: true },
    });
    if (!automation) {
      throw new Error(`Automation not found: ${automationId}`);
    }

    // Если автоматизация выключена (и это не тест), выходим
    if (!automation.enabled && !isTest) {
      this.logger.log(`Automation ${automationId} is disabled`);
      return null;
    }

    // 2) Создаём запись в логах
    let executionLog = await this.prisma.automationExecutionLog.create({
      data: {
        automationId: automation.id,
        eventData,
        isTest,
      },
    });

    // 3) Проверка общих условий (conditions) автоматизации
    let automationPass = false;
    try {
      automationPass = await this.checkConditions(automation.conditions, { eventData });
    } catch (err) {
      await this.prisma.automationExecutionLog.update({
        where: { id: executionLog.id },
        data: {
          status: 'error',
          error: String(err),
        },
      });
      return;
    }

    if (!automationPass && !isTest) {
      // условие не выполнено => статус success, но нет действий
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

    // 4) Выполняем actions по порядку
    const actionsSorted = automation.actions.sort((a, b) => a.order - b.order);
    const context = { eventData };

    let finalResult: any = null;
    let executionStatus: StatusType = 'success';
    let errorMessage: string | undefined;

    try {
      for (const action of actionsSorted) {
        // 4.1) Проверяем conditions экшена
        const stepPass = await this.checkConditions(action.conditions, context);
        if (!stepPass && !isTest) {
          // Пропускаем экшен
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
        const consoleLogs: string[] = [];

        try {
          stepResult = await this.runAction(
            action.type,
            action.params,
            context,
            action.inputVars || {},
            consoleLogs,
          );
          context[`step_${action.id}_result`] = stepResult;
        } catch (err: any) {
          stepStatus = 'error';
          stepError = err.message || String(err);
          this.logger.error(`Action error: ${stepError}`, err.stack);
        }

        // 4.2) Записываем лог действия
        await this.prisma.automationActionExecutionLog.create({
          data: {
            executionId: executionLog.id,
            actionId: action.id,
            status: stepStatus,
            result: stepStatus === 'success' ? stepResult : undefined,
            error: stepError,
            consoleLogs,
          },
        });

        if (stepStatus === 'error') {
          throw new Error(stepError);
        }
      }

      finalResult = context;
    } catch (error) {
      errorMessage = (error as Error).message || String(error);
      executionStatus = 'error';
    }

    // 5) Обновляем общий лог
    executionLog = await this.prisma.automationExecutionLog.update({
      where: { id: executionLog.id },
      data: {
        status: executionStatus,
        result: finalResult,
        error: errorMessage,
      },
    });

    // 6) Шлём WebSocket
    this.gateway.broadcastAutomationRun(executionLog);
    return executionLog;
  }

  /**
   * Метод runAction: в зависимости от типа экшена вызываем соответствующий метод.
   */
  private async runAction(
    type: string,
    params: any,
    context: any,
    inputVars: any,
    consoleLogs: string[],
  ) {
    switch (type) {
      case 'runScript':
        return this.runScript(params?.script, context, inputVars, consoleLogs);
      case 'callAPI':
        return this.callAPI(params);
      case 'sendNotification':
        return this.sendNotification(params);
      case 'sendEmail':
        return this.sendEmail(params, context);
      case 'sendSlack':
        return this.sendSlack(params, context);
      case 'updateRecord':
        return this.updateRecord(params);
      case 'createRecord':
        return this.createRecord(params);
      case 'deleteRecord':
        return this.deleteRecord(params);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  /**
   * Запуск скрипта в vm2 + сбор console.log
   */
  private runScript(
    scriptContent: string,
    context: any,
    inputVars: any,
    consoleLogs: string[],
  ) {
    if (!scriptContent) {
      throw new Error('No script content');
    }

    const base = new BaseApi(this.prisma);
    const input = {
      config: () => inputVars || {},
    };

    const vm = new NodeVM({
      console: 'redirect',
      timeout: 30000,
      sandbox: {
        base,
        context,
        input,
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

    vm.on('console.log', (msg) => {
      consoleLogs.push(String(msg));
    });
    vm.on('console.error', (err) => {
      consoleLogs.push(`[error] ${String(err)}`);
    });
    vm.on('console.warn', (w) => {
      consoleLogs.push(`[warn] ${String(w)}`);
    });

    const script = new VMScript(scriptContent);
    return vm.run(script);
  }

  /**
   * callAPI — делает HTTP-запрос по указанному URL с помощью axios.
   */
  private async callAPI(params: any) {
    const method = params?.method || 'POST';
    const url = params?.url;
    if (!url) throw new Error('callAPI requires url');

    const payload = params?.payload || {};
    const resp = await axios.request({ method, url, data: payload });
    return resp.data;
  }

  /**
   * sendNotification — простой экшен, пример логирования/уведомления.
   */
  private sendNotification(params: any) {
    const message = params?.message || 'No message';
    this.logger.log(`[sendNotification] -> ${message}`);
    return { notificationSent: true, message };
  }

  /**
   * sendEmail через nodemailer + шаблоны Handlebars.
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
   * sendSlack — отправка сообщения в Slack через webhookUrl.
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
   * updateRecord — пример обращения к вашей БД (или через BaseApi).
   * Тут можно расширять логику под нужды.
   */
  private async updateRecord(params: any) {
    // Для простоты
    const tableName = params?.tableName;
    const recordId = params?.recordId;
    const fields = params?.fields || {};

    if (!tableName || !recordId) {
      throw new Error('updateRecord requires tableName and recordId');
    }

    const base = new BaseApi(this.prisma);
    const table = base.getTable(tableName);
    await table.updateRecordAsync(recordId, fields);
    return { updated: true, recordId, fields };
  }

  private async createRecord(params: any) {
    const tableName = params?.tableName;
    const fields = params?.fields || {};
    if (!tableName) {
      throw new Error('createRecord requires tableName');
    }

    const base = new BaseApi(this.prisma);
    const table = base.getTable(tableName);
    const newId = await table.createRecordAsync(fields);
    return { createdId: newId };
  }

  private async deleteRecord(params: any) {
    const tableName = params?.tableName;
    const recordId = params?.recordId;
    if (!tableName || !recordId) {
      throw new Error('deleteRecord requires tableName and recordId');
    }

    const base = new BaseApi(this.prisma);
    const table = base.getTable(tableName);
    await table.deleteRecordAsync(recordId);
    return { deleted: true, recordId };
  }

  /**
   * Пример примитивной проверки условий (JSON).
   * Можно расширять под AND/OR, сравнения, in, contains и т. д.
   */
  private async checkConditions(conditions: any, context: any): Promise<boolean> {
    if (!conditions) return true;
    // В реальном проекте распарсите и реализуйте сложную логику
    return true;
  }
}
