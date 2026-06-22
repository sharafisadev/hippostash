import { AmbientBackground } from "@/components/organisms/AmbientBackground";
import { Navbar } from "@/components/organisms/Navbar";
import { Hero } from "@/components/organisms/Hero";
import { FormatsMarquee } from "@/components/organisms/FormatsMarquee";
import { TrustLogos } from "@/components/organisms/TrustLogos";
import { FeatureGrid } from "@/components/organisms/FeatureGrid";
import { StorageSpotlight } from "@/components/organisms/StorageSpotlight";
import { HowItWorks } from "@/components/organisms/HowItWorks";
import { ConverterSection } from "@/components/organisms/ConverterSection";
import { Stats } from "@/components/organisms/Stats";
import { Security } from "@/components/organisms/Security";
import { PricingSection } from "@/components/organisms/PricingSection";
import { Testimonials } from "@/components/organisms/Testimonials";
import { FAQ } from "@/components/organisms/FAQ";
import { CTABanner } from "@/components/organisms/CTABanner";
import { Footer } from "@/components/organisms/Footer";

export default function HomePage() {
  return (
    <div className="relative">
      <AmbientBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <FormatsMarquee />
        <TrustLogos />
        <FeatureGrid />
        <StorageSpotlight />
        <HowItWorks />
        <ConverterSection />
        <Stats />
        <Security />
        <PricingSection />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
