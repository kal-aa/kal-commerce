import React from "react";
import { PendingOrdersProps } from "@/app/types/types";
import OrderActions from "./OrderActions";
import Pagination from "../Pagination";

export default function PendingOrders(data: PendingOrdersProps) {
  const { mappedPendingOrders, hasMorePending, pagesPending, pendingPage } =
    data;

  return (
    <div>
      <section className="order-section">
        <OrderActions
          isProcessingSection={false}
          orders={mappedPendingOrders}
        />
      </section>
      <Pagination
        baseUrl="your-orders"
        pageKey="pendingPage"
        hasMore={hasMorePending}
        totalPages={pagesPending}
        page={pendingPage}
      />
    </div>
  );
}
