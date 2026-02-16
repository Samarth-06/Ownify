import { motion } from 'framer-motion';
import { Upload, Fingerprint, Share2, Eye } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Work',
    description: 'Drop any digital creation — art, music, code, writing, design.',
    color: 'text-neon-purple',
    bgGlow: 'hsl(263 70% 58% / 0.15)',
  },
  {
    icon: Fingerprint,
    title: 'Timestamp & Prove',
    description: 'We generate an immutable proof of creation with a unique digital fingerprint.',
    color: 'text-neon-pink',
    bgGlow: 'hsl(330 80% 60% / 0.15)',
  },
  {
    icon: Share2,
    title: 'Share or Sell',
    description: 'License your work, sell with authenticity certificates, or share freely with proof.',
    color: 'text-neon-cyan',
    bgGlow: 'hsl(187 85% 53% / 0.15)',
  },
  {
    icon: Eye,
    title: 'Track Usage',
    description: 'Monitor where your work appears online and enforce your rights automatically.',
    color: 'text-neon-purple',
    bgGlow: 'hsl(263 70% 58% / 0.15)',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-neon-pink/5" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="font-display text-4xl font-bold sm:text-5xl glow-text">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Four steps to creative sovereignty
          </p>
        </motion.div>

        {/* Horizontal scrolling journey */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative min-w-[280px] snap-center flex-shrink-0 md:min-w-0"
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-16 hidden h-px w-6 translate-x-full md:block"
                  style={{ background: `linear-gradient(to right, hsl(var(--neon-purple) / 0.4), transparent)` }}
                />
              )}

              <div className="glass-panel group relative overflow-hidden p-8 text-center transition-all duration-500 hover:scale-[1.03]">
                {/* Step number */}
                <div className="absolute right-4 top-4 font-display text-6xl font-bold opacity-5">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Glow bg */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at center, ${step.bgGlow}, transparent 70%)` }}
                />

                <div className={`relative mb-6 inline-flex rounded-2xl bg-secondary/50 p-4 ${step.color}`}>
                  <step.icon size={32} />
                </div>
                <h3 className="relative font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="relative text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
