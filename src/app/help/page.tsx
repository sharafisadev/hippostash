import type { Metadata } from "next";
import { InfoHub, HubSection, Sub } from "@/components/organisms/InfoHub";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Guides and answers for using Hippo Stash — storage, conversion, accounts and frequently asked questions.",
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

export default function HelpPage() {
  return (
    <InfoHub
      current="help"
      eyebrow="Resources"
      title="Need a hand? Start here."
      intro="Quick guides to get you stashing and converting in no time — plus answers to the questions we hear most."
      sections={[
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
            <HubSection
              title="FAQ"
              lead="The short answers to the questions we get asked the most."
            >
              {faqs.map((f) => (
                <Sub key={f.q} title={f.q}>
                  <p>{f.a}</p>
                </Sub>
              ))}
            </HubSection>
          ),
        },
      ]}
    />
  );
}
