"use client";

import BigLoader from "@/app/_components/big-loader";
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
import { DeleteUser, ReadUser } from "@/controller/user/data";
import { Pager } from "@/lib/pager";
import { PencilRuler, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserList() {
  const pager = new Pager();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const listenSearchText = async (val: string) => {
    setCurrPage(1);
    setSearch(val);
    FetchUser();
  };

  const [data, setData] = useState<
    {
      id: string;
      fname: string;
      lname: string;
      email: string;
    }[]
  >([]);

  const [totalItems, setTotalItems] = useState<number>(0);
  const [currPage, setCurrPage] = useState<number>(pager.page);

  async function FetchUser(offset = currPage, limit = pager.perPage) {
    setLoading(true)
    const result = await ReadUser(offset - 1, limit, search);
    if (!result.status) {
      toast.error(result.message);
    } else {
      setData(result.data as any);
      setTotalItems(Math.ceil((result.totalItems || 0) / pager.perPage));
    }
    setLoading(false);
  }

  async function deleteUser(id: string) {
    const result = await DeleteUser(id);
    if (!result.status) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      setData((prevData) =>
        prevData
          ? prevData.filter((user) => user.id !== (result.data as any).id)
          : []
      );
    }
  }

  useEffect(() => {
    FetchUser();
  }, [data.length, totalItems, currPage, search]);

  return (
    <>
      <section>
        <SubHeader title="User's" />
        <div className=" mt-8">
          <SearchBar listenSearchText={listenSearchText} />
        </div>
        <div className="relative mt-2 h-[65vh] overflow-y-auto  rounded-md shadow">
          {!isLoading && data.length > 0 && (
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-customPrimary hover:bg-customPrimary">
                  <TableHead className="text-white">#</TableHead>
                  <TableHead className="text-white">First Name</TableHead>
                  <TableHead className="text-white">Last Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((data, i) => {
                  return (
                    <TableRow
                      key={i}
                      className="even:bg-customSecondary-20 hover:bg-customSecondary-20"
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="capitalize">{data.fname}</TableCell>
                      <TableCell className="capitalize">{data.lname}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell className="flex gap-x-2">
                        <button
                          type="button"
                          onClick={() => deleteUser(data.id)}
                        >
                          <Trash2 stroke="red" />
                        </button>
                        <Link href={`/user/create-user/${data.id}`}>
                          <PencilRuler stroke="#3d2bdb" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {!isLoading && data.length <= 0 && <NoData />}
          {isLoading && <BigLoader />}
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
                      FetchUser(currPage);
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
                        FetchUser(1);
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
                        FetchUser(pageNum);
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
                      FetchUser(currPage);
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
                      FetchUser(currPage);
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
