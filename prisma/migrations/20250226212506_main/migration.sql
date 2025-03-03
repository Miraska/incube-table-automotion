-- CreateTable
CREATE TABLE "automations" (
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
CREATE TABLE "automation_actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "params" JSONB,
    "conditions" JSONB,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    CONSTRAINT "automation_actions_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "automation_execution_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "status" TEXT,
    "event_data" JSONB,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "automation_execution_logs_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "automation_action_execution_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "execution_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "status" TEXT,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "automation_action_execution_logs_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "automation_execution_logs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "automation_action_execution_logs_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "automation_actions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
