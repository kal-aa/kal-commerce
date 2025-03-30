"use client";

import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <HashLoader size={100} color="#6A5ACD" />
    </div>
  );
}
