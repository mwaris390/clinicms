/*
  Warnings:

  - Added the required column `updated_at` to the `PatientAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PatientCheckUp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientAppointment" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PatientCheckUp" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
