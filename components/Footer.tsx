"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/contexts/i18n";

export default function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(184,150,46,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Lounge afterglow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(184,150,46,0.055) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 3vw, 3rem) clamp(3rem, 6vw, 5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.125rem" }}>
          <p className="cielo-wordmark" style={{ fontSize: "1.375rem" }}>CIELO</p>
          <p className="cielo-tagline" style={{ fontSize: "0.9375rem" }}>{f.tagline}</p>
        </div>

        <div style={{ width: "100%", maxWidth: "100px", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(184,150,46,0.4), transparent)" }} />

        <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <a href="#inquiry" className="nav-link-gold cielo-hover" style={{ fontSize: "0.5625rem" }}>
            {f.inquiry}
          </a>
          <span style={{ width: "1px", height: "9px", background: "rgba(184,150,46,0.18)" }} />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link cielo-hover"
            style={{ fontSize: "0.5625rem" }}
          >
            {f.instagram}
          </a>
        </nav>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.625rem" }}>
          <p style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.4375rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(200,200,200,0.18)",
          }}>
            © CIELO {year} — {f.operatedBy}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <a
              href="#maison-structure"
              style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontWeight: 300,
                fontSize: "0.375rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(200,200,200,0.12)",
                textDecoration: "none",
                transition: "color 0.4s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(200,200,200,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(200,200,200,0.12)")}
            >
              {f.maisonStructureLink}
            </a>
            <span style={{ color: "rgba(184,150,46,0.12)", fontSize: "0.375rem" }}>·</span>
            <a
              href="https://asiavision.link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontWeight: 300,
                fontSize: "0.375rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(200,200,200,0.12)",
                textDecoration: "none",
                transition: "color 0.4s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(200,200,200,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(200,200,200,0.12)")}
            >
              asiavision.link
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
