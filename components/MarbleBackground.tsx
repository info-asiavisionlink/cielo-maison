export default function MarbleBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      {/* Layer 1 — Deep Black Marble Base */}
      <div className="marble-base" style={{ position: "absolute", inset: 0 }} />

      {/* Layer 2 — Marble Texture Atmosphere */}
      <div className="marble-texture" style={{ position: "absolute", inset: 0 }} />

      {/* Layer 3 — Luxury Gold Reflection */}
      <div className="marble-gold" style={{ position: "absolute", inset: 0 }} />

      {/* Layer 4a — Breathing Ambient Glow */}
      <div className="marble-ambient" style={{ position: "absolute", inset: 0 }} />

      {/* Layer 4b — Floating Reflected Light */}
      <div className="marble-float" style={{ position: "absolute", inset: 0 }} />

      {/* Vignette */}
      <div className="marble-vignette" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
