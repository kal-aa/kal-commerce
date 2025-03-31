import { UserProfile } from "@clerk/nextjs";

export default function ManageYourAccountPage() {
  return (
    <div className="flex justify-center items-center px-5">
      <UserProfile />
    </div>
  );
}
