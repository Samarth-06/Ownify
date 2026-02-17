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

    const stars: Star[] = Array.from({ length: 400 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.4,
      hue: Math.random() > 0.6 ? 0 : (Math.random() > 0.5 ? 187 : 300),
    }));

    const shootingStars: ShootingStar[] = [];
    let shootTimer = 0;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003 + s.x + s.y);
        const twinkle = 0.6 + 0.4 * Math.sin(Date.now() * 0.006 + s.x * 2);
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2);
        
        if (s.hue === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * pulse * 0.8})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(255, 255, 255, ${pulse * 0.6})`;
        } else if (s.hue === 187) {
          ctx.fillStyle = `rgba(0, 255, 255, ${s.opacity * pulse})`;
          ctx.shadowBlur = 18;
          ctx.shadowColor = `rgba(0, 255, 255, ${pulse * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(255, 0, 255, ${s.opacity * pulse})`;
          ctx.shadowBlur = 18;
          ctx.shadowColor = `rgba(255, 0, 255, ${pulse * 0.8})`;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Shooting stars
      shootTimer++;
      if (shootTimer > 30 && Math.random() < 0.1) {
        shootTimer = 0;
        const angle = Math.PI / 4 + Math.random() * 0.4;
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.3,
          vx: Math.cos(angle) * (3 + Math.random() * 3),
          vy: Math.sin(angle) * (3 + Math.random() * 3),
          life: 0,
          maxLife: 35 + Math.random() * 25,
          size: 1.2 + Math.random() * 1.2,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;

        const alpha = 1 - ss.life / ss.maxLife;
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 10, ss.y - ss.vy * 10);
        grad.addColorStop(0, `rgba(0, 255, 255, ${alpha * 0.9})`);
        grad.addColorStop(1, `rgba(255, 0, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 10, ss.y - ss.vy * 10);
        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.size;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(0, 255, 255, ${alpha * 0.7})`;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        opacity: 0.8,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 255, 200, 0.1) 0%, rgba(255, 0, 100, 0.05) 40%, transparent 100%)',
      }}
    />
  );
}
