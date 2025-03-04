import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsRunner } from './automations.runner';
import { AutomationsScheduler } from './automations.scheduler';
import { AutomationsGateway } from './automations.gateway';
import { TriggerConfig, AutomationTriggerType } from './automation.types';

@Injectable()
export class AutomationsService {
  private readonly logger = new Logger(AutomationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly runner: AutomationsRunner,
    private readonly scheduler: AutomationsScheduler,
    private readonly gateway: AutomationsGateway,
  ) {}

  async createAutomation(data: any) {
    const automation = await this.prisma.automation.create({ data });

    if (automation.triggerType === 'scheduled' && automation.enabled) {
      const config = automation.triggerConfig as TriggerConfig;
      const cronExpr = config?.cron || '0 * * * *';
      this.scheduler.registerCronJob(automation.id, cronExpr);
    }

    this.gateway.broadcastAutomationUpdate(automation);
    return automation;
  }

  // Еще нужно доработать и протестить
  async updateAutomation(id: string, data: any) {
    const old = await this.prisma.automation.findUnique({ where: { id } });

    if(old && data.actions !== undefined || data.actions !== null)
      await this.prisma.automationAction.deleteMany();

    const updated = await this.prisma.automation.update({
      where: { id },
      data,
    });

    // Логика крон-задачи
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

  // src/automations/automations.service.ts
  async getAutomationActions(automationId: string) {
    return this.prisma.automationAction.findMany({
      where: { automationId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        type: true,
        params: true, 
        order: true,
      },
    });
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

  async listAutomations() {
    return this.prisma.automation.findMany();
  }

  async getAutomation(id: string) {
    return this.prisma.automation.findUnique({ where: { id } });
  }

  async runAutomation(automationId: string, eventData: any) {
    return this.runner.runAutomation(automationId, eventData);
  }

  /**
   * Пример вызова при событиях (динамических). 
   * Если у вас есть хуки при создании новой записи в Record (или т.п.),
   * можно дергать этот метод.
   */
  async handleTableEvent(
    tableName: string,
    eventType: AutomationTriggerType,
    recordData: any,
  ) {
    this.logger.log(`handleTableEvent -> table=${tableName}, event=${eventType}`);

    const automations = await this.prisma.automation.findMany({
      where: {
        triggerType: eventType,
        enabled: true,
        OR: [{ tableIdOrName: null }, { tableIdOrName: tableName }],
      },
    });

    for (const automation of automations) {
      await this.runner.runAutomation(automation.id, { record: recordData });
    }
  }
}
