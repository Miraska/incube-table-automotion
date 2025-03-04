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
  record: Record<string, any>;
}
