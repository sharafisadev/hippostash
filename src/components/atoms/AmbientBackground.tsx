/**
 * Site-wide ambient backdrop: drifting brand glows, a field of twinkling
 * particles, and a few slow-floating outlined shapes — visible but understated,
 * fixed behind all content.
 */

// Deterministic particle field (fixed positions → no hydration mismatch).
const PARTICLES = [
  { l: 6, t: 18, s: 3, d: 0, dur: 7, c: "var(--a1)" },
  { l: 14, t: 64, s: 2, d: 1.5, dur: 9, c: "var(--a2)" },
  { l: 22, t: 36, s: 4, d: 0.6, dur: 8, c: "var(--a3)" },
  { l: 31, t: 82, s: 2, d: 2.2, dur: 10, c: "var(--a1)" },
  { l: 39, t: 12, s: 3, d: 1.1, dur: 7.5, c: "var(--a2)" },
  { l: 47, t: 52, s: 2, d: 3, dur: 9.5, c: "var(--a1)" },
  { l: 55, t: 28, s: 4, d: 0.3, dur: 8.5, c: "var(--a3)" },
  { l: 63, t: 74, s: 2, d: 2.6, dur: 7, c: "var(--a2)" },
  { l: 70, t: 44, s: 3, d: 1.8, dur: 10, c: "var(--a1)" },
  { l: 78, t: 16, s: 2, d: 0.9, dur: 9, c: "var(--a3)" },
  { l: 85, t: 60, s: 4, d: 2.4, dur: 8, c: "var(--a2)" },
  { l: 92, t: 34, s: 2, d: 1.3, dur: 7.5, c: "var(--a1)" },
  { l: 50, t: 88, s: 3, d: 3.2, dur: 9, c: "var(--a3)" },
  { l: 9, t: 90, s: 2, d: 0.5, dur: 10, c: "var(--a2)" },
];

export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="ambient-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* drifting glows */}
      <div
        className="absolute -left-[10%] top-[8%] h-[55vh] w-[55vh] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(78,205,196,0.07), transparent 70%)", animation: "ambientDrift 38s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[-8%] top-[45%] h-[60vh] w-[60vh] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(155,89,182,0.06), transparent 70%)", animation: "ambientDriftAlt 46s ease-in-out infinite" }}
      />

      {/* twinkling particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: p.s,
            height: p.s,
            background: p.c,
            boxShadow: `0 0 ${p.s * 3}px ${p.c}`,
            animation: `ambientTwinkle ${p.dur}s ease-in-out ${p.d}s infinite`,
          }}
        />
      ))}

      {/* slow-floating outlined shapes */}
      <div
        className="absolute left-[12%] top-[22%] h-28 w-28 rounded-[28px] border border-accent-cyan/[0.12]"
        style={{ animation: "ambientFloatShape 28s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[14%] top-[58%] h-36 w-36 rounded-full border border-accent-violet/[0.1]"
        style={{ animation: "ambientFloatShape 34s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute left-[60%] top-[14%] h-20 w-20 rotate-45 rounded-[18px] border border-accent-blue/[0.1]"
        style={{ animation: "ambientFloatShape 24s ease-in-out 2s infinite" }}
      />

      {/* occasional light sweep */}
      <div
        className="absolute -inset-y-[20%] left-0 w-[24%]"
        style={{ background: "linear-gradient(105deg, transparent, rgba(120,140,220,0.06), transparent)", animation: "ambientSweep 26s ease-in-out infinite" }}
      />
    </div>
  );
}
