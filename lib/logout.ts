'use server'
import { cookies } from "next/headers";

export async function Logout() {
  const cookie = await cookies();
  cookie.delete("token");
  return true;
}
