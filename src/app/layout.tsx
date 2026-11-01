import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spendlytics — Personal Finance Tracker",
  description: "Track your income and expenses",
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-base text-dark-text antialiased`}>
        {children}
      </body>
    </html>
  );
}
