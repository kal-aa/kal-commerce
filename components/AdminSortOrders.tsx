"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSortOrders() {
  const [sortBy, setSortBy] = useState("date-descending");
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);
    const url = new URL(window.location.href);
    url.searchParams.set("sortBy", selectedSort);

    router.push(url.toString());
  };

  return (
    <div className="flex justify-start sm:justify-end items-center">
      <label htmlFor="select">
        <span className="inline sm:hidden">Sort by:</span>
        <select
          id="select"
          value={sortBy}
          onChange={handleSortChange}
          className="ml-3 sm:ml-0 sm:mr-3 dark:bg-black ring rounded-lg py-1"
        >
          <option value="date-descending">Newest First</option>
          <option value="date-ascending">Oldest First</option>
          <option value="processing-first">Processing Orders First</option>
          <option value="pending-checkout-first">
            Pending Checkout Orders First
          </option>
        </select>
        <span className="hidden sm:inline">:Sort by</span>
      </label>
    </div>
  );
}
