/*
  Warnings:

  - Added the required column `isPhoneNumberPublic` to the `RunnerCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `RunnerCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `RunnerCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `RunnerCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RunnerCard" ADD COLUMN     "days" TEXT[],
ADD COLUMN     "isPhoneNumberPublic" BOOLEAN NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;
