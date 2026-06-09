"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";
import { supabase, type GalleryImage } from "@/lib/supabase";

export default function WorksSection() {
  const { t } = useI18n();
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
      id="works"
      style={{
        padding: "clamp(5rem, 10vw, 9rem) 0",
        borderTop: "1px solid rgba(184,150,46,0.08)",
      }}
    >
      <Reveal style={{
        textAlign: "center",
        marginBottom: "clamp(4rem, 8vw, 7rem)",
        padding: "0 clamp(1.5rem, 4vw, 2rem)",
      }}>
        <p style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontWeight: 300,
          fontSize: "0.625rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--cielo-gold-dim)",
          marginBottom: "1.25rem",
        }}>
          {w.label}
        </p>
        <RevealRule delay={0.1} />
        <h2 className="section-heading" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", marginTop: "1.5rem" }}>
          {w.heading}
        </h2>
      </Reveal>

      {loaded && works.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {works.map((work, i) => <WorkCard key={work.id} work={work} index={i} cta={w.cta} />)}
        </div>
      ) : loaded ? (
        <EmptyWorksState t={w} />
      ) : null}
    </section>
  );
}

function WorkCard({ work, index, cta }: { work: GalleryImage; index: number; cta: string }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "65vh",
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
          minHeight: "460px",
        }}
      >
        <Image
          src={work.image_url}
          alt={work.title ?? "CIELO Work"}
          fill
          quality={80}
          sizes="50vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))",
        }} />
      </div>

      {/* Caption */}
      <div
        style={{
          gridColumn: isLeft ? 2 : 1,
          gridRow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(2.5rem, 5vw, 5rem) clamp(2.5rem, 6vw, 6.5rem)",
          gap: "1.625rem",
        }}
      >
        <div style={{ width: "32px", height: "1px", background: "rgba(184,150,46,0.5)" }} />
        {work.title && (
          <h3 className="work-title" style={{ fontSize: "clamp(1.375rem, 2.5vw, 2rem)", lineHeight: 1.3 }}>
            {work.title}
          </h3>
        )}
        {work.description && (
          <p className="work-caption" style={{ lineHeight: 1.8 }}>{work.description}</p>
        )}
        <a href="#inquiry" className="cta-link" style={{ display: "inline-block", marginTop: "0.375rem" }}>
          {cta}
        </a>
      </div>
    </motion.article>
  );
}

function EmptyWorksState({ t }: { t: { empty: string; emptyBody: string; cta: string } }) {
  return (
    <Reveal style={{
      textAlign: "center",
      padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 4vw, 2rem)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
    }}>
      <div style={{ width: "32px", height: "1px", background: "rgba(184,150,46,0.5)" }} />
      <p className="section-heading" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontStyle: "italic" }}>
        {t.empty}
      </p>
      <p className="body-text" style={{ maxWidth: "480px", fontSize: "0.9375rem" }}>{t.emptyBody}</p>
      <a href="#inquiry" className="cta-link">{t.cta}</a>
    </Reveal>
  );
}
