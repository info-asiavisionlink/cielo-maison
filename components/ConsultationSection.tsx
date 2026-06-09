"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Reveal, RevealRule } from "@/components/Reveal";
import { useI18n } from "@/contexts/i18n";

type FormState = "idle" | "sending" | "sent" | "error";

const INPUT_BASE: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(184,150,46,0.2)",
  padding: "0.625rem 0",
  color: "var(--cielo-white)",
  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
  fontWeight: 300,
  fontSize: "1.0625rem",
  letterSpacing: "0.04em",
  outline: "none",
  width: "100%",
  transition: "border-color 0.5s ease, opacity 0.4s ease",
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-inter, Inter, sans-serif)",
  fontWeight: 300,
  fontSize: "0.5625rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "rgba(200,200,200,0.38)",
};

export default function ConsultationSection() {
  const { t } = useI18n();
  const c = t.consultation;
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", contact: "", inquiry: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending" || state === "sent") return;
    setState("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? c.error); setState("error"); return; }
      setState("sent");
    } catch {
      setErrorMsg(c.error);
      setState("error");
    }
  }

  return (
    <section
      id="inquiry"
      style={{
        padding: "clamp(6rem, 12vw, 10rem) clamp(1.5rem, 5vw, 2rem)",
        borderTop: "1px solid rgba(184,150,46,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", maxWidth: "620px", width: "100%" }}>
        <Reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", width: "100%", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontWeight: 300,
            fontSize: "0.625rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--cielo-gold-dim)",
          }}>
            {c.label}
          </p>
          <RevealRule delay={0.1} />
          <h2 className="section-heading" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.375rem)", lineHeight: 1.3 }}>
            {c.heading}
          </h2>
          <p className="body-text" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1rem)" }}>
            {c.body}
          </p>
        </Reveal>

        {/* Form area */}
        <div style={{ width: "100%", position: "relative", minHeight: "300px" }}>
          <AnimatePresence mode="wait">
            {state === "sent" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "4rem 2rem",
                  border: "1px solid rgba(184,150,46,0.14)",
                  textAlign: "center",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  style={{ height: "1px", background: "rgba(184,150,46,0.5)" }}
                />
                <p className="section-heading" style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)", fontStyle: "italic", fontWeight: 300 }}>
                  {c.success}
                </p>
                <p className="body-text" style={{ fontSize: "0.875rem", color: "rgba(200,200,200,0.45)", maxWidth: "320px" }}>
                  {c.successSub}
                </p>
                <p className="cielo-wordmark" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>CIELO</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", gap: "2.25rem", width: "100%" }}
              >
                <Field label={c.fields.name} value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} disabled={state === "sending"} />
                <Field label={c.fields.contact} value={form.contact} onChange={(v) => setForm(f => ({ ...f, contact: v }))} disabled={state === "sending"} />
                <Textarea label={c.fields.inquiry} value={form.inquiry} onChange={(v) => setForm(f => ({ ...f, inquiry: v }))} disabled={state === "sending"} />

                <p style={{
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                  fontWeight: 300,
                  fontSize: "0.5625rem",
                  letterSpacing: "0.1em",
                  color: "rgba(200,200,200,0.25)",
                  textAlign: "center",
                  lineHeight: 1.8,
                }}>
                  {c.privacy}
                </p>

                <AnimatePresence>
                  {state === "error" && errorMsg && (
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        textAlign: "center",
                        fontFamily: "var(--font-inter, Inter, sans-serif)",
                        fontWeight: 300,
                        fontSize: "0.625rem",
                        letterSpacing: "0.12em",
                        color: "rgba(200,200,200,0.4)",
                      }}
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="cta-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: state === "sending" ? "default" : "pointer",
                      padding: "0.75rem 0",
                      position: "relative",
                      opacity: state === "sending" ? 0.45 : 1,
                      transition: "opacity 0.4s ease",
                    }}
                  >
                    <motion.span key={state} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                      {state === "sending" ? c.sending : c.send}
                    </motion.span>
                    {state === "sending" && (
                      <motion.span
                        style={{ display: "block", height: "1px", background: "rgba(184,150,46,0.45)", position: "absolute", bottom: "0.5rem", left: 0 }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
                      />
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      <span style={LABEL_STYLE}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        style={{ ...INPUT_BASE, opacity: disabled ? 0.45 : 1 }}
        onFocus={(e) => { e.currentTarget.style.borderBottomColor = "rgba(184,150,46,0.55)"; }}
        onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(184,150,46,0.2)"; }}
      />
    </label>
  );
}

function Textarea({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      <span style={LABEL_STYLE}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        rows={5}
        style={{
          background: "transparent",
          border: "1px solid rgba(184,150,46,0.2)",
          padding: "1rem",
          color: "var(--cielo-white)",
          fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
          fontWeight: 300,
          fontSize: "1.0625rem",
          letterSpacing: "0.04em",
          outline: "none",
          width: "100%",
          resize: "none",
          transition: "border-color 0.5s ease, opacity 0.4s ease",
          opacity: disabled ? 0.45 : 1,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(184,150,46,0.55)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(184,150,46,0.2)"; }}
      />
    </label>
  );
}
