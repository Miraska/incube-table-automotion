import { PrismaService } from 'src/prisma/prisma.service';
import { TableApi } from './table-api';

/**
 * Эмуляция объекта "base" (как в Airtable).
 * В скриптах пользователь пишет:
 *   let table = base.getTable("Сверка");
 */
export class BaseApi {
  constructor(private prisma: PrismaService) {}

  getTable(tableName: string): TableApi {
    // Возвращаем обёртку над выбранной "логической" таблицей:
    return new TableApi(this.prisma, tableName);
  }
}
