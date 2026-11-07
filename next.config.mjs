/** @type {import('next').NextConfig} */
const nativeBuild = process.env.FILMOOD_NATIVE === "1";

// The hosted desktop website retains normal Next.js behavior.
// Capacitor packages a separate, fully static copy into Android/iOS.
const nextConfig = nativeBuild
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
