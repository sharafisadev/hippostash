import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#convert", label: "Convert" },
      { href: "/#storage", label: "Storage" },
      { href: "/#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company/about", label: "About" },
      { href: "/company/story", label: "Our story" },
      { href: "/company/security", label: "Security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/company/help", label: "Help Center" },
      { href: "/company/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/company/privacy", label: "Privacy Policy" },
      { href: "/company/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-[2] overflow-hidden border-t border-white/[0.07]">
      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 pb-[30px] pt-[56px]">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Image src="/hippo-icon.png" alt="" width={30} height={30} className="rounded-[8px]" />
              <span className="font-display text-[18px] font-bold tracking-[-0.02em]">Hippo Stash</span>
            </div>
            <p className="m-0 max-w-[300px] text-sm leading-[1.6] text-white/45">
              Manage all your important documents in one secure place. Store,
              organize and convert with ease.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[13px] font-semibold text-white/40">{col.title}</div>
              <div className="flex flex-col gap-[11px]">
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href} className="text-sm font-medium text-white/60 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
          <span className="text-[13px] text-white/35">© {new Date().getFullYear()} Hippo Stash. All rights reserved.</span>
          <span className="text-[13px] text-white/35">Made for tidy minds.</span>
        </div>
      </div>
      <div className="select-none whitespace-nowrap pb-5 text-center font-display text-[clamp(80px,18vw,230px)] font-extrabold leading-[0.8] tracking-[-0.04em] text-white/[0.03]">
        Hippo Stash
      </div>
    </footer>
  );
}
