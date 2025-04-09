import MainGenerate from "./MainGenerate";
import allProducts from "../app/data/products.json";
import { Product } from "@/app/types/types";
import Pagination from "./Pagination";

export default async function MainLogic({
  isAddOrdersPage = false,
  query,
  page,
}: {
  isAddOrdersPage: boolean;
  query?: string;
  page?: string;
}) {
  const filteredProducts = allProducts.products.filter((product) => {
    if (!query) return true;
    const queryLower = query?.toLowerCase();
    return (
      product.price.toString().includes(queryLower) ||
      product.for.toLowerCase().includes(queryLower) ||
      product.type.toLowerCase().includes(queryLower)
    );
  });

  // Pagination logic
  const itemsPerPage = 10;
  const currentPage = parseInt(page || "1", 10);
  const skip = (currentPage - 1) * itemsPerPage;

  const noMatchFound = query && filteredProducts.length === 0;
  const dataSource = noMatchFound
    ? allProducts.products
    : isAddOrdersPage
    ? filteredProducts
    : allProducts.products.slice(0, 3);

  const totalCount = dataSource.length;
  const pagesCount = Math.ceil(totalCount / itemsPerPage);
  const hasMore = currentPage * itemsPerPage < totalCount;

  const productsToShow = dataSource.slice(skip, skip + itemsPerPage);
  const enhancedProducts = productsToShow.map((product: Product) => ({
    ...product,
    selectedColor: product.color[0] || "black",
    selectedSize: product.size.includes("MD") ? "MD" : product.size[0],
    selectedQuantity: 1,
  }));

  return (
    <div>
      {noMatchFound && (
        <div className="flex items-center justify-center text-center col-span-5 mx-[5%]">
          <p className="w-full text-white bg-red-500 p-4 rounded-md shadow-md">
            Sorry, we couldn’t find any matches for your search.
            <span className="block md:inline text-sm ml-1">
              But don&apos;t worry — here’s our full collection for you to
              explore!
            </span>
          </p>
        </div>
      )}

      <MainGenerate
        allProducts={enhancedProducts}
        isAddOrdersPage={isAddOrdersPage}
      />
      {isAddOrdersPage && (
        <Pagination
          page={currentPage}
          hasMore={hasMore}
          totalPages={pagesCount}
          baseUrl="add-orders"
        />
      )}
    </div>
  );
}
