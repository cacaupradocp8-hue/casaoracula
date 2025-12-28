import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TRAVESSIAS_DATA } from '@/types/travessia';
import { BookOpen, Lock, Check, Play, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Travessias() {
  const [selectedTravessia, setSelectedTravessia] = useState<string | null>(null);

  // Mock progress data
  const progress = {
    'travessia-1': { completed: 3, total: 6 },
    'travessia-2': { completed: 0, total: 6 },
    'travessia-3': { completed: 0, total: 6 },
    'travessia-4': { completed: 0, total: 6 },
  };

  const isUnlocked = (number: number) => {
    if (number === 1) return true;
    const prevTravessia = TRAVESSIAS_DATA.find(t => t.number === number - 1);
    if (!prevTravessia) return false;
    const prevProgress = progress[prevTravessia.id as keyof typeof progress];
    return prevProgress.completed === prevProgress.total;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Sala das Travessias"
          subtitle="Sua formação simbólica em 4 jornadas transformadoras"
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Intro Quote */}
        <div className="glass rounded-2xl p-8 mb-12 text-center">
          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/90 mb-4">
            "Toda travessia começa quando o mundo conhecido já não oferece respostas."
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Complete cada travessia para desbloquear a próxima. Cada jornada inclui aulas, 
            exercícios reflexivos e um rito simbólico de fechamento.
          </p>
        </div>

        {/* Travessias Grid */}
        <div className="grid gap-6">
          {TRAVESSIAS_DATA.map((travessia) => {
            const prog = progress[travessia.id as keyof typeof progress];
            const unlocked = isUnlocked(travessia.number);
            const progressPercent = (prog.completed / prog.total) * 100;
            const isComplete = prog.completed === prog.total;

            return (
              <Card 
                key={travessia.id}
                className={cn(
                  'group transition-all duration-500',
                  unlocked ? 'hover:shadow-gold cursor-pointer' : 'opacity-60',
                  selectedTravessia === travessia.id && 'ring-2 ring-gold/50'
                )}
                onClick={() => unlocked && setSelectedTravessia(
                  selectedTravessia === travessia.id ? null : travessia.id
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-display font-bold transition-colors',
                        unlocked 
                          ? isComplete 
                            ? 'bg-gold text-primary-foreground' 
                            : 'bg-gold/20 text-gold'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {isComplete ? <Check className="w-6 h-6" /> : travessia.number}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gold mb-1">
                          Travessia {travessia.number}
                        </p>
                        <CardTitle className="text-xl md:text-2xl font-display">
                          {travessia.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {travessia.subtitle}
                        </CardDescription>
                      </div>
                    </div>
                    {!unlocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className={cn(
                        'w-5 h-5 text-muted-foreground transition-transform',
                        selectedTravessia === travessia.id && 'rotate-90'
                      )} />
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {unlocked && (
                    <>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="text-foreground font-medium">
                            {prog.completed}/{prog.total} aulas
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      {selectedTravessia === travessia.id && (
                        <div className="pt-4 border-t border-border animate-fade-in">
                          <p className="text-muted-foreground mb-4">
                            {travessia.description}
                          </p>
                          
                          <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Rito de Fechamento
                            </p>
                            <p className="text-sm text-muted-foreground italic">
                              {travessia.closingRitual}
                            </p>
                          </div>

                          <Button variant="gold" className="w-full gap-2">
                            <Play className="w-4 h-4" />
                            {prog.completed === 0 ? 'Iniciar Travessia' : 'Continuar'}
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {!unlocked && (
                    <p className="text-sm text-muted-foreground">
                      Complete a Travessia {travessia.number - 1} para desbloquear.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
