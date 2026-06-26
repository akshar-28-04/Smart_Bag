import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmartBagProvider } from "@/context/SmartBagContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartBag — Know Where Your Child Is. Anytime. Anywhere.",
  description:
    "Real-time location tracking, geofencing, route monitoring, and emergency alerts powered by IoT. SmartBag keeps your child safe every step of the way.",
  keywords: [
    "child safety",
    "GPS tracking",
    "school bag tracker",
    "geofence",
    "IoT",
    "parent app",
    "SmartBag",
  ],
  openGraph: {
    title: "SmartBag — Child Safety Tracking",
    description: "Real-time GPS tracking and alerts for your child's safety.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased bg-[#0F172A] text-[#F8FAFC]">
        <SmartBagProvider>{children}</SmartBagProvider>
      </body>
    </html>
  );
}
