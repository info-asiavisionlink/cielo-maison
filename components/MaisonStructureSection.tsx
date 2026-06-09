"use client";

import { motion } from "framer-motion";
import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";

// ── Architectural divider ─────────────────────────────────────────────────────
function ArchDivider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay }}
      viewport={{ once: true }}
      style={{
        width: "100%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(184,150,46,0.22), rgba(184,150,46,0.12), transparent)",
        transformOrigin: "left",
      }}
    />
  );
}

// ── Engraved label ────────────────────────────────────────────────────────────
function Engraved({
  children,
  size = "sm",
}: {
  children: React.ReactNode;
  size?: "sm" | "xs";
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontWeight: 300,
        fontSize: size === "sm" ? "0.5625rem" : "0.4375rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(200,200,200,0.32)",
        display: "block",
      }}
    >
      {children}
    </span>
  );
}

// ── Roman numeral BG marker ───────────────────────────────────────────────────
function RomanMarker({ n }: { n: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
        fontWeight: 300,
        fontSize: "clamp(5rem, 8vw, 8rem)",
        color: "rgba(184,150,46,0.06)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
        userSelect: "none",
        pointerEvents: "none",
        position: "absolute",
        top: "clamp(1rem, 2vw, 2rem)",
        right: "clamp(1rem, 2vw, 2rem)",
      }}
    >
      {n}
    </div>
  );
}

// ── Entity block ──────────────────────────────────────────────────────────────
function EntityBlock({
  roman,
  entityLabel,
  name,
  role,
  descriptor,
  microCopy,
  pillars,
  delay,
  bordered,
}: {
  roman: string;
  entityLabel: string;
  name: string;
  role: string;
  descriptor: string;
  microCopy: string;
  pillars: string[];
  delay: number;
  bordered?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay }}
      viewport={{ once: true, margin: "-60px" }}
      style={{
        position: "relative",
        padding: "clamp(3rem, 5vw, 5rem) clamp(2.5rem, 4vw, 4.5rem)",
        borderLeft: bordered ? "1px solid rgba(184,150,46,0.1)" : undefined,
        display: "flex",
        flexDirection: "column",
        gap: "clamp(1.75rem, 3.5vw, 2.75rem)",
      }}
    >
      <RomanMarker n={roman} />

      <Engraved size="xs">{entityLabel}</Engraved>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3
          className="section-heading"
          style={{
            fontSize: "clamp(1.375rem, 2.5vw, 2rem)",
            letterSpacing: "0.12em",
            lineHeight: 1.15,
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(0.875rem, 1.4vw, 1.0625rem)",
            color: "rgba(200,200,200,0.4)",
            letterSpacing: "0.05em",
          }}
        >
          {role}
        </p>
      </div>

      <p
        style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontWeight: 300,
          fontSize: "clamp(0.8125rem, 1.25vw, 0.9375rem)",
          letterSpacing: "0.04em",
          color: "rgba(200,200,200,0.45)",
          lineHeight: 2.1,
          maxWidth: "420px",
          wordBreak: "break-word",
        }}
      >
        {descriptor}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem" }}>
        {pillars.map((p) => (
          <span
            key={p}
            style={{
              fontFamily: "var(--font-inter, Inter, sans-serif)",
              fontWeight: 300,
              fontSize: "0.5rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(184,150,46,0.45)",
              wordBreak: "keep-all",
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <p
        style={{
          fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)",
          color: "rgba(200,200,200,0.28)",
          letterSpacing: "0.05em",
          lineHeight: 1.6,
          borderLeft: "1px solid rgba(184,150,46,0.15)",
          paddingLeft: "1.25rem",
          marginTop: "auto",
          wordBreak: "break-word",
        }}
      >
        {microCopy}
      </p>
    </motion.div>
  );
}

// ── Business domains ──────────────────────────────────────────────────────────
function BusinessDomains() {
  const { t } = useI18n();
  const ms = t.maisonStructure;

  const domains = [
    { index: "01", title: ms.d01Title, body: ms.d01Body },
    { index: "02", title: ms.d02Title, body: ms.d02Body },
    { index: "03", title: ms.d03Title, body: ms.d03Body },
    { index: "04", title: ms.d04Title, body: ms.d04Body },
    { index: "05", title: ms.d05Title, body: ms.d05Body },
    { index: "06", title: ms.d06Title, body: ms.d06Body },
  ];

  return (
    <Reveal
      delay={0.1}
      style={{
        padding: "clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)",
        borderTop: "1px solid rgba(184,150,46,0.07)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Engraved size="xs">{ms.domainsLabel}</Engraved>
        <div
          style={{
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(184,150,46,0.06)",
          }}
          className="domains-grid"
        >
          {domains.map((d, i) => (
            <motion.div
              key={d.index}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.07 * i }}
              viewport={{ once: true }}
              style={{
                background: "rgba(4,4,4,0.7)",
                padding: "clamp(1.75rem, 3vw, 2.5rem) clamp(1.5rem, 2.5vw, 2rem)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontWeight: 300,
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  color: "rgba(184,150,46,0.08)",
                  lineHeight: 1,
                  position: "absolute",
                  top: "1rem",
                  right: "1.25rem",
                  userSelect: "none",
                }}
              >
                {d.index}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontWeight: 300,
                  fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                  color: "var(--cielo-white)",
                  letterSpacing: "0.05em",
                  lineHeight: 1.3,
                }}
              >
                {d.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                  fontWeight: 300,
                  fontSize: "0.8125rem",
                  letterSpacing: "0.04em",
                  color: "rgba(200,200,200,0.38)",
                  lineHeight: 1.95,
                  wordBreak: "break-word",
                }}
              >
                {d.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── Corporate information ─────────────────────────────────────────────────────
function CorporateInformation() {
  const { t } = useI18n();
  const ms = t.maisonStructure;

  const fields = [
    { label: ms.corpF1Label, value: ms.corpF1Value },
    { label: ms.corpF2Label, value: ms.corpF2Value },
    { label: ms.corpF3Label, value: ms.corpF3Value },
    { label: ms.corpF4Label, value: ms.corpF4Value },
    { label: ms.corpF5Label, value: ms.corpF5Value },
    { label: ms.corpF6Label, value: ms.corpF6Value },
  ];

  return (
    <Reveal
      delay={0.2}
      style={{
        padding: "clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)",
        borderTop: "1px solid rgba(184,150,46,0.07)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Engraved size="xs">{ms.corpLabel}</Engraved>
        <div
          style={{
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(184,150,46,0.06)",
          }}
          className="corp-info-grid"
        >
          {fields.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.06 * i }}
              viewport={{ once: true }}
              style={{
                background: "rgba(4,4,4,0.7)",
                padding: "clamp(1.5rem, 2.5vw, 2.25rem) clamp(1.25rem, 2vw, 2rem)",
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              <Engraved size="xs">{f.label}</Engraved>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontWeight: 300,
                  fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)",
                  color: "rgba(200,200,200,0.6)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                {f.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── Closing statement ─────────────────────────────────────────────────────────
function ClosingStatement() {
  const { t } = useI18n();
  const ms = t.maisonStructure;

  return (
    <Reveal
      delay={0.15}
      style={{
        padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem)",
        borderTop: "1px solid rgba(184,150,46,0.07)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(1.25rem, 3vw, 2.5rem)",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "60px",
            background: "linear-gradient(to bottom, transparent, rgba(184,150,46,0.25))",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
            color: "rgba(200,200,200,0.3)",
            letterSpacing: "0.06em",
            lineHeight: 1.8,
            wordBreak: "break-word",
          }}
        >
          {ms.closingL1}
          <br />
          {ms.closingL2}
        </p>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(184,150,46,0.2), transparent)",
          }}
        />
        <Engraved size="xs">{ms.closingCredit}</Engraved>
      </div>
    </Reveal>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function MaisonStructureSection() {
  const { t } = useI18n();
  const ms = t.maisonStructure;

  return (
    <section
      id="maison-structure"
      style={{ borderTop: "1px solid rgba(184,150,46,0.07)" }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)",
          textAlign: "center",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <Reveal>
          <Engraved>{ms.sectionLabel}</Engraved>
          <div style={{ marginTop: "1.5rem" }}>
            <RevealRule delay={0.1} />
          </div>
        </Reveal>

        <Reveal delay={0.2} style={{ marginTop: "2rem" }}>
          <h2
            className="section-heading"
            style={{
              fontSize: "clamp(1.625rem, 3.5vw, 2.75rem)",
              letterSpacing: "0.08em",
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            {ms.headingL1}
            <br />
            {ms.headingL2}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter, Inter, sans-serif)",
              fontWeight: 300,
              fontSize: "clamp(0.8125rem, 1.3vw, 0.9375rem)",
              letterSpacing: "0.05em",
              color: "rgba(200,200,200,0.38)",
              lineHeight: 2.1,
              wordBreak: "break-word",
            }}
          >
            {ms.subL1}
            <br />
            {ms.subL2}
          </p>
        </Reveal>
      </div>

      <ArchDivider delay={0.3} />

      {/* Two entity columns */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "rgba(184,150,46,0.07)",
          }}
          className="entity-grid"
        >
          <EntityBlock
            roman="I"
            entityLabel={ms.cieloEntityLabel}
            name="CIELO"
            role={ms.cieloRole}
            descriptor={ms.cieloDesc}
            microCopy={ms.cieloMicro}
            pillars={[ms.cieloPillar1, ms.cieloPillar2, ms.cieloPillar3, ms.cieloPillar4]}
            delay={0.1}
          />
          <EntityBlock
            roman="II"
            entityLabel={ms.avlEntityLabel}
            name="ASIA VISION LINK"
            role={ms.avlRole}
            descriptor={ms.avlDesc}
            microCopy={ms.avlMicro}
            pillars={[ms.avlPillar1, ms.avlPillar2, ms.avlPillar3, ms.avlPillar4]}
            delay={0.2}
            bordered
          />
        </div>
      </div>

      <ArchDivider delay={0.2} />

      <BusinessDomains />
      <CorporateInformation />
      <ClosingStatement />
    </section>
  );
}
