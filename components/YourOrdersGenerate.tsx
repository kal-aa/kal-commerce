"use client";

import { removeOrderAction } from "@/app/actions";
import { OrderAlongWithProduct } from "@/app/types/types";
import { useOptimistic } from "react";
import OrdersForm from "./OrdersForm";
import { formatTime, round } from "@/app/utils/reuses";
import Image from "next/image";
import Link from "next/link";
import { useSWRConfig } from "swr";

export default function YourOrdersGenerate({
  orders,
  isProcessingSection = true,
}: {
  orders: OrderAlongWithProduct[];
  isProcessingSection: boolean;
}) {
  const [optimisticOrders, setOptimisticOrders] = useOptimistic(orders);
  const { mutate } = useSWRConfig();

  const removeOrder = async (orderId: string, action: string) => {
    if (action === "removeAll") {
      setOptimisticOrders((prev) =>
        prev.filter((order) => order.id !== orderId)
      );
    } else {
      setOptimisticOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, selectedQuantity: order.selectedQuantity - 1 }
            : order
        )
      );
    }

    const response = await removeOrderAction(orderId, action);
    if (response?.success === true) {
      mutate("/api/order-count");
    }
  };

  return optimisticOrders.map((order) => {
    const imgPath = `${order.for}/${order.type}/${order.selectedColor}-${order.type}.jpeg`;

    return (
      <section
        key={order.id}
        className="flex max-h-[250px] h-full rounded-2xl overflow-hidden shadow shadow-black/70 hover:shadow-md dark:hover:shadow-white/30"
      >
        <div className="order-details text-center relative">
          {isProcessingSection && (
            <div className="order-details-child bg-black text-white">
              Checked out: <br />
              {formatTime(order.updatedAt)}
            </div>
          )}
          <div className="w-[80%]! order-details-child">
            {order.for + " " + order.type}
          </div>
          <div className="w-[70%]! order-details-child">
            {order.selectedSize} {order.selectedColor}
          </div>
          <div className="flex justify-center space-x-2 w-[80%]! order-details-child">
            <select>
              <option>{order.selectedQuantity}</option>
            </select>
            <div>${round(order.selectedQuantity * order.price)}</div>
          </div>
          <div className="border rounded-xl w-[90%] py-1 hover:border-black/60">
            {order.status}
          </div>
          {/* Orders form */}
          {!isProcessingSection && (
            <OrdersForm removeOrder={removeOrder} order={order} />
          )}
        </div>

        <Link href={`/images?imgUrl=${imgPath}`} legacyBehavior>
          <Image
            width={300}
            height={0}
            src={`/images/${imgPath}`}
            alt=""
            className="w-full max-w-[250px] sm:max-w-[150px] -ml-1 cursor-pointer object-cover"
          />
        </Link>
      </section>
    );
  });
}
