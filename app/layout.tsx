import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAE5303 Leaderboard",
  description: "AAE5303 Course Project Leaderboard System - UNet, ORB-SLAM3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {children}
      </body>
    </html>
  );
}

