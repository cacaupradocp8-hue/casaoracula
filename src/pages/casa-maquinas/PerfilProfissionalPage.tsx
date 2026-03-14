import { useAuth } from '@/contexts/AuthContext';
import { useAcademyProgress } from '@/hooks/useAcademyProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

export default function PerfilProfissionalPage() {
  const { user } = useAuth();
  const { progress, stats, isLoading, currentLevel } = useAcademyProgress();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando perfil...</div>
      </div>
    );
  }

  const specialtyLabels: Record<string, string> = {
    big5: 'Big Five',
    big5_simbolico: 'Big5 Simbólico',
    big5_oracular: 'Cartografia Psíquica Orácula',
    big5_funcional: 'Big5 Funcional',
    sessoes: 'Sessões Clínicas',
    cartografia: 'Cartografia',
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-gold/30 bg-gradient-to-br from-card to-gold/5 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-gold/40">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-gold/10 text-gold text-2xl font-display">
                  {user?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-display text-foreground">{user?.name || 'Facilitadora'}</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-2xl">{currentLevel.icon}</span>
                  <span className="text-gold font-semibold">{currentLevel.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Nível {currentLevel.level} • {progress?.points || 0} pontos</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Journey Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jornada em Números</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
                  <p className="text-3xl font-bold text-gold">{stats?.clientsCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Jornadas</p>
                </div>
                <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
                  <p className="text-3xl font-bold text-gold">{stats?.sessionsCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Sessões</p>
                </div>
                <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
                  <p className="text-3xl font-bold text-gold">{stats?.toolsUsed.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Ferramentas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges */}
        {progress?.badges && progress.badges.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Insígnias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {progress.badges.map((b) => (
                    <div key={b.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
                      <span>{b.icon}</span>
                      <span className="text-sm text-foreground">{b.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Specialties */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Especialidades Simbólicas</CardTitle>
            </CardHeader>
            <CardContent>
              {progress?.specialties && progress.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {progress.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-sm">
                      {specialtyLabels[s] || s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Use ferramentas para revelar suas especialidades.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
