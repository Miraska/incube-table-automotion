// src/automations/automations.actions.controller.ts
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation } from '@nestjs/swagger';
  import { AutomationsService } from './automations.service';
  
  @ApiTags('automation-actions')
  @Controller('automations/:automationId/actions')
  export class AutomationsActionsController {
    constructor(private readonly service: AutomationsService) {}
  
    @ApiOperation({ summary: 'Список действий автоматизации' })
    @Get()
    async list(@Param('automationId') automationId: string) {
      return this.service.getAutomationActions(automationId);
    }
  
    @ApiOperation({ summary: 'Создать новое действие' })
    @Post()
    async create(
      @Param('automationId') automationId: string,
      @Body() body: any,
    ) {
      return this.service.createAction(automationId, body);
    }
  
    @ApiOperation({ summary: 'Получить действие по ID' })
    @Get(':actionId')
    async getOne(
      @Param('automationId') automationId: string,
      @Param('actionId') actionId: string,
    ) {
      return this.service.getAction(automationId, actionId);
    }
  
    @ApiOperation({ summary: 'Обновить действие' })
    @Patch(':actionId')
    async update(
      @Param('automationId') automationId: string,
      @Param('actionId') actionId: string,
      @Body() body: any,
    ) {
      return this.service.updateAction(automationId, actionId, body);
    }
  
    @ApiOperation({ summary: 'Удалить действие' })
    @Delete(':actionId')
    async remove(
      @Param('automationId') automationId: string,
      @Param('actionId') actionId: string,
    ) {
      return this.service.deleteAction(automationId, actionId);
    }
  
    @ApiOperation({ summary: 'Переставить несколько действий' })
    @Patch('reorder')
    async reorder(
      @Param('automationId') automationId: string,
      @Body() body: { actions: Array<{ actionId: string; order: number }> },
    ) {
      return this.service.reorderActions(automationId, body.actions);
    }
  }
  