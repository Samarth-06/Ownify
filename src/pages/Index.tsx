import GlowCursor from '../components/GlowCursor';
import BackgroundParticles from '../components/BackgroundParticles';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CreatorShowcase from '../components/CreatorShowcase';
import CreatorFeed from '../components/CreatorFeed';
import FooterSection from '../components/FooterSection';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundParticles />
      <GlowCursor />
      <Navbar />
      <HeroSection />
      <section id="features"><FeaturesSection /></section>
      <section id="how-it-works"><HowItWorksSection /></section>
      <section id="showcase"><CreatorShowcase /></section>
      <CreatorFeed />
      <FooterSection />
    </div>
  );
};

export default Index;
