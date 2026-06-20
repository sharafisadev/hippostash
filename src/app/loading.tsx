import { HippoMark } from "@/components/atoms/Logo";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-pulse">
          <HippoMark className="h-12 w-12" />
        </div>
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    </div>
  );
}
