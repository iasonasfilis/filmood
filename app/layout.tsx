import type { Metadata, Viewport } from "next";
import NativeBridge from "./native-bridge";
import "./globals.css";

export const metadata: Metadata = {
  title: "FILMOOD. — Find your mood. Find your movie.",
  description: "A more personal way to discover what to watch tonight.",
  applicationName: "FILMOOD.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "FILMOOD.", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#100e14",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={process.env.FILMOOD_NATIVE === "1" ? "filmood-native" : undefined}>
      <body>{process.env.FILMOOD_NATIVE === "1" && <NativeBridge />}{children}</body>
    </html>
  );
}
