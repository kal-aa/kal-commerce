"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Navlink } from "@/app/types";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";

const countFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function Header({
  NavMiddleSection,
}: {
  NavMiddleSection: React.ReactNode;
}) {
  const [isElipsisClicked, setIsElipsisClicked] = useState(false);
  const [showMiddleSection, setShowMiddleSection] = useState(false);
  const { isLoaded, userId } = useAuth();
  const isAuthorized = isLoaded && userId;

  // Get orders count
  // Don't forget to revalidate /api/order-count on the server after successful order submission
  // use {mutate} = useSWRConfig on the /api/order-count on the client after success
  const { data } = useSWR("/api/order-count", countFetcher);

  const pathname = usePathname();
  const isYourOrdersPage = pathname.includes("/your-orders");
  useEffect(() => {
    setShowMiddleSection([`/home/`, `/add-orders`].includes(pathname));
  }, [pathname, userId]);

  const leftNav: Navlink[] = [
    { name: "Home", href: `/home` },
    { name: "Add Orders", href: `/add-orders` },
    { name: "Your Orders", href: `/your-orders` },
  ];

  const rightNav: Navlink[] = [
    {
      name: isAuthorized ? "manage your acc" : "Go to Homepage",
      href: isAuthorized ? `/manage-your-account` : "/",
    },
    {
      name: isAuthorized ? "About us" : "Get Started",
      href: isAuthorized ? `/about-us` : "/sign-up",
    },
    {
      name: isAuthorized ? "Contact us" : "Log in",
      href: isAuthorized ? `/contact-us` : "/sign-in",
    },
  ];

  return (
    <header className="header-container">
      {/* Lef section of the header */}
      <div className="flex items-center ml-1">
        <div className="relative">
          <Link href={`/home`}>
            <Image
              width={100}
              height={0}
              src="/images/cart.jpeg"
              alt="cart.jpeg"
              className="sm:w-20 w-16  h-10 rounded-full"
            />
          </Link>
          {!isElipsisClicked && data?.count > 0 && !isYourOrdersPage && (
            <Link
              href="/your-orders"
              className={`count-orders -left-4 sm:hidden ${
                !isYourOrdersPage && "animate-bounce hover:animate-none"
              }`}
            >
              {data.count}
            </Link>
          )}
        </div>
        {isAuthorized && (
          <FaEllipsisV
            onClick={() => {
              setIsElipsisClicked((prev) => !prev);
            }}
            className="h-5 mr-2 text-yellow-800 hover:text-yellow-600 sm:hidden dark:text-yellow-700"
          />
        )}
        {isAuthorized && (
          <nav
            className={`space-y-1 sm:flex sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center sm:ml-2 ${
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
                      isActive
                        ? "bg-blue-300 dark:bg-yellow-500/50"
                        : "hover:bg-blue-300 dark:hover:bg-yellow-500/20"
                    }`}
                  >
                    {link.name}
                  </Link>
                  {link.name === "Your Orders" &&
                    data?.count > 0 &&
                    !isYourOrdersPage && (
                      <span className="count-orders -right-4">
                        {data?.count}
                      </span>
                    )}
                </div>
              );
            })}
          </nav>
        )}
      </div>

      {/* Middle section of the header */}
      {isAuthorized ? showMiddleSection && <>{NavMiddleSection}</> : ""}

      {/* Right section of the header */}
      <div>
        <nav
          className={`flex items-center justify-center text-center pr-2 ${
            showMiddleSection
              ? "flex flex-col space-y-1"
              : "sm:flex-col space-x-1.5 sm:space-y-1.5"
          }`}
        >
          {rightNav.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`header-links ${
                  isActive
                    ? "bg-blue-300 dark:bg-yellow-500/50"
                    : "hover:bg-blue-300 dark:hover:bg-yellow-500/20"
                } ${link.name === "manage your acc" ? "hidden md:block" : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
