import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastNotification from "@/components/ToastNotification";
import SearchBar from "@/components/SearchBar";
export const metadata: Metadata = {
  title: { default: "Kal-commerce", template: "%s | kal-commerce" },
  description: "an E-commerce website dedicated to offering huge collectin of ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-white text-black dark:bg-black dark:text-white">
          <Header SearchBar={<SearchBar />} />
          <div className="min-h-[55vh] mt-28">{children}</div>
          <ToastNotification />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
