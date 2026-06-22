import type { Metadata } from "next";
import { PageShell, Section } from "@/components/organisms/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Hippo Stash collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="We keep this simple: your documents are private, and we collect only what we need to run the service."
      updated="June 2026"
    >
      <Section title="Information we collect">
        <p>
          Account details (such as your email and name) and the files you choose
          to upload. We also collect basic usage data to keep the service reliable.
        </p>
      </Section>
      <Section title="How we use it">
        <p>
          To provide storage and conversion, secure your account, and improve the
          product. We do not sell your personal data, and we never access your
          documents except as required to deliver features you request.
        </p>
      </Section>
      <Section title="Storage & retention">
        <p>
          Your files are stored in encrypted, private storage tied to your account
          and kept until you delete them or close your account.
        </p>
      </Section>
      <Section title="Third-party processors">
        <p>
          We use trusted infrastructure providers for hosting, authentication and
          file conversion. They process data only on our instructions and under
          appropriate safeguards.
        </p>
      </Section>
      <Section title="Your rights">
        <p>
          You can access, export or delete your data at any time. For requests,
          contact{" "}
          <a href="mailto:privacy@hippostash.com" className="text-accent-cyan hover:underline">privacy@hippostash.com</a>.
        </p>
      </Section>
    </PageShell>
  );
}
