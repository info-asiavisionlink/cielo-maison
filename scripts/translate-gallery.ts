#!/usr/bin/env tsx
/**
 * CIELO Gallery Translation
 *
 * gallery_images テーブルの title / description を
 * Luxury Maison トーンで多言語化し、Supabase へ保存します。
 *
 * Prerequisites:
 *   ANTHROPIC_API_KEY=sk-ant-...  (.env.local に追加)
 *   SUPABASE_SERVICE_ROLE_KEY     (既存)
 *
 * Usage:
 *   npm run translate-gallery
 *   npm run translate-gallery -- --dry-run    (DB書き込みなし)
 *   npm run translate-gallery -- --slug=xxx   (1作品のみ)
 *   npm run translate-gallery -- --force      (翻訳済みも再翻訳)
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import * as path from "path";
import * as dotenv from "dotenv";
import { WebSocket } from "ws";

// @ts-ignore
globalThis.WebSocket = WebSocket;

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// ─── Config ───────────────────────────────────────────────────────────────────
const DRY_RUN   = process.argv.includes("--dry-run");
const FORCE     = process.argv.includes("--force");
const SLUG_ARG  = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

const SUPABASE_URL       = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY  = process.env.ANTHROPIC_API_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.error("❌  Missing: ANTHROPIC_API_KEY");
  console.error("   Add ANTHROPIC_API_KEY=sk-ant-... to .env.local");
  process.exit(1);
}

// ─── Clients ──────────────────────────────────────────────────────────────────
const supabase  = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryRow {
  id: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  title_jp: string | null;
  title_en: string | null;
  title_fr: string | null;
  title_cn: string | null;
  title_th: string | null;
  description_jp: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_cn: string | null;
  description_th: string | null;
}

type TargetLocale = "en" | "fr" | "cn" | "th";

// ─── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the voice of CIELO, a spatial luxury maison whose works complete architectural spaces in penthouses, private residences, and the finest hotels.

Your task is to translate a Japanese artwork title and description into the specified language, while maintaining the exact tone and register of:
— Aman (stillness, spatial intelligence, private atmosphere)
— HERMÈS (precision of language, refusal to over-explain)
— A serious luxury gallery (architectural gravity, restraint, no marketing language)

Rules:
1. Never use promotional language ("beautiful", "stunning", "amazing", "perfect")
2. Never explain the work — suggest its presence
3. Preserve the atmosphere of spatial completion: the work belongs to a room, not to a wall
4. For titles: keep them atmospheric and spatial, not literal
5. For descriptions: 1–2 sentences maximum. Cinematic restraint. No adjective pileups.
6. Respond ONLY with a JSON object: {"title": "...", "description": "..."}
7. No preamble, no explanation, no markdown`;

// ─── Translation call ──────────────────────────────────────────────────────────
async function translateWork(
  title_jp: string,
  description_jp: string,
  locale: TargetLocale
): Promise<{ title: string; description: string }> {
  const languageNames: Record<TargetLocale, string> = {
    en: "English",
    fr: "French",
    cn: "Simplified Chinese",
    th: "Thai",
  };

  const prompt = `Translate the following CIELO artwork data from Japanese into ${languageNames[locale]}.

Title (Japanese): ${title_jp}
Description (Japanese): ${description_jp}

Respond with JSON only: {"title": "...", "description": "..."}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "{}";

  // Strip markdown fences if present
  const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean) as { title: string; description: string };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n CIELO — Gallery Translation");
  console.log("══════════════════════════════════════════");
  if (DRY_RUN) console.log("  DRY RUN — no writes to Supabase");
  if (FORCE)   console.log("  FORCE   — re-translating all rows");
  console.log();

  // Fetch rows
  let query = supabase
    .from("gallery_images")
    .select("id, slug, title, description, title_jp, title_en, title_fr, title_cn, title_th, description_jp, description_en, description_fr, description_cn, description_th")
    .order("sort_order", { ascending: true });

  if (SLUG_ARG) {
    query = query.eq("slug", SLUG_ARG);
  }

  const { data, error } = await query;
  if (error) { console.error("❌  Supabase fetch error:", error.message); process.exit(1); }
  if (!data || data.length === 0) { console.log("⚠️  No rows found."); return; }

  const rows = data as GalleryRow[];
  console.log(`  Found ${rows.length} work(s)\n`);

  const locales: TargetLocale[] = ["en", "fr", "cn", "th"];
  let translated = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    const srcTitle = row.title_jp ?? row.title;
    const srcDesc  = row.description_jp ?? row.description;

    if (!srcTitle && !srcDesc) {
      console.log(`  ⏭  ${row.slug ?? row.id} — no source text, skipping`);
      skipped++;
      continue;
    }

    const label = row.slug ?? row.id;
    console.log(`  ▸ ${label}`);

    const updates: Partial<GalleryRow> = {};
    let rowHasChanges = false;

    for (const locale of locales) {
      const titleKey = `title_${locale}` as keyof GalleryRow;
      const descKey  = `description_${locale}` as keyof GalleryRow;

      const alreadyDone =
        !FORCE &&
        row[titleKey] != null &&
        row[descKey] != null;

      if (alreadyDone) {
        console.log(`    ✓ ${locale.toUpperCase()} — already translated`);
        continue;
      }

      try {
        const result = await translateWork(
          srcTitle ?? "",
          srcDesc  ?? "",
          locale
        );

        updates[titleKey] = result.title as any;
        updates[descKey]  = result.description as any;
        rowHasChanges = true;

        console.log(`    ✓ ${locale.toUpperCase()} — "${result.title}"`);

        // Rate limit: pause 300ms between calls
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        console.error(`    ✗ ${locale.toUpperCase()} — ${(err as Error).message}`);
        errors++;
      }
    }

    if (rowHasChanges && !DRY_RUN) {
      const { error: updateError } = await supabase
        .from("gallery_images")
        .update(updates)
        .eq("id", row.id);

      if (updateError) {
        console.error(`    ✗ DB write failed: ${updateError.message}`);
        errors++;
      } else {
        translated++;
      }
    } else if (rowHasChanges && DRY_RUN) {
      translated++;
    }

    console.log();
  }

  console.log("══════════════════════════════════════════");
  console.log(`  ✅  Translated : ${translated} work(s)`);
  console.log(`  ⏭   Skipped   : ${skipped} work(s)`);
  if (errors > 0) console.log(`  ❌  Errors    : ${errors}`);
  console.log("══════════════════════════════════════════\n");

  if (DRY_RUN) {
    console.log("  Dry run complete. Run without --dry-run to write to Supabase.\n");
  }
}

main().catch((err) => {
  console.error("\n❌  Unexpected error:", err);
  process.exit(1);
});
