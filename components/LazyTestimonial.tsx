"use client";

import React, { Suspense, useState } from "react";
import LazyButton from "./LazyButton";
import { suspenseFallBack } from "./LazyCheckedOutOrders";
const Testimonial = React.lazy(() => import("@/components/Testimonial"));

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
