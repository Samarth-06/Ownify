import { useRef } from 'react';
import { motion } from 'framer-motion';
import HeroScene from './HeroScene';

export default function HeroSection() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-neon-blue/20 to-background" />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <HeroScene mouse={mouse} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl glow-text"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          PROTECT YOUR IDEAS
          <br />
          <span style={{ color: 'hsl(var(--neon-pink))' }} className="glow-text-pink">
            BEFORE THE INTERNET
          </span>
          <br />
          COPIES THEM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Proof, licensing and authenticity for digital creators
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button className="magnetic-btn rounded-full px-8 py-4 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
            Protect a Work
          </button>
          <button className="magnetic-btn-outline rounded-full px-8 py-4 font-display text-sm font-semibold uppercase tracking-widest text-foreground">
            Explore Verified Portfolio
          </button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
