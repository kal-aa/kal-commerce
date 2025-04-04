import Form from "next/form";
import { OrderAlongWithProduct } from "@/app/types/types";
import { round } from "@/app/utils/reuses";

export default function RequestPayement({
  orders,
}: {
  orders: OrderAlongWithProduct[];
}) {
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

  return (
    <section className="request-payement-container">
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

      <Form
        action={"/your-orders"}
        className="relative flex flex-col space-y-2 group"
      >
        <button
          disabled
          type="submit"
          className="remove-order-btn py-3! rounded-none! text-base! cursor-no-drop!"
        >
          Request Payement
        </button>
        <div className="absolute -top-[180px] right-9 hidden group-hover:block text-red-400 text-center">
          Sorry, we&apos;re not receiving orders right now
        </div>
      </Form>
    </section>
  );
}
