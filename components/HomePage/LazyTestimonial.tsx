"use client";

import React, { Suspense, useState } from "react";
import LazyButton from "../LazyButton";
import { suspenseFallBack } from "../YourOrdersPage/LazyProcessingOrders";
const Testimonial = React.lazy(() => import("@/components/HomePage/Testimonial"));

export default function LazyTestimonial() {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <LazyButton {...{ checked, setChecked }} />
      {checked && (
        <Suspense fallback={suspenseFallBack()}>
          <Testimonial />
        </Suspense>
      )}
    </div>
  );
}
