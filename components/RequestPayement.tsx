"use client";

import { round } from "@/app/utils/reuses";
import { OrderAlongWithProduct } from "@/app/types/types";
import { useState } from "react";

export default function RequestPayement({
  orders,
}: {
  orders: OrderAlongWithProduct[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const total = orders.reduce(
    (acc, order) => {
      acc.totalQuantity += order.selectedQuantity;
      acc.totalPrice += order.selectedQuantity * order.price;
      return acc;
    },
    { totalQuantity: 0, totalPrice: 0 }
  );

  const baseShipping = 0.1;
  const freeShippingThreshold = 250;
  const shippingCost =
    total.totalPrice > freeShippingThreshold
      ? 0
      : baseShipping * total.totalPrice;

  const handleRequestPayement = async () => {
    setIsLoading(true);
    setError("");

    const ordersToSend = orders.map((order) => ({
      orderId: order.id,
      productId: order.productId,
      selectedColor: order.selectedColor,
      selectedSize: order.selectedSize,
      selectedQuantity: order.selectedQuantity,
    }));
    if (orders.length === 0) {
      setIsLoading(false);
      return setError("No products available for payment");
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: ordersToSend }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.mssg || "Failed to create session");
      }
      window.location = data.url;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An unexpected error occurred");
        console.error("Error creating payment session:", error);
      }
      setError("An unknown error occurred");
      console.error("Unknown error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="request-payement-container">
      {error && <div className="text-red-400 text-center">{error}</div>}
      <div className="grid grid-cols-2 py-1">
        <p>Product(s) Quantity:</p>
        <p className="text-right">{round(total.totalQuantity)}</p>
      </div>
      <div className="grid grid-cols-2 py-1">
        <p>Product(s) Price:</p>
        <p className="text-right">${round(total.totalPrice)}</p>
      </div>
      <div className="grid grid-cols-2 py-1">
        <p>Shipping (10%):</p>
        <p className="text-right">${round(shippingCost)}</p>
      </div>
      <div className="grid grid-cols-2 py-1 font-bold border-t mt-2 pt-2">
        <p>Total Price:</p>
        <p className="text-right">${round(total.totalPrice + shippingCost)}</p>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        onClick={handleRequestPayement}
        className={`remove-order-btn py-3! rounded-none! text-base! w-full ${
          isLoading ? "cursor-wait!" : ""
        }`}
      >
        Request Payment
      </button>
    </section>
  );
}
