// src/automations/automations.triggers.controller.ts
import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';

@ApiTags('automation-triggers')
@Controller('automations/:id/trigger')
export class AutomationsTriggersController {
  constructor(private readonly service: AutomationsService) {}

  @ApiOperation({ summary: 'Получить конфигурацию триггера' })
  @Get()
  async getTrigger(@Param('id') id: string) {
    const automation = await this.service.getAutomation(id);
    if (!automation) return null;
    return {
      triggerType: automation.triggerType,
      triggerConfig: automation.triggerConfig,
      triggerLabel: automation.triggerLabel,
      triggerDescription: automation.triggerDescription,
      conditions: automation.conditions,
    };
  }

  @ApiOperation({ summary: 'Обновить конфигурацию триггера' })
  @Patch()
  async updateTrigger(
    @Param('id') id: string,
    @Body() body: {
      triggerType?: string;
      triggerConfig?: any;
      triggerLabel?: string;
      triggerDescription?: string;
      conditions?: any;
    },
  ) {
    return this.service.updateAutomation(id, body);
  }
}
