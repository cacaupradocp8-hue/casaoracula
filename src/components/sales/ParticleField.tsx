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
  tailLength: number;
  speed: number;
  angle: number;
}

interface Props {
  density?: number;
  color?: string;
  className?: string;
}

export function ParticleField({ density = 80, color = '216,255,62', className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? Math.floor(density * 0.4) : density;

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const speed = Math.random() * 2.5 + 1.5;
      const angle = Math.random() * 0.4 + 1.2; // ~70-90 degrees downward with slight diagonal
      particles.push({
        x: Math.random() * w * 1.5,
        y: Math.random() * h - h * 0.3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 1.8 + 0.8,
        opacity: 0,
        baseOpacity: Math.random() * 0.6 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        tailLength: Math.random() * 30 + 15,
        speed,
        angle,
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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulse += p.pulseSpeed;
        p.opacity = p.baseOpacity + Math.sin(p.pulse) * 0.15;

        // Move along meteor angle
        p.x += p.vx;
        p.y += p.vy;

        // Reset when off screen
        if (p.y > h() + 20 || p.x > w() + 50 || p.x < -50) {
          p.x = Math.random() * w() * 1.5 - w() * 0.25;
          p.y = -Math.random() * h() * 0.3;
          p.speed = Math.random() * 2.5 + 1.5;
          p.angle = Math.random() * 0.4 + 1.2;
          p.vx = Math.cos(p.angle) * p.speed;
          p.vy = Math.sin(p.angle) * p.speed;
        }

        // Draw meteor streak (line with gradient)
        const tailX = p.x - Math.cos(p.angle) * p.tailLength;
        const tailY = p.y - Math.sin(p.angle) * p.tailLength;
        
        const grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
        grad.addColorStop(0, `rgba(${color},0)`);
        grad.addColorStop(0.7, `rgba(${color},${p.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(${color},${p.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.size * 0.8;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright head dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity * 1.2})`;
        ctx.fill();
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
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
