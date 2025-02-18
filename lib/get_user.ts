'use server'
import { ReadSingleUser } from "@/controller/user/data";
import { cookies } from "next/headers";

export async function GetUser() {
  const id = (await cookies()).get("token")?.value || "";
  const user = await ReadSingleUser(id);
  return user;
}
