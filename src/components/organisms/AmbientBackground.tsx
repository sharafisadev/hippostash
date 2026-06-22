/** Fixed ambient layer: dotted grid + soft, slow-drifting color washes. Kept
 *  deliberately subtle — atmosphere, not motion. */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="grid-dots absolute inset-0 opacity-60" />
      <div className="absolute -left-[12%] top-[4%] h-[520px] w-[520px] animate-floatA rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--a1)_34%,transparent),transparent_66%)] opacity-60 blur-[100px]" />
      <div className="absolute -right-[14%] top-[24%] h-[560px] w-[560px] animate-floatB rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--a2)_34%,transparent),transparent_66%)] opacity-55 blur-[110px]" />
    </div>
  );
}
