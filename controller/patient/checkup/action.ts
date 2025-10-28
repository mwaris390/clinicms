"use server";

import { prisma } from "@/lib/client";
import { endOfDay, startOfDay } from "date-fns";
import { z } from "zod";

let baseSchema = z.object({
  patient: z.string().uuid({ message: "Patient must be selected" }),
  sphLD: z.string().optional(),
  cylLD: z.string().optional(),
  axisLD: z.string().optional(),
  vaLD: z.string().optional(),
  sphLN: z.string().optional(),
  cylLN: z.string().optional(),
  axisLN: z.string().optional(),
  vaLN: z.string().optional(),
  sphRD: z.string().optional(),
  cylRD: z.string().optional(),
  axisRD: z.string().optional(),
  vaRD: z.string().optional(),
  sphRN: z.string().optional(),
  cylRN: z.string().optional(),
  axisRN: z.string().optional(),
  vaRN: z.string().optional(),
  sideNote: z.string().optional(),
  addNote: z.string().optional(),
  addNoteL: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val.trim() === "" ||
        /^[-+]?\d+(\.\d+)?$/.test(val),
      {
        message: "Invalid decimal number",
      }
    ),
  created_user_id: z.string(),
  updated_user_id: z.string(),
});
type FormType = z.infer<typeof baseSchema>;
function convertStringToFloat(val: string | undefined) {
  if (val === undefined || val.trim() === "") {
    // return undefined;
  } else {
    return val;
  }
}
export async function PatientCheckup(values: FormType) {
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
        const date = new Date();
        const isAppointmentExist = await prisma.patientAppointment.findFirst({
          where: {
            AND: [
              { patient_id: values.patient },
              {
                appointment_date_time: {
                  gte: startOfDay(date), // Start of the day (00:00:00)
                  lt: endOfDay(date), // End of the day (23:59:59)
                },
              },
            ],
          },
          select: {
            id: true,
          },
        });
        if (isAppointmentExist) {
          const updateAppointment = await prisma.patientAppointment.update({
            data: {
              appointment_status: "Fulfilled",
            },
            where: {
              id: isAppointmentExist.id,
            },
          });
        }
        const result = await prisma.patientCheckUp.create({
          data: {
            patient_id: values.patient,
            remarks: values.sideNote,
            axisld: convertStringToFloat(values.axisLD),
            // axisln: convertStringToFloat(values.axisLN),
            axisrd: convertStringToFloat(values.axisRD),
            // axisrn: convertStringToFloat(values.axisRN),
            cylld: convertStringToFloat(values.cylLD),
            // cylln: convertStringToFloat(values.cylLN),
            cylrd: convertStringToFloat(values.cylRD),
            // cylrn: convertStringToFloat(values.cylRN),
            sphld: convertStringToFloat(values.sphLD),
            // sphln: convertStringToFloat(values.sphLN),
            sphrd: convertStringToFloat(values.sphRD),
            // sphrn: convertStringToFloat(values.sphRN),
            vald: convertStringToFloat(values.vaLD),
            // valn: convertStringToFloat(values.vaLN),
            vard: convertStringToFloat(values.vaRD),
            // varn: convertStringToFloat(values.vaRN),
            add_note: convertStringToFloat(values.addNote),
            add_noteL: convertStringToFloat(values.addNoteL),
            created_user_id: values.created_user_id,
            updated_user_id: values.updated_user_id,
          },
          include: {
            created_by: {
              select: {
                fname: true,
                lname: true,
              },
            },
            patient_checkups: {
              select: {
                patient_name: true,
              },
            },
          },
        });
        return {
          message: "Created Patient Checkup successfully",
          data: result,
          status: true,
        };
      });
      return dbResult;
    } catch (error) {
      return { message: "Something Went Wrong", error: error, status: false };
    }
  }
}
const updatedSchema = baseSchema.merge(
  z.object({ checkupId: z.string().uuid({ message: "checkup required" }) })
);
type UpdatedFormType = z.infer<typeof updatedSchema>;
export async function UpdatePatientCheckup(values: UpdatedFormType) {
  const result = baseSchema.safeParse(values);
  if (!result.success) {
    return {
      message: "Validation failed",
      error: result.error.format(),
      status: false,
    };
  } else {
    try {
      const dbResult = await prisma.patientCheckUp.update({
        data: {
          patient_id: values.patient,
          remarks: values.sideNote,
          axisld: convertStringToFloat(values.axisLD),
          axisln: convertStringToFloat(values.axisLN),
          axisrd: convertStringToFloat(values.axisRD),
          axisrn: convertStringToFloat(values.axisRN),
          cylld: convertStringToFloat(values.cylLD),
          cylln: convertStringToFloat(values.cylLN),
          cylrd: convertStringToFloat(values.cylRD),
          cylrn: convertStringToFloat(values.cylRN),
          sphld: convertStringToFloat(values.sphLD),
          sphln: convertStringToFloat(values.sphLN),
          sphrd: convertStringToFloat(values.sphRD),
          sphrn: convertStringToFloat(values.sphRN),
          vald: convertStringToFloat(values.vaLD),
          valn: convertStringToFloat(values.vaLN),
          vard: convertStringToFloat(values.vaRD),
          varn: convertStringToFloat(values.vaRN),
          add_note: convertStringToFloat(values.addNote),
          add_noteL: convertStringToFloat(values.addNoteL),
          created_user_id: values.created_user_id,
          updated_user_id: values.updated_user_id,
        },
        where: {
          id: values.checkupId,
        },
      });
      return {
        message: "Updated Checkup Patient successfully",
        data: dbResult,
        status: true,
      };
    } catch (error) {
      return { message: "Something Went Wrong", error: error, status: false };
    }
  }
}

export async function ReadCheckUp(checkupId: string) {
  if (!checkupId) {
    return {
      message: "Id did not provided",
      error: "",
      status: false,
    };
  }
  try {
    const dbResult = await prisma.patientCheckUp.findUnique({
      where: {
        id: checkupId,
      },
    });
    return {
      message: "Fetch Patient checkup Data successfully",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

export async function CountCheckUpByDate() {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // Get date 7 days ago
    const dbResult = await prisma.patientCheckUp.groupBy({
      by: ["created_at"],
      _count: true,
      where: {
        created_at: {
          gte: startOfDay(sevenDaysAgo), // Greater than or equal to 7 days ago
          lte: endOfDay(today), // Less than or equal to today
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });
    let dateMap = new Map();
    dbResult.map((item) => {
      let date = new Date(item.created_at);
      let dateWithoutTime = date.toISOString().split("T")[0];
      if (dateMap.has(dateWithoutTime)) {
        let val = dateMap.get(dateWithoutTime);
        dateMap.set(dateWithoutTime, val + item._count);
      } else {
        dateMap.set(dateWithoutTime, item._count);
      }
    });

    let computeDbResult: { date: string; count: number }[] = [];
    dateMap.forEach((val, key) => {
      computeDbResult.push({ date: key, count: val });
    });

    return {
      message: "Fetch Patient checkup Count",
      data: computeDbResult,
      status: true,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}
