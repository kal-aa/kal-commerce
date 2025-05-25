"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Navlink } from "@/app/types/types";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import useSWR from "swr";
import SearchBar from "./SearchBar";

const countFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function Header() {
  const [isElipsisClicked, setIsElipsisClicked] = useState(false);
  const [showMiddleSection, setShowMiddleSection] = useState(false);
  const { user, isLoaded } = useUser();
  const isAuthorized = isLoaded && user;

  // Get orders count
  // Don't forget to revalidate /api/order-count on the server after successful order submission
  // use {mutate} = useSWRConfig on the /api/order-count on the client after success
  const { data } = useSWR(user?.id ? "/api/order-count" : null, countFetcher);
  const memorizedData = useMemo(() => data, [data]);

  const pathname = usePathname();
  const isYourOrdersPage = pathname.includes("/your-orders");
  useEffect(() => {
    setShowMiddleSection([`/`, `/add-orders`].includes(pathname));
  }, [pathname]);

  const isAdmin = user?.publicMetadata?.role === "admin";
  const leftNav: Navlink[] = [
    { name: "Home", href: `/` },
    { name: "Shop", href: `/add-orders` },
    { name: "Orders", href: `/your-orders` },
  ];

  let rightNav: Navlink[] = [
    {
      name: isAuthorized ? "Admin" : "Go to Homepage",
      href: isAuthorized ? `/admin` : "/",
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

  if (isAuthorized && !isAdmin) {
    rightNav = rightNav.slice(1);
  }

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
                {memorizedData?.count < 10 ? memorizedData?.count : "9+"}
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
            className={`space-y-2 sm:flex sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center sm:ml-2 ${
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
                    memorizedData?.count > 0 &&
                    !isYourOrdersPage &&
                    isAuthorized && (
                      <span className="count-orders rounded-sm! p-1! py-0! -right-4">
                        {memorizedData?.count < 10
                          ? memorizedData?.count
                          : "9+"}
                      </span>
                    )}
                </div>
              );
            })}
          </nav>
        )}
      </div>

      {/* Middle section of the header */}
      {isAuthorized ? showMiddleSection && <SearchBar /> : ""}

      {/* Right section of the header */}
      <div
        className={`flex items-center justify-center ${
          !isAdmin ? "sm:flex-col-reverse" : ""
        } md:flex-row`}
      >
        <nav
          className={`flex flex-col ${
            !isAuthorized ? "md:flex-row md:space-y-0 space-x-4" : ""
          } items-center justify-center text-center pr-2 ${
            showMiddleSection
              ? "space-y-1"
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
                  isActive ? "ring-1" : "hover:rounded-none! hover:border-b"
                }`}
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
