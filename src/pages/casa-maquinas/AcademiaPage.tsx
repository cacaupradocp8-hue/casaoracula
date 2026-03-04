import { useAuth } from '@/contexts/AuthContext';
import { useAcademyProgress, ACADEMY_LEVELS } from '@/hooks/useAcademyProgress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, Award, Star, Zap, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AcademiaPage() {
  const { user } = useAuth();
  const { progress, stats, isLoading, currentLevel, nextLevel, progressToNext, refreshProgress, allLevels } = useAcademyProgress();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Calculando sua jornada...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display text-gold">Academia Orácula</h1>
            <p className="text-muted-foreground mt-1">Sua jornada de progressão profissional</p>
          </div>
          <Button variant="ghost" size="icon" onClick={refreshProgress} title="Atualizar">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Current Level Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-gold/30 bg-gradient-to-br from-card to-gold/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentLevel.icon}</span>
                <div>
                  <CardTitle className="text-2xl text-gold">{currentLevel.name}</CardTitle>
                  <CardDescription>{currentLevel.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nível {currentLevel.level} de 5</span>
                <span className="text-gold font-semibold">{progress?.points || 0} pontos</span>
              </div>
              {nextLevel ? (
                <div className="space-y-2">
                  <Progress value={progressToNext} className="h-3 bg-muted" />
                  <p className="text-xs text-muted-foreground text-right">
                    {nextLevel.minPoints - (progress?.points || 0)} pts para {nextLevel.name}
                  </p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-gold font-display">✦ Nível Máximo Alcançado ✦</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Sessões', value: stats?.sessionsCount || 0, icon: <Zap className="h-4 w-4 text-gold" /> },
            { label: 'Casos', value: stats?.clientsCount || 0, icon: <Star className="h-4 w-4 text-gold" /> },
            { label: 'Ferramentas', value: stats?.toolsUsed.length || 0, icon: <Award className="h-4 w-4 text-gold" /> },
            { label: 'Sonhos', value: stats?.dreamsCount || 0, icon: <span className="text-gold">🌙</span> },
            { label: 'Labirinto', value: stats?.labyrinthCount || 0, icon: <span className="text-gold">🌀</span> },
            { label: 'Cartografias', value: stats?.cartographyCount || 0, icon: <span className="text-gold">📐</span> },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                {stat.icon}
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" /> Insígnias Conquistadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progress?.badges && progress.badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {progress.badges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-2 p-3 rounded-lg bg-gold/5 border border-gold/20">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Nenhuma insígnia conquistada ainda. Continue sua jornada!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progression */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jornada de Níveis</CardTitle>
              <CardDescription>Desbloqueie novos recursos conforme avança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allLevels.map((lvl) => {
                const isUnlocked = (progress?.level || 1) >= lvl.level;
                const isCurrent = (progress?.level || 1) === lvl.level;
                return (
                  <div
                    key={lvl.level}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-gold/50 bg-gold/5 shadow-gold'
                        : isUnlocked
                        ? 'border-border/50 bg-card/30'
                        : 'border-border/20 bg-muted/20 opacity-60'
                    }`}
                  >
                    <span className="text-3xl">{lvl.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${isCurrent ? 'text-gold' : 'text-foreground'}`}>{lvl.name}</p>
                        {isCurrent && <Badge variant="default" className="text-xs">Atual</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{lvl.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lvl.minPoints} pontos necessários</p>
                    </div>
                    {isUnlocked ? (
                      <CheckCircle className="h-5 w-5 text-gold" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
