import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/20 via-background to-background" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-panel neon-border relative w-full max-w-md p-8"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-pink">
            <span className="font-display text-xl font-bold text-primary-foreground">◈</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground glow-text">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your creative vault</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="email" placeholder="Email" className="w-full rounded-xl border border-border bg-secondary/30 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="password" placeholder="Password" className="w-full rounded-xl border border-border bg-secondary/30 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
          </div>
          <button type="submit" className="magnetic-btn flex w-full items-center justify-center gap-2 rounded-full py-3 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neon-cyan hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
