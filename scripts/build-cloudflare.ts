#!/usr/bin/env tsx
/**
 * CIELO — Cloudflare Pages build script
 *
 * 1. opennextjs-cloudflare build  →  .open-next/
 * 2. esbuild bundles .open-next/worker.js → .open-next/assets/_worker.js
 *    (Node.js built-ins kept external; resolved at runtime via nodejs_compat)
 *
 * Usage (Cloudflare Pages dashboard build command):
 *   npm run build:cf
 */

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

const root = process.cwd();

// ── Step 1: OpenNext build ────────────────────────────────────────────────────
console.log("\n[1/2] OpenNext Cloudflare build…");
execSync("npx opennextjs-cloudflare build", { stdio: "inherit", cwd: root });

// ── Step 2: Bundle worker.js → assets/_worker.js ─────────────────────────────
console.log("\n[2/2] Bundling worker for Cloudflare Pages…");

const workerIn  = path.join(root, ".open-next", "worker.js");
const workerOut = path.join(root, ".open-next", "assets", "_worker.js");

// All Node.js core modules that must stay external (resolved by nodejs_compat)
const NODE_BUILTINS = [
  "assert", "async_hooks", "buffer", "child_process", "cluster",
  "console", "constants", "crypto", "dgram", "diagnostics_channel",
  "dns", "domain", "events", "fs", "fs/promises", "http", "http2",
  "https", "inspector", "module", "net", "os", "path", "path/posix",
  "path/win32", "perf_hooks", "process", "punycode", "querystring",
  "readline", "repl", "stream", "stream/consumers", "stream/promises",
  "stream/web", "string_decoder", "sys", "timers", "timers/promises",
  "tls", "trace_events", "tty", "url", "util", "util/types",
  "v8", "vm", "wasi", "worker_threads", "zlib",
];

const externals = [
  "--external:cloudflare:*",
  "--external:node:*",
  ...NODE_BUILTINS.map((m) => `--external:${m}`),
].join(" ");

const cmd = [
  `${path.join(root, "node_modules", ".bin", "esbuild")}`,
  workerIn,
  "--bundle",
  `--outfile=${workerOut}`,
  "--format=esm",
  "--platform=browser",
  "--conditions=workerd,worker,browser",
  "--minify",
  externals,
].join(" ");

execSync(cmd, { stdio: "inherit", cwd: root });

const sizeMb = (fs.statSync(workerOut).size / 1024 / 1024).toFixed(2);
console.log(`\n✓ Cloudflare Pages build complete`);
console.log(`  Assets : .open-next/assets/`);
console.log(`  Worker : .open-next/assets/_worker.js  (${sizeMb} MB)`);
console.log(`\nCloudflare Pages settings:`);
console.log(`  Build command      : npm run build:cf`);
console.log(`  Build output dir   : .open-next/assets`);
console.log(`  Compatibility flag : nodejs_compat`);
