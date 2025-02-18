-- CreateEnum
CREATE TYPE "Appointment" AS ENUM ('Pending', 'Fulfilled', 'Canceled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "father_name" TEXT,
    "age" INTEGER NOT NULL,
    "cnic" TEXT,
    "phone_no" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_user_id" TEXT NOT NULL,
    "updated_user_id" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientAppointment" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "appointment_date_time" TIMESTAMP(3) NOT NULL,
    "appointment_status" "Appointment" NOT NULL DEFAULT 'Pending',
    "created_user_id" TEXT NOT NULL,
    "updated_user_id" TEXT NOT NULL,

    CONSTRAINT "PatientAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientCheckUp" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "sphrd" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cylrd" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "axisrd" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "vard" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sphrn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cylrn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "axisrn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "varn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sphld" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cylld" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "axisld" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "vald" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sphln" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cylln" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "axisln" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "valn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "remarks" TEXT,
    "created_user_id" TEXT NOT NULL,
    "updated_user_id" TEXT NOT NULL,

    CONSTRAINT "PatientCheckUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_updated_user_id_fkey" FOREIGN KEY ("updated_user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAppointment" ADD CONSTRAINT "PatientAppointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAppointment" ADD CONSTRAINT "PatientAppointment_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAppointment" ADD CONSTRAINT "PatientAppointment_updated_user_id_fkey" FOREIGN KEY ("updated_user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCheckUp" ADD CONSTRAINT "PatientCheckUp_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCheckUp" ADD CONSTRAINT "PatientCheckUp_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCheckUp" ADD CONSTRAINT "PatientCheckUp_updated_user_id_fkey" FOREIGN KEY ("updated_user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
