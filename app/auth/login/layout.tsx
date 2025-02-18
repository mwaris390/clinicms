import { Hospital } from "lucide-react";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h2 className="px-2 py-1 mx-6 my-2 text-2xl font-bold bg-customPrimary text-white w-fit rounded-md flex items-center gap-1">
        <Hospital />
        ClinicMS.
      </h2>
      {children}
    </>
  );
}
