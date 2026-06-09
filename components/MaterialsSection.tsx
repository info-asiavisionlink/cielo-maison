"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";

const ACRYLIC_IMAGE =
  "https://res.cloudinary.com/deyc8gz2k/image/upload/v1781038903/kowlpc3yshicrkzzv86v.png";
const ALUMINUM_IMAGE =
  "https://res.cloudinary.com/deyc8gz2k/image/upload/v1781038901/vnlvuxvedvljbml2nkdq.png";

// ── Material image panel ──────────────────────────────────────────────────────
function MaterialImagePanel({
  src,
  alt,
  number,
  reverse,
}: {
  src: string;
  alt: string;
  number: string;
  reverse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      style={{
        position: "relative",
        gridColumn: reverse ? 2 : 1,
        gridRow: 1,
        minHeight: "520px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem, 4vw, 3.5rem)",
        background: "rgba(4,4,4,0.6)",
      }}
      className="material-image-panel"
    >
      {/* Ambient background glow behind image */}
      <div
        style={{
          position: "absolute",
          inset: "20%",
          background: reverse
            ? "radial-gradient(ellipse at 50% 50%, rgba(184,150,46,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(184,150,46,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Image container with gold edge */}
      <motion.div
        whileHover={{ scale: 1.008 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          aspectRatio: "4 / 3",
          boxShadow: reverse
            ? "0 8px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(184,150,46,0.18)"
            : "0 8px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(184,150,46,0.22)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={90}
          sizes="(max-width: 768px) 100vw, 45vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority={number === "01"}
        />

        {/* Hover shimmer overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute",
            inset: 0,
            background: reverse
              ? "linear-gradient(135deg, rgba(200,200,200,0.04) 0%, transparent 60%)"
              : "linear-gradient(135deg, rgba(184,150,46,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Cinematic shadow vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.45) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Material number — bottom corner */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(1.25rem, 2.5vw, 2rem)",
          [reverse ? "right" : "left"]: "clamp(1.25rem, 2.5vw, 2rem)",
          fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
          fontWeight: 300,
          fontSize: "clamp(4rem, 7vw, 6.5rem)",
          color: "rgba(184,150,46,0.1)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {number}
      </div>
    </motion.div>
  );
}

// ── Spatial impression words ──────────────────────────────────────────────────
function ImpressionWords({ words }: { words: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem 1.5rem" }}>
      {words.map((word) => (
        <span
          key={word}
          style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.5rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(184,150,46,0.5)",
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

// ── Single material row ───────────────────────────────────────────────────────
function MaterialRow({
  number,
  label,
  title,
  spatial,
  body,
  impressions,
  src,
  alt,
  reverse,
  delay,
}: {
  number: string;
  label: string;
  title: string;
  spatial: string;
  body: string;
  impressions: string[];
  src: string;
  alt: string;
  reverse?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: delay ?? 0 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderTop: "1px solid rgba(184,150,46,0.07)",
      }}
      className="material-card"
    >
      {/* Image panel */}
      <MaterialImagePanel src={src} alt={alt} number={number} reverse={reverse} />

      {/* Text panel */}
      <div
        style={{
          gridColumn: reverse ? 1 : 2,
          gridRow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(3rem, 6vw, 6rem) clamp(3rem, 6vw, 7rem)",
          gap: "clamp(1.75rem, 3vw, 2.5rem)",
        }}
      >
        {/* Label + rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "24px", height: "1px", background: "rgba(184,150,46,0.45)" }} />
          <span style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.5rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--cielo-gold-dim)",
          }}>
            {label}
          </span>
        </div>

        {/* Title */}
        <h3
          className="section-heading"
          style={{
            fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
            letterSpacing: "0.05em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>

        {/* Spatial character — one line, large italic */}
        <p style={{
          fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
          color: "rgba(200,200,200,0.55)",
          letterSpacing: "0.04em",
          lineHeight: 1.5,
          borderLeft: "1px solid rgba(184,150,46,0.2)",
          paddingLeft: "1.25rem",
        }}>
          {spatial}
        </p>

        {/* Body — kept short */}
        <p
          className="body-text"
          style={{
            fontSize: "clamp(0.875rem, 1.3vw, 0.9375rem)",
            lineHeight: 2.1,
            letterSpacing: "0.04em",
            maxWidth: "440px",
          }}
        >
          {body}
        </p>

        {/* Impression words */}
        <ImpressionWords words={impressions} />
      </div>
    </motion.div>
  );
}

// ── Format dimensions ─────────────────────────────────────────────────────────
function FormatsGrid({ t }: { t: Record<string, string> }) {
  const formats = [
    { name: "Standard", dim: "900 × 1200 mm", desc: t.fmtStdDesc },
    { name: "Grand",    dim: "1200 × 1600 mm", desc: t.fmtGrandDesc },
    { name: "Signature", dim: t.fmtSigDim,     desc: t.fmtSigDesc },
  ];

  return (
    <Reveal delay={0.15} style={{
      padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)",
      borderTop: "1px solid rgba(184,150,46,0.07)",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontWeight: 300,
          fontSize: "0.5rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--cielo-gold-dim)",
          textAlign: "center",
          marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}>
          {t.formatsLabel}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(184,150,46,0.07)",
          }}
          className="formats-grid"
        >
          {formats.map((fmt) => (
            <motion.div
              key={fmt.name}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                background: "rgba(5,5,5,0.8)",
                padding: "clamp(2rem, 4vw, 3rem) clamp(1.75rem, 3vw, 2.5rem)",
                display: "flex",
                flexDirection: "column",
                gap: "1.125rem",
              }}
            >
              <p style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontWeight: 300,
                fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                color: "var(--cielo-white)",
                letterSpacing: "0.06em",
              }}>
                {fmt.name}
              </p>
              <p style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontWeight: 300,
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                color: "var(--cielo-gold-dim)",
              }}>
                {fmt.dim}
              </p>
              <p style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontWeight: 300,
                fontSize: "0.8125rem",
                letterSpacing: "0.04em",
                color: "rgba(200,200,200,0.4)",
                lineHeight: 1.9,
              }}>
                {fmt.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── Installation pillars ──────────────────────────────────────────────────────
function InstallationGrid({ t }: { t: Record<string, string> }) {
  const pillars = [
    { label: t.install1, desc: t.install1Desc },
    { label: t.install2, desc: t.install2Desc },
    { label: t.install3, desc: t.install3Desc },
    { label: t.install4, desc: t.install4Desc },
  ];

  return (
    <Reveal delay={0.1} style={{
      padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)",
      borderTop: "1px solid rgba(184,150,46,0.07)",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <p style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.5rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--cielo-gold-dim)",
            marginBottom: "1.375rem",
          }}>
            {t.installLabel}
          </p>
          <h3
            className="section-heading"
            style={{
              fontSize: "clamp(1.375rem, 2.5vw, 2rem)",
              letterSpacing: "0.08em",
            }}
          >
            {t.installHeading}
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid rgba(184,150,46,0.08)",
          }}
          className="install-grid"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 * i }}
              viewport={{ once: true }}
              style={{
                padding: "clamp(1.75rem, 3vw, 2.5rem) clamp(1.25rem, 2vw, 2rem)",
                borderRight: i < 3 ? "1px solid rgba(184,150,46,0.07)" : undefined,
                borderBottom: "1px solid rgba(184,150,46,0.07)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <span style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontWeight: 300,
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                color: "var(--cielo-white)",
                letterSpacing: "0.05em",
              }}>
                {p.label}
              </span>
              <p style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontWeight: 300,
                fontSize: "0.8125rem",
                letterSpacing: "0.04em",
                color: "rgba(200,200,200,0.42)",
                lineHeight: 1.95,
              }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function MaterialsSection() {
  const { t } = useI18n();
  const m = t.materials;

  return (
    <section
      id="materials"
      style={{ borderTop: "1px solid rgba(184,150,46,0.07)" }}
    >
      {/* Section header */}
      <div style={{
        padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vw, 6rem)",
        textAlign: "center",
        maxWidth: "720px",
        margin: "0 auto",
      }}>
        <Reveal>
          <p style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.5625rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--cielo-gold-dim)",
            marginBottom: "1.5rem",
          }}>
            {m.label}
          </p>
          <RevealRule delay={0.1} />
        </Reveal>

        <Reveal delay={0.2} style={{ marginTop: "2rem" }}>
          <h2
            className="section-heading"
            style={{
              fontSize: "clamp(1.75rem, 3.8vw, 3rem)",
              lineHeight: 1.2,
              letterSpacing: "0.08em",
              marginBottom: "2.25rem",
            }}
          >
            {m.heading}
          </h2>
          <p
            className="body-text"
            style={{
              fontSize: "clamp(0.9rem, 1.4vw, 1rem)",
              lineHeight: 2.2,
              letterSpacing: "0.05em",
              color: "rgba(200,200,200,0.55)",
            }}
          >
            {m.intro}
          </p>
        </Reveal>
      </div>

      {/* Material 01 — Acrylic UV Print */}
      <MaterialRow
        number="01"
        label={m.m1Label}
        title={m.m1Title}
        spatial={m.m1Spatial}
        body={m.m1Body}
        impressions={[m.m1i1, m.m1i2, m.m1i3, m.m1i4]}
        src={ACRYLIC_IMAGE}
        alt="Acrylic UV Print — CIELO Material 01"
        delay={0}
      />

      {/* Material 02 — Aluminum Composite UV Print */}
      <MaterialRow
        number="02"
        label={m.m2Label}
        title={m.m2Title}
        spatial={m.m2Spatial}
        body={m.m2Body}
        impressions={[m.m2i1, m.m2i2, m.m2i3, m.m2i4]}
        src={ALUMINUM_IMAGE}
        alt="Aluminum Composite UV Print — CIELO Material 02"
        reverse
        delay={0.05}
      />

      {/* Formats */}
      <FormatsGrid t={m} />

      {/* Installation */}
      <InstallationGrid t={m} />
    </section>
  );
}
