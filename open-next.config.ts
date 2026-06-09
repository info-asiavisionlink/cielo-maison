import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Explicitly set the Next.js build command to "npm run build:next"
// so opennextjs-cloudflare does NOT recurse into "npm run build"
// (which is our full Cloudflare pipeline script).
export default {
  ...defineCloudflareConfig(),
  buildCommand: "npm run build:next",
};
