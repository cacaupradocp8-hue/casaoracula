import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  pulse: number;
  pulseSpeed: number;
}

interface Props {
  density?: number;
  color?: string;
  className?: string;
}

export function ParticleField({ density = 35, color = '216,255,62', className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? Math.floor(density * 0.3) : density;

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const edgeMargin = w * 0.2; // particles pushed toward edges
    for (let i = 0; i < count; i++) {
      // Bias particles toward edges: 70% in edge zones, 30% anywhere
      let px: number;
      if (Math.random() < 0.7) {
        // Left or right edge zone
        px = Math.random() < 0.5
          ? Math.random() * edgeMargin
          : w - Math.random() * edgeMargin;
      } else {
        px = Math.random() * w;
      }

      particles.push({
        x: px,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: Math.random() * 0.15 + 0.05,
        size: Math.random() * 1.5 + 1,
        opacity: 0,
        baseOpacity: Math.random() * 0.2 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.006 + 0.002,
      });
    }
    particlesRef.current = particles;
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      if (particlesRef.current.length === 0) {
        initParticles(window.innerWidth, window.innerHeight);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMouse);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const particles = particlesRef.current;
      const centerX = w() / 2;
      const fadeZone = w() * 0.25; // center zone where particles fade out

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulse += p.pulseSpeed;

        // Fade particles near center for text readability
        const distFromCenter = Math.abs(p.x - centerX);
        const centerFade = Math.min(distFromCenter / fadeZone, 1);
        p.opacity = (p.baseOpacity + Math.sin(p.pulse) * 0.08) * centerFade;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w();
        if (p.x > w()) p.x = 0;
        if (p.y < 0) p.y = h();
        if (p.y > h()) p.y = 0;

        if (p.opacity < 0.01) continue; // skip invisible

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity})`;
        ctx.fill();

        // Lines — only between edge particles, reduced range
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const lx = p.x - q.x;
          const ly = p.y - q.y;
          const ld = Math.sqrt(lx * lx + ly * ly);
          if (ld < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color},${(1 - ld / 80) * 0.04})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [color, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ mixBlendMode: 'screen', opacity: 0.6 }}
    />
  );
}
