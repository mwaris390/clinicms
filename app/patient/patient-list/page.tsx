"use client";
import Appointment from "@/app/_components/modal/appointment";
import NoData from "@/app/_components/no-data";
import SearchBar from "@/app/_components/search-bar";
import SubHeader from "@/app/_components/sub-header";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeletePatient, ReadPatient } from "@/controller/patient/action";
import { Pager } from "@/lib/pager";
import {
  CalendarClock,
  FileUser,
  PencilRuler,
  Stethoscope,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
type Patient = {
  id: string;
  age: number;
  cnic: string | null;
  patient_name: string;
  father_name: string | null;
  phone_no: string;
  notes: string | null;
};
export default function PatientList() {
  const pager = new Pager();
  const [data, setData] = useState<Patient[] | null>(null);
  const [currPage, setCurrPage] = useState<number>(pager.page);
  const [totalItems, setTotalItems] = useState<number>(pager.total);
  const [search, setSearch] = useState<string>("");

  const listenSearchText = async (val: string) => {
    setCurrPage(1);
    setSearch(val);
    FetchPatient();
  };

  async function FetchPatient(offset = currPage, limit = pager.perPage) {
    const result = await ReadPatient(offset - 1, limit, search);
    if (!result.status) {
      toast.error(result.message);
      console.log(result);
    } else {
      setData(result.data as any);
      setTotalItems(Math.ceil((result.totalItems || 0) / pager.perPage));
    }
  }

  async function deletePatient(id: string) {
    const result = await DeletePatient(id);
    if (!result.status) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      setData((prevData) =>
        prevData
          ? prevData.filter((patient) => patient.id !== (result.data as any).id)
          : []
      );
    }
  }

  useEffect(() => {
    FetchPatient();
  }, [data?.length, currPage, totalItems, search]);

  return (
    <>
      <section>
        <SubHeader title="Patient's" />
        <div className=" mt-8">
          <SearchBar listenSearchText={listenSearchText} />
        </div>
        <div className="relative mt-2 h-[65vh] overflow-y-auto  rounded-md shadow">
          {data && data?.length > 0 && (
            <Table>
              <TableHeader className="sticky top-0 z-9">
                <TableRow className="bg-customPrimary hover:bg-customPrimary">
                  <TableHead className="text-white">#</TableHead>
                  <TableHead className="text-white">Patient Name</TableHead>
                  <TableHead className="text-white">Father Name</TableHead>
                  <TableHead className="text-white">Age</TableHead>
                  <TableHead className="text-white">CNIC</TableHead>
                  <TableHead className="text-white">Phone No</TableHead>
                  {/* <TableHead className="text-white">Note</TableHead> */}
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((data, i) => {
                  return (
                    <TableRow
                      key={i}
                      className="even:bg-customSecondary-20 hover:bg-customSecondary-20"
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="capitalize">
                        {data.patient_name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {data.father_name || "--"}
                      </TableCell>
                      <TableCell>{data.age}</TableCell>
                      <TableCell>{data.cnic || "--"}</TableCell>
                      <TableCell>{data.phone_no || "--"}</TableCell>
                      {/* <TableCell className="w-[25%]">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur, odio assumenda?{" "}
                      </TableCell> */}
                      <TableCell className="flex gap-x-4">
                        <button>
                          <Link href={`patient-checkup/${data.id}`}>
                            <Stethoscope className="stroke-tertiary" />
                          </Link>
                        </button>
                        <button>
                          <Link href={`profile/${data.id}`}>
                            <FileUser className="stroke-tertiary" />
                          </Link>
                        </button>
                        <button onClick={() => deletePatient(data.id)}>
                          <Trash2 className="stroke-red-500" />
                        </button>
                        <button>
                          <Link href={`create-patient/${data.id}`}>
                            <PencilRuler className="stroke-customPrimary" />
                          </Link>
                        </button>
                        <Appointment patientId={data.id} data={data} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {data == null || (data.length <= 0 && <NoData />)}
        </div>
        <div className="">
          <Pagination className="">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => {
                    if (currPage != 1) {
                      setCurrPage(currPage - 1);
                      FetchPatient(currPage);
                    }
                  }}
                />
              </PaginationItem>

              {totalItems > pager.slide &&
                currPage >= totalItems - pager.slide && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currPage === 1}
                      onClick={() => {
                        setCurrPage(1);
                        FetchPatient(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}
              {totalItems > pager.slide &&
                currPage >= totalItems - pager.slide && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              {Array.from({ length: totalItems }, (_, i) => i + 1)
                .slice(
                  currPage == 1 ? currPage - 1 : currPage - 2,
                  currPage + pager.slide - 1
                )
                .map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={currPage === pageNum}
                      onClick={() => {
                        setCurrPage(pageNum);
                        FetchPatient(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {currPage < totalItems - pager.slide && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {totalItems > 3 && currPage < totalItems - pager.slide && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={currPage === totalItems}
                    onClick={() => {
                      setCurrPage(totalItems);
                      FetchPatient(currPage);
                    }}
                  >
                    {totalItems}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => {
                    if (totalItems > 1) {
                      setCurrPage(currPage + 1);
                      FetchPatient(currPage);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </>
  );
}
