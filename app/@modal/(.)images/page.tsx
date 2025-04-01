"use client";

import Image from "next/image";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { TiDelete } from "react-icons/ti";

export default function ImagePageIntercept() {
  const searchParams = useSearchParams();
  const imgUrl = searchParams.get("imgUrl");

  if (!imgUrl || !imgUrl.includes("/") || !imgUrl.includes(".")) redirect("/");
  const split = imgUrl.split("/");
  const alt = split[split.length - 1];

  const router = useRouter();
  return (
    <div className="relative flex justify-center items-center">
      <Image
        width={300}
        height={0}
        src={`/images/${imgUrl}`}
        alt={alt}
        className="rounded-2xl ring-8 ring-amber-500/20"
      />
      <TiDelete
        onClick={() => router.back()}
        className="absolute -right-6 -top-6 text-3xl cursor-pointer text-black/60 hover:text-gray-700 hover:dark:text-gray-200 dark:text-white/70"
      />
    </div>
  );
}
