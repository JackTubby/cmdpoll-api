/*
  Warnings:

  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoricalPoll" DROP CONSTRAINT "HistoricalPoll_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_teamId_fkey";

-- DropForeignKey
ALTER TABLE "RunningPoll" DROP CONSTRAINT "RunningPoll_roomId_fkey";

-- DropTable
DROP TABLE "Room";
