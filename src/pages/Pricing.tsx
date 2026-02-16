import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'For independent creators getting started',
    features: ['5 protected works', 'Basic timestamp proof', 'Public portfolio', 'Community support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12/mo',
    desc: 'For serious creators building their brand',
    features: ['Unlimited protected works', 'Smart licensing engine', 'Plagiarism detection', 'Analytics dashboard', 'Priority support', 'Custom portfolio URL'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Studio',
    price: '$39/mo',
    desc: 'For teams and creative studios',
    features: ['Everything in Pro', 'Team collaboration', 'API access', 'Bulk upload tools', 'White-label certificates', 'Dedicated account manager'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-background" />
      <div className="relative mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground glow-text">Pricing</h1>
          <p className="mt-3 text-muted-foreground">Simple plans for every creative journey</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel relative p-8 ${plan.highlight ? 'neon-border scale-[1.03]' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-4 py-1">
                  <Sparkles size={12} className="text-primary-foreground" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most Popular</span>
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 font-display text-3xl font-bold text-foreground glow-text">{plan.price}</div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-neon-cyan flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`mt-8 w-full rounded-full py-3 font-display text-sm font-semibold uppercase tracking-widest ${
                plan.highlight
                  ? 'magnetic-btn text-primary-foreground'
                  : 'magnetic-btn-outline text-foreground'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
