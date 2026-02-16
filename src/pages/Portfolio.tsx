import { motion } from 'framer-motion';
import { BadgeCheck, Calendar, Eye } from 'lucide-react';

const works = [
  { title: 'Neural Bloom Series', creator: 'Aria Chen', date: 'Jan 2025', views: '12.4k', license: 'CC BY-NC', gradient: 'from-neon-purple to-neon-pink' },
  { title: 'Digital Currents', creator: 'Max Torres', date: 'Feb 2025', views: '8.1k', license: 'Exclusive', gradient: 'from-neon-cyan to-neon-purple' },
  { title: 'Synthetic Dreams', creator: 'Lena Park', date: 'Mar 2025', views: '15.3k', license: 'Open Use', gradient: 'from-neon-pink to-accent' },
  { title: 'Chromatic Whisper', creator: 'Dev Kapoor', date: 'Apr 2025', views: '6.7k', license: 'Commercial', gradient: 'from-neon-purple to-neon-cyan' },
  { title: 'Void Echo', creator: 'Sasha Kim', date: 'May 2025', views: '9.2k', license: 'Personal', gradient: 'from-neon-cyan to-neon-pink' },
  { title: 'Fractal Identity', creator: 'Rio Alvarez', date: 'Jun 2025', views: '11.5k', license: 'CC BY-NC', gradient: 'from-accent to-neon-purple' },
];

export default function Portfolio() {
  return (
    <div className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-background" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground glow-text">Verified Portfolio</h1>
          <p className="mt-3 text-muted-foreground">Authenticated creative works from our community</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-panel overflow-hidden group cursor-pointer"
            >
              <div className={`aspect-video bg-gradient-to-br ${w.gradient} opacity-40 group-hover:opacity-60 transition-opacity relative`}>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 glass-panel px-2 py-1">
                  <BadgeCheck size={12} className="text-neon-cyan" />
                  <span className="text-[10px] text-neon-cyan font-medium">Verified</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-foreground">{w.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{w.creator}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={10} />{w.date}</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{w.views}</span>
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-neon-purple/15 text-neon-purple">{w.license}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
