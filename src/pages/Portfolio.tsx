import { motion } from 'framer-motion';
import { BadgeCheck, Calendar, Eye, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Copyright {
  id: string;
  title: string;
  description: string;
  file_hash: string;
  ipfs_hash: string;
  license_type: string;
  created_at: string;
}

export default function Portfolio() {
  const { token, username } = useAuth();
  const navigate = useNavigate();
  const [copyrights, setCopyrights] = useState<Copyright[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCopyrights();
  }, [token, username]);

  const fetchUserCopyrights = async () => {
    try {
      setLoading(true);

      if (!token) {
        navigate('/login');
        return;
      }

      if (!username) {
        console.warn('Username not available');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/users/${username}/copyrights`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch copyrights');
      }

      const data = await response.json();
      setCopyrights(data.copyrights || []);
    } catch (error) {
      console.error('Failed to fetch user copyrights:', error);
      setCopyrights([]);
    } finally {
      setLoading(false);
    }
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
    <div className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-background" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground glow-text">My Portfolio</h1>
          <p className="mt-3 text-muted-foreground">Your protected creative works</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader size={40} className="animate-spin text-neon-cyan" />
          </div>
        ) : copyrights.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No copyrights registered yet.</p>
            <p className="text-muted-foreground text-sm mt-2">Upload and register your first work to see it here!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copyrights.map((copyright, i) => (
              <motion.div
                key={copyright.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-panel overflow-hidden group cursor-pointer"
              >
                <div className={`aspect-video bg-gradient-to-br from-neon-purple to-neon-pink opacity-40 group-hover:opacity-60 transition-opacity relative`}>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 glass-panel px-2 py-1">
                    <BadgeCheck size={12} className="text-neon-cyan" />
                    <span className="text-[10px] text-neon-cyan font-medium">Verified</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-foreground">{copyright.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{copyright.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={10} />{getTimeAgo(copyright.created_at)}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-neon-purple/15 text-neon-purple">{copyright.license_type}</span>
                  </div>
                  <div className="mt-3 p-2 bg-background/50 rounded text-[10px] text-muted-foreground break-all">
                    <span className="font-mono">Hash: {copyright.file_hash.substring(0, 20)}...</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
