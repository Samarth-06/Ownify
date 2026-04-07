import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, BadgeCheck, Clock, Loader } from 'lucide-react';

interface Copyright {
  id: string;
  title: string;
  description: string;
  file_hash: string;
  license_type: string;
  created_at: string;
  user_profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export default function CreatorFeed() {
  const [copyrights, setCopyrights] = useState<Copyright[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCopyrights();
  }, []);

  const fetchCopyrights = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/copyrights/feed/all`);
      const data = await response.json();
      setCopyrights(data.copyrights || []);
    } catch (error) {
      console.error('Failed to fetch copyrights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id: string) => {
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleSave = (id: string) => {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const getTimeAgo = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader size={40} className="animate-spin text-neon-cyan" />
          </div>
        ) : copyrights.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No copyrights registered yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copyrights.map((copyright, i) => (
              <motion.div
                key={copyright.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-panel group overflow-hidden cursor-pointer"
              >
                {/* Artwork preview */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${copyright.id}/600/450`}
                    alt={copyright.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-pink opacity-25 mix-blend-overlay" />
                  {/* Timestamp badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 glass-panel px-2 py-1 text-[10px] text-muted-foreground">
                    <Clock size={10} />
                    <span>Protected</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xs font-bold">
                      {copyright.user_profiles?.full_name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-display text-sm font-semibold text-foreground truncate">
                          {copyright.user_profiles?.full_name || 'Unknown'}
                        </span>
                        <BadgeCheck size={14} className="text-neon-cyan flex-shrink-0" />
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate">
                        @{copyright.user_profiles?.username || 'user'}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {getTimeAgo(copyright.created_at)}
                    </span>
                  </div>
                  <p className="font-display text-sm text-foreground mb-2 line-clamp-2">{copyright.title}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{copyright.description}</p>
                  <div className="flex items-center gap-4 border-t border-border pt-3">
                    <button onClick={() => toggleLike(copyright.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-pink transition-colors">
                      <Heart size={16} className={liked.has(copyright.id) ? 'fill-neon-pink text-neon-pink' : ''} />
                      <span>{liked.has(copyright.id) ? '1' : '0'}</span>
                    </button>
                    <button onClick={() => toggleSave(copyright.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan transition-colors">
                      <Bookmark size={16} className={saved.has(copyright.id) ? 'fill-neon-cyan text-neon-cyan' : ''} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
