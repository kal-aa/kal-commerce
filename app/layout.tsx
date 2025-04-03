import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastNotification from "@/components/ToastNotification";

export const metadata: Metadata = {
  title: { default: "kal-commerce", template: "%s | kal-commerce" },
  description: "an E-commerce website dedicated to offering huge collectin of ",
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode | null;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={playfair.variable}>
          <Header />
          <div className="min-h-[55vh] mt-28">{children}</div>
          <div className="modal-container">{modal}</div>
          <ToastNotification />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
