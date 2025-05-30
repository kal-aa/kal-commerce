"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  checkIsRefundable,
  formatRefundBatchLabel,
  formatTime,
  round,
} from "@/app/utils/reuses";
import { OrderCardProps } from "@/app/types/types";
import PendingOrderForm from "./PendingOrderForm";

function OrderCard(data: OrderCardProps) {
  const { order, isProcessingSection, loadingId, handleCancel, removeOrder } =
    data;
  const imgPath = `${order.for}/${order.type}/${order.selectedColor}-${order.type}.jpeg`;
  const isRefundable =
    isProcessingSection &&
    order.paymentDate &&
    checkIsRefundable(order.paymentDate);

  return (
    <section className="order-card">
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
          <PendingOrderForm removeOrder={removeOrder} order={order} />
        )}
        {isProcessingSection && isRefundable && (
          <button
            onClick={() => handleCancel(order.id, isRefundable)}
            className={`underline text-red-800 hover:text-red-800 hover:underline-offset-2 ${
              loadingId === order.id ? "opacity-50 cursor-wait!" : ""
            }`}
            disabled={loadingId === order.id}
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
}

export default React.memo(OrderCard);
