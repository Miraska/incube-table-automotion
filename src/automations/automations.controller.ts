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
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { AutomationsService } from './automations.service';

// Импорт DTO
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { RunAutomationDto } from './dto/run-automation.dto';
import { ToggleAutomationDto } from './dto/toggle-automation.dto';

// Импорт объекта с примерами (не класса)
import { createAutomationExamples } from './examples/automations.examples';

@ApiTags('automations')
@Controller('automations')
export class AutomationsController {
  constructor(private readonly service: AutomationsService) {}

  @ApiOperation({ summary: 'Получить список всех автоматизаций' })
  @ApiResponse({ status: 200, description: 'Возвращает массив автоматизаций' })
  @Get()
  async listAutomations() {
    return this.service.listAutomations();
  }

  @ApiOperation({ summary: 'Создать новую автоматизацию' })
  @ApiBody({
    description: 'Данные для новой автоматизации',
    type: CreateAutomationDto,
    // Вот здесь указываем объект с примерами
    examples: createAutomationExamples,
  })
  @ApiResponse({ status: 201, description: 'Созданная автоматизация' })
  @Post()
  async create(@Body() dto: CreateAutomationDto) {
    return this.service.createAutomation(dto);
  }

  @ApiOperation({ summary: 'Получить одну автоматизацию по ID' })
  @ApiParam({ name: 'id', description: 'ID автоматизации' })
  @ApiResponse({ status: 200, description: 'Найденная автоматизация' })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.service.getAutomation(id);
  }

  @ApiOperation({ summary: 'Получить список действий (actions) автоматизации' })
  @ApiParam({ name: 'id', description: 'ID автоматизации' })
  @ApiResponse({ status: 200, description: 'Список действий автоматизации' })
  @Get(':id/actions')
  async getActions(@Param('id') id: string) {
    return this.service.getAutomationActions(id);
  }

  @ApiOperation({ summary: 'Обновить автоматизацию по ID' })
  @ApiParam({ name: 'id', description: 'ID автоматизации' })
  @ApiBody({
    description: 'Поля для обновления автоматизации',
    type: UpdateAutomationDto,
    examples: {
      updateAutomation: {
        summary: 'Пример обновления автоматизации',
        value: {
          name: 'Updated Automation Name',
          enabled: false,
          actions: {
            create: [
              {
                order: 12,
                type: 'runScript',
                params: {
                  script: '(async () => { /* ... ваш скрипт ... */ })();',
                },
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Обновлённая автоматизация' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAutomationDto) {
    return this.service.updateAutomation(id, dto);
  }

  @ApiOperation({ summary: 'Удалить автоматизацию по ID' })
  @ApiParam({ name: 'id', description: 'ID автоматизации' })
  @ApiResponse({ status: 200, description: 'Удалённая автоматизация' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.deleteAutomation(id);
  }

  @ApiOperation({ summary: 'Ручной запуск автоматизации' })
  @ApiParam({ name: 'id', description: 'ID автоматизации' })
  @ApiBody({
    description: 'Данные (eventData), которые передаются в автоматизацию',
    type: RunAutomationDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Лог выполнения (execution log) запущенной автоматизации',
  })
  @Post(':id/run')
  async run(@Param('id') id: string, @Body() eventData: RunAutomationDto) {
    return this.service.runAutomation(id, eventData);
  }

  @ApiOperation({ summary: 'Включить или выключить автоматизацию' })
  @ApiParam({ name: 'id', description: 'ID автоматизации' })
  @ApiBody({
    description: 'Флаг включения/выключения',
    type: ToggleAutomationDto,
    examples: {
      enableAutomation: {
        summary: 'Включить автоматизацию',
        value: { enabled: true },
      },
      disableAutomation: {
        summary: 'Выключить автоматизацию',
        value: { enabled: false },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Обновлённая автоматизация с новым значением enabled',
  })
  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @Body() body: ToggleAutomationDto) {
    return this.service.toggleAutomationEnabled(id, body.enabled);
  }
}
