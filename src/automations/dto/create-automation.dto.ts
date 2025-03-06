// src/automations/dto/create-automation.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAutomationDto {
  @ApiProperty({ description: 'Название автоматизации' })
  name: string;

  @ApiProperty({ description: 'Тип триггера', example: 'scheduled' })
  triggerType: string;

  @ApiPropertyOptional({ description: 'ID или имя таблицы (если нужно)' })
  tableIdOrName?: string | null;

  @ApiPropertyOptional({ description: 'Условие (JSON-структура)' })
  conditions?: any;

  @ApiPropertyOptional({ description: 'Включена ли автоматизация', default: true })
  enabled?: boolean;

  @ApiPropertyOptional({ description: 'Настройки для расписания (cron)', example: { cron: '* * * * *' } })
  triggerConfig?: { cron?: string };

  @ApiPropertyOptional({ description: 'Метка (label) триггера' })
  triggerLabel?: string;

  @ApiPropertyOptional({ description: 'Описание триггера' })
  triggerDescription?: string;
}
