"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Delete, Search } from "lucide-react";
import { useRef, useState } from "react";

export default function SearchBar({
  listenSearchText,
}: {
  listenSearchText(val: string): void;
}) {
  const [searchText, setSearchText] = useState("");
  const searchTextRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center justify-end gap-x-2">
      <Input
        className="w-2/6 border border-customPrimary-20"
        placeholder="Search Here..."
        type="text"
        ref={searchTextRef}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      />
      {searchText != "" && (
        <Delete
          className="stroke-red-600 absolute right-[145px]"
          onClick={() => {
            if (searchTextRef.current) searchTextRef.current.value = "";
            setSearchText("");
            listenSearchText('');
          }}
        />
      )}

      <Button
        className="bg-customPrimary hover:bg-customPrimary-80"
        type="button"
        disabled={searchText == ""}
        onClick={() => {
          listenSearchText(searchText);
        }}
      >
        <Search />
        <span>Search</span>
      </Button>
    </div>
  );
}
