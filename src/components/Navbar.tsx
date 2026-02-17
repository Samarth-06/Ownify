import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Showcase', to: '/showcase' },
  { label: 'Feed', to: '/feed' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Docs', to: '/docs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed left-0 right-0 z-50 px-3 transition-all duration-500 ${
        scrolled ? 'top-2' : 'top-4'
      }`}
    >
      <div className="glass-panel neon-border mx-auto max-w-[1600px] px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink transition-shadow duration-300 group-hover:shadow-[0_0_20px_hsl(263_70%_58%/0.5)]">
              <span className="font-display text-xs font-bold text-primary-foreground">◈</span>
            </div>
            <span className="font-display text-sm font-bold text-foreground tracking-wide hidden md:block">
              CreatorShield
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`relative px-2 py-1.5 font-body text-[10px] tracking-wider uppercase transition-colors duration-300 rounded-md hover:text-foreground whitespace-nowrap ${
                    isActive ? 'text-neon-cyan' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md border border-neon-cyan/30 bg-neon-cyan/5"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth buttons + mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="hidden lg:block magnetic-btn-outline rounded-full px-4 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wide text-foreground"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hidden lg:block magnetic-btn rounded-full px-4 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wide text-primary-foreground"
            >
              Sign Up
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-foreground p-1"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel neon-border mx-auto max-w-[1600px] mt-2 overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="px-4 py-2.5 rounded-lg font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex gap-3 pt-3 border-t border-border">
                <Link to="/login" className="flex-1 text-center magnetic-btn-outline rounded-full px-4 py-2 font-display text-xs uppercase tracking-widest text-foreground">Login</Link>
                <Link to="/signup" className="flex-1 text-center magnetic-btn rounded-full px-4 py-2 font-display text-xs uppercase tracking-widest text-primary-foreground">Sign Up</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
