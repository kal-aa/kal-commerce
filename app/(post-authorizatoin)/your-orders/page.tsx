"use server";

import YourOrdersGenerate from "@/components/YourOrdersGenerate";
import products from "../../data/products.json";
import { OrderAlongWithProduct } from "@/app/types";
import { mongoDb } from "@/app/utils/mongodb";
import { auth } from "@clerk/nextjs/server";

export default async function YourOrdersPage() {
  const getOrdersActoin = async () => {
    const { userId } = await auth();
    const db = await mongoDb();
    return await db.collection("orders").find({ userId }).toArray();
  };

  const ordersFromDb = await getOrdersActoin();

  const orders =
    ordersFromDb.length > 0
      ? ordersFromDb
          .map((order) => {
            const product = products.products.find(
              (product) => product.id === order.productId
            );

            if (product) {
              const { color, ...restOfProduct } = product;
              color.black = ""; // get rid of the unused err

              return {
                ...restOfProduct,
                id: order._id.toString(),
                productId: order.productId,
                selectedColor: order.selectedColor,
                selectedSize: order.selectedSize,
                selectedQuantity: order.selectedQuantity,
                status: order.status,
                createdAt: order.createdAt,
              };
            }

            return null;
          })
          .filter((order): order is OrderAlongWithProduct => order !== null)
      : [];

  return <YourOrdersGenerate orders={orders} />;
}
