import { useEffect, useRef } from 'react';

/**
 * ElectricWaves — Ondas sonoras luminosas em tons de azul elétrico.
 * Efeito de raios fluindo, brilhantes e hipnóticos.
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Cores em azul elétrico / ciano luminoso
    const waves = [
      { y: 0.20, amplitude: 50, frequency: 0.006, speed: 0.010, opacity: 0.55, width: 1.6, color: '120, 180, 255' },
      { y: 0.32, amplitude: 35, frequency: 0.010, speed: 0.016, opacity: 0.40, width: 1.0, color: '90, 160, 255' },
      { y: 0.45, amplitude: 60, frequency: 0.005, speed: 0.008, opacity: 0.65, width: 2.0, color: '140, 200, 255' },
      { y: 0.55, amplitude: 28, frequency: 0.013, speed: 0.020, opacity: 0.35, width: 0.9, color: '80, 150, 255' },
      { y: 0.68, amplitude: 55, frequency: 0.007, speed: 0.012, opacity: 0.55, width: 1.8, color: '160, 210, 255' },
      { y: 0.80, amplitude: 40, frequency: 0.009, speed: 0.014, opacity: 0.45, width: 1.2, color: '100, 170, 255' },
    ];

    let t = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      // additive blending para sensação luminosa
      ctx.globalCompositeOperation = 'lighter';
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
            Math.sin(x * wave.frequency * 2.3 + phase * 1.4) * (wave.amplitude * 0.35) +
            Math.cos(x * wave.frequency * 0.7 + phase * 0.6) * (wave.amplitude * 0.2);
          ctx.lineTo(x, y);
        }

        // Glow externo grande
        ctx.shadowBlur = 24;
        ctx.shadowColor = `rgba(${wave.color}, 0.9)`;
        ctx.strokeStyle = `rgba(${wave.color}, ${wave.opacity * 0.35})`;
        ctx.lineWidth = wave.width * 6;
        ctx.stroke();

        // Linha intermediária
        ctx.shadowBlur = 12;
        ctx.strokeStyle = `rgba(${wave.color}, ${wave.opacity * 0.7})`;
        ctx.lineWidth = wave.width * 2.2;
        ctx.stroke();

        // Núcleo brilhante (branco-azulado)
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(220, 235, 255, 1)';
        ctx.strokeStyle = `rgba(230, 240, 255, ${Math.min(1, wave.opacity + 0.3)})`;
        ctx.lineWidth = wave.width * 0.7;
        ctx.stroke();
      }

      // Faíscas brilhantes em encontros de ondas
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(180, 220, 255, 1)';
      for (let i = 0; i < waves.length - 1; i++) {
        const w1 = waves[i];
        const w2 = waves[i + 1];
        const sparkX = (Math.sin(t * 0.008 + i * 1.7) * 0.5 + 0.5) * w;
        const phase1 = t * w1.speed;
        const phase2 = t * w2.speed;
        const y1 = h * w1.y + Math.sin(sparkX * w1.frequency + phase1) * w1.amplitude;
        const y2 = h * w2.y + Math.sin(sparkX * w2.frequency + phase2) * w2.amplitude;
        const midY = (y1 + y2) / 2;
        const dist = Math.abs(y1 - y2);

        if (dist < 80) {
          const sparkOpacity = (1 - dist / 80) * 0.9;
          ctx.beginPath();
          ctx.arc(sparkX, midY, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230, 240, 255, ${sparkOpacity})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(sparkX, midY, 14, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 190, 255, ${sparkOpacity * 0.4})`;
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';

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
      style={{ opacity: 1 }}
    />
  );
}
