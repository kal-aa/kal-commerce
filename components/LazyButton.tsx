import { LazyButtonProps } from "@/app/types/types";
import React from "react";

export default function LazyButton({
  checked,
  setChecked,
  text = "Testimonials",
}: LazyButtonProps) {
  return (
    <button
      onClick={() => setChecked((prev) => !prev)}
      className="group relative text-black search-btn block mt-4 sm:w-[30%]"
      style={{ marginLeft: checked ? "25px" : "0px" }}
    >
      {checked && <span className="btn-pin -left-3"></span>}
      {checked ? `Hide ${text}` : `See ${text}`}
      {!checked && <span className="btn-pin"></span>}
    </button>
  );
}
