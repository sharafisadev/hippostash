import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { GlowOrb } from "@/components/atoms/GlowOrb";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 text-center">
      <GlowOrb color="violet" size={380} className="left-1/2 top-1/4 -translate-x-1/2" />
      <div>
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="gradient-text text-7xl font-bold">404</p>
        <h1 className="mt-3 text-xl font-semibold text-white">
          This page wandered off.
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          The document you&apos;re looking for isn&apos;t here.
        </p>
        <Link
          href="/"
          className="btn-gradient mt-6 inline-block rounded-btn px-6 py-3 text-sm"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
