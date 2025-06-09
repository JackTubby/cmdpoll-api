-- AlterTable
ALTER TABLE "HistoricalPoll" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RunningPoll" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
