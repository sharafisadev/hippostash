import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hippo Stash — Secure Document Storage & Conversion",
    template: "%s · Hippo Stash",
  },
  description:
    "Manage all your important documents in one secure place. Store, convert, preview, and protect your files with Hippo Stash.",
  keywords: [
    "document storage",
    "file conversion",
    "secure cloud storage",
    "PDF",
    "Hippo Stash",
  ],
  authors: [{ name: "Hippo Stash" }],
  openGraph: {
    title: "Hippo Stash — Secure Document Storage & Conversion",
    description:
      "Manage all your important documents in one secure place.",
    url: siteUrl,
    siteName: "Hippo Stash",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hippo Stash",
    description: "Manage all your important documents in one secure place.",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0B0B14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
