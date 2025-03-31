import MainLogic from "@/components/MainLogic";

export default async function AddOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  return <MainLogic isAddOrdersPage={true} query={query} />;
}
