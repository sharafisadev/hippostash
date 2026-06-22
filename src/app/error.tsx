"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <Image src="/hippo-icon.png" alt="" width={56} height={56} className="mx-auto mb-6 rounded-2xl" />
        <h1 className="font-display text-xl font-semibold text-white">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">
          We hit an unexpected error. Try again, and if it keeps happening, reach out to support.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="btn-primary rounded-[13px] px-6 py-3 text-sm">
            Try again
          </button>
          <a href="/" className="lq rounded-[13px] px-6 py-3 text-sm font-semibold text-white">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
