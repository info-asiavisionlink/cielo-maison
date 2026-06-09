"use client";

import { motion } from "framer-motion";
import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";

// ── Registry Seal SVG ────────────────────────────────────────────────────────
function RegistrySeal() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "64px", height: "64px" }}
    >
      <circle cx="40" cy="40" r="38" stroke="rgba(184,150,46,0.3)" strokeWidth="0.5" />
      <circle cx="40" cy="40" r="32" stroke="rgba(184,150,46,0.15)" strokeWidth="0.5" />
      <circle cx="40" cy="40" r="26" stroke="rgba(184,150,46,0.25)" strokeWidth="0.5" />
      {/* Eight-pointed star */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 40 + 20 * Math.cos(rad);
        const y1 = 40 + 20 * Math.sin(rad);
        const x2 = 40 + 26 * Math.cos(rad);
        const y2 = 40 + 26 * Math.sin(rad);
        return (
          <line
            key={angle}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(184,150,46,0.4)"
            strokeWidth="0.5"
          />
        );
      })}
      <text
        x="40" y="38"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "serif",
          fontSize: "8px",
          letterSpacing: "0.1em",
          fill: "rgba(184,150,46,0.7)",
        }}
      >
        CIELO
      </text>
      <text
        x="40" y="48"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "sans-serif",
          fontSize: "4px",
          letterSpacing: "0.15em",
          fill: "rgba(184,150,46,0.4)",
        }}
      >
        REGISTRY
      </text>
    </svg>
  );
}

// ── QR Code visual ────────────────────────────────────────────────────────────
const QR_PATTERN = [
  [1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1],
  [1,0,1,0,1,0,1],
  [1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1],
];
const QR_INNER = [
  [0,1,0,1,0],
  [1,0,1,0,1],
  [0,1,1,1,0],
  [1,0,0,1,1],
  [0,1,0,0,1],
];

function QRCode() {
  const cell = 6;
  const gold = "rgba(184,150,46,0.72)";
  const dim = "rgba(184,150,46,0.08)";

  return (
    <div
      aria-hidden="true"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "1px",
        padding: "10px",
        border: "1px solid rgba(184,150,46,0.2)",
        background: "rgba(4,4,4,0.7)",
      }}
    >
      {QR_PATTERN.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: "1px" }}>
          {row.map((c, ci) => (
            <div key={ci} style={{ width: cell, height: cell, background: c ? gold : dim }} />
          ))}
        </div>
      ))}
      <div style={{ marginTop: "1px", display: "flex", flexDirection: "column", gap: "1px" }}>
        {QR_INNER.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: "1px" }}>
            {row.map((c, ci) => (
              <div key={ci} style={{ width: cell, height: cell, background: c ? gold : dim }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ label, active = true }: { label: string; active?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <div style={{
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: active ? "rgba(184,150,46,0.72)" : "rgba(200,200,200,0.2)",
        flexShrink: 0,
      }} />
      <span style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: "0.5625rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: active ? "rgba(200,200,200,0.65)" : "rgba(200,200,200,0.3)",
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Certificate Card ──────────────────────────────────────────────────────────
function CertificateCard({ r }: { r: Record<string, string> }) {
  return (
    <div
      style={{
        border: "1px solid rgba(184,150,46,0.22)",
        padding: "clamp(1.75rem, 3vw, 2.75rem)",
        position: "relative",
        background: "rgba(5,5,5,0.7)",
      }}
    >
      {/* Corner accents — larger */}
      {[
        { top: "-1px", left: "-1px" },
        { top: "-1px", right: "-1px" },
        { bottom: "-1px", left: "-1px" },
        { bottom: "-1px", right: "-1px" },
      ].map((pos, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "14px",
            height: "14px",
            ...pos,
            borderTop: pos.top !== undefined ? "1px solid rgba(184,150,46,0.75)" : undefined,
            borderBottom: pos.bottom !== undefined ? "1px solid rgba(184,150,46,0.75)" : undefined,
            borderLeft: pos.left !== undefined ? "1px solid rgba(184,150,46,0.75)" : undefined,
            borderRight: pos.right !== undefined ? "1px solid rgba(184,150,46,0.75)" : undefined,
          }}
        />
      ))}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span className="cielo-wordmark" style={{ fontSize: "1rem" }}>CIELO</span>
          <span style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.4375rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(184,150,46,0.35)",
          }}>
            Maison de Luxe Spatial
          </span>
        </div>
        <RegistrySeal />
      </div>

      <hr className="gold-rule-full" style={{ marginBottom: "1.75rem" }} />

      {/* Certificate title */}
      <p style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: "0.4375rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(184,150,46,0.55)",
        marginBottom: "1.125rem",
      }}>
        {r.cert}
      </p>

      {/* Edition plate */}
      <div style={{ marginBottom: "0.375rem" }}>
        <p
          className="section-heading"
          style={{
            fontStyle: "italic",
            fontSize: "clamp(1.375rem, 2.8vw, 2rem)",
            lineHeight: 1.2,
          }}
        >
          Edition III of III
        </p>
      </div>

      <p style={{
        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: "1rem",
        color: "rgba(200,200,200,0.5)",
        marginBottom: "0.5rem",
        letterSpacing: "0.04em",
      }}>
        Surface and Light, No. 7
      </p>

      <p style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: "0.5rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(200,200,200,0.3)",
        marginBottom: "1.75rem",
      }}>
        Tokyo · 2025 · 1200 × 1600 mm · UV Acrylic
      </p>

      {/* Registry number */}
      <div style={{
        padding: "0.75rem 1rem",
        background: "rgba(184,150,46,0.04)",
        border: "1px solid rgba(184,150,46,0.1)",
        marginBottom: "1.75rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.4375rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(184,150,46,0.4)",
          }}>
            {r.regNum}
          </span>
          <span style={{
            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
            fontWeight: 300,
            fontSize: "0.875rem",
            letterSpacing: "0.1em",
            color: "rgba(184,150,46,0.65)",
          }}>
            № REG-2025-001
          </span>
        </div>
      </div>

      {/* Dashed separator */}
      <div style={{ borderTop: "1px dashed rgba(184,150,46,0.12)", marginBottom: "1.75rem" }} />

      {/* QR + status badges */}
      <div style={{ display: "flex", gap: "1.75rem", alignItems: "flex-start" }}>
        <QRCode />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "0.25rem" }}>
          <StatusBadge label={r.certified} />
          <StatusBadge label={r.secured} />
          <StatusBadge label={r.verified} />
          <StatusBadge label={r.archived} />
          <p style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.4375rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(184,150,46,0.3)",
            marginTop: "0.25rem",
          }}>
            {r.scan}
          </p>
        </div>
      </div>

      <hr className="gold-rule-full" style={{ margin: "1.75rem 0 1.375rem" }} />

      {/* Maison seal text */}
      <p style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: "0.5rem",
        letterSpacing: "0.08em",
        color: "rgba(200,200,200,0.22)",
        lineHeight: 1.9,
      }}>
        {r.certFooter}
      </p>
    </div>
  );
}

// ── Architectural presentation pillar ────────────────────────────────────────
function OwnershipPillar({
  number,
  title,
  body,
  delay,
}: {
  number: string;
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay }}
      viewport={{ once: true }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "clamp(1.75rem, 3vw, 2.5rem)",
        borderTop: "1px solid rgba(184,150,46,0.1)",
      }}
    >
      <span style={{
        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
        fontWeight: 300,
        fontSize: "clamp(2rem, 3.5vw, 3rem)",
        color: "rgba(184,150,46,0.12)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}>
        {number}
      </span>
      <span style={{
        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
        fontWeight: 300,
        fontSize: "clamp(1rem, 1.75vw, 1.375rem)",
        color: "var(--cielo-white)",
        letterSpacing: "0.06em",
        lineHeight: 1.3,
      }}>
        {title}
      </span>
      <p style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: "0.8125rem",
        letterSpacing: "0.04em",
        color: "rgba(200,200,200,0.45)",
        lineHeight: 1.9,
      }}>
        {body}
      </p>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function RegistrySection() {
  const { t } = useI18n();
  const r = t.registry;

  return (
    <section
      id="registry"
      style={{
        padding: "clamp(6rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem)",
        borderTop: "1px solid rgba(184, 150, 46, 0.08)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Section header */}
        <Reveal style={{ textAlign: "center", marginBottom: "clamp(4rem, 8vw, 6rem)" }}>
          <p style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.625rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--cielo-gold-dim)",
            marginBottom: "1.375rem",
          }}>
            {r.label}
          </p>
          <RevealRule delay={0.15} />
          <h2
            className="section-heading"
            style={{
              fontSize: "clamp(1.625rem, 3.5vw, 2.625rem)",
              marginTop: "1.75rem",
              letterSpacing: "0.08em",
              lineHeight: 1.25,
            }}
          >
            {r.heading}
          </h2>
          <Reveal delay={0.3}>
            <p style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              color: "rgba(200,200,200,0.45)",
              marginTop: "1.25rem",
              letterSpacing: "0.04em",
            }}>
              {r.subheading}
            </p>
          </Reveal>
        </Reveal>

        {/* Main grid: Certificate + Text */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(2.5rem, 5vw, 5rem)",
            alignItems: "start",
          }}
          className="registry-grid"
        >
          {/* Certificate */}
          <Reveal delay={0.1}>
            <CertificateCard r={r} />
          </Reveal>

          {/* Right: Text + Ownership pillars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <Reveal delay={0.2}>
              <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1rem)", lineHeight: 2 }}>
                {r.p1}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1rem)", lineHeight: 2 }}>
                {r.p2}
              </p>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.4}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                border: "1px solid rgba(184,150,46,0.12)",
              }}>
                {[
                  { value: r.stat1, label: r.stat1Label },
                  { value: r.stat2, label: r.stat2Label },
                  { value: r.stat3, label: r.stat3Label },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "1.625rem 1rem",
                      textAlign: "center",
                      borderRight: i < 2 ? "1px solid rgba(184,150,46,0.12)" : undefined,
                    }}
                  >
                    <p className="cielo-wordmark" style={{ fontSize: "1.375rem", marginBottom: "0.5rem" }}>
                      {item.value}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-inter, Inter, sans-serif)",
                      fontWeight: 300,
                      fontSize: "0.4375rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(200,200,200,0.32)",
                    }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Ownership architecture — 3 pillars */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "rgba(184,150,46,0.06)",
          marginTop: "clamp(4rem, 8vw, 7rem)",
        }}
          className="ownership-pillars"
        >
          <OwnershipPillar
            number="I"
            title={r.pillar1Title}
            body={r.pillar1Body}
            delay={0}
          />
          <OwnershipPillar
            number="II"
            title={r.pillar2Title}
            body={r.pillar2Body}
            delay={0.1}
          />
          <OwnershipPillar
            number="III"
            title={r.pillar3Title}
            body={r.pillar3Body}
            delay={0.2}
          />
        </div>

        {/* Transfer protocol */}
        <Reveal delay={0.3} style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }}>
          <div style={{
            padding: "clamp(1.75rem, 3.5vw, 2.75rem) clamp(1.75rem, 3.5vw, 2.75rem)",
            borderLeft: "1px solid rgba(184,150,46,0.25)",
            background: "rgba(184,150,46,0.02)",
          }}>
            <p style={{
              fontFamily: "var(--font-inter, Inter, sans-serif)",
              fontWeight: 300,
              fontSize: "0.5rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(184,150,46,0.55)",
              marginBottom: "0.875rem",
            }}>
              {r.transfer}
            </p>
            <p className="body-text" style={{ fontSize: "0.9375rem", lineHeight: 1.9 }}>
              {r.transferBody}
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
