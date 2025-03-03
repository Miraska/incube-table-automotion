// src/automations/automations.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsRunner } from './automations.runner';
import { AutomationTriggerType } from './automation.types';
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
    private readonly gateway: AutomationsGateway, // Внедряем WebSocket-шлюз
  ) {}

  // CREATE
  async createAutomation(data: any) {
    const automation = await this.prisma.automation.create({ data });

    // Если это scheduled-автоматизация и она включена => регистрируем cron
    if (automation.triggerType === 'scheduled' && automation.enabled) {
      const config = automation.triggerConfig as TriggerConfig;
      const cronExpr = config?.cron || '0 * * * *';
      this.scheduler.registerCronJob(automation.id, cronExpr);
    }

    // Оповестим всех клиентов, что появилась новая автоматизация
    this.gateway.broadcastAutomationUpdate(automation);

    return automation;
  }

  // UPDATE
  async updateAutomation(id: string, data: any) {
    const old = await this.prisma.automation.findUnique({ where: { id } });

    const updated = await this.prisma.automation.update({
      where: { id },
      data,
    });

    // Логика пересоздания или удаления cron-задачи при смене triggerType/cron
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

    // Оповещаем всех клиентов, что автоматизация изменилась
    this.gateway.broadcastAutomationUpdate(updated);

    return updated;
  }

  // DELETE
  async deleteAutomation(id: string) {
    // Сначала уберём крон-задачу (если есть)
    this.scheduler.removeCronJob(id);

    // Удаляем саму Automation
    const deleted = await this.prisma.automation.delete({
      where: { id },
    });

    // Сообщаем, что автоматизация удалена (чтобы клиент убрал её из списка)
    this.gateway.broadcastAutomationRemoved(id);

    return deleted;
  }

  // TOGGLE (включить/выключить)
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

    // Оповещаем о любом изменении, в том числе включение/выключение
    this.gateway.broadcastAutomationUpdate(updated);

    return updated;
  }

  // READ
  async listAutomations() {
    return this.prisma.automation.findMany();
  }

  async getAutomation(id: string) {
    return this.prisma.automation.findUnique({ where: { id } });
  }

  // Ручной запуск
  async runAutomation(automationId: string, eventData: any) {
    return this.runner.runAutomation(automationId, eventData);
  }

  // Обработка событий в таблицах
  async handleTableEvent(
    tableName: string,
    eventType: AutomationTriggerType,
    record: any,
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
      await this.runner.runAutomation(automation.id, { record });
    }
  }
}
