"use client";
import Logo from "@/public/waqar-logo-black.svg";
import { format } from "date-fns";
import { PrinterIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
export default function PrintPatientCard({
  patientData,
  showIcon = true,
  printCallByParent,
}: {
  patientData: any;
  showIcon: boolean;
  printCallByParent?: (fn: () => void) => void;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `eye-receipt-${patientData?.patient_name}`,
    // : () => toast.success("Print Successfully"),
    // onPrintError: () => toast.error("Print Failed"),
  } as any);
  useEffect(() => {
    if (printCallByParent) {
      printCallByParent(handlePrint);
    }
  }, [printCallByParent, handlePrint]);
  const returnValidValue = (val: any) => (val ? val : "-");
  function saimHeader() {
    return (
      <>
        {/* Header */}
        <div className="flex justify-between items-center border-black border-b-4 pb-0 mb-2">
          {/* address */}

          <div className={`text-left w-[15rem]`}>
            <h2 className="font-bold text-lg">Waqar Optical Center</h2>
            <p className="text-sm font-semibold capitalize">
              Adil market near staff gala sargodha road, gujrat
            </p>
            <p className="text-sm font-semibold capitalize">0331-9615009</p>
          </div>

          {/* Logo placeholder */}
          <div className="w-[14rem]   flex items-center justify-center text-xs">
            <Image src={Logo} className="w-full" alt="logo" />
          </div>

          {/* Right text */}

          <div className="text-right  w-[15rem]">
            <h2 className="font-bold text-lg">Saim Younis</h2>
            <p className="text-sm font-semibold">
              Optometrist | Vision Care Specialist
            </p>
            <p className="text-xs font-semibold">
              Clinical Training: Model Town Hospital and CH
            </p>
          </div>
        </div>{" "}
      </>
    );
  }
  function otherHeader() {
    return (
      <>
        {/* Header */}
        <div className="flex justify-between px-[4rem] items-center border-black border-b-4 pb-0 mb-2">
          {/* Logo placeholder */}
          <div className="w-[14rem]   flex items-center justify-center text-xs">
            <Image src={Logo} className="w-full" alt="logo" />
          </div>

          {/* address */}
          <div className={`text-right w-[16rem]`}>
            <h2 className="font-bold text-lg">Waqar Optical Center</h2>
            <p className="text-sm font-semibold capitalize">
              Adil market near staff gala sargodha road, gujrat
            </p>
            <p className="text-sm font-semibold capitalize">0331-9615009</p>
          </div>
        </div>{" "}
      </>
    );
  }
  return (
    <>
      {showIcon && (
        <button onClick={handlePrint}>
          <PrinterIcon className="stroke-primary" />
        </button>
      )}
      <div className="hidden print:block">
        <div
          ref={contentRef}
          className="w-[210mm] h-[148.5mm] mx-auto p-6  print:shadow-none shadow-md print-color"
        >
          {/* condition header */}
          {patientData.patient_checkup[0].created_by.fname == "saim"
            ? saimHeader()
            : otherHeader()}
          {/* Date / Time */}
          <div className="flex justify-between text-sm mb-2">
            <p>
              Date: {format(patientData.patient_checkup[0].created_at, "PPP")}
            </p>
          </div>

          {/* Patient / Doctor Info */}
          <div className="mb-2 text-sm capitalize">
            <p>
              <span className="font-semibold">Patient Name:</span>{" "}
              {returnValidValue(patientData.patient_name)}
            </p>
          </div>

          {/* Tables */}
          <div className="flex gap-x-4">
            {/* OD Table */}
            <table className="flex-1 border-collapse">
              <thead>
                <tr>
                  <td
                    className="border-2 border-gray-600 font-bold text-center"
                    colSpan={5}
                  >
                    Right Eye
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-gray-600"></td>
                  <td className="border-2 border-gray-600 text-center">SPH</td>
                  <td className="border-2 border-gray-600 text-center">CYL</td>
                  <td className="border-2 border-gray-600 text-center">AXIS</td>
                  <td className="border-2 border-gray-600 text-center">VA</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-2 border-gray-600 text-center w-20 px-2">
                    DIST.
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].sphrd)}
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].cylrd)}
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].axisrd)}
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].vard)}
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-gray-600 text-center w-20 px-2">
                    ADD.
                  </td>
                  <td
                    className="border-2 border-gray-600 w-20 px-2 text-center"
                    colSpan={4}
                  >
                    {returnValidValue(patientData.patient_checkup[0].add_note)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* OS Table */}
            <table className="flex-1 border-collapse">
              <thead>
                <tr>
                  <td
                    className="border-2 border-gray-600 font-bold text-center"
                    colSpan={5}
                  >
                    Left Eye
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-gray-600"></td>
                  <td className="border-2 border-gray-600 text-center">SPH</td>
                  <td className="border-2 border-gray-600 text-center">CYL</td>
                  <td className="border-2 border-gray-600 text-center">AXIS</td>
                  <td className="border-2 border-gray-600 text-center">VA</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-2 border-gray-600 text-center w-20 px-2">
                    DIST.
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].sphld)}
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].cylld)}
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].axisld)}
                  </td>
                  <td className="border-2 border-gray-600 w-20 px-2 text-center">
                    {returnValidValue(patientData.patient_checkup[0].vald)}
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-gray-600 text-center w-20 px-2">
                    ADD.
                  </td>
                  <td
                    className="border-2 border-gray-600 w-20 px-2 text-center"
                    colSpan={4}
                  >
                    {returnValidValue(patientData.patient_checkup[0].add_noteL)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end text-sm  my-2 capitalize">
            <p>
              <span className="font-semibold">Checked By:</span>{" "}
              {returnValidValue(
                patientData.patient_checkup[0].created_by.fname
              )}{" "}
              {returnValidValue(
                patientData.patient_checkup[0].created_by.lname
              )}
            </p>
          </div>

          <div className="flex items-end justify-between text-sm my-2 ">
            <p className="text-sm">Printed on: {format(new Date(), "pp")}</p>
            <p>
              <span className="">Checked Time:</span>{" "}
              {format(patientData.patient_checkup[0].created_at, "pp")}
            </p>
          </div>

          <hr className="border-b-4 border-black" />
        </div>
      </div>
    </>
  );
}
