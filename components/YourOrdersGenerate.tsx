"use client";

import { refundOrder, removeOrderAction } from "@/app/actions";
import { OrderAlongWithProduct } from "@/app/types/types";
import { useOptimistic, useState } from "react";
import OrdersForm from "./OrdersForm";
import {
  checkIsRefundable,
  formatRefundBatchLabel,
  formatTime,
  round,
} from "@/app/utils/reuses";
import Image from "next/image";
import Link from "next/link";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";

export default function YourOrdersGenerate({
  orders,
  isProcessingSection = true,
}: {
  orders: OrderAlongWithProduct[];
  isProcessingSection: boolean;
}) {
  const [optimisticOrders, setOptimisticOrders] = useOptimistic(orders);
  const [isRefundLoading, setIsRefundLoading] = useState(false);
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

  // Handle refund action
  const handleCancel = async (orderId: string, isRefundable: boolean) => {
    if (!isRefundable) {
      alert("This order is not refundable.");
      return;
    }
    setIsRefundLoading(true);

    try {
      const { success, refund } = await refundOrder(orderId);

      if (success && refund) {
        const amount = (refund.amount / 100).toFixed(2);
        toast.success(
          `${amount}-${refund.currency.toUpperCase()} refund successful!`
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Refund failed");
    } finally {
      setIsRefundLoading(false);
    }
  };

  return optimisticOrders.map((order) => {
    const imgPath = `${order.for}/${order.type}/${order.selectedColor}-${order.type}.jpeg`;

    const isRefundable =
      isProcessingSection &&
      order.paymentDate &&
      checkIsRefundable(order.paymentDate);

    return (
      <section
        key={order.id}
        className="flex max-h-[250px] h-full rounded-2xl overflow-hidden shadow shadow-black/70 hover:shadow-md dark:hover:shadow-white/30"
      >
        <div className="order-details text-center relative">
          {isProcessingSection && order.paymentDate && (
            <div className="order-details-child bg-black text-white">
              Checked out: <br />
              {formatTime(order.paymentDate)}
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
          {isProcessingSection && isRefundable && (
            <button
              onClick={() => handleCancel(order.id, isRefundable)}
              className={`underline text-red-800 hover:text-red-800 hover:underline-offset-2 ${
                isRefundLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isRefundLoading}
            >
              Refund batch-
              <span className="font-sans">
                {order.paymentDate && formatRefundBatchLabel(order.paymentDate)}
              </span>
            </button>
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
