import type { Metadata } from "next";
import { PageShell, Section } from "@/components/organisms/PageShell";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about storing and converting documents with Hippo Stash.",
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

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Frequently asked questions."
      intro="Everything you need to know about storing and converting with Hippo Stash."
    >
      {faqs.map((f) => (
        <Section key={f.q} title={f.q}>
          <p>{f.a}</p>
        </Section>
      ))}
    </PageShell>
  );
}
