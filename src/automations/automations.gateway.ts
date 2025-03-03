// src/automations/automations.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AutomationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AutomationsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Метод, который мы вызываем при запуске автоматизации
  broadcastAutomationRun(data: any) {
    this.server.emit('automationRun', data);
  }

  // Новый метод — оповещает, что автоматизация была создана или обновлена
  broadcastAutomationUpdate(automation: any) {
    // Назовём событие "automationUpdate" 
    this.server.emit('automationUpdate', automation);
  }

  // Новый метод — оповещает, что автоматизация была удалена
  broadcastAutomationRemoved(automationId: string) {
    // Отправляем только ID, чтобы клиент мог убрать её из списка
    this.server.emit('automationRemoved', { id: automationId });
  }
}
