import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "authorize",
  description: "Authorization layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
