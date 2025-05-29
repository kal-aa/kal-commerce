import LazyTestimonial from "@/components/LazyTestimonial";
import MainLogic from "@/components/MainLogic";
import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-[55vh] mt-28">
      <MainLogic isAddOrdersPage={false} query="" />
      <LazyTestimonial />
    </div>
  );
}
