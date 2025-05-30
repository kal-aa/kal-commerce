import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

import { useUser } from "@clerk/nextjs";
import { Navlink } from "@/app/types/types";
import { usePathname } from "next/navigation";

export default function HeaderLeftSection({
  memorizedData,
}: {
  memorizedData: number;
}) {
  const [isElipsisClicked, setIsElipsisClicked] = useState(false);
  const { user, isLoaded } = useUser();
  const isAuthorized = isLoaded && user;
  const pathname = usePathname();
  const isYourOrdersPage = pathname.includes("/your-orders");

  const leftNav: Navlink[] = [
    // { name: "Home", href: `/` },
    { name: "Shop", href: `/add-orders` },
    { name: "Orders", href: `/your-orders` },
  ];

  return (
    <div className="flex items-center ml">
      <div className="relative">
        <Link href="/" title="Home">
          <Image
            width={100}
            height={0}
            src="/images/others/cart.jpeg"
            alt="cart.jpeg"
            className="sm:w-20 w-16 h-10 rounded-full"
          />
        </Link>
        {!isElipsisClicked &&
          memorizedData > 0 &&
          !isYourOrdersPage &&
          isAuthorized && (
            <Link
              href="/your-orders"
              className={`count-orders -left-4 sm:hidden ${
                !isYourOrdersPage && "animate-bounce hover:animate-none"
              }`}
            >
              {memorizedData < 10 ? memorizedData : "9+"}
            </Link>
          )}
      </div>
      {isAuthorized && (
        <FaEllipsisV
          onClick={() => {
            setIsElipsisClicked((prev) => !prev);
          }}
          className="h-5 mx-2 text-yellow-800 hover:text-yellow-600 sm:hidden dark:text-yellow-700 cursor-pointer"
        />
      )}
      {isAuthorized && (
        <nav
          className={`space-y-2 sm:flex sm:flex-row sm:space-y-0 sm:space-x-5 sm:ml- sm:items-center sm:ml-2 ${
            isElipsisClicked ? "flex flex-col" : "hidden"
          }`}
        >
          {leftNav.map((link) => {
            const isActive = pathname === link.href;

            return (
              <div key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`header-links ${
                    isActive ? "ring-1" : "hover:rounded-none! hover:border-b"
                  }`}
                >
                  {link.name}
                </Link>
                {link.name === "Orders" &&
                  memorizedData > 0 &&
                  !isYourOrdersPage &&
                  isAuthorized && (
                    <span className="count-orders rounded-sm! p-1! py-0! -right-4">
                      {memorizedData < 10 ? memorizedData : "9+"}
                    </span>
                  )}
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}
