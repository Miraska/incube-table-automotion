// src/automations/automations.runner.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsGateway } from './automations.gateway';
import { NodeVM, VMScript } from 'vm2';
import axios, { AxiosRequestConfig } from 'axios';
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
   * Запускает автоматизацию с переданными eventData.
   * @param automationId - Идентификатор автоматизации
   * @param eventData - Данные события, которые будут переданы в контекст
   * @param isTest - Флаг тестового запуска (по умолчанию false)
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
      automationPass = await this.evaluateConditions(automation.conditions, { eventData });
    } catch (err) {
      await this.updateExecutionLogWithError(executionLog.id, err);
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
    const actionsSorted = this.getSortedActions(automation.actions);
    const context = { eventData };

    let finalResult: any = null;
    let executionStatus: StatusType = 'success';
    let errorMessage: string | undefined;

    try {
      for (const action of actionsSorted) {
        // 4.1) Проверяем conditions экшена
        const stepPass = await this.evaluateConditions(action.conditions, context);
        if (!stepPass && !isTest) {
          console.log(`Step skipped: condition not met`);
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

        const { stepStatus, stepResult, stepError, consoleLogs } = await this.runActionSafely(
          action,
          context,
          executionLog.id,
        );

        // Записываем результат каждого экшена в контекст
        if (stepStatus === 'success') {
          context[`step_${action.id}_result`] = stepResult;
        } else {
          // Если экшен упал с ошибкой, прерываем дальнейшее выполнение
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
   * Метод, который оборачивает вызов runAction в try/catch
   * и формирует удобный для логирования результат.
   */
  private async runActionSafely(action: any, context: any, executionLogId: string) {
    const consoleLogs: string[] = [];
    let stepStatus: StatusType = 'success';
    let stepError: string | undefined;
    let stepResult: any;

    try {
      stepResult = await this.runAction(
        action.type,
        action.params,
        context,
        action.inputVars || {},
        consoleLogs,
      );
    } catch (err: any) {
      stepStatus = 'error';
      stepError = err.message || String(err);
      this.logger.error(`Action error: ${stepError}`, err.stack);
    }

    // Записываем лог действия
    await this.prisma.automationActionExecutionLog.create({
      data: {
        executionId: executionLogId,
        actionId: action.id,
        status: stepStatus,
        result: stepStatus === 'success' ? stepResult : undefined,
        error: stepError,
        consoleLogs,
      },
    });

    return { stepStatus, stepResult, stepError, consoleLogs };
  }

  /**
   * Главный метод определения экшена по типу и запуска нужной логики.
   */
  private async runAction(
    type: string,
    params: any,
    context: any,
    inputVars: any,
    consoleLogs: string[],
  ): Promise<any> {
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
   * Выполняет скрипт в vm2, собирая console.log в массив consoleLogs.
   */
  private runScript(
    scriptContent: string,
    context: any,
    inputVars: any,
    consoleLogs: string[],
  ): any {
    if (!scriptContent) {
      throw new Error('No script content provided for runScript');
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
        fetch: async (url: string, options?: AxiosRequestConfig) => {
          const { method = 'GET', data } = options || {};
          const resp = await axios.request({ method, url, data });
          return resp.data;
        },
        try: (fn: any) => {
          try {
            return fn();
          } catch (err) {
            return err;
          }
        },
        catch: (fn: any) => (err: any) => fn(err),
      },
      require: false,
    });

    vm.on('console.log', (msg) => {
      consoleLogs.push(String(msg));
      console.log(msg);
    });
    vm.on('console.error', (err) => {
      consoleLogs.push(`[error] ${String(err)}`);
      console.error(err);
    });
    vm.on('console.warn', (w) => {
      consoleLogs.push(`[warn] ${String(w)}`);
      console.warn(w);
    });

    const script = new VMScript(scriptContent);
    return vm.run(script);
  }

  /**
   * callAPI — делает HTTP-запрос по указанному URL с помощью axios.
   */
  private async callAPI(params: any) {
    const { method = 'POST', url, payload = {} } = params || {};
    if (!url) {
      throw new Error('callAPI requires "url" parameter');
    }

    const resp = await axios.request({ method, url, data: payload });
    return resp.data;
  }

  /**
   * sendNotification — простой экшен-уведомление.
   */
  private sendNotification(params: any) {
    const message = params?.message || 'No message provided';
    this.logger.log(`[sendNotification] -> ${message}`);
    return { notificationSent: true, message };
  }

  /**
   * sendEmail — отправка письма через nodemailer с использованием шаблонов Handlebars.
   */
  private async sendEmail(params: any, context: any) {
    if (!params?.to) {
      throw new Error('sendEmail requires "to" parameter');
    }

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
      to: params.to,
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
    const { webhookUrl, text: templateStr } = params || {};
    if (!webhookUrl) {
      throw new Error('sendSlack requires "webhookUrl" parameter');
    }

    const textTemplate = Handlebars.compile(templateStr || '');
    const text = textTemplate(context);

    const resp = await axios.post(webhookUrl, { text });
    return { ok: true, resp: resp.data };
  }

  /**
   * updateRecord — обновляет запись в базе данных.
   */
  private async updateRecord(params: any) {
    const { tableName, recordId, fields = {} } = params || {};
    if (!tableName || !recordId) {
      throw new Error('updateRecord requires both "tableName" and "recordId"');
    }

    const base = new BaseApi(this.prisma);
    const table = base.getTable(tableName);
    await table.updateRecordAsync(recordId, fields);

    return { updated: true, recordId, fields };
  }

  /**
   * createRecord — создаёт новую запись в базе данных.
   */
  private async createRecord(params: any) {
    const { tableName, fields = {} } = params || {};
    if (!tableName) {
      throw new Error('createRecord requires "tableName"');
    }

    const base = new BaseApi(this.prisma);
    const table = base.getTable(tableName);
    const createdId = await table.createRecordAsync(fields);

    return { created: true, createdId };
  }

  /**
   * deleteRecord — удаляет запись из базы данных.
   */
  private async deleteRecord(params: any) {
    const { tableName, recordId } = params || {};
    if (!tableName || !recordId) {
      throw new Error('deleteRecord requires both "tableName" and "recordId"');
    }

    const base = new BaseApi(this.prisma);
    const table = base.getTable(tableName);
    await table.deleteRecordAsync(recordId);

    return { deleted: true, recordId };
  }

  /**
   * Простая проверка условий (JSON). В реальном проекте стоит
   * распарсить `conditions` и реализовать логику AND/OR, сравнения,
   * in, contains и т. д. Возвращает true/false в зависимости
   * от того, выполнены ли условия.
   */
  private async evaluateConditions(conditions: any, context: any): Promise<boolean> {
    if (!conditions) return true;
    // В реальном проекте добавить полноценный парсинг.
    return true;
  }

  /**
   * Получение actions, отсортированных по order.
   */
  private getSortedActions(actions: any[]) {
    return actions.sort((a, b) => a.order - b.order);
  }

  /**
   * Обновляет ExecutionLog, выставляя статус 'error' и сохраняя
   * сообщение об ошибке.
   */
  private async updateExecutionLogWithError(executionLogId: string, err: any) {
    await this.prisma.automationExecutionLog.update({
      where: { id: executionLogId },
      data: {
        status: 'error',
        error: String(err),
      },
    });
  }
}
