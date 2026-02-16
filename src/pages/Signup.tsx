import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Palette, Music, Code, Camera } from 'lucide-react';

const creatorTypes = [
  { icon: Palette, label: 'Visual Artist' },
  { icon: Music, label: 'Musician' },
  { icon: Code, label: 'Developer' },
  { icon: Camera, label: 'Photographer' },
];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const steps = [
    // Step 1: Creator type
    <div key="type" className="space-y-4">
      <h2 className="font-display text-xl font-bold text-foreground text-center">What do you create?</h2>
      <div className="grid grid-cols-2 gap-3">
        {creatorTypes.map((t) => (
          <button
            key={t.label}
            onClick={() => setSelected(t.label)}
            className={`glass-panel flex flex-col items-center gap-2 p-5 transition-all duration-300 ${
              selected === t.label ? 'neon-border scale-[1.03]' : 'hover:scale-[1.02]'
            }`}
          >
            <t.icon size={28} className={selected === t.label ? 'text-neon-cyan' : 'text-muted-foreground'} />
            <span className="font-display text-xs text-foreground">{t.label}</span>
          </button>
        ))}
      </div>
    </div>,
    // Step 2: Account details
    <div key="details" className="space-y-4">
      <h2 className="font-display text-xl font-bold text-foreground text-center">Create your account</h2>
      <div className="relative">
        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Display Name" className="w-full rounded-xl border border-border bg-secondary/30 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
      </div>
      <div className="relative">
        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="email" placeholder="Email" className="w-full rounded-xl border border-border bg-secondary/30 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
      </div>
      <div className="relative">
        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="password" placeholder="Password" className="w-full rounded-xl border border-border bg-secondary/30 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
      </div>
    </div>,
    // Step 3: Welcome
    <div key="welcome" className="text-center space-y-4">
      <div className="text-5xl">🚀</div>
      <h2 className="font-display text-2xl font-bold text-foreground glow-text">You're In!</h2>
      <p className="text-sm text-muted-foreground">Your creative vault is ready. Start protecting your work.</p>
      <Link to="/dashboard" className="magnetic-btn inline-flex items-center gap-2 rounded-full px-8 py-3 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
        Go to Dashboard <ArrowRight size={16} />
      </Link>
    </div>,
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/20 via-background to-background" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel neon-border relative w-full max-w-md p-8"
      >
        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {[0, 1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-neon-cyan' : 'bg-secondary'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {step < 2 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className={`flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ${step === 0 ? 'invisible' : ''}`}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={() => setStep(step + 1)}
              className="magnetic-btn flex items-center gap-2 rounded-full px-6 py-2 font-display text-xs font-semibold uppercase tracking-widest text-primary-foreground"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-cyan hover:underline">Sign In</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
