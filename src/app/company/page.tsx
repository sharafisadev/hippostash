import type { Metadata } from "next";
import { InfoHub, HubSection, Sub } from "@/components/organisms/InfoHub";

export const metadata: Metadata = {
  title: "Company, Help & Legal",
  description: "About Hippo Stash, help & FAQ, and our privacy and terms — secure document storage and conversion.",
};

const faqs = [
  {
    q: "How secure are my documents?",
    a: "Every file is encrypted in transit and at rest, stored in a private bucket scoped to your account. You can add two-factor authentication and a biometric lock for extra protection.",
  },
  {
    q: "Which file formats can I convert?",
    a: "Convert freely between PDF, DOCX, JPG, PNG, WEBP, XLSX, PPTX and more. Images convert instantly in your browser; documents convert securely in the cloud.",
  },
  {
    q: "Can I convert multiple files at once?",
    a: "Yes — select several files in the converter, choose your output format, and convert them together.",
  },
  {
    q: "What happens when I hit my storage limit?",
    a: "We'll let you know as you approach your limit. Your existing files stay safe — you simply upgrade your plan to add more space whenever you're ready.",
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Absolutely. Upgrade, downgrade or cancel at any time from your settings; changes take effect at the end of the billing period.",
  },
  {
    q: "Can I access my stash on any device?",
    a: "Yes. Your documents sync automatically across phone, tablet and desktop, so the latest version is always with you.",
  },
];

export default function InfoPage() {
  return (
    <InfoHub
      eyebrow="Hippo Stash"
      title="Everything about Hippo Stash, in one place."
      intro="Who we are, how to get the most out of the app, and the legal details. Pick a topic — Company, Resources or Legal — to explore it."
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
                <p>Privacy-first, quality over quantity, and shipping improvements continuously.</p>
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
        {
          id: "help",
          content: (
            <HubSection
              title="Help Center"
              lead="Everything you need to go from sign-up to your first converted file."
            >
              <Sub title="Getting started">
                <p>
                  Create a free account, then drag any file into your stash. Hippo Stash stores it
                  securely and lets you preview, rename, convert or download it whenever you need.
                </p>
              </Sub>
              <Sub title="Uploading & organizing">
                <p>
                  Use <strong>Add file</strong> or drag &amp; drop to upload. Filter your stash by
                  type (PDFs, images, documents) using the tabs, and rename any file to keep things
                  tidy.
                </p>
              </Sub>
              <Sub title="Converting files">
                <p>
                  Open the Converter, drop one or more files, choose an output format and hit convert.
                  Images convert instantly in your browser; documents are converted securely in the
                  cloud and delivered as a clean download.
                </p>
              </Sub>
              <Sub title="Still stuck?">
                <p>
                  Email us at{" "}
                  <a href="mailto:hello@hippostash.com" className="text-accent-cyan hover:underline">hello@hippostash.com</a>{" "}
                  and we&apos;ll help you out.
                </p>
              </Sub>
            </HubSection>
          ),
        },
        {
          id: "faq",
          content: (
            <HubSection title="FAQ" lead="The short answers to the questions we get asked the most.">
              {faqs.map((f) => (
                <Sub key={f.q} title={f.q}>
                  <p>{f.a}</p>
                </Sub>
              ))}
            </HubSection>
          ),
        },
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
