import type { Metadata } from "next";
import { InfoHub, HubSection, Sub } from "@/components/organisms/InfoHub";

export const metadata: Metadata = {
  title: "Legal",
  description: "Hippo Stash legal — Privacy Policy and Terms of Service, kept readable.",
};

export default function LegalPage() {
  return (
    <InfoHub
      current="legal"
      eyebrow="Legal"
      title="The fine print, kept readable."
      intro="How we handle your data, and the terms that govern your use of Hippo Stash — in plain language."
      sections={[
        {
          id: "privacy",
          content: (
            <HubSection
              title="Privacy Policy"
              updated="June 2026"
              lead="We keep this simple: your documents are private, and we collect only what we need to run the service."
            >
              <Sub title="Information we collect">
                <p>
                  Account details (such as your email and name) and the files you choose to upload. We
                  also collect basic usage data to keep the service reliable.
                </p>
              </Sub>
              <Sub title="How we use it">
                <p>
                  To provide storage and conversion, secure your account, and improve the product. We
                  do not sell your personal data, and we never access your documents except as required
                  to deliver features you request.
                </p>
              </Sub>
              <Sub title="Storage & retention">
                <p>
                  Your files are stored in encrypted, private storage tied to your account and kept
                  until you delete them or close your account.
                </p>
              </Sub>
              <Sub title="Third-party processors">
                <p>
                  We use trusted infrastructure providers for hosting, authentication and file
                  conversion. They process data only on our instructions and under appropriate
                  safeguards.
                </p>
              </Sub>
              <Sub title="Your rights">
                <p>
                  You can access, export or delete your data at any time. For requests, contact{" "}
                  <a href="mailto:privacy@hippostash.com" className="text-accent-cyan hover:underline">privacy@hippostash.com</a>.
                </p>
              </Sub>
            </HubSection>
          ),
        },
        {
          id: "terms",
          content: (
            <HubSection
              title="Terms of Service"
              updated="June 2026"
              lead="By using Hippo Stash, you agree to these terms. We've kept them readable."
            >
              <Sub title="Using the service">
                <p>
                  You may use Hippo Stash to store, organize and convert files you own or have the
                  right to use. Don&apos;t upload unlawful content or attempt to disrupt the service or
                  other users.
                </p>
              </Sub>
              <Sub title="Your account">
                <p>
                  You&apos;re responsible for keeping your login credentials secure and for activity
                  under your account. Notify us promptly of any unauthorized use.
                </p>
              </Sub>
              <Sub title="Plans & billing">
                <p>
                  Paid plans renew automatically until cancelled. You can change or cancel your plan at
                  any time; changes take effect at the end of the current billing period.
                </p>
              </Sub>
              <Sub title="Availability & changes">
                <p>
                  We work hard to keep the service available but provide it &ldquo;as is.&rdquo; We may
                  update features and these terms over time, and we&apos;ll note material changes.
                </p>
              </Sub>
              <Sub title="Contact">
                <p>
                  Questions about these terms? Email{" "}
                  <a href="mailto:hello@hippostash.com" className="text-accent-cyan hover:underline">hello@hippostash.com</a>.
                </p>
              </Sub>
            </HubSection>
          ),
        },
      ]}
    />
  );
}
