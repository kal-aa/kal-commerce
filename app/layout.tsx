import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
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
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
