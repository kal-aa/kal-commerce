"use client";

import { ProcessingOrdersProps } from "@/app/types/types";
import OrderActions from "./OrderActions";
import Pagination from "../Pagination";

function ProcessingOrders(data: ProcessingOrdersProps) {
  const {
    mappedProcessingOrders,
    processingPage,
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
        <OrderActions
          isProcessingSection={true}
          orders={mappedProcessingOrders}
        />
      </section>
      <Pagination
        page={processingPage}
        pageKey="processingPage"
        hasMore={hasMoreProcessing}
        totalPages={pagesProcessing}
        baseUrl="your-orders"
      />
    </div>
  );
}

export default ProcessingOrders;
