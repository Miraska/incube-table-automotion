-- CreateTable
CREATE TABLE "automation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "trigger_type" TEXT NOT NULL,
    "trigger_config" JSONB,
    "conditions" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "last_modified_time" DATETIME
);

-- CreateTable
CREATE TABLE "automation_action" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "params" JSONB,
    "conditions" JSONB,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    CONSTRAINT "automation_action_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "automation_execution_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "status" TEXT,
    "event_data" JSONB,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "automation_execution_log_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "automation_test_run" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "test_data" JSONB NOT NULL,
    "result" JSONB,
    "status" TEXT NOT NULL,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "automation_test_run_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Base" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    CONSTRAINT "Base_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "space" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "base_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Table_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "Base" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tabel_id" TEXT NOT NULL,
    "field_type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    CONSTRAINT "Field_tabel_id_fkey" FOREIGN KEY ("tabel_id") REFERENCES "Table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
