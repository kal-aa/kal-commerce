import Form from "next/form";
import { OrderAlongWithProduct } from "@/app/types";

export default function OrdersForm({
  removeOrder,
  order,
}: {
  order: OrderAlongWithProduct;
  removeOrder: (orderId: string, action: string) => void;
}) {
  return (
    <Form
      action={(formData) => {
        const action = formData.get("action") as string;
        removeOrder(order.id, action);
      }}
      className="flex flex-col space-y-2"
    >
      {/* Button for removing 1 order */}
      {order.selectedQuantity > 1 && (
        <button
          type="submit"
          name="action"
          value="removeOne"
          className="remove-order-btn"
        >
          Remove-1
        </button>
      )}
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
  );
}
