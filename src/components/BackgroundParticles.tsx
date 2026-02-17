import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number;
}
interface ShootingStar {
  x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number;
}

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = document.body.scrollHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars: Star[] = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 2.5 + 0.3,
      opacity: Math.random() * 0.8 + 0.2,
      hue: Math.random() > 0.7 ? 0 : (Math.random() > 0.5 ? 187 : 263),
    }));

    const shootingStars: ShootingStar[] = [];
    let shootTimer = 0;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Particles
      for (const s of stars) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + s.x + s.y);
        const twinkle = 0.6 + 0.4 * Math.sin(Date.now() * 0.005 + s.x * 3);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2);
        const isWhite = s.hue === 0;
        const color = isWhite
          ? `rgba(255, 255, 255, ${s.opacity * pulse})`
          : `hsla(${s.hue}, 100%, 75%, ${s.opacity * pulse})`;
        ctx.fillStyle = color;
        ctx.shadowBlur = isWhite ? 6 : 12;
        ctx.shadowColor = isWhite ? 'rgba(255,255,255,0.5)' : `hsla(${s.hue}, 100%, 70%, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Shooting stars
      shootTimer++;
      if (shootTimer > 30 && Math.random() < 0.08) {
        shootTimer = 0;
        const angle = Math.PI / 4 + Math.random() * 0.5;
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.3,
          vx: Math.cos(angle) * (4 + Math.random() * 4),
          vy: Math.sin(angle) * (4 + Math.random() * 4),
          life: 0,
          maxLife: 40 + Math.random() * 30,
          size: 1.5 + Math.random() * 1.5,
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.life++;
        const alpha = 1 - ss.life / ss.maxLife;
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        grad.addColorStop(0, `hsla(187, 100%, 80%, ${alpha})`);
        grad.addColorStop(1, `hsla(260, 100%, 70%, 0)`);
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.size;
        ctx.stroke();
        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
