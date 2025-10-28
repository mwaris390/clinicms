import { AddUser } from "@/controller/user/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await AddUser({
      fname: "saim",
      lname: "younis",
      email: "saim01@gmail.com",
      password: "12345678",
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { message: "Something Went Wrong", error: e },
      { status: 500 }
    );
  }
}
