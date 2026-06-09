"use client";

import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";

export default function WorldSection() {
  const { t } = useI18n();
  const w = t.world;
  const locs = [w.locations.tokyo, w.locations.paris];

  return (
    <section
      style={{
        padding: "clamp(6rem, 12vw, 10rem) clamp(1.5rem, 5vw, 2rem)",
        borderTop: "1px solid rgba(184,150,46,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.75rem", maxWidth: "640px", textAlign: "center", width: "100%" }}>
        <p style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontWeight: 300,
          fontSize: "0.625rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--cielo-gold-dim)",
        }}>
          {w.label}
        </p>

        <RevealRule delay={0.1} />

        <h2 className="section-heading" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
          {w.heading}
        </h2>

        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "440px",
          border: "1px solid rgba(184,150,46,0.1)",
        }}>
          {locs.map((loc, i) => (
            <div
              key={loc.city}
              style={{
                padding: "1.875rem 2.25rem",
                borderBottom: i < locs.length - 1 ? "1px solid rgba(184,150,46,0.08)" : undefined,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <p className="section-heading" style={{ fontSize: "1.0625rem", letterSpacing: "0.1em" }}>
                {loc.city}
              </p>
              <p style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontWeight: 300,
                fontSize: "0.5rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--cielo-gold-dim)",
              }}>
                {loc.status}
              </p>
              <p className="cielo-tagline" style={{ fontSize: "0.875rem", color: "rgba(200,200,200,0.5)" }}>
                {loc.note}
              </p>
            </div>
          ))}
        </div>

        <p className="body-text" style={{ fontSize: "0.9375rem", color: "rgba(200,200,200,0.45)" }}>
          {w.body}
        </p>
      </Reveal>
    </section>
  );
}
