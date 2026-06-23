import type { Metadata } from "next";
import { InfoHub, HubSection, Sub } from "@/components/organisms/InfoHub";

export const metadata: Metadata = {
  title: "Company",
  description: "About Hippo Stash — the team, mission and security behind secure document storage and conversion.",
};

export default function CompanyPage() {
  return (
    <InfoHub
      current="company"
      eyebrow="Company"
      title="The people and principles behind your stash."
      intro="We're a small team obsessed with making everyday document chaos disappear — securely, and with a little delight."
      sections={[
        {
          id: "about",
          content: (
            <HubSection
              title="About"
              lead="Hippo Stash exists to take the stress out of keeping track of your important paperwork — and to make converting files feel effortless."
            >
              <Sub title="Why we built it">
                <p>
                  Bills, IDs, contracts, certificates — the documents that matter most are usually
                  scattered across email, phones and random folders. Hippo Stash brings them together
                  in one secure, searchable home, then lets you convert any of them to the format you
                  need in seconds.
                </p>
              </Sub>
              <Sub title="What we believe">
                <p>
                  Your documents are yours. Everything you store is private by design, encrypted, and
                  tied only to your account. Simplicity and security shouldn&apos;t be a trade-off —
                  they&apos;re the whole point.
                </p>
              </Sub>
              <Sub title="Where we're going">
                <p>
                  We&apos;re continuously adding new file formats, smarter organization, and
                  collaboration features — while keeping the experience friendly, fast and tidy.
                </p>
              </Sub>
            </HubSection>
          ),
        },
        {
          id: "story",
          content: (
            <HubSection
              title="Our story"
              lead="A small team that would rather do a few things exceptionally well than many things half-way."
            >
              <Sub title="Our mission">
                <p>
                  To give everyone a secure, delightful home for their important documents — and the
                  tools to convert, preview and share them without friction.
                </p>
              </Sub>
              <Sub title="How we work">
                <p>
                  Privacy-first, quality over quantity, and shipping improvements continuously.
                </p>
              </Sub>
              <Sub title="Get in touch">
                <p>
                  Questions, ideas or partnership inquiries? Reach us any time at{" "}
                  <a href="mailto:hello@hippostash.com" className="text-accent-cyan hover:underline">hello@hippostash.com</a>.
                </p>
              </Sub>
            </HubSection>
          ),
        },
        {
          id: "security",
          content: (
            <HubSection
              title="Security"
              lead="Security isn't a feature we bolt on — it's the foundation everything else is built on."
            >
              <Sub title="Encryption">
                <p>
                  Files are encrypted in transit (TLS) and at rest. Your documents are stored in a
                  private bucket that is never publicly accessible.
                </p>
              </Sub>
              <Sub title="Access control">
                <p>
                  Every file operation is verified server-side and scoped to your account. One user
                  can never read, list or delete another user&apos;s files — your stash is yours alone.
                </p>
              </Sub>
              <Sub title="Authentication">
                <p>
                  Sign in with email and password or trusted providers. Two-factor authentication and
                  biometric lock add extra layers of protection.
                </p>
              </Sub>
              <Sub title="Responsible disclosure">
                <p>
                  Found a vulnerability? We appreciate responsible reports — email{" "}
                  <a href="mailto:security@hippostash.com" className="text-accent-cyan hover:underline">security@hippostash.com</a>{" "}
                  and we&apos;ll respond promptly.
                </p>
              </Sub>
            </HubSection>
          ),
        },
      ]}
    />
  );
}
