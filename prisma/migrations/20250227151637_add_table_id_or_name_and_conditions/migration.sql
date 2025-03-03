-- AlterTable
ALTER TABLE "automations" ADD COLUMN "tableIdOrName" TEXT;
ALTER TABLE "automations" ADD COLUMN "watchFields" JSONB;
