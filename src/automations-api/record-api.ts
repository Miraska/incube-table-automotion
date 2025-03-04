import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Эмуляция объекта "Record" в Airtable:
 *   record.id
 *   record.getCellValue("Колонка")
 */
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

  /**
   * Возвращает значение поля (колонки) из JSON rawData.
   */
  getCellValue(fieldName: string): any {
    const value = this.rawData[fieldName];
    if (value instanceof Date) {
      return value.toISOString(); // Пример обработки даты
    }
    return value;
  }
}
