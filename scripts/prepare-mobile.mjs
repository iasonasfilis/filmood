import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const platform = process.argv[2];
if (!["android", "ios", "sync"].includes(platform)) {
  console.error("Usage: node scripts/prepare-mobile.mjs android|ios|sync");
  process.exit(1);
}
if (platform === "ios" && process.platform !== "darwin") {
  console.error("iOS project generation and Xcode require macOS.");
  process.exit(1);
}
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.error) console.error(result.error);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

run(npm, ["run", "mobile:build"]);

if (platform === "sync") {
  if (!existsSync(join(root, "android")) && !existsSync(join(root, "ios"))) {
    console.error("No native platforms yet. Run npm run mobile:android or npm run mobile:ios first.");
    process.exit(1);
  }
  run(npx, ["--no-install", "cap", "sync"]);
} else {
  if (!existsSync(join(root, platform))) {
    run(npx, ["--no-install", "cap", "add", platform]);
  }
  run(npx, ["--no-install", "cap", "sync", platform]);
}
console.log("Native FILMOOD project prepared. Open it in Android Studio or Xcode.");
