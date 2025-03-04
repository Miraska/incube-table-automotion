import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAutomationDto {
  @ApiPropertyOptional({ description: 'Новое имя автоматизации' })
  name?: string;

  @ApiPropertyOptional({ description: 'Флаг включения или отключения' })
  enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Изменённый набор действий (actions)',
  })
  actions?: {
    create?: Array<{
      order: number;
      type: string;
      params: Record<string, any>;
    }>;
  };
}
