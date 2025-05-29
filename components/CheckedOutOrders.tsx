import React from "react";
import YourOrdersGenerate from "./YourOrdersGenerate";
import Pagination from "./Pagination";
import { checkedOrdersProps } from "@/app/types/types";

export default function CheckedOutOrders(data: checkedOrdersProps) {
  const {
    mappedProcessingOrders,
    pageProcessing,
    pagesProcessing,
    hasMoreProcessing,
  } = data;

  return (
    <div>
      {" "}
      <br />
      <hr />
      <br />
      <div className="text-center col-span-5 bg-blue-700 py-3 text-white mb-5 mx-5 px-2">
        <span className="font-bold">
          Below is a list of your orders currently in dispatch.
        </span>
      </div>
      <br />
      <hr />
      <br />
      <section className="order-section">
        <YourOrdersGenerate
          isProcessingSection={true}
          orders={mappedProcessingOrders}
        />
      </section>
      <Pagination
        page={pageProcessing}
        pageKey="pageProcessing"
        hasMore={hasMoreProcessing}
        totalPages={pagesProcessing}
        baseUrl="your-orders"
      />
    </div>
  );
}
