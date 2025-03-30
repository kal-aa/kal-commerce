import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "../globals.css";
import NavMiddleSection from "@/components/NavMiddleSection";
export const metadata: Metadata = {
  title: "authorize",
  description: "Authorization layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header NavMiddleSection={<NavMiddleSection />} />
      <div className="min-h-[55vh] mt-28">{children}</div>
      <Footer />
    </>
  );
}
