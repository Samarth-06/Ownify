import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const platformLinks = [
  { label: 'Features', to: '/#features' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Creator Feed', to: '/#feed' },
];

const resourceLinks = [
  { label: 'Documentation', to: '/docs' },
  { label: 'API Reference', to: '/docs' },
  { label: 'Best Practices', to: '/docs' },
  { label: 'Community', to: '/#feed' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
  { label: 'Cookie Policy', to: '#' },
];

const socialLinks = [
  { label: 'Twitter / X', url: '#' },
  { label: 'Discord', url: '#' },
  { label: 'GitHub', url: '#' },
  { label: 'Instagram', url: '#' },
];

export default function FooterSection() {
  return (
    <footer className="relative pt-20 pb-10 px-6">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-neon-blue/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel neon-border p-8 sm:p-12 mb-16 text-center"
        >
          <h3 className="font-display text-2xl font-bold text-foreground glow-text mb-2">Join the Creator Movement</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Get updates on new features, creator stories, and platform launches.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-border bg-secondary/30 py-3 px-5 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors"
            />
            <button className="magnetic-btn flex items-center gap-2 rounded-full px-6 py-3 font-display text-xs font-semibold uppercase tracking-widest text-primary-foreground">
              Subscribe <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* Links grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink">
                <span className="font-display text-sm font-bold text-primary-foreground">◈</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground">CreatorShield</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The creative protection ecosystem. Prove ownership, license your work, and build your verified portfolio.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((l) => (
                <li key={l.label}><Link to={l.to} className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((l) => (
                <li key={l.label}><Link to={l.to} className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Community</h4>
            <ul className="space-y-2">
              {socialLinks.map((l) => (
                <li key={l.label}><a href={l.url} className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.label}><Link to={l.to} className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display text-sm text-muted-foreground tracking-wide">
            Own What You Create
          </p>
          <p className="text-[11px] text-muted-foreground/50">
            © 2025 CreatorShield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
