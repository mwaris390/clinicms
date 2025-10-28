import { Hospital } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/waqar-logo.svg";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h2 className="px-2 py-1 mx-6 my-2 text-2xl font-bold bg-customPrimary text-white w-fit rounded-md flex items-center gap-1">
        <Image src={Logo} className="w-[150px]" alt="logo" />
        {/* <span className="font-bold text-[18px]">Waqar Optical Center.</span> */}
      </h2>
      {children}
    </>
  );
}
