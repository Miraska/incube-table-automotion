// src/automations/automations.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsRunner } from './automations.runner';
import { AutomationsScheduler } from './automations.scheduler';
import { AutomationsGateway } from './automations.gateway';
import { TriggerConfig } from './automation.types';

@Injectable()
export class AutomationsService {
  private readonly logger = new Logger(AutomationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly runner: AutomationsRunner,
    private readonly scheduler: AutomationsScheduler,
    private readonly gateway: AutomationsGateway,
  ) {}

  // ========== AUTOMATIONS CRUD ==========

  async listAutomations() {
    return this.prisma.automation.findMany({
      orderBy: { createdTime: 'desc' },
    });
  }

  async createAutomation(data: any) {
    const automation = await this.prisma.automation.create({ data });

    // Если автоматизация типа scheduled и включена => регистрируем cron
    if (automation.triggerType === 'scheduled' && automation.enabled) {
      const config = automation.triggerConfig as TriggerConfig;
      const cronExpr = config?.cron || '0 * * * *';
      this.scheduler.registerCronJob(automation.id, cronExpr);
    }

    this.gateway.broadcastAutomationUpdate(automation);
    return automation;
  }

  async getAutomation(id: string) {
    return this.prisma.automation.findUnique({ where: { id } });
  }

  async updateAutomation(id: string, data: any) {
    const old = await this.prisma.automation.findUnique({ where: { id } });
    if (!old) throw new Error(`Automation not found: ${id}`);

    const updated = await this.prisma.automation.update({
      where: { id },
      data,
    });

    // Логика для cron
    if (old.triggerType === 'scheduled' && updated.triggerType !== 'scheduled') {
      this.scheduler.removeCronJob(id);
    }
    if (updated.triggerType === 'scheduled') {
      if (!updated.enabled) {
        this.scheduler.stopCronJob(id);
      } else {
        const config = updated.triggerConfig as TriggerConfig;
        const newCron = config?.cron || '0 * * * *';
        this.scheduler.registerCronJob(id, newCron);
      }
    }

    this.gateway.broadcastAutomationUpdate(updated);
    return updated;
  }

  async deleteAutomation(id: string) {
    this.scheduler.removeCronJob(id);

    const deleted = await this.prisma.automation.delete({
      where: { id },
    });

    this.gateway.broadcastAutomationRemoved(id);
    return deleted;
  }

  async toggleAutomationEnabled(id: string, enabled: boolean) {
    const updated = await this.prisma.automation.update({
      where: { id },
      data: { enabled },
    });

    if (updated.triggerType === 'scheduled') {
      if (!updated.enabled) {
        this.scheduler.stopCronJob(id);
      } else {
        const config = updated.triggerConfig as TriggerConfig;
        const cronExpr = config?.cron || '0 * * * *';
        if (!this.scheduler.hasCronJob(id)) {
          this.scheduler.registerCronJob(id, cronExpr);
        } else {
          this.scheduler.startCronJob(id);
        }
      }
    }

    this.gateway.broadcastAutomationUpdate(updated);
    return updated;
  }

  // ========== RUN + TEST-RUN ==========

  async runAutomation(automationId: string, body: any, isTest = false) {
    const { eventData } = body; // Из RunAutomationDto
    return this.runner.runAutomation(automationId, eventData, isTest);
  }

  // ========== ACTIONS CRUD ==========

  async getAutomationActions(automationId: string) {
    return this.prisma.automationAction.findMany({
      where: { automationId },
      orderBy: { order: 'asc' },
    });
  }

  async createAction(automationId: string, data: any) {
    // Проверка, что автоматизация существует
    const automation = await this.getAutomation(automationId);
    if (!automation) throw new Error('Automation not found');

    return this.prisma.automationAction.create({
      data: {
        automationId,
        order: data.order,
        type: data.type,
        label: data.label,
        description: data.description,
        params: data.params,
        conditions: data.conditions,
        inputVars: data.inputVars,
      },
    });
  }

  async getAction(automationId: string, actionId: string) {
    return this.prisma.automationAction.findFirst({
      where: { id: actionId, automationId },
    });
  }

  async updateAction(automationId: string, actionId: string, data: any) {
    const oldAction = await this.getAction(automationId, actionId);
    if (!oldAction) throw new Error('Action not found');

    return this.prisma.automationAction.update({
      where: { id: actionId },
      data: {
        order: data.order ?? oldAction.order,
        type: data.type ?? oldAction.type,
        label: data.label ?? oldAction.label,
        description: data.description ?? oldAction.description,
        params: data.params ?? oldAction.params,
        conditions: data.conditions ?? oldAction.conditions,
        inputVars: data.inputVars ?? oldAction.inputVars,
      },
    });
  }

  async deleteAction(automationId: string, actionId: string) {
    const oldAction = await this.getAction(automationId, actionId);
    if (!oldAction) throw new Error('Action not found');

    return this.prisma.automationAction.delete({
      where: { id: actionId },
    });
  }

  async reorderActions(automationId: string, actions: Array<{ actionId: string; order: number }>) {
    const updates = [];
    for (const { actionId, order } of actions) {
      updates.push(
        this.prisma.automationAction.update({
          where: { id: actionId },
          data: { order },
        }),
      );
    }
    await this.prisma.$transaction(updates);

    return this.getAutomationActions(automationId);
  }

  // ========== LOGS ==========

  async listExecutionLogs(automationId: string) {
    return this.prisma.automationExecutionLog.findMany({
      where: { automationId },
      orderBy: { executedAt: 'desc' },
      select: {
        id: true,
        status: true,
        error: true,
        eventData: true,
        isTest: true,
        executedAt: true,
      },
    });
  }

  async getExecutionLog(automationId: string, executionId: string) {
    return this.prisma.automationExecutionLog.findFirst({
      where: { id: executionId, automationId },
      include: {
        steps: true,
      },
    });
  }
}
