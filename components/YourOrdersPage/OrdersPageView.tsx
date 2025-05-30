import Link from "next/link";
import { OrdersPageViewProps } from "@/app/types/types";
import RequestPayment from "./RequestPayment";
import PendingOrders from "./PendingOrders";
import LazyProcessingOrders from "./LazyProcessingOrders";

function OrdersPageView(data: OrdersPageViewProps) {
  const {
    mappedPendingOrders,
    mappedProcessingOrders,
    hasMorePending,
    hasMoreProcessing,
    pendingPage,
    processingPage,
    pagesPending,
    pagesProcessing,
  } = data;

  // Helper function for empty Pending Orders
  const EmptyOrderState = () => (
    <div className="text-center col-span-5 bg-red-400 py-3 text-white mx-5">
      <span className="font-bold">No order to checkout</span>, do you want to
      <Link
        href="/add-orders/"
        className="text-blue-200 hover:text-blue-300 underline ml-1"
      >
        add some
      </Link>
    </div>
  );

  return (
    <>
      <h1 className="add-orders-header">
        Delivery dates depend on item availability and shipping method,
        typically processed in 1-2 business days with delivery in 3-7 days. A
        confirmation email will provide your estimated delivery date. We offer a{" "}
        <span className="text-black/60 dark:text-yellow-400/90 font-serif">
          3-day refund
        </span>{" "}
        window from the delivery date. For orders over $250, shipping is{" "}
        <span className="text-black/60 dark:text-yellow-400/90 font-serif">
          FREE
        </span>{" "}
        unless it constitutes 10% (0.1) of the total order value.
      </h1>
      {/* Request payment component and Purchase notification*/}
      <div className="relative mb-10">
        <RequestPayment orders={mappedPendingOrders} />
        {mappedProcessingOrders.length > 0 && (
          <Link
            href="/your-orders#purchases"
            className="absolute right-0 -top-7 search-btn rounded-full text-black"
          >
            ▼ You have Purchases
          </Link>
        )}
      </div>
      {/* Orders pending checkout */}
      {mappedPendingOrders.length === 0 ? (
        EmptyOrderState()
      ) : (
        <PendingOrders
          mappedPendingOrders={mappedPendingOrders}
          hasMorePending={hasMorePending}
          pagesPending={pagesPending}
          pendingPage={pendingPage}
        />
      )}

      {/* orders in Processing */}
      {mappedProcessingOrders.length > 0 && (
        <LazyProcessingOrders
          mappedProcessingOrders={mappedProcessingOrders}
          processingPage={processingPage}
          pagesProcessing={pagesProcessing}
          hasMoreProcessing={hasMoreProcessing}
        />
      )}
    </>
  );
}

export default OrdersPageView;
