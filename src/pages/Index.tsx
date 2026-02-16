import GlowCursor from '../components/GlowCursor';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CreatorShowcase from '../components/CreatorShowcase';
import FooterSection from '../components/FooterSection';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <GlowCursor />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CreatorShowcase />
      <FooterSection />
    </div>
  );
};

export default Index;
