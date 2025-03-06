// src/automations/automations.scheduler.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodeCron from 'node-cron';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationsRunner } from './automations.runner';
import { TriggerConfig } from './automation.types';

@Injectable()
export class AutomationsScheduler implements OnModuleInit {
  private readonly logger = new Logger(AutomationsScheduler.name);
  private cronJobs: Record<string, nodeCron.ScheduledTask> = {};

  constructor(
    private readonly prisma: PrismaService,
    private readonly runner: AutomationsRunner,
  ) {}

  async onModuleInit() {
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

  registerCronJob(automationId: string, cronExpr: string) {
    // Останавливаем и убираем старую задачу, если была
    if (this.cronJobs[automationId]) {
      this.cronJobs[automationId].stop();
      delete this.cronJobs[automationId];
    }

    this.logger.log(`Registering cron for automation=${automationId} => ${cronExpr}`);
    const job = nodeCron.schedule(cronExpr, async () => {
      this.logger.log(`Running scheduled automation: ${automationId}`);
      await this.runner.runAutomation(automationId, { reason: 'cron' });
    });

    this.cronJobs[automationId] = job;
  }

  removeCronJob(automationId: string) {
    const job = this.cronJobs[automationId];
    if (job) {
      this.logger.log(`Removing cron job for automationId=${automationId}`);
      job.stop();
      delete this.cronJobs[automationId];
    }
  }

  stopCronJob(automationId: string) {
    const job = this.cronJobs[automationId];
    if (job) {
      this.logger.log(`Stopping cron job for automationId=${automationId}`);
      job.stop();
    }
  }

  startCronJob(automationId: string) {
    const job = this.cronJobs[automationId];
    if (job) {
      this.logger.log(`Starting cron job for automationId=${automationId}`);
      job.start();
    }
  }

  hasCronJob(automationId: string) {
    return !!this.cronJobs[automationId];
  }
}
