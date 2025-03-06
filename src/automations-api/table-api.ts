// src/automations-api/table-api.ts
import { PrismaService } from 'src/prisma/prisma.service';
import { RecordApi } from './record-api';

export class TableApi {
  constructor(private prisma: PrismaService, private tableName: string) {}

  async selectRecordsAsync(options?: { filter?: any; sort?: any }): Promise<RecordApi[]> {
    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Table "${this.tableName}" not found`);
    }

    const rows = await this.prisma.record.findMany({
      where: { tableId: tableDef.id, ...(options?.filter || {}) },
      orderBy: options?.sort || {},
    });

    return rows.map(
      (row) => new RecordApi(row.id, row.data, this.tableName, this.prisma),
    );
  }

  async selectRecordAsync(recordId: string): Promise<RecordApi | null> {
    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Table "${this.tableName}" not found`);
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
    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Table "${this.tableName}" not found`);
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
    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Table "${this.tableName}" not found`);
    }

    const oldRecord = await this.prisma.record.findUnique({
      where: { id: recordId },
    });
    if (!oldRecord || oldRecord.tableId !== tableDef.id) {
      throw new Error(`Record ${recordId} not found in table "${this.tableName}"`);
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
    const tableDef = await this.prisma.tableDefinition.findFirst({
      where: { name: this.tableName },
    });
    if (!tableDef) {
      throw new Error(`Table "${this.tableName}" not found`);
    }

    const oldRecord = await this.prisma.record.findUnique({
      where: { id: recordId },
    });
    if (!oldRecord || oldRecord.tableId !== tableDef.id) {
      throw new Error(`Record ${recordId} not found in table "${this.tableName}"`);
    }

    await this.prisma.record.delete({ where: { id: recordId } });
  }
}
