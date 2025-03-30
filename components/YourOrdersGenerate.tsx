import Link from "next/link";
import Form from "next/form";
import { removeOrderAction } from "@/app/actions";
import OrdersImage from "./OrdersImage";
import { FaDollarSign } from "react-icons/fa";
import { OrderAlongWithProduct } from "@/app/types";

export default function YourOrdersGenerate({
  orders,
}: {
  orders: OrderAlongWithProduct[];
}) {
  // Round the No. in to two decimals
  function round(num: number) {
    return Math.round(num * 100) / 100;
  }

  // Orders Total
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
    <>
      <div className="add-orders-header">
        Delivery dates are estimated based on the item’s availability and the
        shipping method selected during checkout. Typically, orders are
        processed within 1-2 business days, and delivery can take anywhere from
        3-7 business days depending on your location. You’ll receive a
        confirmation email with your estimated delivery date once your order is
        shipped. For orders over $250, shipping is{" "}
        <span className="text-black dark:text-yellow-400">FREE</span> unless it
        constitutes 10% (0.1) of the total order value.
      </div>

      {/* Request payement section */}
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
          <p className="text-right">
            ${round(total.totalPrice + shippingCost)}
          </p>
        </div>

        {/* Dollar Icon */}
        <FaDollarSign
          className="absolute -top-4 left-2 bg-white\ px-1"
          color="4A90E2"
          size={30}
        />

        <Form action={"Hanlde"} className="flex flex-col space-y-2">
          {/* Button for removing 1 order */}
          <button
            type="submit"
            name="action"
            value="removeOne"
            className="remove-order-btn py-3! rounded-none! text-base!"
          >
            Request Payement
          </button>
        </Form>
      </section>

      <section className="px-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-10">
        {orders.length === 0 ? (
          <div className="text-center col-span-5 bg-red-400 py-3 text-white">
            <span className="font-bold">No order!</span>, do you want to
            <Link
              href={`/add-orders/`}
              className="text-blue-200 hover:text-blue-300 underline ml-1"
            >
              add some
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={`${order.id}-${order.createdAt}`}
              className="flex max-h-[250px] h-full"
            >
              <div className="order-details">
                <div className="border w-[90%] text-center">
                  {order.for + " " + order.type}
                </div>
                <div className="border w-[80%] text-center">
                  {order.selectedColor}
                </div>
                <div className="border w-[70%] text-center">
                  {order.selectedSize}
                </div>
                <div className="flex justify-center space-x-2 border w-[80%]">
                  <select>
                    <option>{order.selectedQuantity}</option>
                  </select>
                  <div>${round(order.selectedQuantity * order.price)}</div>
                </div>
                <div className="border w-[90%] text-center">{order.status}</div>

                <Form
                  action={removeOrderAction}
                  className="flex flex-col space-y-2"
                >
                  {/* Button for removing 1 order */}
                  <button
                    type="submit"
                    name="action"
                    value="removeOne"
                    className="remove-order-btn"
                  >
                    Remove-1
                  </button>
                  {/* Button for removing all orders */}
                  <button
                    type="submit"
                    name="action"
                    value="removeAll"
                    className="remove-order-btn"
                  >
                    Remove from cart
                  </button>
                </Form>
              </div>
              {/* Image component */}
              <OrdersImage order={order} />
            </div>
          ))
        )}
      </section>
    </>
  );
}
