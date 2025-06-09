/*
  Warnings:

  - You are about to drop the column `categories` on the `RunningPoll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RunningPoll" DROP COLUMN "categories";

-- CreateTable
CREATE TABLE "PollCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "PollCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "runningPollId" TEXT,

    CONSTRAINT "PollVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PollCategory" ADD CONSTRAINT "PollCategory_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "RunningPoll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PollCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_runningPollId_fkey" FOREIGN KEY ("runningPollId") REFERENCES "RunningPoll"("id") ON DELETE SET NULL ON UPDATE CASCADE;
