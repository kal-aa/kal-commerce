import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "products", template: "%s | kal-commerce" },
  description: "Post authorization layout of kal-commerce",
};

export default async function PostAuthorizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
