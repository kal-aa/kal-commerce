import ProductsGenerate from "./ProductsGenerate";
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
      <h1
        className={`intro-header px-10 ${
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

      <ProductsGenerate
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
