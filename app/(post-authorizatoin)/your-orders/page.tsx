import YourOrdersGenerate from "@/components/YourOrdersGenerate";
import products from "../../data/products.json";
import { EnhancedOrder, OrderAlongWithProduct } from "@/app/types/types";
import { mongoDb } from "@/app/utils/mongodb";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import RequestPayement from "@/components/RequestPayement";
import Pagination from "@/components/Pagination";

export default async function YourOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ pagePending?: string; pageProcessing?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access: Missing userId");
  const db = await mongoDb();

  const params = await searchParams;
  const pagePending = params.pagePending ? parseInt(params.pagePending, 10) : 1;
  const pageProcessing = params.pageProcessing
    ? parseInt(params.pageProcessing, 10)
    : 1;
  const itemsPerPage = 10;
  const skipPending = (pagePending - 1) * itemsPerPage;
  const skipProcessing = (pageProcessing - 1) * itemsPerPage;
  // check when to disable the next btn in the pagination
  const totalOrders = async (status: string) =>
    await db.collection("orders").countDocuments({ userId, status });
  const totalPending = await totalOrders("Pending Checkout");
  const totalProcessing = await totalOrders("Processing");
  const hasMorePending = pagePending * itemsPerPage < totalPending;
  const hasMoreProcessing = pageProcessing * itemsPerPage < totalProcessing;
  // how many pages left
  const totalPages = (totalItems: number) => {
    const divided = totalItems / itemsPerPage;
    return totalItems % 10 === 0 ? divided : Math.floor(divided) + 1;
  };
  const pagesPending = totalPages(totalPending);
  const pagesProcessing = totalPages(totalProcessing);

  // Get the Orders from mongoDB
  let pendingCheckoutOrders = [];
  let processingOrders = [];
  // helper function to fetch orders
  const fetchOrders = async (
    status: "Processing" | "Pending Checkout" | "Dispatched",
    skip: number
  ) =>
    await db
      .collection<EnhancedOrder>("orders")
      .find({ userId, status })
      .skip(skip)
      .limit(itemsPerPage)
      .toArray();
  try {
    pendingCheckoutOrders = await fetchOrders("Pending Checkout", skipPending);
    processingOrders = await fetchOrders("Processing", skipProcessing);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div className="text-center bg-red-500 text-white p-5">
        There was an error loading your orders. Please try again later.
      </div>
    );
  }

  // helper function to map the orders and get their equivalent products
  const mapOrders = (orders: EnhancedOrder[]): OrderAlongWithProduct[] =>
    orders
      .map((o) => {
        const product = products.products.find(
          (p) => p.productId === o.productId
        );
        if (!product) return null;

        const { color, size, ...restOfProduct } = product;
        if (color || size) {
        }
        return {
          id: o._id.toString(),
          userId: o.userId,
          ...restOfProduct,
          selectedColor: o.selectedColor,
          selectedSize: o.selectedSize,
          selectedQuantity: o.selectedQuantity,
          status: o.status,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          // ...(o.paymentIntentId && { paymentIntentId: o.paymentIntentId }),
          // ...(o.chargeId && { chargeId: o.chargeId }),
          ...(o.paymentDate && { paymentDate: o.paymentDate }),
        };
      })
      .filter((order): order is OrderAlongWithProduct => order !== null);
  const mappedPendingCheckoutOrders = mapOrders(pendingCheckoutOrders);
  const mappedProcessingOrders = mapOrders(processingOrders);

  // Helper function for the orders === 0
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

      <div>
        {/* Request payement component */}
        <RequestPayement orders={mappedPendingCheckoutOrders} />
        {/* Orders pending checkout */}
        {mappedPendingCheckoutOrders.length === 0 ? (
          EmptyOrderState()
        ) : (
          <div>
            <section className="order-section">
              <YourOrdersGenerate
                isProcessingSection={false}
                orders={mappedPendingCheckoutOrders}
              />
            </section>
            <Pagination
              page={pagePending}
              pageKey="pagePending"
              hasMore={hasMorePending}
              totalPages={pagesPending}
              baseUrl="your-orders"
            />
          </div>
        )}
        {}
      </div>

      {/* orders In dispatch */}
      {mappedProcessingOrders.length > 0 && (
        <div>
          <br />
          <hr />
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
      )}
    </>
  );
}
