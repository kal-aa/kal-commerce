"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const adminNav = [
    { name: "Manage Roles", href: "/admin" },
    { name: "Manage Orders", href: "/admin/manage-orders" },
  ];

  return (
    <div className="flex space-x-3 sm:justify-start sm:pl-[3%] justify-around my-5">
      {adminNav.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`p-2 ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-black dark:text-gray-400 hover:text-blue-500"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
