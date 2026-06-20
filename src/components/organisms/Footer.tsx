import { Logo } from "@/components/atoms/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#convert", label: "Convert" },
      { href: "#pricing", label: "Pricing" },
      { href: "#trust", label: "Security" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#top", label: "About" },
      { href: "#trust", label: "Trust" },
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
    ],
  },
  {
    title: "Get started",
    links: [
      { href: "#pricing", label: "Plans" },
      { href: "#convert", label: "Try the converter" },
      { href: "#get-started", label: "Sign up" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="get-started" className="border-t border-hairline px-4 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Logo href="#top" />
          <p className="mt-4 max-w-xs text-sm text-text-secondary">
            Manage all your important documents in one secure place.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-text-secondary transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-hairline pt-6 text-xs text-text-secondary sm:flex-row">
        <p>© {new Date().getFullYear()} Hippo Stash. All rights reserved.</p>
        <p>Built with care for your documents.</p>
      </div>
    </footer>
  );
}
