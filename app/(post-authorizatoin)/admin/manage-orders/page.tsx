import products from "../../../data/products.json";
import { mongoDb } from "@/app/utils/mongodb";
import { OrderAlongWithProduct } from "@/app/types/types";
import { clerkClient } from "@clerk/nextjs/server";
import ManageOrdersForm from "@/components/ManageOrdersForm";

export default async function page() {
  const db = await mongoDb();
  const ordersFromDb = await db.collection("orders").find().toArray();

  // get product information of each order
  const orders =
    ordersFromDb.length > 0
      ? ordersFromDb
          .map((order) => {
            const product = products.products.find(
              (product) => product.productId === order.productId
            );
            if (!product) return null;

            const { color, ...restOfProduct } = product;
            color.black = "black";
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

  // assign orders to their userIds
  const groupedOrders = orders.reduce<Record<string, OrderAlongWithProduct[]>>(
    (acc, order) => {
      if (!acc[order.userId]) acc[order.userId] = [];
      acc[order.userId].push(order);
      return acc;
    },
    {}
  );

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

  return (
    <div className="space-y-6 ml-5">
      {Object.entries(groupedOrders).map(async ([userId, userOrders]) => (
        <details key={userId}>
          <summary className="md:text-xl cursor-pointer mb-5 hover:border-l">
            {(await userInfo(userId)).emailAddress ||
              (await userInfo(userId)).fullname}
            &apos;s Order(s)
          </summary>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 px-5 text-center">
            {userOrders.map((order) => (
              <ManageOrdersForm key={order.id} order={order} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
