import type { Metadata } from "next";
import AdminNav from "@/components/AdminPage/AdminNav";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage your clients and their orders",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}
