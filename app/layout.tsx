import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FILMOOD. — Find your mood. Find your movie.",
  description: "A more personal way to discover what to watch tonight.",
  applicationName: "FILMOOD.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "FILMOOD.", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
