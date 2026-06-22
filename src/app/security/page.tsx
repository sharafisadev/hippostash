import type { Metadata } from "next";
import { PageShell, Section } from "@/components/organisms/PageShell";

export const metadata: Metadata = {
  title: "Security",
  description: "How Hippo Stash keeps your documents private and secure.",
};

export default function SecurityPage() {
  return (
    <PageShell
      eyebrow="Security"
      title="Your documents, locked down by default."
      intro="Security isn't a feature we bolt on — it's the foundation everything else is built on."
    >
      <Section title="Encryption">
        <p>
          Files are encrypted in transit (TLS) and at rest. Your documents are
          stored in a private bucket that is never publicly accessible.
        </p>
      </Section>
      <Section title="Access control">
        <p>
          Every file operation is verified server-side and scoped to your account.
          One user can never read, list or delete another user&apos;s files — your
          stash is yours alone.
        </p>
      </Section>
      <Section title="Authentication">
        <p>
          Sign in with email and password or trusted providers. Two-factor
          authentication and biometric lock add extra layers of protection.
        </p>
      </Section>
      <Section title="Responsible disclosure">
        <p>
          Found a vulnerability? We appreciate responsible reports — email{" "}
          <a href="mailto:security@hippostash.com" className="text-accent-cyan hover:underline">security@hippostash.com</a>{" "}
          and we&apos;ll respond promptly.
        </p>
      </Section>
    </PageShell>
  );
}
