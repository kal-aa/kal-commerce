"use client";

import { FormEvent } from "react";
import { OrderAlongWithProduct } from "@/app/types/types";

export default function PendingOrderForm({
  removeOrder,
  order,
}: {
  order: OrderAlongWithProduct;
  removeOrder: (orderId: string, action: string) => void;
}) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const action = formData.get("action") as string;
    removeOrder(order.id, action);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {/* Button for removing 1 order */}
      {order.selectedQuantity > 1 && (
        <div>
          <input type="hidden" name="action" value="removeOne" />
          <button type="submit" className="remove-order-btn">
            Remove One
          </button>
        </div>
      )}
      {/* Button for removing all orders */}
      <div>
        <input type="hidden" name="action" value="removeAll" />
        <button type="submit" className="remove-order-btn">
          {order.selectedQuantity === 1 ? "Remove Item" : "Remove All"}
        </button>
      </div>
    </form>
  );
}
