import { HippoLoader } from "@/components/atoms/HippoLoader";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <HippoLoader size={64} label="Loading…" />
    </div>
  );
}
