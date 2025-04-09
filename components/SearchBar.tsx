"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [queryValue, setQueryValue] = useState(query || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryValue.trim() && pathname !== "/add-orders") return;

    const form = e.target as HTMLFormElement;
    const query = new FormData(form).get("query") as string;
    if (pathname !== "/add-orders") {
      router.push(`/add-orders?query=${query}`);
    } else {
      window.location.href = `/add-orders?query=${query}`;
    }
  };

  const handleQueryDelete = () => {
    setQueryValue("");
    router.push(pathname);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-1/4 flex items-center">
      <div className="relative">
        {queryValue && (
          <TiDelete onClick={handleQueryDelete} className="query-remove-icon" />
        )}
        <input
          name="query"
          value={queryValue}
          onChange={(e) => setQueryValue(e.target.value)}
          className={`search-input ${queryValue && "pl-6!"}`}
        />
      </div>
      <button type="submit" className="search-btn">
        <FaSearch className="inline-block text-black/30" />
      </button>
    </form>
  );
}
