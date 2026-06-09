#!/usr/bin/env node
/**
 * CIELO — Cloudflare Pages build
 *
 * Pure ESM Node.js script (no tsx / TypeScript required).
 * Runs via: npm run build  OR  node scripts/build-cf.mjs
 *
 * Steps:
 *   1. opennextjs-cloudflare build  →  .open-next/
 *   2. esbuild bundles .open-next/worker.js  →  .open-next/assets/_worker.js
 *
 * Cloudflare Pages dashboard settings:
 *   Build command      : npm run build
 *   Build output dir   : .open-next/assets
 *   Compat flag        : nodejs_compat
 *   Compat date        : 2025-01-01
 */

import { execSync }                    from "node:child_process";
import { existsSync, statSync, rmSync } from "node:fs";
import { join, dirname }               from "node:path";
import { fileURLToPath }               from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = join(__dirname, "..");

// ── helpers ───────────────────────────────────────────────────────────────────
function run(cmd, label) {
  console.log(`\n▸ ${label}`);
  execSync(cmd, { stdio: "inherit", cwd: root });
}

function assertExists(p, label) {
  if (!existsSync(p)) {
    console.error(`\n✘ Expected path not found: ${p}`);
    console.error(`  Step "${label}" may have failed silently.`);
    process.exit(1);
  }
}

// ── Clean previous build artifacts ───────────────────────────────────────────
const openNextDir = join(root, ".open-next");
if (existsSync(openNextDir)) {
  console.log("\n▸ Cleaning previous .open-next/");
  rmSync(openNextDir, { recursive: true, force: true });
}

// ── Step 1: OpenNext Cloudflare build ─────────────────────────────────────────
console.log("\n┌─────────────────────────────────────────┐");
console.log("│  CIELO — Cloudflare Pages Build (1/2)  │");
console.log("└─────────────────────────────────────────┘");

run(
  `node "${join(root, "node_modules/@opennextjs/cloudflare/dist/cli/index.js")}" build`,
  "opennextjs-cloudflare build"
);

const workerSrc = join(root, ".open-next", "worker.js");
assertExists(workerSrc, "opennextjs-cloudflare build");

// ── Step 2: Bundle worker.js → assets/_worker.js ─────────────────────────────
console.log("\n┌─────────────────────────────────────────┐");
console.log("│  CIELO — Bundle Worker (2/2)            │");
console.log("└─────────────────────────────────────────┘");

const workerOut  = join(root, ".open-next", "assets", "_worker.js");
const esbuildBin = join(root, "node_modules", ".bin", "esbuild");

// Node.js built-ins to keep external (resolved at runtime by nodejs_compat)
const NODE_BUILTINS = [
  "assert","async_hooks","buffer","child_process","cluster","console",
  "constants","crypto","dgram","diagnostics_channel","dns","domain",
  "events","fs","fs/promises","http","http2","https","inspector",
  "module","net","os","path","path/posix","path/win32","perf_hooks",
  "process","punycode","querystring","readline","repl","stream",
  "stream/consumers","stream/promises","stream/web","string_decoder",
  "sys","timers","timers/promises","tls","trace_events","tty","url",
  "util","util/types","v8","vm","wasi","worker_threads","zlib",
];

const externals = [
  "--external:cloudflare:*",
  "--external:node:*",
  ...NODE_BUILTINS.map(m => `--external:${m}`),
].join(" ");

run(
  [
    `"${esbuildBin}"`,
    `"${workerSrc}"`,
    "--bundle",
    `--outfile="${workerOut}"`,
    "--format=esm",
    "--platform=browser",
    "--conditions=workerd,worker,browser",
    "--minify",
    externals,
  ].join(" "),
  "esbuild bundle → .open-next/assets/_worker.js"
);

assertExists(workerOut, "esbuild bundle");

const sizeMb = (statSync(workerOut).size / 1024 / 1024).toFixed(2);

console.log("\n┌─────────────────────────────────────────┐");
console.log("│  ✓  Build complete                      │");
console.log("└─────────────────────────────────────────┘");
console.log(`  Static assets : .open-next/assets/`);
console.log(`  Worker        : .open-next/assets/_worker.js  (${sizeMb} MB)`);
console.log(`\n  Cloudflare Pages settings:`);
console.log(`    Build command      : npm run build`);
console.log(`    Build output dir   : .open-next/assets`);
console.log(`    Compatibility flag : nodejs_compat`);
console.log(`    Compatibility date : 2025-01-01\n`);
