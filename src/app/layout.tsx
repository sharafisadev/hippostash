import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { IntroLoader } from "@/components/organisms/IntroLoader";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hippostash.com";

const description =
  "Store papers, IDs, bills and certificates in one secure place — then convert any file (PDF, DOCX, JPG, PNG, XLSX and more) in seconds. Private, encrypted document storage and conversion.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hippo Stash — All your documents, one secure stash",
    template: "%s · Hippo Stash",
  },
  description,
  applicationName: "Hippo Stash",
  keywords: [
    "document storage",
    "secure document storage",
    "file converter",
    "PDF converter",
    "PDF to DOCX",
    "convert files online",
    "cloud document storage",
    "store IDs bills certificates",
    "encrypted file storage",
    "Hippo Stash",
  ],
  authors: [{ name: "Hippo Stash" }],
  creator: "Hippo Stash",
  publisher: "Hippo Stash",
  category: "productivity",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hippo Stash",
    title: "Hippo Stash — All your documents, one secure stash",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hippo Stash — All your documents, one secure stash",
    description,
  },
  icons: { icon: "/hippo-icon.png", apple: "/hippo-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#08080F",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hippo Stash",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free plan with 1 GB secure storage",
  },
  featureList: [
    "Secure document storage",
    "File conversion (PDF, DOCX, JPG, PNG, XLSX and more)",
    "Smart folders & search",
    "256-bit encryption",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} dark`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>
          <SmoothScroll />
          <IntroLoader />
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
