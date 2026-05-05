import { motion } from 'framer-motion';
import { Loader2, Sparkles, Map, Compass } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useClubeRoutes, useClubeStations } from '@/hooks/useClubeV3';
import { StationRoad } from '@/components/clube-v3/StationRoad';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function ClubeHomePage() {
  const { user } = useAuth();
  const { data: routes, isLoading: loadingRoutes } = useClubeRoutes();
  const currentRoute = routes?.[0]; // Default to first published route
  const { data: stations, isLoading: loadingStations } = useClubeStations(currentRoute?.id);

  const welcomeName = user?.name?.split(' ')[0] || 'Assinante';

  if (loadingRoutes || loadingStations) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-gold/60 text-xs uppercase tracking-[0.2em] animate-pulse">Tecendo sua jornada...</p>
        </div>
      </AppLayout>
    );
  }

  // Calculate overall route progress
  const totalSteps = (stations?.length || 0) * 5;
  const completedSteps = stations?.reduce((acc, station) => {
    if (!station.progress) return acc;
    return acc + [
      station.progress.audio_completed,
      station.progress.letter_completed,
      station.progress.reflection_completed,
      station.progress.question_completed,
      station.progress.practice_completed
    ].filter(Boolean).length;
  }, 0) || 0;
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <AppLayout>
      <ResponsiveContainer size="full" className="py-8 md:py-16 px-4 max-w-5xl mx-auto">
        <div className="space-y-16">
          
          {/* Header Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <Compass className="w-3 h-3" />
              Sua Travessia Atual
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-serif text-foreground/90 tracking-tight">
                Olá, {welcomeName}
              </h1>
              <p className="text-muted-foreground/70 max-w-lg mx-auto text-sm md:text-base">
                Bem-vinda de volta à {currentRoute?.title || 'sua jornada'}. 
                {currentRoute?.description}
              </p>
            </div>

            {/* Overall Progress Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <Card className="bg-midnight/40 border-gold/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gold/60">Progresso Geral</p>
                      <p className="text-2xl font-serif text-foreground/90">{Math.round(overallProgress)}%</p>
                    </div>
                    <Map className="w-8 h-8 text-gold/20" />
                  </div>
                  <Progress value={overallProgress} className="h-1.5 bg-gold/10" />
                  <p className="text-[10px] text-muted-foreground/60 text-left">
                    {completedSteps} de {totalSteps} passos concluídos na estrada
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* The Road (Estrada da Aluna) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-px w-12 bg-gold/20" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/50">Estrada das Estações</h2>
              <div className="h-px w-12 bg-gold/20" />
            </div>
            
            {stations && stations.length > 0 ? (
              <StationRoad stations={stations} />
            ) : (
              <div className="text-center py-12 border border-dashed border-border/10 rounded-3xl">
                <p className="text-muted-foreground/50 italic text-sm">Nenhuma estação publicada nesta rota ainda.</p>
              </div>
            )}
          </div>

        </div>
      </ResponsiveContainer>
    </AppLayout>
  );
}

