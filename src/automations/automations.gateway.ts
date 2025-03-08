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
  cors: { origin: '*' },
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

  broadcastAutomationRun(data: any) {
    this.server.emit('automationRun', data);
  }

  broadcastAutomationUpdate(automation: any) {
    this.server.emit('automationUpdate', automation);
  }

  broadcastAutomationRemoved(automationId: string) {
    this.server.emit('automationRemoved', { id: automationId });
  }
}
