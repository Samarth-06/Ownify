import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroScene from './HeroScene';

const title1 = 'PROTECT YOUR IDEAS';
const title2 = 'BEFORE THE INTERNET';
const title3 = 'COPIES THEM';

function InteractiveText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [mouseX, setMouseX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouseX((e.clientX - rect.left) / rect.width);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <span ref={containerRef} className={`inline-flex flex-wrap justify-center ${className || ''}`}>
      {text.split('').map((char, i) => {
        const charPos = i / text.length;
        const dist = Math.abs(mouseX - charPos);
        const glow = Math.max(0, 1 - dist * 3);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + i * 0.02 }}
            style={{
              textShadow: glow > 0.1 ? `0 0 ${20 + glow * 30}px hsl(var(--neon-cyan) / ${glow * 0.7}), 0 0 ${40 + glow * 40}px hsl(var(--neon-purple) / ${glow * 0.3})` : undefined,
              transform: glow > 0.1 ? `translateY(${-glow * 3}px)` : undefined,
              transition: 'text-shadow 0.15s ease, transform 0.15s ease',
            }}
            className={char === ' ' ? 'w-[0.3em]' : ''}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </span>
  );
}

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
      {/* Background gradient - enhanced blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-neon-blue/25 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--neon-cyan)/0.08)_0%,transparent_60%)]" />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <HeroScene mouse={mouse} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-16">
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          <InteractiveText text={title1} className="text-foreground" />
          <br />
          <InteractiveText text={title2} className="text-neon-pink" delay={0.4} />
          <br />
          <InteractiveText text={title3} className="text-foreground" delay={0.8} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Proof, licensing and authenticity for digital creators
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
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
