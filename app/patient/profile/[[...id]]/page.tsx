"use client";
import SubHeader from "@/app/_components/sub-header";
import EyeScope from "@/app/_components/eye-scope";
import PatientCard from "@/app/_components/patient-card";
import { ReadSinglePatient } from "@/controller/patient/action";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import NoData from "@/app/_components/no-data";
import { format } from "date-fns";
import Link from "next/link";
import { PencilRuler } from "lucide-react";
export default function Profile() {
  let { id } = useParams();
  let patientID: string | undefined;
  if (id) {
    patientID = id[0];
  }
  const [data, setData] = useState<any | null>(null);
  async function FetchRecord() {
    const result = await ReadSinglePatient(patientID || "");
    if (result.status) {
      setData(result.data);
    } else {
      toast.error(result.message);
    }
  }

  useEffect(() => {
    FetchRecord();
  }, []);

  return (
    <>
      <section>
        <SubHeader title="Patient Profile" />
        <div className=" bg-customSecondary-20 rounded-md mt-8 w-full p-8">
          <PatientCard data={data} />
          <h2 className="bg-customPrimary-20 font-semibold py-2 px-8 rounded-md shadow-sm my-8 w-fit">
            History
          </h2>
          <div>
            {data?.patient_checkup.length > 0 && (
              <ul className="space-y-4">
                {data?.patient_checkup.map((checkup: any, index: number) => {
                  return (
                    <li
                      key={index}
                      className="bg-white px-8 py-4 rounded-md shadow w-full border border-tertiary "
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="bg-tertiary w-2 h-2 me-4 rounded-full block"></span>
                          <h2 className="text-tertiary">
                            {format(checkup.created_at, "PPPpp")}
                          </h2>
                        </div>
                        <button>
                          <Link
                            href={`/patient/patient-checkup/${patientID}/true/${checkup.id}`}
                          >
                            <PencilRuler className="stroke-customPrimary" />
                          </Link>
                        </button>
                      </div>
                      <EyeScope tableName="Left / Right" data={checkup} />
                      <div className="capitalize">
                        <span className="font-semibold me-2 ">Extra Note:</span>
                        {checkup.remarks}
                      </div>
                      <div className="w-full text-right">
                        <span className="text-sm capitalize">
                          Created By - {checkup.created_by.fname}{" "}
                          {checkup.created_by.lname}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {data?.patient_checkup.length <= 0 && <NoData />}
          </div>
        </div>
      </section>
    </>
  );
}
