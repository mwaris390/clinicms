import { FileX } from "lucide-react";

export default function NoData() {
  return (
    <div className="text-tertiary font-bold flex justify-center items-center flex-col gap-y-2 mt-20">
      <FileX size={38} className="stroke-tertiary" />
      No Data!
    </div>
  );
}

