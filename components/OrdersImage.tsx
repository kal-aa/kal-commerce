"use client";

import { OrderAlongWithProduct } from "@/app/types";
import Image from "next/image";

export default function OrdersImage({
  order,
}: {
  order: OrderAlongWithProduct;
}) {
  return (
    <Image
      width={300}
      height={0}
      src={`/images/${order.for}/${order.type}/${order.selectedColor}-${order.type}.jpeg`}
      alt=""
      className="w-full max-w-[250px] sm:max-w-[150px] -ml-1 cursor-pointer object-cover"
      onClick={() =>
        window.open(
          `/images/${order.for}/${order.type}/${order.selectedColor}-${order.type}.jpeg`
        )
      }
    />
  );
}
