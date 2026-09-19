import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sobia Mariam & Farhan Ullah Khan",
  description: "Wedding celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
