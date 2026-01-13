import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeditationPauseProps {
  duration?: number; // seconds
  message?: string;
  onComplete: () => void;
  primaryColor?: string;
}

export function MeditationPause({
  duration = 3,
  message = 'Respire fundo...',
  onComplete,
  primaryColor = 'hsl(var(--gold))',
}: MeditationPauseProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min((elapsed / (duration * 1000)) * 100, 100);
      
      setProgress(newProgress);

      if (now >= endTime) {
        setIsComplete(true);
        setTimeout(onComplete, 500);
      } else {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [duration, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* Breathing circle */}
      <div className="relative mb-12">
        <div
          className={cn(
            'w-32 h-32 rounded-full flex items-center justify-center',
            'animate-breathe transition-all duration-1000'
          )}
          style={{
            background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
          }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
            }}
          >
            <Sparkles
              className="w-10 h-10 animate-float-gentle"
              style={{ color: primaryColor }}
            />
          </div>
        </div>

        {/* Progress ring */}
        <svg
          className="absolute inset-0 w-32 h-32 -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`${primaryColor}20`}
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-100"
            style={{ opacity: 0.6 }}
          />
        </svg>
      </div>

      {/* Message */}
      <p
        className={cn(
          'text-xl md:text-2xl font-display text-center',
          'animate-fade-in-slow text-foreground/80'
        )}
      >
        {message}
      </p>

      {/* Subtle hint */}
      <p
        className={cn(
          'text-sm text-muted-foreground/60 mt-4',
          isComplete ? 'opacity-0' : 'opacity-100',
          'transition-opacity duration-500'
        )}
      >
        Conecte-se com sua intenção
      </p>
    </div>
  );
}
