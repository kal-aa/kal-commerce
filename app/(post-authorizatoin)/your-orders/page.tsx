import YourOrdersGenerate from "@/components/YourOrdersGenerate";
import products from "../../data/products.json";
import { OrderAlongWithProduct } from "@/app/types/types";
import { mongoDb } from "@/app/utils/mongodb";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import RequestPayement from "@/components/RequestPayement";

export default async function YourOrdersPage() {
  const { userId } = await auth();
  const db = await mongoDb();

  const ordersFromDb = await db.collection("orders").find({ userId }).toArray();

  const orders =
    ordersFromDb.length > 0
      ? ordersFromDb
          .map((o) => {
            const product = products.products.find(
              (p) => p.productId === o.productId
            );
            if (!product) return null;

            const { color, ...restOfProduct } = product;
            color.black = "black";
            return {
              id: o._id.toString(),
              userId: o.userId,
              ...restOfProduct,
              selectedColor: o.selectedColor,
              selectedSize: o.selectedSize,
              selectedQuantity: o.selectedQuantity,
              status: o.status,
              createdAt: o.createdAt,
            };
          })
          .filter((order): order is OrderAlongWithProduct => order !== null)
      : [];

  return (
    <>
      <div className="add-orders-header">
        Delivery dates are estimated based on the item’s availability and the
        shipping method selected during checkout. Typically, orders are
        processed within 1-2 business days, and delivery can take anywhere from
        3-7 business days depending on your location. You’ll receive a
        confirmation email with your estimated delivery date once your order is
        shipped. For orders over $250, shipping is{" "}
        <span className="text-black dark:text-yellow-400/90 font-serif">
          FREE
        </span>{" "}
        unless it constitutes 10% (0.1) of the total order value.
      </div>

      {/* Request payement section */}
      <RequestPayement orders={orders} />

      <section className="px-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-10">
        {orders.length === 0 ? (
          <div className="text-center col-span-5 bg-red-400 py-3 text-white">
            <span className="font-bold">No order!</span>, do you want to
            <Link
              href={`/add-orders/`}
              className="text-blue-200 hover:text-blue-300 underline ml-1"
            >
              add some
            </Link>
          </div>
        ) : (
          <YourOrdersGenerate orders={orders} />
        )}
      </section>
    </>
  );
}
