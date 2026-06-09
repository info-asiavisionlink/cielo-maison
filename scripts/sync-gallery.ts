#!/usr/bin/env tsx
/**
 * CIELO Gallery Sync
 *
 * gallery/ フォルダ内の作品をスキャンし、
 * Supabase Storage へアップロード → gallery_images テーブルへ同期します。
 *
 * Usage:
 *   npm run sync-gallery
 *   npm run sync-gallery -- --dry-run   (アップロードせず確認のみ)
 *   npm run sync-gallery -- --force     (既存ファイルも再アップロード)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { WebSocket } from "ws";

// Node.js 20 には native WebSocket がないため ws を注入する
// @ts-ignore
globalThis.WebSocket = WebSocket;

// ─── env ──────────────────────────────────────────────────────────────────────
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌  Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

// ─── config ───────────────────────────────────────────────────────────────────
const BUCKET = "hero-images";
const GALLERY_DIR = path.join(process.cwd(), "gallery");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

// ─── types ────────────────────────────────────────────────────────────────────
interface WorkMeta {
  title?: string;
  description?: string;
  featured?: boolean;
  sort_order?: number;
  series?: string;
  edition?: string;
  year?: number | string;
  city?: string;
  status?: "available" | "sold" | "private";
}

interface WorkEntry {
  slug: string;
  imagePath: string;
  imageExt: string;
  meta: WorkMeta;
  hash: string;
  sortKey: number;
}

interface SyncResult {
  slug: string;
  action: "uploaded" | "skipped" | "updated" | "error";
  url?: string;
  reason?: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/^\d+[_\-\s]+/, "")      // strip leading sort number
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fileHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex").slice(0, 12);
}

function parseSortKey(dirName: string): number {
  const m = dirName.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

function loadMeta(dir: string): WorkMeta {
  const jsonPath = path.join(dir, "meta.json");
  const mdPath = path.join(dir, "description.md");

  let meta: WorkMeta = {};

  if (fs.existsSync(jsonPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    } catch {
      console.warn(`  ⚠  Invalid JSON in ${jsonPath}, ignoring`);
    }
  }

  // description.md overrides / extends meta.description
  if (fs.existsSync(mdPath)) {
    const raw = fs.readFileSync(mdPath, "utf-8").trim();
    // Use first non-empty line as description if not set in meta.json
    if (!meta.description) {
      meta.description = raw.split("\n").find((l) => l.trim()) ?? undefined;
    }
  }

  return meta;
}

function buildDescription(meta: WorkMeta): string | null {
  if (meta.description) return meta.description;

  const parts: string[] = [];
  if (meta.series) parts.push(meta.series);
  if (meta.edition) parts.push(`Edition ${meta.edition}`);
  if (meta.status) {
    const statusLabel =
      meta.status === "available"
        ? "Available"
        : meta.status === "sold"
        ? "Sold"
        : "In private residence";
    parts.push(statusLabel);
  }
  if (meta.city && meta.year) parts.push(`${meta.city}, ${meta.year}`);
  else if (meta.city) parts.push(meta.city);
  else if (meta.year) parts.push(String(meta.year));

  return parts.length ? parts.join(" — ") : null;
}

// ─── scan gallery directory ───────────────────────────────────────────────────
function scanGallery(): WorkEntry[] {
  if (!fs.existsSync(GALLERY_DIR)) {
    console.error(`❌  gallery/ directory not found at ${GALLERY_DIR}`);
    process.exit(1);
  }

  const entries: WorkEntry[] = [];

  const items = fs.readdirSync(GALLERY_DIR, { withFileTypes: true });

  for (const item of items) {
    // Skip non-directories and hidden/sample folders
    if (!item.isDirectory()) continue;
    if (item.name.startsWith(".") || item.name.startsWith("_")) continue;

    const dirName = item.name;
    const dirPath = path.join(GALLERY_DIR, dirName);

    // Find the primary image file
    const files = fs.readdirSync(dirPath);
    const imageFile = files.find(
      (f) =>
        IMAGE_EXTS.has(path.extname(f).toLowerCase()) &&
        !f.startsWith(".")
    );

    if (!imageFile) {
      console.warn(`  ⚠  No image found in gallery/${dirName}, skipping`);
      continue;
    }

    const imagePath = path.join(dirPath, imageFile);
    const imageExt = path.extname(imageFile).toLowerCase();
    const meta = loadMeta(dirPath);
    const sortKey = parseSortKey(dirName);
    const rawSlug = toSlug(dirName);
    const hash = fileHash(imagePath);

    entries.push({
      slug: rawSlug,
      imagePath,
      imageExt,
      meta,
      hash,
      sortKey,
    });
  }

  // Sort by the numeric prefix in the folder name
  entries.sort((a, b) => a.sortKey - b.sortKey);

  // Assign sequential sort_order if not specified in meta
  entries.forEach((e, i) => {
    if (e.meta.sort_order === undefined) {
      e.meta.sort_order = (i + 1) * 10;
    }
  });

  return entries;
}

// ─── storage helpers ──────────────────────────────────────────────────────────
async function ensureBucket(supabase: SupabaseClient): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);

  if (!exists) {
    console.log(`  📦  Creating bucket "${BUCKET}"...`);
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 52428800, // 50 MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
  }
}

async function listStorageFiles(supabase: SupabaseClient): Promise<Set<string>> {
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) throw new Error(`Storage list failed: ${error.message}`);
  return new Set((data ?? []).map((f) => f.name));
}

async function uploadImage(
  supabase: SupabaseClient,
  entry: WorkEntry,
  existingFiles: Set<string>
): Promise<{ url: string; action: "uploaded" | "skipped" }> {
  // Storage filename: slug--hash.ext  (hash prevents stale cache)
  const storageFilename = `${entry.slug}--${entry.hash}${entry.imageExt}`;
  const contentType = CONTENT_TYPES[entry.imageExt] ?? "image/jpeg";

  if (existingFiles.has(storageFilename) && !FORCE) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storageFilename);
    return { url: data.publicUrl, action: "skipped" };
  }

  if (DRY_RUN) {
    return {
      url: `[dry-run] https://storage/${BUCKET}/${storageFilename}`,
      action: "uploaded",
    };
  }

  const fileBuffer = fs.readFileSync(entry.imagePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storageFilename, fileBuffer, {
      contentType,
      upsert: true,
      cacheControl: "31536000", // 1 year — content-addressed by hash
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storageFilename);
  return { url: data.publicUrl, action: "uploaded" };
}

// ─── schema detection ────────────────────────────────────────────────────────
async function detectSlugColumn(supabase: SupabaseClient): Promise<boolean> {
  const { error } = await supabase
    .from("gallery_images")
    .select("slug")
    .limit(0);
  return !error || !error.message.toLowerCase().includes("slug");
}

async function applySlugMigration(supabase: SupabaseClient): Promise<boolean> {
  // Try to add slug column via a safe SELECT-based workaround.
  // Real migration must be run in Supabase Dashboard > SQL Editor.
  // See supabase/migrate.sql
  return false;
}

// ─── database sync ────────────────────────────────────────────────────────────
async function upsertRecord(
  supabase: SupabaseClient,
  entry: WorkEntry,
  imageUrl: string,
  hasSlugColumn: boolean
): Promise<"updated" | "inserted"> {
  const title = entry.meta.title ?? toTitle(entry.slug);
  const description = buildDescription(entry.meta);
  const isFeatured = entry.meta.featured ?? false;
  const sortOrder = entry.meta.sort_order ?? entry.sortKey * 10;

  const baseRecord: Record<string, unknown> = {
    image_url: imageUrl,
    title,
    description,
    sort_order: sortOrder,
    is_featured: isFeatured,
  };

  if (hasSlugColumn) {
    baseRecord.slug = entry.slug;
  }

  // ── with slug column: slug-based upsert ───────────────────────────────────
  if (hasSlugColumn) {
    const { data: existing } = await supabase
      .from("gallery_images")
      .select("id")
      .eq("slug", entry.slug)
      .maybeSingle();

    if (existing) {
      if (DRY_RUN) return "updated";
      const { error } = await supabase
        .from("gallery_images")
        .update(baseRecord)
        .eq("slug", entry.slug);
      if (error) throw new Error(`DB update failed: ${error.message}`);
      return "updated";
    } else {
      if (DRY_RUN) return "inserted";
      const { error } = await supabase.from("gallery_images").insert(baseRecord);
      if (error) throw new Error(`DB insert failed: ${error.message}`);
      return "inserted";
    }
  }

  // ── without slug column: image_url-based upsert (fallback) ───────────────
  const { data: existing } = await supabase
    .from("gallery_images")
    .select("id")
    .eq("image_url", imageUrl)
    .maybeSingle();

  if (existing) {
    if (DRY_RUN) return "updated";
    const { error } = await supabase
      .from("gallery_images")
      .update(baseRecord)
      .eq("image_url", imageUrl);
    if (error) throw new Error(`DB update failed: ${error.message}`);
    return "updated";
  } else {
    if (DRY_RUN) return "inserted";
    const { error } = await supabase.from("gallery_images").insert(baseRecord);
    if (error) throw new Error(`DB insert failed: ${error.message}`);
    return "inserted";
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n┌─────────────────────────────────────────");
  console.log("│  CIELO Gallery Sync");
  if (DRY_RUN) console.log("│  ⚡  DRY RUN — no changes will be made");
  if (FORCE)   console.log("│  🔄  FORCE — re-uploading existing files");
  console.log("└─────────────────────────────────────────\n");

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

  // Scan local gallery folder
  const entries = scanGallery();

  if (entries.length === 0) {
    console.log(
      "ℹ  No works found in gallery/\n" +
      "   Add folders following the structure in gallery/README.md\n"
    );
    return;
  }

  console.log(`📂  Found ${entries.length} work(s) in gallery/\n`);

  // Detect schema capabilities
  const hasSlugColumn = await detectSlugColumn(supabase);
  if (!hasSlugColumn) {
    console.log(
      "  ⚠  slug column not found — running in fallback mode (image_url deduplication)\n" +
      "     Run supabase/migrate.sql in Supabase Dashboard to enable slug-based sync\n"
    );
  }

  // Ensure storage bucket exists
  await ensureBucket(supabase);

  // List existing storage files for deduplication
  const existingFiles = await listStorageFiles(supabase);

  const results: SyncResult[] = [];

  for (const entry of entries) {
    process.stdout.write(`  → ${entry.slug.padEnd(40)} `);

    try {
      const { url, action: uploadAction } = await uploadImage(
        supabase,
        entry,
        existingFiles
      );

      const dbAction = await upsertRecord(supabase, entry, url, hasSlugColumn);

      const finalAction: SyncResult["action"] =
        uploadAction === "skipped" && dbAction === "updated"
          ? "updated"
          : uploadAction === "skipped"
          ? "skipped"
          : "uploaded";

      results.push({ slug: entry.slug, action: finalAction, url });

      const icon =
        finalAction === "uploaded" ? "✅ uploaded" :
        finalAction === "updated"  ? "🔄 updated"  :
                                     "⏭  skipped";
      console.log(icon);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ slug: entry.slug, action: "error", reason: msg });
      console.log(`❌ error: ${msg}`);
    }
  }

  // Summary
  const uploaded = results.filter((r) => r.action === "uploaded").length;
  const updated  = results.filter((r) => r.action === "updated").length;
  const skipped  = results.filter((r) => r.action === "skipped").length;
  const errors   = results.filter((r) => r.action === "error").length;

  console.log("\n─────────────────────────────────────────");
  console.log(`  ✅  Uploaded : ${uploaded}`);
  console.log(`  🔄  Updated  : ${updated}`);
  console.log(`  ⏭   Skipped  : ${skipped}`);
  if (errors > 0) console.log(`  ❌  Errors   : ${errors}`);
  console.log("─────────────────────────────────────────");

  if (errors > 0) {
    console.log("\nErrors occurred. Check output above.\n");
    process.exit(1);
  } else if (DRY_RUN) {
    console.log("\nDry run complete. Run without --dry-run to apply changes.\n");
  } else {
    console.log("\n✨  Gallery sync complete.\n");
  }
}

main().catch((err) => {
  console.error("\n❌  Unexpected error:", err);
  process.exit(1);
});
