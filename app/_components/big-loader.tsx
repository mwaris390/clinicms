"use client";

import { Loader } from "lucide-react";

export default function BigLoader() {
  return (
    <div className="text-tertiary font-bold flex justify-center items-center gap-x-2 mt-20">
      <Loader size={38} className="stroke-tertiary animate-spin" />
      Loading!
    </div>
  );
}
