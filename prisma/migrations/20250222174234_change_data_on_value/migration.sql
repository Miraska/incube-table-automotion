/*
  Warnings:

  - You are about to drop the column `data` on the `Field` table. All the data in the column will be lost.
  - Added the required column `value` to the `Field` table without a default value. This is not possible if the table is not empty.

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
    "value" TEXT NOT NULL,
    CONSTRAINT "Field_tabel_id_fkey" FOREIGN KEY ("tabel_id") REFERENCES "Table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("field_id", "field_type", "id", "name", "tabel_id") SELECT "field_id", "field_type", "id", "name", "tabel_id" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
