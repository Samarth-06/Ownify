import { motion } from 'framer-motion';
import { Book, Zap, Shield, Code, FileText, HelpCircle } from 'lucide-react';

const sections = [
  { icon: Zap, title: 'Getting Started', desc: 'Learn the basics of protecting your work in under 5 minutes.', articles: 4 },
  { icon: Shield, title: 'Proof of Creation', desc: 'How timestamping and digital fingerprinting work.', articles: 6 },
  { icon: FileText, title: 'Licensing Guide', desc: 'Understand different license types and how to apply them.', articles: 8 },
  { icon: Code, title: 'API Reference', desc: 'Integrate CreatorShield into your tools and workflows.', articles: 12 },
  { icon: Book, title: 'Best Practices', desc: 'Tips for building a strong verified portfolio.', articles: 5 },
  { icon: HelpCircle, title: 'FAQ & Support', desc: 'Answers to common questions and how to get help.', articles: 10 },
];

export default function Docs() {
  return (
    <div className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-background" />
      <div className="relative mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground glow-text">Documentation</h1>
          <p className="mt-3 text-muted-foreground">Everything you need to know about CreatorShield</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <input placeholder="Search docs…" className="w-full glass-panel rounded-2xl border border-border py-4 px-6 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-panel p-6 cursor-pointer group"
            >
              <s.icon size={24} className="text-neon-cyan mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <p className="mt-3 text-[11px] text-neon-purple">{s.articles} articles</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
