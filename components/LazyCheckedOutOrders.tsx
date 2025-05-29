"use client";

import React, { Suspense, useState } from "react";
import LazyButton from "./LazyButton";
import { MoonLoader } from "react-spinners";
const CheckedOutOrders = React.lazy(() => import("./CheckedOutOrders"));
import { checkedOrdersProps } from "@/app/types/types";

export function suspenseFallBack() {
  return (
    <div className="flex justify-center mt-5 text-black dark:text-white">
      <MoonLoader color="currentColor" />
    </div>
  );
}

export default function LazyCheckedOutOrders(data: checkedOrdersProps) {
  const {
    mappedProcessingOrders,
    pageProcessing,
    pagesProcessing,
    hasMoreProcessing,
  } = data;
  const [checked, setChecked] = useState(false);

  return (
    <div id="purchases">
      <LazyButton {...{ checked, setChecked, text: "Purchases" }} />
      {checked && (
        <Suspense fallback={suspenseFallBack()}>
          <CheckedOutOrders
            {...{
              mappedProcessingOrders,
              pageProcessing,
              pagesProcessing,
              hasMoreProcessing,
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
