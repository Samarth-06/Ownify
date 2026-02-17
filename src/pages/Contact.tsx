import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

const Contact = () => (
  <div className="relative min-h-screen bg-background pt-24 px-6">
    <div className="mx-auto max-w-4xl py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
        <h1 className="font-display text-5xl font-bold glow-text mb-4">Get in Touch</h1>
        <p className="text-muted-foreground text-lg">We'd love to hear from you. Reach out anytime.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
          <div className="glass-panel p-6 flex items-start gap-4">
            <Mail className="text-neon-cyan mt-1" size={20} />
            <div>
              <h3 className="font-display font-semibold text-foreground">Email</h3>
              <p className="text-sm text-muted-foreground">hello@creatorshield.io</p>
            </div>
          </div>
          <div className="glass-panel p-6 flex items-start gap-4">
            <MessageSquare className="text-neon-pink mt-1" size={20} />
            <div>
              <h3 className="font-display font-semibold text-foreground">Discord</h3>
              <p className="text-sm text-muted-foreground">Join our community server</p>
            </div>
          </div>
          <div className="glass-panel p-6 flex items-start gap-4">
            <MapPin className="text-neon-purple mt-1" size={20} />
            <div>
              <h3 className="font-display font-semibold text-foreground">Location</h3>
              <p className="text-sm text-muted-foreground">San Francisco, CA · Remote-first</p>
            </div>
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel neon-border p-8 space-y-4">
          <input placeholder="Your name" className="w-full rounded-lg border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
          <input placeholder="your@email.com" className="w-full rounded-lg border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
          <textarea placeholder="Your message..." rows={5} className="w-full rounded-lg border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors resize-none" />
          <button type="button" className="magnetic-btn w-full rounded-full py-3 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
            Send Message
          </button>
        </motion.form>
      </div>
    </div>
  </div>
);

export default Contact;
