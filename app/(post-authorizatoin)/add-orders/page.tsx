import ProductsLogicHandler from "@/components/ProductsLogicHandler";

export default async function AddOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; productsPage?: string }>;
}) {
  const { query, productsPage } = await searchParams;
  return (
    <ProductsLogicHandler
      isAddOrdersPage={true}
      query={query}
      productsPage={productsPage}
    />
  );
}
