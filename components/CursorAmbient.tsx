"use client";

import { useEffect, useRef } from "react";

export default function CursorAmbient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number;

    function move(e: MouseEvent) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!el) return;
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
      });
    }

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        zIndex: 1,
        pointerEvents: "none",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle, rgba(184,150,46,0.045) 0%, rgba(184,150,46,0.015) 35%, transparent 70%)",
        transition: "opacity 0.6s ease",
        willChange: "left, top",
      }}
    />
  );
}
