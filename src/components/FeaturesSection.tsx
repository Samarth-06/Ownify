import { motion } from 'framer-motion';
import { Shield, FileText, Network, ScanSearch, BadgeCheck } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Proof of Creation',
    description: 'Timestamp and fingerprint your work the moment it exists. Immutable proof that you made it first.',
    gradient: 'from-neon-purple/20 to-neon-pink/10',
    glowColor: 'var(--shadow-neon-purple)',
    iconColor: 'text-neon-purple',
  },
  {
    icon: FileText,
    title: 'Smart Licensing',
    description: 'Generate legally-sound usage licenses in seconds. Control how your work is used across the internet.',
    gradient: 'from-neon-pink/20 to-accent/10',
    glowColor: 'var(--shadow-neon-pink)',
    iconColor: 'text-neon-pink',
  },
  {
    icon: Network,
    title: 'Verified Portfolio',
    description: 'Build a constellation of your verified works. Every piece authenticated and connected.',
    gradient: 'from-neon-cyan/20 to-neon-purple/10',
    glowColor: 'var(--shadow-neon-cyan)',
    iconColor: 'text-neon-cyan',
  },
  {
    icon: ScanSearch,
    title: 'Plagiarism Detection',
    description: 'Scanning beam technology reveals unauthorized copies of your work across the web.',
    gradient: 'from-neon-purple/20 to-neon-cyan/10',
    glowColor: 'var(--shadow-neon-purple)',
    iconColor: 'text-neon-purple',
  },
  {
    icon: BadgeCheck,
    title: 'Authenticity Certificates',
    description: 'Holographic digital badges that prove every purchase is genuine and creator-approved.',
    gradient: 'from-neon-pink/20 to-neon-purple/10',
    glowColor: 'var(--shadow-neon-pink)',
    iconColor: 'text-neon-pink',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="font-display text-4xl font-bold sm:text-5xl glow-text">
            Your Creative Arsenal
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Every tool a creator needs to own their future
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass-panel group cursor-pointer bg-gradient-to-br ${feature.gradient} p-8 transition-all duration-500`}
            >
              <div className={`mb-6 inline-flex rounded-2xl bg-secondary/50 p-4 ${feature.iconColor} transition-all duration-300 group-hover:scale-110`}>
                <feature.icon size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
