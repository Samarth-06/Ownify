import { motion } from 'framer-motion';
import { Shield, Users, Globe, Zap } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Creator-First', desc: 'Every feature is designed to empower creators and protect their intellectual property.' },
  { icon: Users, title: 'Community Driven', desc: 'Built by creators, for creators. Our community shapes the platform.' },
  { icon: Globe, title: 'Global Protection', desc: 'Your work is protected across borders, languages, and platforms worldwide.' },
  { icon: Zap, title: 'Instant Proof', desc: 'Timestamp and verify ownership in seconds, not days.' },
];

const About = () => (
  <div className="relative min-h-screen bg-background pt-24 px-6">
    <div className="mx-auto max-w-4xl py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
        <h1 className="font-display text-5xl font-bold glow-text mb-4">About CreatorShield</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We're building the future of creative ownership — a world where every creator can prove, protect, and profit from their work.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel neon-border p-8 mb-12">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          In a world where digital content is copied in seconds, creators deserve better. CreatorShield provides immutable proof of creation, smart licensing tools, plagiarism detection, and verified portfolios — all in one ecosystem designed to feel like a creative studio, not a legal office.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {values.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="glass-panel p-6 group hover:scale-[1.02] transition-transform">
            <v.icon size={24} className="text-neon-cyan mb-3" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
