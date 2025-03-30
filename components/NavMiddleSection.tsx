import Form from "next/form";
import { FaSearch } from "react-icons/fa";
import { searchAction } from "@/app/actions";

export default async function NavMiddleSection() {
  return (
    <Form action={searchAction} className="w-1/4 flex items-center">
      <input
        name="query"
        className="outline-none border-2 w-full px-2 py-1.5 -mr-1 rounded-l-lg border-black/20 dark:border-white dark:hover:bg-blue-300/20"
      />
      <button
        type="submit"
        className="bg-gray-200 py-2 pl-3 pr-4 md:pl-5 md:pr-6 rounded-r-xl cursor-pointer"
      >
        <FaSearch className="inline-block text-black/30" />
      </button>
    </Form>
  );
}
