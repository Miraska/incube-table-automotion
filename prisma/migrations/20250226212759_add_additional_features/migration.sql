-- CreateTable
CREATE TABLE "bases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    CONSTRAINT "bases_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "base_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "tables_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "bases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "field_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tabel_id" TEXT NOT NULL,
    "field_type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "fields_tabel_id_fkey" FOREIGN KEY ("tabel_id") REFERENCES "tables" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
