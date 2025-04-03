"use client";

import { changeStatusAction, removeOrderAction } from "@/app/actions";
import { OrderAlongWithProduct } from "@/app/types/types";

export default function ManageOrdersForm({
  order,
}: {
  order: OrderAlongWithProduct;
}) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          await changeStatusAction(formData);
        }}
      >
        <input type="hidden" name="orderId" value={order.id} />
        <div>
          <span>Mark as:</span>
          <select
            name={`status-${order.id}`}
            value={order.status}
            onChange={(e) => e.target.form?.requestSubmit()}
            className="ml-2 border p-2 rounded-2xl hover:scale-95 transition-all duration-100 dark:bg-black"
          >
            <option value="Pending checkout">Pending checkout</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
          </select>
        </div>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          removeOrderAction(order.id, "removeAll");
        }}
      >
        <button type="submit" className="remove-order-btn py-2! text-sm!">
          Remove order
        </button>
      </form>
    </div>
  );
}
