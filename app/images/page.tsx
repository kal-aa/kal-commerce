import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ImagePage({
  searchParams,
}: {
  searchParams: Promise<{ imgUrl: string }>;
}) {
  const { imgUrl } = await searchParams;
  if (!imgUrl || !imgUrl.includes("/") || !imgUrl.includes(".")) redirect("/");
  const split = imgUrl.split("/");
  const alt = split[split.length - 1];

  return (
    <div className="flex justify-center">
      <Image width={300} height={0} src={`/images/${imgUrl}`} alt={alt} />
    </div>
  );
}
