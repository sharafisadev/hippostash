import Link from "next/link";
import { cn } from "@/lib/utils";

export function HippoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 45 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <path d="M11.194 3.588c1.235.355 2.119 1.44 2.217 2.72.164 2.139-1.855 3.783-3.916 3.191a2.84 2.84 0 0 1-2.217-2.72c-.164-2.138 1.855-3.783 3.916-3.191Z" fill="#EDEDED" stroke="#323232" strokeWidth=".95" />
      <path d="M38.495 6.913a2.84 2.84 0 0 1-2.31 2.642c-2.079.521-4.04-1.193-3.802-3.323a2.84 2.84 0 0 1 2.31-2.643c2.08-.52 4.04 1.193 3.802 3.324Z" fill="#EDEDED" stroke="#323232" strokeWidth=".95" />
      <circle cx="22.467" cy="19.202" r="15.402" fill="#EDEDED" stroke="#323232" strokeWidth=".95" />
      <path d="M36.654 36.751c-.244 3.735-3.35 6.69-7.148 6.69H15.427c-3.797 0-6.902-2.955-7.146-6.69h28.373Z" fill="#D9D9D9" stroke="#323232" strokeWidth=".95" />
      <path d="M11.233 16.38h22.467c5.942 0 10.76 4.817 10.76 10.76 0 5.94-4.817 10.757-10.759 10.758H11.233c-5.941 0-10.758-4.817-10.758-10.759 0-5.942 4.817-10.758 10.758-10.759Z" fill="#EDEDED" stroke="#323232" strokeWidth=".95" />
      <circle cx="15.802" cy="13.105" r="1.414" fill="#323232" />
      <circle cx="29.057" cy="13.105" r="1.414" fill="#323232" />
      <rect x="9.22" y="25.62" width="4.027" height="2.904" rx="1.452" fill="#323232" />
      <rect x="30.7" y="25.62" width="4.027" height="2.904" rx="1.452" fill="#323232" />
    </svg>
  );
}

interface LogoProps {
  href?: string;
  showWord?: boolean;
  className?: string;
}

export function Logo({ href = "/", showWord = true, className }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-btn bg-white/5 ring-1 ring-hairline">
        <HippoMark className="h-6 w-6" />
      </span>
      {showWord && (
        <span className="text-lg font-bold tracking-tight text-white">
          Hippo&nbsp;Stash
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="Hippo Stash home" className="shrink-0">
      {content}
    </Link>
  );
}
