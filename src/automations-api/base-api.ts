// src/automations-api/base-api.ts
import { PrismaService } from 'src/prisma/prisma.service';
import { TableApi } from './table-api';

/**
 * Аналог объекта "base" в Airtable.
 * Позволяет: base.getTable("TableName").
 */
export class BaseApi {
  constructor(private prisma: PrismaService) {}

  getTable(tableName: string): TableApi {
    return new TableApi(this.prisma, tableName);
  }
}
