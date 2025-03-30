"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export const ImageSlider = ({
  isAddOrdersPage,
}: {
  isAddOrdersPage: boolean;
}) => {
  const { isLoaded, userId } = useAuth();

  let images: string[] = [];
  const images1 = [
    "/images/women/pants/fiery-red-pants.jpeg",
    "/images/children/jacket/black-jacket.jpeg",
    "/images/men/shirt/lime-green-shirt.jpeg",
    "/images/women/shirt/electric-blue-shirt.jpeg",
    "/images/men/jacket/fiery-red-jacket.jpeg",
    "/images/children/pants/black-pants.jpeg",
  ];

  images = isLoaded && userId ? images1.slice(0, 3) : images1.slice(3);

  const settings = {
    dots: true,
    infinite: true, // Allow infinite scrolling
    speed: 1500, // Speed of transition between slides (in milliseconds)
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2500, // Delay between slide transitions (in milliseconds)
    pauseOnHover: true,
  };

  return (
    !isAddOrdersPage && (
      <div className="max-w-[250px] md:max-w-[300px] mx-auto">
        <Slider {...settings}>
          {images.map((image, index) => (
            <Link href={image} key={index}>
              <Image
                height={200}
                width={300}
                src={image}
                alt={image.split("/")[4]}
                className="max-w-[250px] md:max-w-[300px] max-h-[250px] rounded-3xl object-cover"
                priority
              />
            </Link>
          ))}
        </Slider>
      </div>
    )
  );
};
