import { clerkClient, User } from "@clerk/nextjs/server";
import UserRoleSwitcher from "@/components/AdminPage/UserRoleSwitcher";

export default async function AdminPage() {
  const client = await clerkClient();
  let users: User[] = [];
  try {
    users = (await client.users.getUserList()).data;
  } catch (error) {
    console.error(
      "An unexpected error occured, while getUserList(), Clerk:",
      error
    );
  }

  // make the btns to be unable to change the role of the main admin
  const mainUserEmail = process.env.MAIN_ADMIN_ID;
  const mainAdminUser = users.find((user) =>
    user.emailAddresses.some((email) => email.emailAddress === mainUserEmail)
  )!;

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className={`flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between md:px-[5%] gap-4 p-4 text-white ${
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
          </div>

          <UserRoleSwitcher
            user={JSON.parse(JSON.stringify(user))}
            mainAdminUser={JSON.parse(JSON.stringify(mainAdminUser))}
          />
        </div>
      ))}
    </div>
  );
}
