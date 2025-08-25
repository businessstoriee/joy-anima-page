import { HeroSection } from "@/components/HeroSection";
import { FeatureCards } from "@/components/FeatureCards";
import { FloatingElements } from "@/components/FloatingElements";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingElements />
      <main className="relative z-10">
        <HeroSection />
        <FeatureCards />
      </main>
    </div>
  );
};

export default Index;
