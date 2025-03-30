import "../globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavMiddleSection from "@/components/NavMiddleSection";
import ToastNotification from "./ToastNotification";

export const metadata: Metadata = {
  title: "products",
  description: "Post authorization layout of kal-commerce",
};

export default async function PostAuthorizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header NavMiddleSection={<NavMiddleSection />} />
      <div className="min-h-[55vh] mt-28">{children}</div>
      <ToastNotification />
      <Footer />
    </>
  );
}
