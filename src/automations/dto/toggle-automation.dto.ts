import { ApiProperty } from '@nestjs/swagger';

export class ToggleAutomationDto {
  @ApiProperty({
    description: 'Флаг включения/выключения автоматизации',
    example: true,
  })
  enabled: boolean;
}
