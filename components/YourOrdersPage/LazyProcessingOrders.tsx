"use client";

import React, { Suspense, useState } from "react";
import { MoonLoader } from "react-spinners";
import { ProcessingOrdersProps } from "@/app/types/types";
const ProcessingOrders = React.lazy(() => import("./ProcessingOrders"));
import LazyButton from "../LazyButton";

// Helper function for the suspene fallback
export function suspenseFallBack() {
  return (
    <div className="flex justify-center mt-5 text-black dark:text-white">
      <MoonLoader color="currentColor" />
    </div>
  );
}

function LazyProcessingOrders(data: ProcessingOrdersProps) {
  const {
    mappedProcessingOrders,
    processingPage,
    pagesProcessing,
    hasMoreProcessing,
  } = data;
  const [checked, setChecked] = useState(false);

  return (
    <div id="purchases">
      <LazyButton {...{ checked, setChecked, text: "Purchases" }} />
      {checked && (
        <Suspense fallback={suspenseFallBack()}>
          <ProcessingOrders
            mappedProcessingOrders={mappedProcessingOrders}
            processingPage={processingPage}
            pagesProcessing={pagesProcessing}
            hasMoreProcessing={hasMoreProcessing}
          />
        </Suspense>
      )}
    </div>
  );
}

export default LazyProcessingOrders;
