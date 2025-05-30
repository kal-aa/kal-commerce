"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useCallback, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { EnhancedProduct, ProductsListProps } from "@/app/types/types";
import ImageSlider from "./HomePage/ImageSlider";
import ProductCard from "./ProductCard";

function ProductsList({ allProducts, isAddOrdersPage }: ProductsListProps) {
  const [products, setProducts] = useState(allProducts);
  const { userId } = useAuth();

  const handleColorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, productId: number) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId &&
          product.selectedColor !== e.target.value
            ? { ...product, selectedColor: e.target.value }
            : product
        )
      );
    },
    []
  );

  const handleSizeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, productId: number) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId &&
          product.selectedSize !== e.target.value
            ? { ...product, selectedSize: e.target.value }
            : product
        )
      );
    },
    []
  );

  const handleQuantityChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>, productId: number) => {
      const eN = Number(e);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId && product.selectedQuantity !== eN
            ? { ...product, selectedQuantity: eN }
            : product
        )
      );
    },
    []
  );

  const getProductImgUrl = (product: EnhancedProduct) =>
    `${product.for}/${product.type}/${product.selectedColor}-${product.type}.jpeg`;

  return (
    <div className="px-10 py-5">
      {/* Carousel */}
      <ImageSlider isAddOrdersPage={isAddOrdersPage} />

      <main className="product-generator">
        {products.map((product) => (
          <article key={product.productId} className="">
            <Link href={`/images?imgUrl=${getProductImgUrl(product)}`}>
              <Image
                width={400}
                height={0}
                src={`/images/${getProductImgUrl(product)}`}
                alt={`${product.for + "'s " + product.type}.jpeg `}
                className="w-full h-full max-h-52 brightness-95 rounded-l-[24px] object-cover"
              />
            </Link>

            {/* Product card Component */}
            <ProductCard
              product={product}
              isAddOrdersPage={isAddOrdersPage}
              handleColorChange={handleColorChange}
              handleSizeChange={handleSizeChange}
              handleQuantityChange={handleQuantityChange}
            />
          </article>
        ))}

        {!isAddOrdersPage && userId && (
          <p className=" self-end text-sm font-bold">
            <span>Please head to the</span>
            <Link
              href="/add-orders"
              className="text-blue-800 mx-1 hover:text-blue-600"
            >
              Add orders
            </Link>
            <span>page to place orders...</span>
          </p>
        )}
      </main>
    </div>
  );
}

export default ProductsList;
