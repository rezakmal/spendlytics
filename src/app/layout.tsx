import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
 
export const metadata: Metadata = {
  title: "Spendlytics — Personal Finance Tracker",
  description: "Track your income and expenses",
};
 
export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const isDev = process.env.MIDTRANS_IS_PRODUCTION !== "true";
 
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-base text-dark-text antialiased`}>
        {children}
        <Script
          src={isDev
            ? "https://app.sandbox.midtrans.com/snap/snap.js"
            : "https://app.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}