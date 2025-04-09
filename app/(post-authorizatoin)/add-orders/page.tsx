import MainLogic from "@/components/MainLogic";

export default async function AddOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  return <MainLogic isAddOrdersPage={true} query={query} page={page} />;
}
