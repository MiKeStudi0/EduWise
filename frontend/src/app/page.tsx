import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PathsSection } from "@/components/home/PathsSection";
import { CTASection } from "@/components/home/CTASection";
import { StatsSection } from "@/components/home/StatsSection";

// This replaces your "Index" component
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        {/* <StatsSection /> */}
        <FeaturesSection />
        {/* <PathsSection /> */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}