// src/automations/automations.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { RunAutomationDto } from './dto/run-automation.dto';
import { ToggleAutomationDto } from './dto/toggle-automation.dto';

@ApiTags('automations')
@Controller('automations')
export class AutomationsController {
  constructor(private readonly service: AutomationsService) {}

  @ApiOperation({ summary: 'Список всех автоматизаций' })
  @Get()
  async listAutomations() {
    return this.service.listAutomations();
  }

  @ApiOperation({ summary: 'Создать автоматизацию' })
  @Post()
  async create(@Body() dto: CreateAutomationDto) {
    return this.service.createAutomation(dto);
  }

  @ApiOperation({ summary: 'Получить автоматизацию по ID' })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.service.getAutomation(id);
  }

  @ApiOperation({ summary: 'Обновить автоматизацию' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAutomationDto) {
    return this.service.updateAutomation(id, dto);
  }

  @ApiOperation({ summary: 'Удалить автоматизацию' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.deleteAutomation(id);
  }

  @ApiOperation({ summary: 'Запустить автоматизацию вручную' })
  @Post(':id/run')
  async run(@Param('id') id: string, @Body() body: RunAutomationDto) {
    return this.service.runAutomation(id, body, false);
  }

  @ApiOperation({ summary: 'Вкл/выкл автоматизацию' })
  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @Body() body: ToggleAutomationDto) {
    return this.service.toggleAutomationEnabled(id, body.enabled);
  }

  @ApiOperation({ summary: 'Тестовый запуск (isTest=true)' })
  @Post(':id/test-run')
  async testRun(@Param('id') id: string, @Body() body: RunAutomationDto) {
    return this.service.runAutomation(id, body, true);
  }
}
