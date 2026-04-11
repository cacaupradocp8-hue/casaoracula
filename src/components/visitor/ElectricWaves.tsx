import { useEffect, useRef } from 'react';

/**
 * ElectricWaves — Ondas elétricas orgânicas fluindo pela tela.
 * Movimento sutil e hipnótico que reforça a presença do campo.
 */
export function ElectricWaves({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

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
    };

    resize();
    window.addEventListener('resize', resize);

    const waves = [
      { y: 0.3, amplitude: 30, frequency: 0.008, speed: 0.012, opacity: 0.08, width: 1.2 },
      { y: 0.4, amplitude: 22, frequency: 0.012, speed: 0.018, opacity: 0.06, width: 0.8 },
      { y: 0.5, amplitude: 40, frequency: 0.006, speed: 0.008, opacity: 0.10, width: 1.5 },
      { y: 0.6, amplitude: 18, frequency: 0.015, speed: 0.022, opacity: 0.05, width: 0.6 },
      { y: 0.7, amplitude: 35, frequency: 0.009, speed: 0.014, opacity: 0.07, width: 1.0 },
    ];

    let t = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      t += 1;

      for (const wave of waves) {
        const baseY = h * wave.y;

        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= w; x += 2) {
          const phase = t * wave.speed;
          const y =
            baseY +
            Math.sin(x * wave.frequency + phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2.3 + phase * 1.4) * (wave.amplitude * 0.3) +
            Math.cos(x * wave.frequency * 0.7 + phase * 0.6) * (wave.amplitude * 0.15);
          ctx.lineTo(x, y);
        }

        // gold color: rgb(201, 164, 92)
        ctx.strokeStyle = `rgba(201, 164, 92, ${wave.opacity})`;
        ctx.lineWidth = wave.width;
        ctx.stroke();

        // Glow effect
        ctx.strokeStyle = `rgba(201, 164, 92, ${wave.opacity * 0.3})`;
        ctx.lineWidth = wave.width * 4;
        ctx.stroke();
      }

      // Spark nodes at wave intersections
      for (let i = 0; i < waves.length - 1; i++) {
        const w1 = waves[i];
        const w2 = waves[i + 1];
        const sparkX = (Math.sin(t * 0.01 + i) * 0.5 + 0.5) * w;
        const phase1 = t * w1.speed;
        const phase2 = t * w2.speed;
        const y1 = h * w1.y + Math.sin(sparkX * w1.frequency + phase1) * w1.amplitude;
        const y2 = h * w2.y + Math.sin(sparkX * w2.frequency + phase2) * w2.amplitude;
        const midY = (y1 + y2) / 2;
        const dist = Math.abs(y1 - y2);

        if (dist < 60) {
          const sparkOpacity = (1 - dist / 60) * 0.25;
          ctx.beginPath();
          ctx.arc(sparkX, midY, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 164, 92, ${sparkOpacity})`;
          ctx.fill();

          // Spark glow
          ctx.beginPath();
          ctx.arc(sparkX, midY, 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 164, 92, ${sparkOpacity * 0.3})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.8 }}
    />
  );
}
