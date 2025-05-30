import { auth } from "@clerk/nextjs/server";
import products from "../../data/products.json";
import { mongoDb } from "@/app/utils/mongodb";
import { EnhancedOrder, OrderAlongWithProduct } from "@/app/types/types";
import OrdersPageView from "@/components/YourOrdersPage/OrdersPageView";

export default async function YourOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ pendingPage?: string; processingPage?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access: Missing userId");
  const db = await mongoDb();

  // Extract page query params
  const params = await searchParams;
  const pendingPage = params.pendingPage ? parseInt(params.pendingPage, 10) : 1;
  const processingPage = params.processingPage
    ? parseInt(params.processingPage, 10)
    : 1;

  // Skip feature
  const itemsPerPage = 10;
  const pendingOffset = (pendingPage - 1) * itemsPerPage;
  const processingOffset = (processingPage - 1) * itemsPerPage;

  // Calculate when to disable & enable the next btn in the pagination
  const countOrdersByStatus = async (status: string) =>
    await db.collection("orders").countDocuments({ userId, status });
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

  // Run all the queries in parallel
  const [totalPending, totalProcessing, pendingOrders, processingOrders] =
    await Promise.all([
      countOrdersByStatus("Pending Checkout"),
      countOrdersByStatus("Processing"),
      fetchOrders("Pending Checkout", pendingOffset),
      fetchOrders("Processing", processingOffset),
    ]);

  const getTotalPages = (totalItems: number) =>
    Math.ceil(totalItems / itemsPerPage);

  const hasMorePending = pendingPage * itemsPerPage < totalPending;
  const hasMoreProcessing = processingPage * itemsPerPage < totalProcessing;
  const pagesPending = getTotalPages(totalPending);
  const pagesProcessing = getTotalPages(totalProcessing);

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
          ...(o.paymentDate && { paymentDate: new Date(o.paymentDate) }),
        };
      })
      .filter((order): order is OrderAlongWithProduct => order !== null);

  const mappedPendingOrders = mapOrders(pendingOrders);
  const mappedProcessingOrders = mapOrders(processingOrders);

  return (
    <OrdersPageView
      mappedPendingOrders={mappedPendingOrders}
      mappedProcessingOrders={mappedProcessingOrders}
      pendingPage={pendingPage}
      pagesPending={pagesPending}
      hasMorePending={hasMorePending}
      processingPage={processingPage}
      pagesProcessing={pagesProcessing}
      hasMoreProcessing={hasMoreProcessing}
    />
  );
}
