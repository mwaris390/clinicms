"use client";
import Image from "next/image";
import avatar from "@/public/avatar.png";
import Link from "next/link";
export default function PatientCard({
  data,
  isNote = true,
  isEdit = true,
  isCompact = false,
}: {
  data: any;
  isNote?: boolean;
  isEdit?: boolean;
  isCompact?: boolean;
  }) {
  // console.log(data);
  
  return (
    <div className="flex justify-center items-center w-full">
      <div
        className={`bg-white rounded-md shadow border border-tertiary ${
          isCompact ? "w-full px-2 py-2" : "w-full lg:w-2/3 px-8 py-4"
        }`}
      >
        <div className="flex items-center">
          <div className="h-[100px] w-[100px] rounded-md border-2 border-tertiary me-8">
            <Image
              src={avatar}
              alt="patient Image"
              className="w-full h-full object-contain"
            />
            {isEdit && (
              <button className="bg-customPrimary hover:bg-customPrimary-80 text-white font-bold w-full rounded-md mt-1 text-[10px]">
                <Link href={`/patient/create-patient/${data?.id}`}>
                  Edit Info
                </Link>
              </button>
            )}
          </div>
          <div>
            <div className="flex gap-x-8">
              <div className="flex flex-col ">
                <label htmlFor="patientName" className="font-bold">
                  Patient Name
                </label>
                <span className="capitalize border-b-2 border-black text-wrap max-w-[150px]">
                  {data?.patient_name}
                </span>
              </div>
              {!isCompact && (
                <>
                  <div className="flex flex-col ">
                    <label htmlFor="fatherName" className="font-bold">
                      Father Name
                    </label>
                    <span className="capitalize border-b-2 border-black text-wrap max-w-[150px]">
                      {data?.father_name || "--"}
                    </span>
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="age" className="font-bold">
                      Age
                    </label>
                    <span className=" border-b-2 border-black text-wrap max-w-[150px]">
                      {data?.age}yr
                    </span>
                  </div>
                </>
              )}
            </div>
            {!isCompact && (
              <div className="flex gap-x-8 mt-4">
                <div className="flex flex-col">
                  <label htmlFor="phone" className="font-bold">
                    Phone
                  </label>
                  <span className=" border-b-2 border-black text-wrap max-w-[150px]">
                    {data?.phone_no || "--"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="cnic" className="font-bold">
                    CNIC
                  </label>
                  <span className=" border-b-2 border-black text-wrap max-w-[150px]">
                    {data?.cnic || "--"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {isNote && (
          <div className="mt-4 border-t-2 border-black">
            <div className="flex flex-col">
              <label htmlFor="sideNote" className="font-bold">
                Note
              </label>
              <span className="capitalize ">{data?.notes || "--"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
