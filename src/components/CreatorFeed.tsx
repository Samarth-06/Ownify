import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, BadgeCheck, Clock } from 'lucide-react';

const posts = [
  { id: 1, creator: 'Aria Chen', handle: '@ariachen', avatar: '🎨', title: 'Neural Bloom Series #4', timestamp: '2h ago', likes: 342, gradient: 'from-neon-purple to-neon-pink', verified: true },
  { id: 2, creator: 'Max Torres', handle: '@maxtorres', avatar: '🎵', title: 'Ambient Drift — Track 07', timestamp: '5h ago', likes: 189, gradient: 'from-neon-cyan to-neon-purple', verified: true },
  { id: 3, creator: 'Lena Park', handle: '@lenapark', avatar: '📸', title: 'Urban Geometry Collection', timestamp: '8h ago', likes: 521, gradient: 'from-neon-pink to-accent', verified: true },
  { id: 4, creator: 'Dev Kapoor', handle: '@devkapoor', avatar: '💻', title: 'Open Source UI Kit v3', timestamp: '12h ago', likes: 274, gradient: 'from-neon-purple to-neon-cyan', verified: false },
  { id: 5, creator: 'Sasha Kim', handle: '@sashakim', avatar: '✏️', title: 'Illustrated Story: Void Echo', timestamp: '1d ago', likes: 698, gradient: 'from-neon-cyan to-neon-pink', verified: true },
  { id: 6, creator: 'Rio Alvarez', handle: '@rioalvarez', avatar: '🎬', title: 'Cinematic Short: Fractal', timestamp: '1d ago', likes: 412, gradient: 'from-accent to-neon-purple', verified: true },
];

export default function CreatorFeed() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleSave = (id: number) => {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <section id="feed" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-4xl font-bold sm:text-5xl glow-text">Creator Feed</h2>
          <p className="mt-4 text-muted-foreground text-lg">See what creators are protecting right now</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-panel group overflow-hidden cursor-pointer"
            >
              {/* Artwork preview */}
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${post.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}>
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30 group-hover:opacity-60 transition-opacity">
                  {post.avatar}
                </div>
                {/* Timestamp badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 glass-panel px-2 py-1 text-[10px] text-muted-foreground">
                  <Clock size={10} />
                  <span>Protected</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{post.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-display text-sm font-semibold text-foreground">{post.creator}</span>
                      {post.verified && <BadgeCheck size={14} className="text-neon-cyan" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{post.handle}</span>
                  </div>
                  <span className="ml-auto text-[11px] text-muted-foreground">{post.timestamp}</span>
                </div>
                <p className="font-display text-sm text-foreground mb-3">{post.title}</p>
                <div className="flex items-center gap-4 border-t border-border pt-3">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-pink transition-colors">
                    <Heart size={16} className={liked.has(post.id) ? 'fill-neon-pink text-neon-pink' : ''} />
                    <span>{post.likes + (liked.has(post.id) ? 1 : 0)}</span>
                  </button>
                  <button onClick={() => toggleSave(post.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan transition-colors">
                    <Bookmark size={16} className={saved.has(post.id) ? 'fill-neon-cyan text-neon-cyan' : ''} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
