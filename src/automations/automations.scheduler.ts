import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodeCron from 'node-cron';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsRunner } from './automations.runner';
import { TriggerConfig } from './automation.types';

@Injectable()
export class AutomationsScheduler implements OnModuleInit {
  private readonly logger = new Logger(AutomationsScheduler.name);

  // Храним список cron-задач
  private cronJobs: Record<string, nodeCron.ScheduledTask> = {};

  constructor(
    private readonly prisma: PrismaService,
    private readonly runner: AutomationsRunner,
  ) {}

  async onModuleInit() {
    // При старте приложения регистрируем все существующие scheduled-автоматизации, которые включены
    await this.initScheduledAutomationsOnStartup();
  }

  private async initScheduledAutomationsOnStartup() {
    this.logger.log('AutomationsScheduler init...');
    const scheduledAutomations = await this.prisma.automation.findMany({
      where: { triggerType: 'scheduled', enabled: true },
    });

    for (const auto of scheduledAutomations) {
      const config = auto.triggerConfig as TriggerConfig;
      const cronExpr = config?.cron || '0 * * * *';
      this.registerCronJob(auto.id, cronExpr);
    }
  }

  /**
   * Создаём/пересоздаём cron-задачу для автоматизации
   */
  registerCronJob(automationId: string, cronExpr: string) {
    // Если такая задача уже есть, удаляем предыдущую
    if (this.cronJobs[automationId]) {
      this.logger.warn(`Cron job for automationId=${automationId} already exists. Removing old job...`);
      this.cronJobs[automationId].stop();
      delete this.cronJobs[automationId];
    }

    this.logger.log(`Registering cron for auto=${automationId} => ${cronExpr}`);
    const job = nodeCron.schedule(cronExpr, async () => {
      this.logger.log(`Running scheduled automation: ${automationId}`);
      await this.runner.runAutomation(automationId, { reason: 'cron' });
    });

    // Сохраняем в объект, чтобы при необходимости остановить или удалить
    this.cronJobs[automationId] = job;
  }

  /**
   * Полностью удаляем (stop + delete) задачу из планировщика
   */
  removeCronJob(automationId: string) {
    const job = this.cronJobs[automationId];
    if (job) {
      this.logger.log(`Removing cron job for automationId=${automationId}`);
      job.stop();
      delete this.cronJobs[automationId];
    }
  }

  /**
   * Останавливаем задачу, но не удаляем её из памяти (можно снова start)
   */
  stopCronJob(automationId: string) {
    const job = this.cronJobs[automationId];
    if (job) {
      this.logger.log(`Stopping cron job for automationId=${automationId}`);
      job.stop();
    }
  }

  /**
   * Запускаем (start) задачу, если она есть в памяти
   */
  startCronJob(automationId: string) {
    const job = this.cronJobs[automationId];
    if (job) {
      this.logger.log(`Starting cron job for automationId=${automationId}`);
      job.start();
    }
  }

  /**
   * Проверяем, есть ли уже cron-задача в памяти
   */
  hasCronJob(automationId: string) {
    return !!this.cronJobs[automationId];
  }
}
