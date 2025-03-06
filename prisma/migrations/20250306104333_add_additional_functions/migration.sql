-- AlterTable
ALTER TABLE "automation_action_execution_logs" ADD COLUMN "consoleLogs" JSONB;

-- AlterTable
ALTER TABLE "automation_actions" ADD COLUMN "description" TEXT;
ALTER TABLE "automation_actions" ADD COLUMN "inputVars" JSONB;
ALTER TABLE "automation_actions" ADD COLUMN "label" TEXT;

-- AlterTable
ALTER TABLE "automations" ADD COLUMN "triggerDescription" TEXT;
ALTER TABLE "automations" ADD COLUMN "triggerLabel" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_automation_execution_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "automation_id" TEXT NOT NULL,
    "status" TEXT,
    "event_data" JSONB,
    "result" JSONB,
    "error" TEXT,
    "executed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isTest" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "automation_execution_logs_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_automation_execution_logs" ("automation_id", "error", "event_data", "executed_at", "id", "result", "status") SELECT "automation_id", "error", "event_data", "executed_at", "id", "result", "status" FROM "automation_execution_logs";
DROP TABLE "automation_execution_logs";
ALTER TABLE "new_automation_execution_logs" RENAME TO "automation_execution_logs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
