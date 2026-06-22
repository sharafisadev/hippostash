import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hippo Stash — All your documents, one secure stash",
    template: "%s · Hippo Stash",
  },
  description:
    "Save papers, IDs, bills and certificates effortlessly — then convert any file to the format you need, in seconds. Wrapped in bank-grade security.",
  keywords: [
    "document storage",
    "file conversion",
    "secure cloud storage",
    "PDF converter",
    "Hippo Stash",
  ],
  openGraph: {
    title: "Hippo Stash — All your documents, one secure stash",
    description:
      "Store, organize and convert all your important documents in one secure place.",
    url: siteUrl,
    siteName: "Hippo Stash",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hippo Stash",
    description: "All your documents, one secure stash.",
  },
  icons: { icon: "/hippo-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#08080F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} dark`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
