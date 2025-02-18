"use client";

import toast, { Toaster } from "react-hot-toast";

export default function ToastForServer({
  message,
  isError = false,
}: {
  message: string;
  isError?: boolean;
}) {
  if (!isError) {
    toast.success(message);
  } else {
    toast.error(message);
  }
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#7ca6f333",
          color: "#7063d3",
          fontWeight: "bold",
        },
      }}
    />
  );
}
