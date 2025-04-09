"use client";

import { User } from "@clerk/nextjs/server";
import { removeRole, setRole } from "@/app/actions";
import { useState } from "react";

export default function OptimisticRole({
  user,
  filterMainUser,
}: {
  user: User;
  filterMainUser: User;
}) {
  const [optimisticUser, setOptimisticUser] = useState<Partial<User>>(user);

  // update role optimistically
  const handleRoleChange = async (newRole: string) => {
    const updatedUser = {
      ...optimisticUser,
      publicMetadata: { ...optimisticUser.publicMetadata, role: newRole },
    };
    setOptimisticUser(updatedUser);

    try {
      if (!optimisticUser.id) throw new Error("User ID is missing");
      if (newRole === "admin") {
        await setRole(optimisticUser.id);
      } else {
        await removeRole(optimisticUser.id);
      }
    } catch (error) {
      setOptimisticUser(user);
      console.error("Failed to update role", error);
    }
  };

  const role = optimisticUser.publicMetadata?.role;

  return (
    <div className="w-1/2 flex flex-row-reverse sm:flex-row justify-between sm:items-center">
      <div className="dark:text-200 uppercase">
        {filterMainUser?.id !== user.id
          ? (optimisticUser.publicMetadata?.role as string) || "CLIENT"
          : ""}
      </div>
      <div>
        {filterMainUser?.id === optimisticUser.id ? (
          <span className="mr-2">Main Admin</span>
        ) : (
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={() =>
                handleRoleChange(role === "admin" ? "client" : "admin")
              }
              className="make-admin-btns"
            >
              {role === "admin" ? "Remove Admin" : "Make Admin"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
