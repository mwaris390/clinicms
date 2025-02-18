"use server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/client";
import { cookies } from "next/headers";

const schema = z.object({
  fname: z.string().min(1, { message: "First Name required" }),
  lname: z.string().min(1, { message: "Last Name required" }),
  email: z
    .string()
    .min(1, { message: "Email required" })
    .email("Incorrect Email"),
  password: z.string().min(1, { message: "Password required" }),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});
type AddUser = z.infer<typeof schema>;

export async function AddUser({
  fname,
  lname,
  email,
  password,
  createdBy = "admin",
  updatedBy = "admin",
}: AddUser) {
  const encryptPassword = await bcrypt.hash(password, 5);
  const result = schema.safeParse({
    fname,
    lname,
    email,
    password,
  });
  if (!result.success) {
    return { message: "Validation failed", error: result.error.format() };
  } else {
    try {
      const dbResult = await prisma.user.create({
        data: {
          fname,
          lname,
          email,
          password: encryptPassword,
          created_by: createdBy,
          updated_by: updatedBy,
        },
        select: {
          id: true,
          updated_at: true,
          updated_by: true,
        },
      });
      return {
        message: "User Data Entered successfully",
        data: dbResult,
        status: true,
      };
    } catch (error) {
      return { message: "Something Went Wrong", error: error, status: false };
    }
  }
}

export async function ReadUser(offset: number, limit: number, val?: string) {
  try {
    const dbResult = await prisma.user.findMany({
      omit: {
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
      skip: offset,
      take: limit,
      where:
        val != ""
          ? {
              OR: [
                { fname: { contains: val } },
                { lname: { contains: val } },
                { email: { contains: val } },
              ],
            }
          : undefined,
    });
    const totalItems = await prisma.user.count();
    return {
      message: "Fetch Users Data successfully",
      data: dbResult,
      status: true,
      totalItems: totalItems,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

export async function ReadSingleUser(id: string) {
  try {
    const dbResult = await prisma.user.findUnique({
      omit: {
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
      where: {
        id,
      },
    });
    return {
      message: "Fetch User Data successfully",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

const UpdateSchema = schema
  .partial({ password: true })
  .merge(z.object({ id: z.string().uuid() }));
type UpdateUser = z.infer<typeof UpdateSchema>;

export async function UpdateUser({
  id,
  fname,
  lname,
  email,
  password,
  createdBy = "super_admin",
  updatedBy = "super_admin",
}: UpdateUser) {
  let encryptPassword = "";
  if (password != undefined) {
    encryptPassword = await bcrypt.hash(password, 5);
  }
  const result = UpdateSchema.safeParse({
    id,
    fname,
    lname,
    email,
    password,
  });
  if (!result.success) {
    return { message: "Validation failed", error: result.error.format() };
  } else {
    try {
      let dbResult;
      if (password != undefined) {
        dbResult = await prisma.user.update({
          data: {
            fname,
            lname,
            email,
            password: encryptPassword,
            created_by: createdBy,
            updated_by: updatedBy,
          },
          where: {
            id,
          },
          select: {
            id: true,
            updated_at: true,
            updated_by: true,
          },
        });
      } else {
        dbResult = await prisma.user.update({
          data: {
            fname,
            lname,
            email,
            created_by: createdBy,
            updated_by: updatedBy,
          },
          where: {
            id,
          },
          select: {
            id: true,
            updated_at: true,
            updated_by: true,
          },
        });
      }
      return {
        message: "User Data Updated successfully",
        data: dbResult,
        status: true,
      };
    } catch (error) {
      return { message: "Something Went Wrong", error: error, status: false };
    }
  }
}

export async function DeleteUser(id: string) {
  try {
    const dbResult = await prisma.user.delete({
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
      message: "User Data Deleted successfully",
      data: dbResult,
      status: true,
    };
  } catch (error) {
    return { message: "Something Went Wrong", error: error, status: false };
  }
}

const loginSchema = schema.omit({
  fname: true,
  lname: true,
  createdBy: true,
  updatedBy: true,
});

type LoginUser = z.infer<typeof loginSchema>;
export async function login({ email, password }: LoginUser) {
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { message: "Validation failed", error: result.error.format() };
  } else {
    try {
      const dbResult = await prisma.$transaction(async (prisma) => {
        let isUserExist = await prisma.user.findUnique({
          where: {
            email,
          },
          omit: {
            created_at: true,
            created_by: true,
            updated_at: true,
            updated_by: true,
          },
        });
        if (isUserExist) {
          let isPasswordExist = await bcrypt.compare(
            password,
            isUserExist.password
          );
          if (isPasswordExist) {
            let cookie = await cookies();
            cookie.set("token", isUserExist.id);
            return {
              message: "Login successfully",
              data: isUserExist,
              status: true,
            };
          } else {
            return {
              message: "Password Provided is Incorrect",
              status: false,
            };
          }
        } else {
          return {
            message: "Email Provided is Incorrect",
            status: false,
          };
        }
      });
      return dbResult;
    } catch (error) {
      return { message: "Something Went Wrong", data: error, status: false };
    }
  }
}

export async function CountUsers() {
  try {
    const dbResult = await prisma.user.count();
    return {
      message: "Fetch User Count",
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
