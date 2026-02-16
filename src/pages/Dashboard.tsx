import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, Shield, Eye, FileText, Plus, TrendingUp, Clock } from 'lucide-react';

const stats = [
  { label: 'Protected Works', value: '24', icon: Shield, color: 'text-neon-purple' },
  { label: 'Active Licenses', value: '12', icon: FileText, color: 'text-neon-pink' },
  { label: 'Views This Month', value: '3.2k', icon: Eye, color: 'text-neon-cyan' },
  { label: 'Earnings', value: '$840', icon: TrendingUp, color: 'text-neon-purple' },
];

const recentWorks = [
  { title: 'Neural Bloom #5', type: 'Illustration', date: 'Feb 14, 2026', status: 'Protected' },
  { title: 'Ambient Loop Pack', type: 'Audio', date: 'Feb 12, 2026', status: 'Licensed' },
  { title: 'UI Kit v4.0', type: 'Design', date: 'Feb 10, 2026', status: 'Protected' },
  { title: 'Photo Series: Neon', type: 'Photography', date: 'Feb 8, 2026', status: 'For Sale' },
];

export default function Dashboard() {
  return (
    <div className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-background" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground glow-text">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back, Creator</p>
          </div>
          <Link to="/upload" className="magnetic-btn flex items-center gap-2 rounded-full px-6 py-3 font-display text-xs font-semibold uppercase tracking-widest text-primary-foreground">
            <Plus size={16} /> Upload Work
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <s.icon size={22} className={s.color} />
                <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent works */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Works</h2>
          <div className="space-y-3">
            {recentWorks.map((w) => (
              <div key={w.title} className="flex items-center justify-between rounded-xl bg-secondary/20 p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
                <div>
                  <p className="font-display text-sm font-medium text-foreground">{w.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-muted-foreground">{w.type}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock size={10} />{w.date}</span>
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${
                  w.status === 'Protected' ? 'bg-neon-purple/20 text-neon-purple' :
                  w.status === 'Licensed' ? 'bg-neon-cyan/20 text-neon-cyan' :
                  'bg-neon-pink/20 text-neon-pink'
                }`}>{w.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
