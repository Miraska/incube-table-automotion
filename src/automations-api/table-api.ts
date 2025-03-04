import { PrismaService } from 'src/prisma/prisma.service';
import { RecordApi } from './record-api';

export class TableApi {
  constructor(
    private prisma: PrismaService,
    private tableName: string,
  ) {}

  async selectRecordsAsync(options?: { filter?: any; sort?: any }): Promise<RecordApi[]> {
    try {
      // Проверка типа tableName
      if (typeof this.tableName !== 'string') {
        throw new Error(`tableName должен быть строкой, получено: ${this.tableName} (тип: ${typeof this.tableName})`);
      }

      // Получаем определение таблицы
      const tableDef = await this.prisma.tableDefinition.findFirst({
        where: { name: this.tableName },
      });

      if (!tableDef) {
        throw new Error(`Логическая таблица "${this.tableName}" не найдена`);
      }

      // Получаем записи
      const rows = await this.prisma.record.findMany({
        where: { tableId: tableDef.id, ...(options?.filter || {}) },
        orderBy: options?.sort || {},
      });

      return rows.map((row) => new RecordApi(row.id, row.data, this.tableName, this.prisma));
    } catch (error) {
      if (error.code === 'P2023') {
        throw new Error('Ошибка в данных таблицы TableDefinition: поле name должно быть строкой');
      }
      throw error;
    }
  }

  async selectRecordAsync(recordId: string): Promise<RecordApi | null> {
    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Таблица "${this.tableName}" не найдена`);
    }

    const row = await this.prisma.record.findUnique({
      where: { id: recordId },
    });
    if (!row || row.tableId !== tableDef.id) {
      return null;
    }

    return new RecordApi(row.id, row.data, this.tableName, this.prisma);
  }

  async createRecordAsync(fields: Record<string, any>): Promise<string> {
    if (typeof fields !== 'object' || fields === null) {
      throw new Error('fields must be a non-null object');
    }

    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Таблица "${this.tableName}" не найдена`);
    }

    const created = await this.prisma.record.create({
      data: {
        tableId: tableDef.id,
        data: fields,
      },
    });
    return created.id;
  }

  async updateRecordAsync(recordId: string, fields: Record<string, any>): Promise<void> {
    if (typeof recordId !== 'string' || !recordId) {
      throw new Error('recordId must be a non-empty string');
    }

    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Таблица "${this.tableName}" не найдена`);
    }

    const oldRecord = await this.prisma.record.findUnique({
      where: { id: recordId },
    });
    if (!oldRecord || oldRecord.tableId !== tableDef.id) {
      throw new Error(`Запись ${recordId} не найдена в таблице "${this.tableName}"`);
    }

    const newData = {
      ...(typeof oldRecord.data === 'object' && oldRecord.data !== null ? oldRecord.data : {}),
      ...fields,
    };

    await this.prisma.record.update({
      where: { id: recordId },
      data: { data: newData },
    });
  }

  async deleteRecordAsync(recordId: string): Promise<void> {
    if (typeof recordId !== 'string' || !recordId) {
      throw new Error('recordId must be a non-empty string');
    }

    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Таблица "${this.tableName}" не найдена`);
    }

    const oldRecord = await this.prisma.record.findUnique({
      where: { id: recordId },
    });
    if (!oldRecord || oldRecord.tableId !== tableDef.id) {
      throw new Error(`Запись ${recordId} не найдена в таблице "${this.tableName}"`);
    }

    await this.prisma.record.delete({ where: { id: recordId } });
  }
}