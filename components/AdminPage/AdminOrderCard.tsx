"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { changeStatusAction, removeOrderAction } from "@/app/actions";
import { updateQueryParam } from "@/app/utils/reuses";
import {
  AdminOrderCardProps,
  OrderAlongWithProduct,
  Status,
} from "@/app/types/types";

export default function ManageOrderCard({
  order,
  userName,
  ordersOnPage,
}: AdminOrderCardProps) {
  const { mutate } = useSWRConfig();
  const [optimisticOrder, setOptimisticOrder] =
    useState<OrderAlongWithProduct | null>(order);
  const router = useRouter();
  const searchParams = useSearchParams();

  const adminPage = Number(searchParams.get("adminPage")) || 1;

  // update status optimistically
  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!optimisticOrder) return;

    const newStatus = e.target.value as Status;

    const updatedOrder = { ...order, status: newStatus };
    setOptimisticOrder(updatedOrder);

    try {
      const response = await changeStatusAction(optimisticOrder.id, newStatus);
      if (response?.success === true) mutate("/api/order-count");
    } catch (error) {
      setOptimisticOrder(order);
      console.error("Failed to update status", error);
    }
  };

  // remove order optimistically
  const handleRemoveOrder = async () => {
    setOptimisticOrder(null);

    try {
      const response = await removeOrderAction(order.id, "removeAll");
      if (response?.success === true) {
        mutate("/api/order-count");

        const remainingOrders = ordersOnPage.filter((o) => o.id !== order.id);

        if (adminPage > 1 && remainingOrders.length === 0) {
          updateQueryParam(
            "adminPage",
            String(adminPage - 1),
            router,
            searchParams,
            "admin/manage-orders"
          );
        }
      }
    } catch (error) {
      setOptimisticOrder(order);
      console.error("Failed to remove order:", error);
    }
  };

  if (!optimisticOrder) return;

  return (
    <div>
      <p className="ml-2 hover:border-l">{userName}</p>
      <div className="order-details bg-transparent! dark:text-white! shadow-sm shadow-blue-600/60 dark:shadow-blue-100/30 py-3! hover:shadow-md text-center">
        <div className="border w-[70%] py-1 rounded-full hover:border-black/50 dark:hover:border-red-200">
          {new Date(optimisticOrder.createdAt).toLocaleString()}
        </div>
        <div className="border w-[90%] py-1 rounded-full hover:border-black/50 dark:hover:border-red-200">
          {optimisticOrder.for +
            " " +
            optimisticOrder.selectedColor +
            " " +
            optimisticOrder.type}
        </div>
        <div className="border w-[70%] py-1 rounded-full hover:border-black/50 dark:hover:border-red-200 flex justify-around">
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
              <option value="Pending Checkout">Pending checkout</option>
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
    </div>
  );
}
