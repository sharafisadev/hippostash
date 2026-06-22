import type { Metadata } from "next";
import { PageShell, Section } from "@/components/organisms/PageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Hippo Stash.",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="By using Hippo Stash, you agree to these terms. We've kept them readable."
      updated="June 2026"
    >
      <Section title="Using the service">
        <p>
          You may use Hippo Stash to store, organize and convert files you own or
          have the right to use. Don&apos;t upload unlawful content or attempt to
          disrupt the service or other users.
        </p>
      </Section>
      <Section title="Your account">
        <p>
          You&apos;re responsible for keeping your login credentials secure and for
          activity under your account. Notify us promptly of any unauthorized use.
        </p>
      </Section>
      <Section title="Plans & billing">
        <p>
          Paid plans renew automatically until cancelled. You can change or cancel
          your plan at any time; changes take effect at the end of the current
          billing period.
        </p>
      </Section>
      <Section title="Availability & changes">
        <p>
          We work hard to keep the service available but provide it &ldquo;as
          is.&rdquo; We may update features and these terms over time, and
          we&apos;ll note material changes.
        </p>
      </Section>
      <Section title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:hello@hippostash.com" className="text-accent-cyan hover:underline">hello@hippostash.com</a>.
        </p>
      </Section>
    </PageShell>
  );
}
