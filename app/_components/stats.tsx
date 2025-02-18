"use client";
import { CountPatients } from "@/controller/patient/action";
import { CountUsers } from "@/controller/user/data";
import { Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Stats() {
  const [noOfUser, setNoOfUsers] = useState(0);
  const [noOfPatient, setNoOfPatient] = useState(0);

  async function FetchTotalUsers() {
    const result = await CountUsers();
    if (result.status) {
      setNoOfUsers(result.data || 0);
    } else {
      toast.error(result.message);
    }
  }
  async function FetchTotalPatients() {
    const result = await CountPatients();
    if (result.status) {
      setNoOfPatient(result.data || 0);
    } else {
      toast.error(result.message);
    }
  }
  useEffect(() => {
    FetchTotalUsers();
    FetchTotalPatients();
  }, [noOfUser, noOfPatient]);
  return (
    <>
      <section className="flex gap-x-12">
        <div className="w-[20rem] h-[5rem] bg-customSecondary-20 rounded-md shadow-md flex justify-between items-center px-4">
          <div>
            <Users size={48} className="stroke-customPrimary" />
          </div>
          <div className="flex flex-col">
            <span className="text-customPrimary text-end font-bold text-xl">
              {noOfPatient}
            </span>
            <span className="text-sm text-slate-600">No of Patients</span>
          </div>
        </div>
        <div className="w-[20rem] h-[5rem] bg-customSecondary-20 rounded-md shadow-md flex justify-between items-center px-4">
          <div>
            <Users size={48} className="stroke-customPrimary" />
          </div>
          <div className="flex flex-col">
            <span className="text-customPrimary text-end font-bold text-xl">
              {noOfUser}
            </span>
            <span className="text-sm text-slate-600">No of Users</span>
          </div>
        </div>
      </section>
    </>
  );
}
