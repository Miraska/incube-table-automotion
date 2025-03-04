import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAutomationDto {
  @ApiProperty({ description: 'Название автоматизации' })
  name: string;

  @ApiProperty({ description: 'Тип триггера', example: 'scheduled' })
  triggerType: string;

  @ApiPropertyOptional({
    description: 'ID или имя таблицы (если нужно)',
    example: 'Fields table',
  })
  tableIdOrName?: string | null;

  @ApiPropertyOptional({
    description: 'Условие (conditions) для выполнения. Может быть null.',
  })
  conditions?: any; // Можно уточнить тип, если он известен

  @ApiPropertyOptional({
    description: 'Включена ли автоматизация',
    default: true,
  })
  enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Настройки для планировщика (cron)',
    example: {
      cron: '* * * * *',
    },
  })
  triggerConfig?: {
    cron?: string;
  };

  @ApiPropertyOptional({
    description:
      'Набор действий автоматизации (например: create, update, script, notification и т.д.)',
  })
  actions?: {
    create?: Array<{
      order: number;
      type: string;
      params: Record<string, any>;
    }>;
  };
}
