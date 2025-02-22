/*
  Warnings:

  - You are about to alter the column `value` on the `Field` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "field_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tabel_id" TEXT NOT NULL,
    "field_type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "Field_tabel_id_fkey" FOREIGN KEY ("tabel_id") REFERENCES "Table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("field_id", "field_type", "id", "name", "tabel_id", "value") SELECT "field_id", "field_type", "id", "name", "tabel_id", "value" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
