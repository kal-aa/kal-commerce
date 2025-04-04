"use client";

import { changeStatusAction, removeOrderAction } from "@/app/actions";
import { OrderAlongWithProduct } from "@/app/types/types";
import { useState } from "react";

export default function ManageOrdersForm({
  order,
}: {
  order: OrderAlongWithProduct;
}) {
  const [optimisticOrder, setOptimisticOrder] =
    useState<OrderAlongWithProduct | null>(order);

  // update status optimistically
  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!optimisticOrder) return;

    const newStatus = e.target.value;
    const updatedOrder = { ...order, status: newStatus };
    setOptimisticOrder(updatedOrder);

    try {
      await changeStatusAction(optimisticOrder.id, newStatus);
    } catch (error) {
      setOptimisticOrder(order);
      console.error("Failed to update status", error);
    }
  };

  // remove order optimistically
  const handleRemoveOrder = async () => {
    setOptimisticOrder(null);

    try {
      await removeOrderAction(order.id, "removeAll");
    } catch (error) {
      setOptimisticOrder(order);
      console.error("Failed to remove order:", error);
    }
  };

  if (!optimisticOrder) return;

  return (
    <div
      key={order.id}
      className="order-details bg-transparent! dark:text-white! shadow-sm shadow-blue-600/60 dark:shadow-blue-100/30 py-3! hover:shadow-md"
    >
      <div className="border w-[70%] py-1 rounded-full hover:border-red-200">
        {new Date(optimisticOrder.createdAt).toLocaleString()}
      </div>
      <div className="border w-[90%] py-1 rounded-full hover:border-red-200">
        {optimisticOrder.for +
          " " +
          optimisticOrder.selectedColor +
          " " +
          optimisticOrder.type}
      </div>
      <div className="border w-[70%] py-1 rounded-full hover:border-red-200 flex justify-around">
        <p>{"Size: " + optimisticOrder.selectedSize}</p>
        <p>{"Quantity: " + optimisticOrder.selectedQuantity}</p>
      </div>
      <div className="flex flex-col items-center space-y-2">
        {/* Change Status */}
        <div>
          <span>Mark as:</span>
          <select
            value={optimisticOrder.status}
            onChange={handleStatusChange}
            className="ml-2 border p-2 rounded-2xl hover:scale-95 transition-all duration-100 dark:bg-black"
          >
            <option value="Pending checkout">Pending checkout</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
          </select>
        </div>
        {/* Remove order */}
        <button
          onClick={handleRemoveOrder}
          className="remove-order-btn py-2! text-sm!"
        >
          Remove order
        </button>
      </div>
    </div>
  );
}
