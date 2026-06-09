"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";
import { supabase, type GalleryImage } from "@/lib/supabase";
import { localizedTitle, localizedDescription } from "@/lib/gallery-i18n";

// ── Edition plate component ──────────────────────────────────────────────────
function EditionPlate({ edition, series }: { edition: string; series: string }) {
  return (
    <div style={{
      display: "inline-flex",
      flexDirection: "column",
      gap: "0.25rem",
      padding: "0.625rem 1rem",
      border: "1px solid rgba(184,150,46,0.2)",
      background: "rgba(4,4,4,0.8)",
      position: "relative",
    }}>
      {/* Corner accents */}
      {[
        { top: "-1px", left: "-1px" },
        { top: "-1px", right: "-1px" },
        { bottom: "-1px", left: "-1px" },
        { bottom: "-1px", right: "-1px" },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            ...pos,
            borderTop: pos.top !== undefined ? "1px solid rgba(184,150,46,0.7)" : undefined,
            borderBottom: pos.bottom !== undefined ? "1px solid rgba(184,150,46,0.7)" : undefined,
            borderLeft: pos.left !== undefined ? "1px solid rgba(184,150,46,0.7)" : undefined,
            borderRight: pos.right !== undefined ? "1px solid rgba(184,150,46,0.7)" : undefined,
          }}
        />
      ))}
      <span style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: "0.4375rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(184,150,46,0.45)",
      }}>
        {series}
      </span>
      <span style={{
        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
        fontWeight: 300,
        fontSize: "0.875rem",
        letterSpacing: "0.12em",
        color: "var(--cielo-white)",
        fontStyle: "italic",
      }}>
        {edition}
      </span>
    </div>
  );
}

// ── Registry certification badge ─────────────────────────────────────────────
function RegistryCertBadge({ label }: { label: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }}>
      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4" stroke="rgba(184,150,46,0.5)" strokeWidth="0.5" fill="none" />
        <circle cx="5" cy="5" r="2" fill="rgba(184,150,46,0.45)" />
      </svg>
      <span style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: "0.5rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(184,150,46,0.6)",
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Individual work card ──────────────────────────────────────────────────────
function WorkCard({
  work,
  index,
  cta,
  certLabel,
  editionLabel,
  seriesLabel,
  locale,
}: {
  work: GalleryImage;
  index: number;
  cta: string;
  certLabel: string;
  editionLabel: string;
  seriesLabel: string;
  locale: import("@/contexts/i18n").Locale;
}) {
  const isLeft = index % 2 === 0;
  const title = localizedTitle(work, locale);
  const description = localizedDescription(work, locale);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "68vh",
        borderTop: "1px solid rgba(184,150,46,0.06)",
      }}
      className="work-card"
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          gridColumn: isLeft ? 1 : 2,
          gridRow: 1,
          overflow: "hidden",
          minHeight: "500px",
        }}
      >
        <Image
          src={work.image_url}
          alt={title ?? "CIELO Work"}
          fill
          quality={80}
          sizes="50vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Atmospheric overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: isLeft
            ? "linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.35))"
            : "linear-gradient(to left, rgba(0,0,0,0.05), rgba(0,0,0,0.35))",
        }} />
        {/* Edition badge on image */}
        <div style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 3vw, 2.5rem)",
          [isLeft ? "right" : "left"]: "clamp(1.5rem, 3vw, 2.5rem)",
        }}>
          <EditionPlate edition={`Edition I of III`} series={seriesLabel} />
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          gridColumn: isLeft ? 2 : 1,
          gridRow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(2.5rem, 5vw, 5.5rem) clamp(2.5rem, 6vw, 7rem)",
          gap: "clamp(1.25rem, 2vw, 1.875rem)",
        }}
      >
        <RegistryCertBadge label={certLabel} />

        <div>
          <div style={{ width: "28px", height: "1px", background: "rgba(184,150,46,0.5)", marginBottom: "1.375rem" }} />
          {title && (
            <h3
              className="work-title"
              style={{
                fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
                lineHeight: 1.25,
                letterSpacing: "0.04em",
                marginBottom: "1rem",
              }}
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              className="work-caption"
              style={{
                lineHeight: 2,
                letterSpacing: "0.08em",
                fontSize: "0.6875rem",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Edition status */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          paddingTop: "0.25rem",
        }}>
          {["I of III", "II of III", "III of III"].map((ed, i) => (
            <div key={ed} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: "24px",
                height: "1px",
                background: i === 0 ? "rgba(184,150,46,0.55)" : "rgba(200,200,200,0.12)",
              }} />
              <span style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontWeight: 300,
                fontSize: "0.5rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: i === 0 ? "rgba(184,150,46,0.5)" : "rgba(200,200,200,0.2)",
              }}>
                {editionLabel} {ed}
              </span>
              {i === 0 && (
                <span style={{
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                  fontWeight: 300,
                  fontSize: "0.4375rem",
                  letterSpacing: "0.18em",
                  color: "rgba(184,150,46,0.4)",
                  textTransform: "uppercase",
                }}>
                  ◉
                </span>
              )}
            </div>
          ))}
        </div>

        <a href="#inquiry" className="cta-link" style={{ display: "inline-block", marginTop: "0.5rem" }}>
          {cta}
        </a>
      </div>
    </motion.article>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ t }: { t: { empty: string; emptyBody: string; cta: string } }) {
  return (
    <Reveal style={{
      textAlign: "center",
      padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 4vw, 2rem)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
    }}>
      <div style={{ width: "28px", height: "1px", background: "rgba(184,150,46,0.5)" }} />
      <p className="section-heading" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontStyle: "italic" }}>
        {t.empty}
      </p>
      <p className="body-text" style={{ maxWidth: "520px", fontSize: "0.9375rem", lineHeight: 2 }}>
        {t.emptyBody}
      </p>
      <a href="#inquiry" className="cta-link">{t.cta}</a>
    </Reveal>
  );
}

// ── Collection hierarchy header ───────────────────────────────────────────────
function CollectionHierarchy({ t }: { t: Record<string, string> }) {
  const levels = [
    t.hierCollection,
    t.hierSeries,
    t.hierEdition,
    t.hierRegistry,
  ];

  return (
    <Reveal delay={0.3} style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "clamp(0.875rem, 2vw, 1.75rem)",
      flexWrap: "wrap",
      padding: "clamp(1.25rem, 3vw, 2rem) clamp(1.5rem, 4vw, 2rem)",
    }}>
      {levels.map((level, i) => (
        <div key={level} style={{ display: "flex", alignItems: "center", gap: "clamp(0.875rem, 2vw, 1.75rem)" }}>
          <span style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.625rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: i === levels.length - 1
              ? "rgba(184,150,46,0.75)"
              : "rgba(200,200,200,0.45)",
            borderBottom: i === levels.length - 1
              ? "1px solid rgba(184,150,46,0.2)"
              : undefined,
            paddingBottom: i === levels.length - 1 ? "2px" : undefined,
          }}>
            {level}
          </span>
          {i < levels.length - 1 && (
            <span style={{
              color: "rgba(184,150,46,0.28)",
              fontSize: "0.625rem",
              letterSpacing: 0,
            }}>
              /
            </span>
          )}
        </div>
      ))}
    </Reveal>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CollectionSection() {
  const { t, locale } = useI18n();
  const w = t.works;
  const [works, setWorks] = useState<GalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setWorks(data as GalleryImage[]);
        setLoaded(true);
      });
  }, []);

  return (
    <section
      id="collection"
      style={{
        paddingTop: "clamp(5rem, 10vw, 9rem)",
        borderTop: "1px solid rgba(184,150,46,0.08)",
      }}
    >
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "clamp(3.5rem, 7vw, 6rem)",
        padding: "0 clamp(1.5rem, 4vw, 2rem)",
      }}>
        <Reveal>
          <p style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.625rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--cielo-gold-dim)",
            marginBottom: "1.375rem",
          }}>
            {w.label}
          </p>
          <RevealRule delay={0.1} />
        </Reveal>

        <Reveal delay={0.2} style={{ marginTop: "1.75rem" }}>
          <h2
            className="section-heading"
            style={{
              fontSize: "clamp(1.625rem, 3.5vw, 2.625rem)",
              letterSpacing: "0.08em",
              lineHeight: 1.25,
            }}
          >
            {w.heading}
          </h2>
        </Reveal>

        <CollectionHierarchy t={w} />
      </div>

      {/* Works */}
      {loaded && works.length > 0 ? (
        <div>
          {works.map((work, i) => (
            <WorkCard
              key={work.id}
              work={work}
              index={i}
              cta={w.cta}
              certLabel={w.certLabel}
              editionLabel={w.editionLabel}
              seriesLabel={w.seriesLabel}
              locale={locale}
            />
          ))}
        </div>
      ) : loaded ? (
        <EmptyState t={w} />
      ) : null}
    </section>
  );
}
