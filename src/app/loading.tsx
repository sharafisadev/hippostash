import Image from "next/image";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/hippo-icon.png"
          alt="Hippo Stash"
          width={56}
          height={56}
          className="animate-bob rounded-2xl"
          priority
        />
        <p className="text-sm text-white/50">Loading…</p>
      </div>
    </div>
  );
}
