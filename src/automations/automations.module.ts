// src/automations/automations.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AutomationsService } from './automations.service';
import { AutomationsController } from './automations.controller';
import { AutomationsGateway } from './automations.gateway';
import { AutomationsRunner } from './automations.runner';
import { AutomationsScheduler } from './automations.scheduler';

@Module({
  imports: [PrismaModule],
  controllers: [AutomationsController],
  providers: [
    AutomationsService,
    AutomationsGateway,
    AutomationsRunner,
    AutomationsScheduler,
  ],
  exports: [AutomationsService],
})
export class AutomationsModule {}
