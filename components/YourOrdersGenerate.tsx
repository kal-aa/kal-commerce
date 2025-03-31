"use client";

import { removeOrderAction } from "@/app/actions";
import { OrderAlongWithProduct } from "@/app/types";
import { useOptimistic } from "react";
import OrdersForm from "./OrdersForm";
import { round } from "@/app/utils/reuses";
import Image from "next/image";

export default function YourOrdersGenerate({
  orders,
}: {
  orders: OrderAlongWithProduct[];
}) {
  const [optimisticOrders, setOptimisticOrders] = useOptimistic(orders);

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

    await removeOrderAction(orderId, action);
  };

  return optimisticOrders.map((order) => (
    <section key={order.id} className="flex max-h-[250px] h-full">
      <div className="order-details">
        <div className="border w-[90%] text-center">
          {order.for + " " + order.type}
        </div>
        <div className="border w-[80%] text-center">{order.selectedColor}</div>
        <div className="border w-[70%] text-center">{order.selectedSize}</div>
        <div className="flex justify-center space-x-2 border w-[80%]">
          <select>
            <option>{order.selectedQuantity}</option>
          </select>
          <div>${round(order.selectedQuantity * order.price)}</div>
        </div>
        <div className="border w-[90%] text-center">{order.status}</div>
        {/* Orders form */}
        <OrdersForm removeOrder={removeOrder} order={order} />
      </div>

      <Image
        width={300}
        height={0}
        src={`/images/${order.for}/${order.type}/${order.selectedColor}-${order.type}.jpeg`}
        alt=""
        className="w-full max-w-[250px] sm:max-w-[150px] -ml-1 cursor-pointer object-cover"
        onClick={() =>
          window.open(
            `/images/${order.for}/${order.type}/${order.selectedColor}-${order.type}.jpeg`
          )
        }
      />
    </section>
  ));
}
