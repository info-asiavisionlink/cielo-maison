"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n, type Locale } from "@/contexts/i18n";

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "JP", label: "JP" },
  { code: "EN", label: "EN" },
  { code: "FR", label: "FR" },
  { code: "CN", label: "CN" },
  { code: "TH", label: "TH" },
];

export default function Header() {
  const { locale, t, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        // Luxury glass blur — always active, deepens on scroll
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        background: scrolled
          ? "rgba(4, 4, 4, 0.72)"
          : "rgba(4, 4, 4, 0.28)",
        borderBottom: "1px solid rgba(184, 150, 46, 0.1)",
        transition: "background 0.9s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 4vw, 3rem)",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          className="cielo-wordmark"
          style={{ fontSize: "1rem", textDecoration: "none", flexShrink: 0 }}
        >
          CIELO
        </Link>

        {/* ── Desktop Nav ── */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="desktop-nav"
        >
          <a href="#materials" className="nav-link cielo-hover">{t.nav.materials}</a>
          <a href="#collection" className="nav-link cielo-hover">{t.nav.works}</a>
          <a href="#membership" className="nav-link cielo-hover">{t.nav.membership}</a>
          <a href="#inquiry" className="nav-link-gold cielo-hover">{t.nav.privateInquiry}</a>
        </nav>

        {/* ── Language Switcher ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          {LANGUAGES.map((lang, i) => (
            <span
              key={lang.code}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <button
                onClick={() => setLocale(lang.code)}
                className={`lang-item${locale === lang.code ? " active" : ""}`}
              >
                {lang.label}
              </button>
              {i < LANGUAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    width: "1px",
                    height: "9px",
                    background: "rgba(184, 150, 46, 0.18)",
                    display: "inline-block",
                  }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
