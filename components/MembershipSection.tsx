"use client";

import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";

export default function MembershipSection() {
  const { t } = useI18n();
  const m = t.membership;

  const tiers = [
    { key: "silver", data: m.tiers.silver, className: "tier-silver" },
    { key: "gold",   data: m.tiers.gold,   className: "tier-gold"   },
    { key: "platinum",data: m.tiers.platinum,className: "tier-platinum"},
    { key: "diamond",data: m.tiers.diamond, className: "tier-diamond"},
  ];

  return (
    <section
      id="membership"
      style={{
        padding: "clamp(6rem, 12vw, 10rem) clamp(1.5rem, 5vw, 2rem)",
        borderTop: "1px solid rgba(184, 150, 46, 0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1060px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(3rem, 6vw, 6rem)",
          alignItems: "start",
        }}
        className="membership-grid"
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
          <Reveal>
            <p style={{
              fontFamily: "var(--font-inter, Inter, sans-serif)",
              fontWeight: 300,
              fontSize: "0.625rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--cielo-gold-dim)",
            }}>
              {m.label}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="section-heading" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.35 }}>
              {m.heading}
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1rem)" }}>
              {m.p1}
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1rem)" }}>
              {m.p2}
            </p>
          </Reveal>
          <Reveal delay={0.34}>
            <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1rem)" }}>
              {m.p3}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <a href="#inquiry" className="cta-link">{m.cta}</a>
          </Reveal>
        </div>

        {/* Right — Tiers */}
        <Reveal delay={0.2}>
          <div style={{ border: "1px solid rgba(184,150,46,0.1)" }}>
            {tiers.map((tier, i) => (
              <div
                key={tier.key}
                style={{
                  padding: "1.875rem 2.25rem",
                  borderBottom: i < tiers.length - 1
                    ? "1px solid rgba(184,150,46,0.08)" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                <p className={`section-heading ${tier.className}`}
                  style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {tier.data.name}
                </p>
                <p style={{
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                  fontWeight: 300,
                  fontSize: "0.625rem",
                  letterSpacing: "0.06em",
                  color: "rgba(200,200,200,0.45)",
                }}>
                  {tier.data.range}
                </p>
                <p className="cielo-tagline" style={{ fontSize: "0.875rem", color: "rgba(200,200,200,0.65)" }}>
                  {tier.data.character}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
