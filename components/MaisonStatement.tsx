"use client";

import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";

export default function MaisonStatement() {
  const { t } = useI18n();
  const m = t.maison;

  return (
    <section
      style={{
        maxWidth: "780px",
        margin: "0 auto",
        padding: "clamp(6rem, 12vw, 10rem) clamp(1.5rem, 5vw, 2rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "2.75rem",
      }}
    >
      <Reveal>
        <p style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontWeight: 300,
          fontSize: "0.625rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--cielo-gold-dim)",
          marginBottom: "1.25rem",
        }}>
          {m.label}
        </p>
        <RevealRule delay={0.15} />
      </Reveal>

      <Reveal delay={0.2}>
        <h2
          className="section-heading"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.3 }}
        >
          {m.heading}
        </h2>
      </Reveal>

      <Reveal delay={0.3} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}>
          {m.p1}
        </p>
        <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}>
          {m.p2}
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <RevealRule />
      </Reveal>
    </section>
  );
}
