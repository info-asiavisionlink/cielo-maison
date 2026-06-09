"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { supabase, type GalleryImage } from "@/lib/supabase";
import { useI18n } from "@/contexts/i18n";
import { localizedTitle } from "@/lib/gallery-i18n";

const INTERVAL = 5000; // 5s — cinematic pace
const FADE_DURATION = "2.8s";

export default function HeroSlider() {
  const { t, locale } = useI18n();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("*")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setImages(data as GalleryImage[]);
        setLoaded(true);
      });
  }, []);

  const next = useCallback(() => {
    if (images.length > 1) setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [images.length, next]);

  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "600px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Slides ── */}
      {loaded && images.map((img, i) => (
        <div
          key={img.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
            transition: `opacity ${FADE_DURATION} ease`,
          }}
        >
          <Image
            src={img.image_url}
            alt={localizedTitle(img, locale) ?? "CIELO"}
            fill
            priority={i === 0}
            quality={85}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      ))}

      {/* ── Cinematic overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,.22) 45%, rgba(0,0,0,.78) 100%)",
        }}
      />

      {/* ── Lateral vignette ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "linear-gradient(to right, rgba(0,0,0,.4) 0%, transparent 20%, transparent 80%, rgba(0,0,0,.4) 100%)",
        }}
      />

      {/* ── Hero content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.75rem",
          padding: "0 2rem",
        }}
      >
        <p
          className="cielo-wordmark"
          style={{ fontSize: "clamp(2.25rem, 7vw, 5rem)" }}
        >
          CIELO
        </p>
        <div
          style={{ width: "36px", height: "1px", background: "rgba(184,150,46,0.6)" }}
        />
        <p
          className="cielo-tagline"
          style={{ fontSize: "clamp(0.9rem, 2vw, 1.125rem)" }}
        >
          {t.hero.tagline}
        </p>
      </div>

      {/* ── Slide dots ── */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "2.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? "28px" : "5px",
                height: "1px",
                background: i === current
                  ? "rgba(184,150,46,0.85)"
                  : "rgba(255,255,255,0.25)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.7s ease, background 0.5s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Scroll label ── */}
      <div
        style={{
          position: "absolute",
          bottom: "2.25rem",
          right: "clamp(1.5rem, 3vw, 3rem)",
          zIndex: 10,
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.5rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(200,200,200,0.3)",
            animation: "scrollPulse 3s ease-in-out infinite",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
