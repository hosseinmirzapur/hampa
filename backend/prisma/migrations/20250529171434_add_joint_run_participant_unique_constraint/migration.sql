/*
  Warnings:

  - A unique constraint covering the columns `[userId,jointRunId]` on the table `JointRunParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JointRunParticipant_userId_jointRunId_key" ON "JointRunParticipant"("userId", "jointRunId");
