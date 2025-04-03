import { removeRole, setRole } from "@/app/actions";
import { clerkClient } from "@clerk/nextjs/server";
import React from "react";

export default async function AdminPage() {
  const client = await clerkClient();
  const users = (await client.users.getUserList()).data;

  // make the btns to be unable to change the role of the main admin
  const mainUserEmail = "sadkalshayee@gmail.com";
  const filterMainUser = users.find((user) =>
    user.emailAddresses.some((email) => email.emailAddress === mainUserEmail)
  );

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className={`flex flex-col-reverse sm:flex-row sm:items-center justify-between md:px-[5%] gap-4 p-4 text-white ${
            users.indexOf(user) % 2 === 0
              ? "bgneutral-50 bg-neutral-600"
              : "bg-whit bg-neutral-800 dark:bg-neutral-900"
          }`}
        >
          <div className="flex gap-8 ">
            <div className="dark:text-neutral-200 text-center">
              {user.firstName
                ? user.firstName + " " + user.lastName
                : "Unknow User"}
            </div>

            <div className="dark:text-neutral-200">
              {
                user.emailAddresses.find(
                  (email) => email.id === user.primaryEmailAddressId
                )?.emailAddress
              }
            </div>

            <div className="dark:text-200 uppercase">
              {filterMainUser?.id !== user.id
                ? (user.publicMetadata?.role as string)
                : ""}
            </div>
          </div>

          <div>
            {filterMainUser?.id === user.id ? (
              <span className="mr-2">Main Admin</span>
            ) : (
              <span className="flex flex-col md:flex-row gap-2">
                {user.publicMetadata.role !== "admin" ? (
                  <form action={setRole} className="inline">
                    <input type="hidden" value={user.id} name="id" />
                    <button type="submit" className="make-admin-btns">
                      Make Admin
                    </button>
                  </form>
                ) : (
                  <form action={removeRole} className="inline">
                    <input type="hidden" value={user.id} name="id" />
                    <button type="submit" className="make-admin-btns">
                      Remove Admin
                    </button>
                  </form>
                )}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
