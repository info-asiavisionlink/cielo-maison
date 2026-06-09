// Film grain — static server component, pure CSS
export default function NoiseOverlay() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9,
          pointerEvents: "none",
          opacity: 0.028,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          animation: "noiseShift 0.4s steps(2) infinite",
        }}
      />

      {/* Vignette — enhanced */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 8,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 25%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.82) 100%)",
        }}
      />
    </>
  );
}
