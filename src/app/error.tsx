"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";

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
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-xl font-semibold text-white">
          Something went wrong
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          We hit an unexpected error. Try again, and if it keeps happening,
          reach out to support.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="gradient" onClick={reset}>
            Try again
          </Button>
          <Button variant="glass" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
