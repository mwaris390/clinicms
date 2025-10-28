"use server";
import { z } from "zod";
import { prisma } from "@/lib/client";
const schema = z
  .object({
    patientName: z.string().min(1, { message: "Patient Name is Required" }),
    fatherName: z.string(),
    age: z
      .union([
        z.string().min(1, { message: "Age is Required" }),
        z
          .number()
          .int()
          .nonnegative({ message: "Age must be a positive number" }),
      ])
      .transform((val, ctx) => {
        if (typeof val === "string") {
          if (!Number.isNaN(parseInt(val))) {
            return parseInt(val);
          } else {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Not a valid number",
            });
          }
        }
        return val; // Already a number
      }),
    cnic: z.string().max(13, { message: "Max 13 digits" }),
    phone: z
      .string()
      .min(11, { message: "Max 11 digits" })
      .max(15, { message: "Max 15 digits" })
      .superRefine((val: string, ctx) => {
        if (val != "") {
          if (Number.isNaN(parseInt(val))) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Not a Number",
            });
          }
        }
      }),
    sideNote: z.string(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
  })
  .partial({ fatherName: true, cnic: true, sideNote: true });
type Patient = z.infer<typeof schema>;
const updateSchema = schema.merge(z.object({ id: z.string().uuid() }));
type UpdatePatient = z.infer<typeof updateSchema>;
export async function AddPatient({
  patientName,
  fatherName,
  age,
  phone,
  cnic,
  sideNote,
  createdBy = "",
  updatedBy = "",
}: Patient) {
  const result = schema.safeParse({
    patientName,
    fatherName,
    age,
    phone,
    cnic,
    sideNote,
  });
  if (!result.success) {
    return { message: "Validation failed", error: result.error.format() };
  } else {
    try {
      const dbResult = await prisma.$transaction(async (prisma) => {
        // const isPhoneExist = await prisma.patient.findUnique({
        //   where: {
        //     phone_no: phone,
        //   },
        //   select: {
        //     id: true,
        //     updated_at: true,
        //     updated_by: true,
        //   },
        // });
        // if (isPhoneExist) {
        //   return {
        //     message: "Phone No already Exist.",
        //     data: isPhoneExist,
        //     status: false,
        //   };
        // } else {
          const result = await prisma.patient.create({
            data: {
              patient_name: patientName,
              father_name: fatherName,
              age: Number(age),
              phone_no: phone,
              cnic,
              notes: sideNote,
              created_user_id: createdBy,
              updated_user_id: updatedBy,
            },
            select: {
              id: true,
              updated_at: true,
              updated_by: true,
            },
          });
          return {
            message: "Patient Data Created Successfully",
            data: result,
            status: true,
          };
        // }
      });
      return dbResult;
    } catch (error) {
      return { message: "Something Went Wrong", error: error, status: false };
    }
  }
}

export async function UpdatePatient({
  id,
  patientName,
  fatherName,
  age,
  phone,
  cnic,
  sideNote,
  createdBy = "",
  updatedBy = "",
}: UpdatePatient) {
  const result = schema.safeParse({
    patientName,
    fatherName,
    age,
    phone,
    cnic,
    sideNote,
  });
  if (!result.success) {
    return { message: "Validation failed", error: result.error.format() };
  } else {
    try {
      const dbResult = await prisma.patient.update({
        data: {
          patient_name: patientName,
          father_name: fatherName,
          age: Number(age),
          phone_no: phone,
          cnic,
          notes: sideNote,
          created_user_id: createdBy,
          updated_user_id: updatedBy,
        },
        select: {
          id: true,
          updated_at: true,
          updated_by: true,
        },
        where: {
          id,
        },
      });
      return {
        message: "Patient Data Updated Successfully",
        data: dbResult,
        status: true,
      };
    } catch (error) {
      return { message: "Something Went Wrong", error: error, status: false };
    }
  }
}

export async function ReadPatient(offset: number, limit: number, val?: string) {
  try {
    const dbResult = await prisma.patient.findMany({
      omit: {
        created_at: true,
        created_user_id: true,
        updated_at: true,
        updated_user_id: true,
      },
      skip: offset,
      take: limit,
      where:
        val != ""
          ? {
              OR: [
                { patient_name: { contains: val } },
                { father_name: { contains: val } },
                // { age: Number(val) },
                { cnic: { contains: val } },
                { phone_no: { contains: val } },
                { notes: { contains: val } },
              ],
            }
          : undefined,
    });
    const totalItems = await prisma.patient.count();
    return {
      message: "Fetch Patient Data successfully",
      data: dbResult,
      status: true,
      totalItems: totalItems,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

export async function ReadPatientAll() {
  try {
    const dbResult = await prisma.patient.findMany({
      omit: {
        created_at: true,
        created_user_id: true,
        updated_at: true,
        updated_user_id: true,
      },
    });
    return {
      message: "Fetch Patient Data successfully",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

export async function ReadSinglePatient(id: string) {
  try {
    const dbResult = await prisma.patient.findUnique({
      omit: {
        created_at: true,
        created_user_id: true,
        updated_at: true,
        updated_user_id: true,
      },
      where: {
        id,
      },
      include: {
        patient_checkup: {
          include: {
            created_by: {
              select: {
                fname: true,
                lname: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    return {
      message: "Fetch Patient Data successfully",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

export async function DeletePatient(id: string) {
  try {
    const dbResult = await prisma.patient.delete({
      where: {
        id,
      },
      select: {
        id: true,
        updated_at: true,
        updated_by: true,
      },
    });
    return {
      message: "Patient Data Deleted successfully",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

export async function CountPatients() {
  try {
    const dbResult = await prisma.patient.count();
    return {
      message: "Fetch Patient Count",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return {
      message: "Something went wrong",
      error: error,
      status: false,
    };
  }
}
