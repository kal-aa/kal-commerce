"use client";

import { MainGenerateProps } from "@/app/types";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { ImageSlider } from "./ImageSlider";
import ProductsForm from "./ProductsForm";
import { useAuth } from "@clerk/nextjs";

export default function MainGenerate({
  allProducts,
  isAddOrdersPage,
}: MainGenerateProps) {
  const [products, setProducts] = useState(allProducts);
  const { userId } = useAuth();

  const handleColorChange = (
    event: ChangeEvent<HTMLInputElement>,
    productId: number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedColor: event.target.value }
          : product
      )
    );
  };

  const handleSizeChange = (
    event: ChangeEvent<HTMLInputElement>,
    productId: number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedSize: event.target.value }
          : product
      )
    );
  };

  const handleQuantityChange = (
    event: ChangeEvent<HTMLSelectElement>,
    productId: number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selectedQuantity: Number(event.target.value) }
          : product
      )
    );
  };

  return (
    <div className="px-10 py-5 mt-24">
      <h1
        className={`intro-header ${
          isAddOrdersPage ? "" : "bg-stone-100 dark:bg-blue-800/30"
        }`}
      >
        {isAddOrdersPage
          ? ` This Website is Dedicated to Offering an Incredible E-Commerce
            Service for Apparel. Whether you're on the hunt for the latest
            trends, timeless classics, or comfortable everyday wear, our
            platform offers an intuitive and efficient way to discover the
            perfect pieces to elevate your wardrobe`
          : ` What sets our offerings apart is the incredible variety we provide.
            Customers can choose from a tremendous palette of colors and a wide
            range of sizes to find the perfect fit for their style and needs.
            Whether you're looking for vibrant hues or classic shades, petite
            sizes or plus fits, our extensive selection ensures that there's
            something for everyone. We believe that personal expression is key,
            and our diverse options allow you to customize your purchases to
            reflect your unique taste. Dive into our collection and discover the
            endless possibilities that await! 🌈👚👖`}
      </h1>

      {/* Carousel */}
      <ImageSlider isAddOrdersPage={isAddOrdersPage} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 -mx-8 sm:-mx-7 sm:-mx gap-y-10 gap-x-5 ">
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-2 border rounded-3xl relative"
          >
            <Link
              href={`/images?imgUrl=${product.for}/${product.type}/${product.selectedColor}-${product.type}.jpeg`}
            >
              <Image
                width={400}
                height={0}
                src={`/images/${product.for}/${product.type}/${product.selectedColor}-${product.type}.jpeg`}
                alt={`${product.for + "'s " + product.type}.jpeg `}
                className="w-full h-full max-h-52 brightness-95 rounded-l-[23px] object-cover"
              />
            </Link>
            <ProductsForm
              formHandlers={{
                product,
                isAddOrdersPage,
                handleColorChange,
                handleSizeChange,
                handleQuantityChange,
              }}
            />
          </div>
        ))}
        {!isAddOrdersPage && userId && (
          <div className=" self-end text-sm font-bold">
            <span>Please head to the</span>
            <Link
              href="/add-orders"
              className="text-blue-800 mx-1 hover:text-blue-600"
            >
              Add orders
            </Link>
            <span>page to place orders...</span>
          </div>
        )}
      </div>
    </div>
  );
}
