import type { Metadata } from "next";
import { PageShell, Section } from "@/components/organisms/PageShell";

export const metadata: Metadata = {
  title: "Company",
  description: "Learn about the company behind Hippo Stash.",
};

export default function CompanyPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="The team behind your stash."
      intro="We're a small team obsessed with making everyday document chaos disappear."
    >
      <Section title="Our mission">
        <p>
          To give everyone a secure, delightful home for their important
          documents — and the tools to convert, preview and share them without
          friction.
        </p>
      </Section>
      <Section title="How we work">
        <p>
          Privacy-first, quality over quantity, and shipping improvements
          continuously. We&apos;d rather do a few things exceptionally well than
          many things half-way.
        </p>
      </Section>
      <Section title="Get in touch">
        <p>
          Questions, ideas or partnership inquiries? Reach us any time at{" "}
          <a href="mailto:hello@hippostash.com" className="text-accent-cyan hover:underline">hello@hippostash.com</a>.
        </p>
      </Section>
    </PageShell>
  );
}
