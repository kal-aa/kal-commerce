"use client";

import { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ImagePageIntercept() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zoom, setZoom] = useState(false);
  const imgUrl = searchParams.get("imgUrl");

  if (!imgUrl || !imgUrl.includes("/") || !imgUrl.includes(".")) {
    router.push("/");
    return null;
  }
  const split = imgUrl.split("/");
  const alt = split[split.length - 1];

  return (
    <div className="relative flex justify-center items-center">
      <div
        className={`w-[300px] rounded-xl ring-8 ring-amber-500/20 cursor-pointer ${
          zoom ? "scale-125" : ""
        }`}
        onClick={() => setZoom(!zoom)}
      >
        <Image
          width={300}
          height={0}
          src={`/images/${imgUrl}`}
          alt={alt}
          className="w-full h-auto transition-transform duration-3000 rounded-xl"
        />
      </div>
      <TiDelete
        onClick={() => router.back()}
        className={`absolute ${
          zoom ? "-right-[78px] text-4xl" : "-right-8  text-3xl"
        } cursor-pointer text-black/60 hover:text-gray-700 hover:dark:text-gray-200 dark:text-white/70 transform animate-spin duration-[1s] hover:animate-none`}
      />
    </div>
  );
}
