import type { Metadata } from "next";
import { PageShell, Section } from "@/components/organisms/PageShell";

export const metadata: Metadata = {
  title: "About",
  description: "About Hippo Stash — secure document storage and conversion for everyone.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Documents, finally in one calm place."
      intro="Hippo Stash exists to take the stress out of keeping track of your important paperwork — and to make converting files feel effortless."
    >
      <Section title="Why we built it">
        <p>
          Bills, IDs, contracts, certificates — the documents that matter most are
          usually scattered across email, phones and random folders. Hippo Stash
          brings them together in one secure, searchable home, then lets you
          convert any of them to the format you need in seconds.
        </p>
      </Section>
      <Section title="What we believe">
        <p>
          Your documents are yours. Everything you store is private by design,
          encrypted, and tied only to your account. Simplicity and security
          shouldn&apos;t be a trade-off — they&apos;re the whole point.
        </p>
      </Section>
      <Section title="Where we're going">
        <p>
          We&apos;re continuously adding new file formats, smarter organization,
          and collaboration features — while keeping the experience friendly,
          fast and tidy.
        </p>
      </Section>
    </PageShell>
  );
}
