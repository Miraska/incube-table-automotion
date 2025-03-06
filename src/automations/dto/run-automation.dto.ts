// src/automations/dto/run-automation.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RunAutomationDto {
  @ApiProperty({
    description: 'Данные (eventData), которые передаются в автоматизацию',
    example: {
      record: {
        id: 'Record manual',
        name: 'Manual run record',
      },
    },
  })
  eventData: Record<string, any>;
}
