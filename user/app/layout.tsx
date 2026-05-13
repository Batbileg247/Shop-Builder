import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
import { Geist } from "next/font/google";
import Script from "next/script";
=======
import { Inter } from "next/font/google";
>>>>>>> user-admin

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Shop Builder",
  description: "Frontend prototype for building and managing online shops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased font-sans ${inter.variable}`}
    >
      <body className="flex min-h-svh flex-col">{children}</body>
    </html>
  );
}
