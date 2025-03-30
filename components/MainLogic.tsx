import MainGenerate from "./MainGenerate";
import allProducts from "../app/data/products.json";

export default async function MainLogic({
  isAddOrdersPage = false,
}: {
  isAddOrdersPage: boolean;
}) {
  const slicedProducts = isAddOrdersPage
    ? allProducts.products
    : allProducts.products.slice(0, 3);

  return (
    <MainGenerate
      allProducts={slicedProducts}
      isAddOrdersPage={isAddOrdersPage}
    />
  );
}
