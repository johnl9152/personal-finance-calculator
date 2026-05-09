import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/app/components/NavBar";

export const metadata: Metadata = {
  title: "Spending Dashboard",
  description: "Personal spending tracker and subscription manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <NavBar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
