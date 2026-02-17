import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BadgeCheck, Calendar, User } from 'lucide-react';

const artworks = [
  {
    title: 'Neural Bloom',
    creator: 'Aria Chen',
    date: 'Jan 12, 2025',
    license: 'Creative Commons BY-NC',
    color: 'from-neon-purple to-neon-pink',
    bgColor: 'hsl(263 70% 30%)',
  },
  {
    title: 'Digital Currents',
    creator: 'Max Torres',
    date: 'Feb 3, 2025',
    license: 'Exclusive License',
    color: 'from-neon-cyan to-neon-purple',
    bgColor: 'hsl(187 60% 25%)',
  },
  {
    title: 'Synthetic Dreams',
    creator: 'Lena Park',
    date: 'Mar 18, 2025',
    license: 'Open Use with Attribution',
    color: 'from-neon-pink to-accent',
    bgColor: 'hsl(330 60% 25%)',
  },
  {
    title: 'Chromatic Whisper',
    creator: 'Dev Kapoor',
    date: 'Apr 7, 2025',
    license: 'Commercial License',
    color: 'from-neon-purple to-neon-cyan',
    bgColor: 'hsl(260 50% 28%)',
  },
  {
    title: 'Void Echo',
    creator: 'Sasha Kim',
    date: 'May 22, 2025',
    license: 'Personal Use Only',
    color: 'from-neon-cyan to-neon-pink',
    bgColor: 'hsl(200 50% 22%)',
  },
  {
    title: 'Fractal Identity',
    creator: 'Rio Alvarez',
    date: 'Jun 1, 2025',
    license: 'NFT Backed License',
    color: 'from-accent to-neon-purple',
    bgColor: 'hsl(340 50% 25%)',
  },
];

export default function CreatorShowcase() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="font-display text-4xl font-bold sm:text-5xl glow-text">
            Creator Showcase
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A gallery of verified, protected digital works
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {artworks.map((art, i) => (
            <motion.div
              key={art.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.03 }}
              onClick={() => setSelected(i)}
              className="group cursor-pointer"
            >
              <div
                className="glass-panel relative aspect-[4/5] overflow-hidden"
              >
                {/* Art placeholder image */}
                <img
                  src={`https://picsum.photos/seed/${art.title.replace(/\s/g, '')}/400/500`}
                  alt={art.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-500"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${art.color} opacity-20 mix-blend-overlay`} />

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                  <p className="font-display text-sm font-semibold text-foreground">{art.title}</p>
                  <p className="text-xs text-muted-foreground">{art.creator}</p>
                </div>

                {/* Verified badge */}
                <div className="absolute right-3 top-3">
                  <BadgeCheck size={18} className="text-neon-cyan opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel neon-border relative w-full max-w-md p-8"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              {/* Artwork preview */}
              <div className={`mb-6 aspect-video rounded-lg bg-gradient-to-br ${artworks[selected].color} opacity-50`} />

              <h3 className="font-display text-2xl font-bold text-foreground glow-text">
                {artworks[selected].title}
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User size={16} className="text-neon-purple" />
                  <span>{artworks[selected].creator}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar size={16} className="text-neon-pink" />
                  <span>{artworks[selected].date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <BadgeCheck size={16} className="text-neon-cyan" />
                  <span className="text-neon-cyan">Verified & Protected</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-secondary/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">License</p>
                <p className="text-sm font-medium text-foreground">{artworks[selected].license}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
