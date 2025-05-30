import { mongoDb } from "@/app/utils/mongodb";
import { clerkClient } from "@clerk/nextjs/server";
import { OrderAlongWithProduct } from "@/app/types/types";
import products from "../../../data/products.json";
import AdminOrderCard from "@/components/AdminPage/AdminOrderCard";
import Pagination from "@/components/Pagination";
import AdminOrderSort from "@/components/AdminPage/AdminOrderSort";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ adminPage?: string; sortBy?: string }>;
}) {
  const db = await mongoDb();
  const { adminPage, sortBy } = await searchParams;
  const itemsPerPage = 20;
  const currentPage = parseInt(adminPage || "1", 10);
  const skip = (currentPage - 1) * itemsPerPage;
  const totalOrders = await db.collection("orders").countDocuments();
  const hasMore = currentPage * itemsPerPage < totalOrders;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const ordersFromDb = await db
    .collection("orders")
    .find()
    .skip(skip)
    .limit(itemsPerPage)
    .toArray();

  // get product information of each order
  const orders =
    ordersFromDb.length > 0
      ? ordersFromDb
          .map((order) => {
            const product = products.products.find(
              (product) => product.productId === order.productId
            );
            if (!product) return null;

            const { color, size, ...restOfProduct } = product;
            if (color || size) {
            }
            return {
              id: order._id.toString(),
              userId: order.userId,
              ...restOfProduct,
              selectedColor: order.selectedColor,
              selectedSize: order.selectedSize,
              selectedQuantity: order.selectedQuantity,
              status: order.status,
              createdAt: order.createdAt,
            };
          })
          .filter((order): order is OrderAlongWithProduct => order !== null)
      : [];

  const defaultSort = sortBy || "date-descending";
  let sortedOrders;

  // Sort order
  switch (defaultSort) {
    // Sort by date in descending order
    case "date-descending":
      sortedOrders = orders.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      break;

    // Sort by date in ascending order
    case "date-ascending":
      sortedOrders = orders.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
      break;

    // Sort by "processing" status first
    case "processing-first":
      sortedOrders = orders.sort((a, b) => {
        if (a.status === "Processing" && b.status !== "Processing") return -1;
        if (b.status === "Processing" && a.status !== "Processing") return 1;
        return 0;
      });
      break;

    // Sort by "pending-checkout" status first
    case "pending-checkout-first":
      sortedOrders = orders.sort((a, b) => {
        if (a.status === "Pending Checkout" && b.status !== "Pending Checkout")
          return -1;
        if (b.status === "Pending Checkout" && a.status !== "Pending Checkout")
          return 1;
        return 0;
      });
      break;

    // Default sorting behavior, if no match
    default:
      sortedOrders = orders.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
      break;
  }

  // get user info
  async function userInfo(userId: string) {
    const user = await (await clerkClient()).users.getUser(userId);
    const fullname =
      user.lastName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : "Unknown user";
    const emailAddress = user.primaryEmailAddress?.emailAddress;
    return { fullname, emailAddress };
  }

  if (ordersFromDb.length === 0)
    return (
      <div className=" flex items-center justify-center min-h-[55vh] text-center col-span-5 mx-[5%]">
        <p className="w-full text-white bg-red-400 py-3 capitalize">
          No orders have been placed yet!
        </p>
      </div>
    );

  const ordersWithUserInfo = await Promise.all(
    sortedOrders.map(async (order) => {
      const user = await userInfo(order.userId);
      const userName = user.emailAddress || user.fullname;

      return (
        <AdminOrderCard
          key={order.id}
          order={order}
          userName={userName}
          ordersOnPage={orders}
        />
      );
    })
  );

  return (
    <section className="mx-8 my-5">
      <AdminOrderSort />
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 -mx-8 sm:-mx-7 sm:-mx gap-y-10 gap-x-5">
        {ordersWithUserInfo}
      </div>
      <Pagination
        baseUrl="admin/manage-orders"
        pageKey="adminPage"
        page={currentPage}
        hasMore={hasMore}
        totalPages={totalPages}
      />
    </section>
  );
}
