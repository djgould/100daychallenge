import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "100 Day Fitness Challenge | Road to 1000 Miles",
  description:
    "Tracking my journey to move 1000 miles before turning 30 on June 28th, 2024. Powered by Strava.",
  keywords: [
    "fitness",
    "challenge",
    "strava",
    "running",
    "cycling",
    "tracking",
    "100 day challenge",
  ],
  authors: [{ name: "Devin Gould" }],
  openGraph: {
    title: "100 Day Fitness Challenge | Road to 1000 Miles",
    description:
      "Tracking my journey to move 1000 miles before turning 30 on June 28th, 2024.",
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
      <body className="antialiased font-sans">{children}</body>
      <Analytics />
    </html>
  );
}
