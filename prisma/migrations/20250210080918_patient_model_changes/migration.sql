/*
  Warnings:

  - A unique constraint covering the columns `[phone_no]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone_no` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "phone_no" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_no_key" ON "Patient"("phone_no");
