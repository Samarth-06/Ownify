import { motion } from 'framer-motion';

export default function FooterSection() {
  return (
    <footer className="relative py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/5 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-6xl text-center"
      >
        {/* Floating logo */}
        <div className="mb-6 inline-flex animate-float">
          <div className="glass-panel flex h-16 w-16 items-center justify-center rounded-2xl">
            <span className="font-display text-2xl font-bold text-neon-purple glow-text">◈</span>
          </div>
        </div>

        <p className="font-display text-lg text-muted-foreground tracking-wide">
          Own What You Create
        </p>

        <div className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />

        <p className="mt-6 text-xs text-muted-foreground/50">
          © 2025 CreatorShield. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
