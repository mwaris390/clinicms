"use server";

import { prisma } from "@/lib/client";
import { endOfDay, startOfDay } from "date-fns";
import { z } from "zod";

const baseSchema = z.object({
  patientId: z.string(),
  appointmentDate: z.date({
    required_error: "Date and time must be selected",
  }),
  createdBy: z.string().min(3, { message: "createdBy required" }),
  updatedBy: z.string().min(3, { message: "updatedBy required" }),
});
type FormType = z.infer<typeof baseSchema>;
export async function BookAppointment(values: FormType) {
  const result = baseSchema.safeParse(values);
  if (!result.success) {
    return {
      message: "Validation failed",
      error: result.error.format(),
      status: false,
    };
  } else {
    try {
      const dbResult = await prisma.$transaction(async (prisma) => {
        const isAppointmentExist = await prisma.patientAppointment.findFirst({
          where: {
            AND: [
              { patient_id: values.patientId },
              { appointment_status: "Pending" },
              {
                appointment_date_time: {
                  gte: startOfDay(values.appointmentDate), // Start of the day (00:00:00)
                  lt: endOfDay(values.appointmentDate), // End of the day (23:59:59)
                },
              },
            ],
          },
          select: {
            id: true,
          },
        });
        if (isAppointmentExist) {
          return {
            message: "Appointment Already booked on this Date",
            data: isAppointmentExist,
            status: true,
          };
        } else {
          const result = await prisma.patientAppointment.create({
            data: {
              patient_id: values.patientId,
              appointment_date_time: values.appointmentDate,
              appointment_status: "Pending",
              created_user_id: values.createdBy,
              updated_user_id: values.updatedBy,
            },
          });
          return {
            message: "Appointment booked Successfully",
            data: result,
            status: true,
          };
        }
      });
      return dbResult;
    } catch (error) {
      return {
        message: "something went wrong",
        error: error,
        status: false,
      };
    }
  }
}
const updatedSchema = baseSchema.merge(
  z.object({ appointmentId: z.string().uuid({ message: "id must required" }) })
);
type UpdatedFormType = z.infer<typeof updatedSchema>;

export async function UpdateBookAppointment(values: UpdatedFormType) {
  const result = baseSchema.safeParse(values);
  if (!result.success) {
    return {
      message: "Validation failed",
      error: result.error.format(),
      status: false,
    };
  } else {
    try {
      const dbResult = await prisma.patientAppointment.update({
        data: {
          patient_id: values.patientId,
          appointment_date_time: values.appointmentDate,
          //   appointment_status: "Pending",
          created_user_id: values.createdBy,
          updated_user_id: values.updatedBy,
        },
        where: {
          id: values.appointmentId,
        },
      });
      return {
        message: "Updated Appointment Successfully",
        data: dbResult,
        status: true,
      };
    } catch (error) {
      return {
        message: "something went wrong",
        error: error,
        status: false,
      };
    }
  }
}
const cancelSchema = z.object({
  appointmentId: z.string().uuid({ message: "id must required" }),
  updatedBy: z.string().min(3, { message: "updatedBy required" }),
});
type CancelFormType = z.infer<typeof cancelSchema>;

export async function CancelBookAppointment(values: CancelFormType) {
  const result = cancelSchema.safeParse(values);
  if (!result.success) {
    return {
      message: "Validation failed",
      error: result.error.format(),
      status: false,
    };
  } else {
    try {
      const dbResult = await prisma.patientAppointment.update({
        data: {
          appointment_status: "Canceled",
          updated_user_id: values.updatedBy,
        },
        where: {
          id: values.appointmentId,
        },
      });
      return {
        message: "Canceled Appointment Successfully",
        data: dbResult,
        status: true,
      };
    } catch (error) {
      return {
        message: "something went wrong",
        error: error,
        status: false,
      };
    }
  }
}

export async function ReadBookAppointment(date: Date) {
  try {
    const dbResult = await prisma.patientAppointment.findMany({
      where: {
        appointment_date_time: {
          gte: startOfDay(date), // Start of the day (00:00:00)
          lt: endOfDay(date), // End of the day (23:59:59)
        },
        appointment_status: "Pending",
      },
      include: {
        patient_appointment: true,
      },
    });
    return {
      message: "Fetch Appointment Successfully",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return {
      message: "something went wrong",
      error: error,
      status: false,
    };
  }
}
