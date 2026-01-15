import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAE5303 - Course Leaderboard",
  description:
    "AAE5303 - Robust Control Technology in Low-Altitude Aerial Vehicle (Jan 2026) — Course Project Leaderboards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {children}
      </body>
    </html>
  );
}

