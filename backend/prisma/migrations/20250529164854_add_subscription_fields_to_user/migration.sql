/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JointRun" DROP CONSTRAINT "JointRun_createdById_fkey";

-- DropForeignKey
ALTER TABLE "JointRunParticipant" DROP CONSTRAINT "JointRunParticipant_jointRunId_fkey";

-- DropForeignKey
ALTER TABLE "JointRunParticipant" DROP CONSTRAINT "JointRunParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- DropForeignKey
ALTER TABLE "RunnerCard" DROP CONSTRAINT "RunnerCard_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "JointRunParticipant_userId_jointRunId_key";

-- AlterTable
ALTER TABLE "JointRunParticipant" ALTER COLUMN "status" SET DEFAULT 'INTERESTED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "hasSubscription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriptionExpiryDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Otp";

-- DropTable
DROP TABLE "Subscription";

-- AddForeignKey
ALTER TABLE "RunnerCard" ADD CONSTRAINT "RunnerCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JointRun" ADD CONSTRAINT "JointRun_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JointRunParticipant" ADD CONSTRAINT "JointRunParticipant_jointRunId_fkey" FOREIGN KEY ("jointRunId") REFERENCES "JointRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JointRunParticipant" ADD CONSTRAINT "JointRunParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
