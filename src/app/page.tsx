import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Hero } from "@/components/organisms/Hero";
import { FeatureGrid } from "@/components/organisms/FeatureGrid";
import { ConverterSection } from "@/components/organisms/ConverterSection";
import { PricingSection } from "@/components/organisms/PricingSection";
import { TrustSection } from "@/components/organisms/TrustSection";
import { CTABanner } from "@/components/organisms/CTABanner";

export default function HomePage() {
  return (
    <>
      <span id="top" />
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <ConverterSection />
        <PricingSection />
        <TrustSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
