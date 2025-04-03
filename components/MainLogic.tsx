import MainGenerate from "./MainGenerate";
import allProducts from "../app/data/products.json";

export default async function MainLogic({
  isAddOrdersPage = false,
  query,
}: {
  isAddOrdersPage: boolean;
  query?: string;
}) {
  const filteredProducts = allProducts.products.filter((product) => {
    if (!query) return true;

    const queryLower = query.toLowerCase();
    return (
      product.price.toString().includes(queryLower) ||
      product.for.toLowerCase().includes(queryLower) ||
      product.type.toLowerCase().includes(queryLower)
    );
  });

  const slicedProducts = isAddOrdersPage
    ? filteredProducts
    : allProducts.products.slice(0, 3);

  return (
    <MainGenerate
      allProducts={slicedProducts}
      isAddOrdersPage={isAddOrdersPage}
    />
  );
}
