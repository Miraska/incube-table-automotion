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
import { AutomationsService } from './automations.service';

@Controller('automations')
export class AutomationsController {
  constructor(private readonly service: AutomationsService) {}

  @Get()
  async listAutomations() {
    return this.service.listAutomations();
  }

  @Post()
  async create(@Body() dto: any) {
    return this.service.createAutomation(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.service.getAutomation(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateAutomation(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.deleteAutomation(id);
  }

  // Ручной запуск (POST /automations/:id/run)
  @Post(':id/run')
  async run(@Param('id') id: string, @Body() eventData: any) {
    return this.service.runAutomation(id, eventData);
  }

  // Новый эндпоинт для вкл/выкл автоматизации
  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @Body() body: { enabled: boolean }) {
    return this.service.toggleAutomationEnabled(id, body.enabled);
  }
}
