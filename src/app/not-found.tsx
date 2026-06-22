import Image from "next/image";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <Image src="/hippo-icon.png" alt="" width={56} height={56} className="mx-auto mb-6 rounded-2xl" />
        <p className="gradient-text font-display text-7xl font-extrabold">404</p>
        <h1 className="mt-3 font-display text-xl font-semibold text-white">This page wandered off.</h1>
        <p className="mt-2 text-sm text-white/50">The document you&apos;re looking for isn&apos;t here.</p>
        <a href="/" className="btn-primary mt-6 inline-block rounded-[13px] px-6 py-3 text-sm">
          Back home
        </a>
      </div>
    </div>
  );
}
