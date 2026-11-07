import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Replace this provisional reverse-DNS identifier with an owned identifier
  // before the first public Play Store / App Store release.
  appId: "com.filmood.discovery",
  appName: "FILMOOD",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
