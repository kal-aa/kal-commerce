"use client";

import { PaginationProps } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  page,
  pageKey = "page",
  hasMore,
  totalPages,
  baseUrl,
}: PaginationProps) => {
  const router = useRouter();
  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page + 1;

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set(pageKey, newPage.toString());

    if (baseUrl === "add-orders") {
      window.location.href = url.toString();
    } else {
      router.push(`/${baseUrl}?${url.searchParams.toString()}`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      {/* Previous Page Link */}
      {page === 1 ? (
        <span className="text-gray-400">
          <FaChevronLeft size={15} />
        </span>
      ) : (
        <button
          onClick={() => handlePageChange(prevPage)}
          className="flex items-center justify-center p-1 bg-purple-600 text-white rounded-md hover:bg-purple-600/90"
        >
          <FaChevronLeft size={15} />
          <span className="ml-0.5">Previous</span>
        </button>
      )}

      {/* Current Page */}
      <span className="text-lg font-medium text-gray-800 dark:text-gray-400">
        Page {page}/{totalPages}
      </span>

      {/* Next Page Link */}
      {hasMore ? (
        <button
          onClick={() => handlePageChange(nextPage)}
          className="flex items-center justify-center p-1 bg-purple-600 text-white rounded-md hover:bg-purple-600/90"
        >
          <span className="mr-0.5">Next</span>
          <FaChevronRight size={15} />
        </button>
      ) : (
        <span className="text-gray-400">
          <FaChevronRight size={15} />
        </span>
      )}
    </div>
  );
};

export default Pagination;
