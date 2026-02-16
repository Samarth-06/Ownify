import { motion } from 'framer-motion';
import { Upload, FileImage, Music, Code, FileText } from 'lucide-react';

const fileTypes = [
  { icon: FileImage, label: 'Image / Art', ext: '.png, .jpg, .svg' },
  { icon: Music, label: 'Audio / Music', ext: '.mp3, .wav, .flac' },
  { icon: Code, label: 'Code / Software', ext: '.zip, .tar, .gz' },
  { icon: FileText, label: 'Document / Writing', ext: '.pdf, .doc, .txt' },
];

export default function UploadWork() {
  return (
    <div className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-background" />
      <div className="relative mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground glow-text mb-2">Upload Work</h1>
          <p className="text-sm text-muted-foreground mb-10">Protect your creation with a timestamped proof</p>

          {/* Drop zone */}
          <div className="glass-panel neon-border flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neon-cyan/30 p-16 mb-8 hover:border-neon-cyan/60 transition-colors cursor-pointer">
            <Upload size={40} className="text-neon-cyan opacity-60" />
            <p className="font-display text-sm text-foreground">Drag & drop your file here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>

          {/* File types */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {fileTypes.map((f) => (
              <div key={f.label} className="glass-panel flex items-center gap-3 p-4">
                <f.icon size={20} className="text-neon-purple" />
                <div>
                  <p className="font-display text-xs font-semibold text-foreground">{f.label}</p>
                  <p className="text-[10px] text-muted-foreground">{f.ext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="glass-panel p-6 space-y-4">
            <input placeholder="Work Title" className="w-full rounded-xl border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors" />
            <textarea placeholder="Description (optional)" rows={3} className="w-full rounded-xl border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors resize-none" />
            <select className="w-full rounded-xl border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors">
              <option>Select License Type</option>
              <option>Creative Commons BY-NC</option>
              <option>Exclusive License</option>
              <option>Commercial License</option>
              <option>Personal Use Only</option>
            </select>
            <button className="magnetic-btn w-full rounded-full py-3 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
              Protect & Publish
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
