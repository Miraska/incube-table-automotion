-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_automation_action_execution_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "execution_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "status" TEXT,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "automation_action_execution_logs_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "automation_execution_logs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "automation_action_execution_logs_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "automation_actions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_automation_action_execution_logs" ("action_id", "error", "executed_at", "execution_id", "id", "result", "status") SELECT "action_id", "error", "executed_at", "execution_id", "id", "result", "status" FROM "automation_action_execution_logs";
DROP TABLE "automation_action_execution_logs";
ALTER TABLE "new_automation_action_execution_logs" RENAME TO "automation_action_execution_logs";
CREATE TABLE "new_automation_actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "params" JSONB,
    "conditions" JSONB,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    CONSTRAINT "automation_actions_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_automation_actions" ("automation_id", "conditions", "created_time", "id", "last_modified_time", "order", "params", "type") SELECT "automation_id", "conditions", "created_time", "id", "last_modified_time", "order", "params", "type" FROM "automation_actions";
DROP TABLE "automation_actions";
ALTER TABLE "new_automation_actions" RENAME TO "automation_actions";
CREATE TABLE "new_automation_execution_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "status" TEXT,
    "event_data" JSONB,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "automation_execution_logs_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_automation_execution_logs" ("automation_id", "error", "event_data", "executed_at", "id", "result", "status") SELECT "automation_id", "error", "event_data", "executed_at", "id", "result", "status" FROM "automation_execution_logs";
DROP TABLE "automation_execution_logs";
ALTER TABLE "new_automation_execution_logs" RENAME TO "automation_execution_logs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
