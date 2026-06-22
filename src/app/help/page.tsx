import type { Metadata } from "next";
import { PageShell, Section } from "@/components/organisms/PageShell";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Guides and answers for using Hippo Stash — storage, conversion and account help.",
};

export default function HelpPage() {
  return (
    <PageShell
      eyebrow="Help Center"
      title="Need a hand?"
      intro="Quick answers to get you stashing and converting in no time."
    >
      <Section title="Getting started">
        <p>
          Create a free account, then drag any file into your stash. Hippo Stash
          stores it securely and lets you preview, rename, convert or download it
          whenever you need.
        </p>
      </Section>
      <Section title="Uploading & organizing">
        <p>
          Use <strong>Add file</strong> or drag &amp; drop to upload. Filter your
          stash by type (PDFs, images, documents) using the tabs, and rename any
          file to keep things tidy.
        </p>
      </Section>
      <Section title="Converting files">
        <p>
          Open the Converter, drop one or more files, choose an output format and
          hit convert. Images convert instantly in your browser; documents are
          converted securely in the cloud and delivered as a clean download.
        </p>
      </Section>
      <Section title="Still stuck?">
        <p>
          Email us at{" "}
          <a href="mailto:hello@hippostash.com" className="text-accent-cyan hover:underline">hello@hippostash.com</a>{" "}
          and we&apos;ll help you out.
        </p>
      </Section>
    </PageShell>
  );
}
