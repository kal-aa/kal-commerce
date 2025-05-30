"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Navlink } from "@/app/types/types";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import useSWR from "swr";
import SearchBar from "./SearchBar";
import HeaderLeftSection from "./HeaderLeftSection";

const countFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function Header() {
  const [showMiddleSection, setShowMiddleSection] = useState(false);
  const { user, isLoaded } = useUser();
  const isAuthorized = isLoaded && user;

  const { data } = useSWR(user?.id ? "/api/order-count" : null, countFetcher);
  const memorizedData = useMemo(() => data?.count, [data]);

  const pathname = usePathname();
  useEffect(() => {
    setShowMiddleSection([`/`, `/add-orders`].includes(pathname));
  }, [pathname]);

  const isAdmin = user?.publicMetadata?.role === "admin";

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
      <HeaderLeftSection memorizedData={memorizedData} />

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
