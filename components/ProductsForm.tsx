"use client";

import Link from "next/link";
import { FormEvent, useOptimistic, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { ProductsFormProps } from "@/app/types/types";
import { submitProductAction } from "@/app/actions";
import { useSWRConfig } from "swr";

export default function ProductsForm({
  formHandlers,
}: {
  formHandlers: ProductsFormProps;
}) {
  const {
    product,
    isAddOrdersPage,
    handleColorChange,
    handleSizeChange,
    handleQuantityChange,
  } = formHandlers;
  const { userId } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [optimisticId, setOptimisticId] = useOptimistic<number | null>(null);
  const { mutate } = useSWRConfig();

  const handleAddToCart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(() => setOptimisticId(product.productId));
    const response = await submitProductAction(formData);
    startTransition(() => setOptimisticId(null));

    if (response?.success) {
      mutate("/api/order-count");
      toast.success(response?.message || "Item Added to your Cart");
    } else {
      toast.error(response?.message || "Try again");
    }
  };

  return (
    <form
      onSubmit={handleAddToCart}
      className={`grid grid-row-4 w-full bg-yellow-400 rounded-r-3xl ${
        isAddOrdersPage ? "dark:bg-black" : ""
      }`}
    >
      <input type="hidden" name="productId" value={product.productId} />
      <div className="text-center pt-2 capitalize">
        {product.for + " " + product.type}
      </div>
      <div className="absolute left-[40%] -top-4 bg-black text-white px-2 rounded-lg shadow-sm shadow-white/20">
        Price: ${product.price}
      </div>

      <div className="row-span-3 grid grid-cols-3 px-2 sm:px-1 lg:px-2 gap-1 text-xs spacey border-white">
        <div className="col-span-2 space-y-2">
          {Object.entries(product.color).map(([index, colorValue]) => (
            <div key={index}>
              <input
                type="radio"
                name={`color-${product.productId}`}
                value={colorValue}
                checked={product.selectedColor === colorValue}
                onChange={(e) => handleColorChange(e, product.productId)}
                className="mr-1 sm:mr-2 cursor-pointer"
              />
              {colorValue.replace("-", " ")} <br />
            </div>
          ))}
        </div>
        <div className="justify-self-center space-y-2">
          {["XS", "SM", "MD", "LG", "XL"].map((size) => (
            <div key={size}>
              <input
                type="radio"
                name={`size-${product.productId}`}
                value={size}
                checked={product.selectedSize === size}
                onChange={(e) => handleSizeChange(e, product.productId)}
                className="mr-1 sm:mr-2 cursor-pointer"
              />
              {size} <br />
            </div>
          ))}
        </div>
      </div>
      <div className=" text-center border-t p-1">
        Quantity:
        <select
          name={`quantity-${product.productId}`}
          className="outline-none cursor-pointer rounded-lg ml-2 bg-white/70 hover:bg-white/80 dark:bg-blue-600/70 dark:hover:bg-blue-600/90"
          onChange={(e) => handleQuantityChange(e, product.productId)}
        >
          {[...Array(10).keys()].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      {/* submit-btn */}
      <div className="text-center">
        {isAddOrdersPage ? (
          <button
            type="submit"
            disabled={isPending || optimisticId === product.productId}
            className={`submit-btn
                    ${
                      isPending || optimisticId === product.productId
                        ? "cursor-progress"
                        : "cursor-pointer"
                    }
                  `}
          >
            {isPending || optimisticId === product.productId
              ? "adding..."
              : "Add"}
          </button>
        ) : (
          <Link className="" href={!userId ? "/sign-up" : `/add-orders/`}>
            <button className="submit-btn cursor-pointer">Add</button>
          </Link>
        )}
      </div>
    </form>
  );
}
