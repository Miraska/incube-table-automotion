// src/automations-api/record-api.ts
import { PrismaService } from 'src/prisma/prisma.service';

export class RecordApi {
  constructor(
    private recordId: string,
    private rawData: any,
    private tableName: string,
    private prisma: PrismaService,
  ) {}

  get id(): string {
    return this.recordId;
  }

  getCellValue(fieldName: string): any {
    return this.rawData[fieldName];
  }
}
