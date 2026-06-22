const logos = [
  { name: "Northwind", className: "font-bold" },
  { name: "Lumen·co", className: "font-extrabold tracking-[-0.02em]" },
  { name: "Vaultly", className: "font-semibold italic" },
  { name: "Paperline", className: "font-bold" },
  { name: "FINCH", className: "font-extrabold" },
];

export function TrustLogos() {
  return (
    <section className="relative z-[2] mx-auto max-w-[1180px] px-4 sm:px-6 pb-5 pt-7 text-center">
      <div className="mb-[30px] text-[13px] font-semibold uppercase tracking-[0.14em] text-white/40">
        Trusted to keep documents safe for thousands
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-[54px] gap-y-5 opacity-65">
        {logos.map((l) => (
          <span key={l.name} className={`font-display text-[22px] text-white/60 ${l.className}`}>
            {l.name}
          </span>
        ))}
      </div>
    </section>
  );
}
