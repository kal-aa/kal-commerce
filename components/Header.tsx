"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Navlink } from "@/app/types";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import useSWR from "swr";

const countFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function Header({ SearchBar }: { SearchBar: React.ReactNode }) {
  const [isElipsisClicked, setIsElipsisClicked] = useState(false);
  const [showMiddleSection, setShowMiddleSection] = useState(false);
  const { isLoaded, userId } = useAuth();
  const isAuthorized = isLoaded && userId;

  // Get orders count
  // Don't forget to revalidate /api/order-count on the server after successful order submission
  // use {mutate} = useSWRConfig on the /api/order-count on the client after success
  const { data } = useSWR("/api/order-count", countFetcher);
  const memorizedData = useMemo(() => data, [data]);

  const pathname = usePathname();
  const isYourOrdersPage = pathname.includes("/your-orders");
  useEffect(() => {
    setShowMiddleSection([`/`, `/add-orders`].includes(pathname));
  }, [pathname, userId]);

  const leftNav: Navlink[] = [
    { name: "Home", href: `/` },
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
          <Link href="/">
            <Image
              width={100}
              height={0}
              src="/images/others/cart.jpeg"
              alt="cart.jpeg"
              className="sm:w-20 w-16  h-10 rounded-full"
            />
          </Link>
          {!isElipsisClicked &&
            memorizedData?.count > 0 &&
            !isYourOrdersPage &&
            isAuthorized && (
              <Link
                href="/your-orders"
                className={`count-orders -left-4 sm:hidden ${
                  !isYourOrdersPage && "animate-bounce hover:animate-none"
                }`}
              >
                {memorizedData?.count}
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
                    } ${link.name === "Your Orders" && "mr-3"}`}
                  >
                    {link.name}
                  </Link>
                  {link.name === "Your Orders" &&
                    memorizedData?.count > 0 &&
                    !isYourOrdersPage &&
                    isAuthorized && (
                      <span className="count-orders right-0.5">
                        {memorizedData?.count}
                      </span>
                    )}
                </div>
              );
            })}
          </nav>
        )}
      </div>

      {/* Middle section of the header */}
      {isAuthorized ? showMiddleSection && <>{SearchBar}</> : ""}

      {/* Right section of the header */}
      <div className="flex items-center justify-center sm:flex-col-reverse md:flex-row">
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
        <SignedIn>
          <div className="sm:scale-110 md:scale-125">
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/manage-your-account"
            />
          </div>
        </SignedIn>
      </div>
    </header>
  );
}
