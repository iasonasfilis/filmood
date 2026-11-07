import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const next = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));

console.log("Building FILMOOD for native Android/iOS (static export)...");
const result = spawnSync(process.execPath, [next, "build"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    FILMOOD_NATIVE: "1",
    NEXT_PUBLIC_FILMOOD_NATIVE: "1",
  },
});
if (result.error) {
  console.error(result.error);
}
process.exit(result.status ?? 1);
