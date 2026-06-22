/** Fixed ambient layer: dotted grid + two soft, slow color washes.
 *  Deliberately light on the GPU — modest blur, slow drift. */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="grid-dots absolute inset-0 opacity-50" />
      <div className="absolute -left-[12%] top-[4%] h-[460px] w-[460px] animate-floatA rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--a1)_30%,transparent),transparent_68%)] opacity-50 blur-[70px]" />
      <div className="absolute -right-[14%] top-[26%] h-[500px] w-[500px] animate-floatB rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--a2)_30%,transparent),transparent_68%)] opacity-45 blur-[80px]" />
    </div>
  );
}
