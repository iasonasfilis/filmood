import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FILMOOD. — Find your mood. Find your movie.",
  description: "A more personal way to discover what to watch tonight."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
