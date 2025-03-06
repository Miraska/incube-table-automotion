// src/automations/dto/update-automation.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAutomationDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  triggerType?: string;

  @ApiPropertyOptional()
  tableIdOrName?: string | null;

  @ApiPropertyOptional()
  conditions?: any;

  @ApiPropertyOptional()
  enabled?: boolean;

  @ApiPropertyOptional()
  triggerConfig?: any;

  @ApiPropertyOptional()
  triggerLabel?: string;

  @ApiPropertyOptional()
  triggerDescription?: string;
}
