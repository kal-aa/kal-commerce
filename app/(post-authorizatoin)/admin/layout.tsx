import AdminNav from "@/components/AdminNav";
import "../../globals.css";
import type { Metadata } from "next";

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
