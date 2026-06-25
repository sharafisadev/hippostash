/**
 * Site-wide ambient backdrop: two slow-drifting brand glows plus a faint light
 * sweep that passes through only once in a while. Fixed, behind everything, and
 * very low opacity so it reads as quiet atmosphere rather than motion.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="ambient-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* drifting glow — cyan */}
      <div
        className="absolute -left-[10%] top-[8%] h-[55vh] w-[55vh] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(78,205,196,0.05), transparent 70%)",
          animation: "ambientDrift 38s ease-in-out infinite",
        }}
      />
      {/* drifting glow — violet */}
      <div
        className="absolute right-[-8%] top-[45%] h-[60vh] w-[60vh] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgba(155,89,182,0.045), transparent 70%)",
          animation: "ambientDriftAlt 46s ease-in-out infinite",
        }}
      />
      {/* occasional light sweep */}
      <div
        className="absolute -inset-y-[20%] left-0 w-[24%]"
        style={{
          background:
            "linear-gradient(105deg, transparent, rgba(120,140,220,0.05), transparent)",
          animation: "ambientSweep 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
