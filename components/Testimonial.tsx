"use client";

import Image from "next/image";
import testimonialsData from "../app/data/testimonials.json";
import { Testimony } from "@/app/types/types";
import Link from "next/link";

export default function Testimonial() {
  return (
    <>
      <h1
        className="text-x font-bold mx-[20%] px-5 py-5 my-10 text-center bg-stone-100 rounded-2xl md:rounded-full dark:bg-blue-800/30
    "
      >
        Thank you for choosing our website for your apparel needs. We are
        honored to serve you and look forward to continuing to provide an
        incredible e-commerce service that not only meets but surpasses your
        expectations. Here are some Testimonials...
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-16 px-10">
        {testimonialsData.testimonials.map((testimony: Testimony) => (
          <div
            key={testimony.id}
            className="p-5 rounded-2xl relative shadow-md text-center shadow-black/20 dark:shadow-white/30"
          >
            <Link href={`/images?imgUrl=others/${testimony.name}.jpeg`}>
              <Image
                width={100}
                height={0}
                src={`/images/others/${testimony.name}.jpeg`}
                alt={`${testimony.name}`}
                className="w-14 h-14 rounded-full absolute -left-3 -top-3 text-blue-500 border-2 border-white/20"
              />
            </Link>

            <h2 className="indent-6 leading-7">{testimony.testimony}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
