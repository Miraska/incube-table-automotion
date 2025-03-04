import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AutomationsService } from './automations.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('automations')
@Controller('automations')
export class AutomationsController {
  constructor(private readonly service: AutomationsService) {}

  @ApiOperation({ summary: 'Получить список всех автоматизаций' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает массив автоматизаций',
  })
  @Get()
  async listAutomations() {
    return this.service.listAutomations();
  }

  @ApiOperation({ summary: 'Создать новую автоматизацию' })
  @ApiBody({
    description: 'Данные для новой автоматизации',
    schema: {
      example: {
        name: 'New Automation',
        triggerType: 'scheduled',
        triggerConfig: { cron: '*/5 * * * *' },
        conditions: null,
        enabled: true,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Созданная автоматизация',
  })
  @Post()
  async create(@Body() dto: any) {
    return this.service.createAutomation(dto);
  }

  @ApiOperation({ summary: 'Получить одну автоматизацию по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID автоматизации',
  })
  @ApiResponse({
    status: 200,
    description: 'Найденная автоматизация',
  })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.service.getAutomation(id);
  }

  @ApiOperation({ summary: 'Обновить автоматизацию по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID автоматизации',
  })
  @ApiBody({
    description: 'Поля для обновления автоматизации',
    schema: {
      example: {
        name: 'Updated Automation',
        enabled: false,
      },
    },
  })

  // src/automations/automations.controller.ts
  @Get(':id/actions')
  async getActions(@Param('id') id: string) {
    return this.service.getAutomationActions(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Обновлённая автоматизация',
  })

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateAutomation(id, dto);
  }

  @ApiOperation({ summary: 'Удалить автоматизацию по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID автоматизации',
  })
  @ApiResponse({
    status: 200,
    description: 'Удалённая автоматизация',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.deleteAutomation(id);
  }

  @ApiOperation({ summary: 'Ручной запуск автоматизации' })
  @ApiParam({
    name: 'id',
    description: 'ID автоматизации',
  })
  @ApiBody({
    description: 'Данные (eventData), которые передаются в автоматизацию',
    schema: {
      example: {
        record: {
          someField: 'someValue',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Лог выполнения (execution log) запущенной автоматизации',
  })
  @Post(':id/run')
  async run(@Param('id') id: string, @Body() eventData: any) {
    return this.service.runAutomation(id, eventData);
  }

  @ApiOperation({ summary: 'Включить или выключить автоматизацию' })
  @ApiParam({
    name: 'id',
    description: 'ID автоматизации',
  })
  @ApiBody({
    description: 'Флаг включения/выключения',
    schema: {
      example: {
        enabled: true,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Обновлённая автоматизация с новым значением enabled',
  })
  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @Body() body: { enabled: boolean }) {
    return this.service.toggleAutomationEnabled(id, body.enabled);
  }
}
