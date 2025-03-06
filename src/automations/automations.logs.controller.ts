// src/automations/automations.logs.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';

@ApiTags('automation-logs')
@Controller('automations/:automationId/logs')
export class AutomationsLogsController {
  constructor(private readonly service: AutomationsService) {}

  @ApiOperation({ summary: 'Получить историю запусков' })
  @Get()
  async listExecutions(@Param('automationId') automationId: string) {
    return this.service.listExecutionLogs(automationId);
  }

  @ApiOperation({ summary: 'Получить детальный лог запуска' })
  @Get(':executionId')
  async getOne(
    @Param('automationId') automationId: string,
    @Param('executionId') executionId: string,
  ) {
    return this.service.getExecutionLog(automationId, executionId);
  }
}
