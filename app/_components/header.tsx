"use client";
import { usePathname } from "next/navigation";

export default function Header(user: {
  user:
    | {
        message: string;
        data: {
          id: string;
          fname: string;
          lname: string;
          email: string;
          password: string;
        } | null;
        status: boolean;
        error?: undefined;
      }
    | {
        message: string;
        error: unknown;
        status: boolean;
        data?: undefined;
      };
}) {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/auth/login" && (
        <div className=" flex justify-end items-center h-[48px] mb-2 border-b-[1px] border-tertiary">
          <span className="bg-customPrimary text-white px-6 h-[32px] flex items-center rounded-md font-semibold shadow-sm capitalize">
            hello, {user.user.data?.fname} {user.user.data?.lname}
          </span>
        </div>
      )}
    </>
  );
}
