import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Lock, Play } from 'lucide-react';
import { StationV3 } from '@/hooks/useClubeV3';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface StationRoadProps {
  stations: StationV3[];
}

export function StationRoad({ stations }: StationRoadProps) {
  const navigate = useNavigate();

  const calculateProgress = (station: StationV3) => {
    if (!station.progress) return 0;
    const steps = [
      station.progress.audio_completed,
      station.progress.letter_completed,
      station.progress.reflection_completed,
      station.progress.question_completed,
      station.progress.practice_completed
    ];
    const completedCount = steps.filter(Boolean).length;
    return (completedCount / steps.length) * 100;
  };

  return (
    <div className="relative py-12">
      {/* Central Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/5 via-gold/20 to-gold/5 -translate-x-1/2 hidden md:block" />

      <div className="space-y-16 md:space-y-24 relative">
        {stations.map((station, index) => {
          const progress = calculateProgress(station);
          const isCompleted = progress === 100;
          const isStarted = progress > 0;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "flex flex-col md:flex-row items-center gap-8",
                isEven ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Station Card */}
              <div className="flex-1 w-full max-w-md">
                <button
                  onClick={() => navigate(`/clube/estacao/${station.id}`)}
                  className={cn(
                    "w-full text-left p-6 rounded-3xl border transition-all duration-500 group relative overflow-hidden",
                    isStarted 
                      ? "bg-midnight/60 border-gold/40 shadow-gold/10" 
                      : "bg-midnight/40 border-border/10 hover:border-gold/20"
                  )}
                >
                  {/* Glowing background if started */}
                  {isStarted && (
                    <div className="absolute inset-0 bg-gold/5 animate-pulse pointer-events-none" />
                  )}

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60">
                          Estação {index + 1}
                        </span>
                        <h3 className="text-xl font-serif text-foreground/90 group-hover:text-gold transition-colors">
                          {station.title}
                        </h3>
                      </div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-gold" />
                      ) : isStarted ? (
                        <div className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground/30" />
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground/70 line-clamp-2">
                      {station.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/60">
                        <span>Progresso</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-1 bg-gold/5" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Connector Dot */}
              <div className="relative z-10 flex items-center justify-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-700",
                  isStarted 
                    ? "bg-gold border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                    : "bg-midnight border-border/20"
                )}>
                  <Play className={cn(
                    "w-5 h-5 ml-1 transition-colors",
                    isStarted ? "text-midnight" : "text-muted-foreground/30"
                  )} />
                </div>
              </div>

              <div className="flex-1 hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
