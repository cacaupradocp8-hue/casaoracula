// ============================================
// CÍRCULO DE LEITURA ORACULAR — Minha Travessia
// Progresso simbólico pessoal da aluna
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Home, Route, Circle, CircleDot, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CLUBE_LIVRO_PORTAIS, JORNADA_COR, type JornadaType } from '@/constants/clubeLivroPortais';

type StatusTravessia = 'latente' | 'em_travessia' | 'integrado';

interface TravessiaStatus {
  ciclo_id: string;
  status: StatusTravessia;
}

export default function MinhaTravessia() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ciclos, loadingCiclos } = useClubeLivro();

  // Buscar integrações concluídas do usuário
  const { data: integracoes } = useQuery({
    queryKey: ['minha-travessia-integracoes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('clube_livro_integracoes')
        .select('ciclo_id, status')
        .eq('user_id', user.id);
      return (data || []) as TravessiaStatus[];
    },
    enabled: !!user?.id,
  });

  // Buscar respostas do usuário (para saber se começou a travessia)
  const { data: respostas } = useQuery({
    queryKey: ['minha-travessia-respostas', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('clube_livro_respostas')
        .select('ciclo_id')
        .eq('user_id', user.id);
      return [...new Set((data || []).map(r => r.ciclo_id))];
    },
    enabled: !!user?.id,
  });

  // Determinar status de cada ciclo
  const getStatus = (cicloId: string): StatusTravessia => {
    const integracao = integracoes?.find(i => i.ciclo_id === cicloId);
    if (integracao?.status === 'concluida' as string) return 'integrado';
    if (respostas?.includes(cicloId)) return 'em_travessia';
    return 'latente';
  };

  const statusIcon = (s: StatusTravessia) => {
    switch (s) {
      case 'integrado': return <CheckCircle2 className="w-4 h-4 text-gold" />;
      case 'em_travessia': return <CircleDot className="w-4 h-4 text-amber-400/70" />;
      default: return <Circle className="w-4 h-4 text-muted-foreground/30" />;
    }
  };

  const statusLabel = (s: StatusTravessia) => {
    switch (s) {
      case 'integrado': return 'Integrado';
      case 'em_travessia': return 'Em Travessia';
      default: return 'Latente';
    }
  };

  // Agrupar ciclos por jornada usando CLUBE_LIVRO_PORTAIS
  const jornadas: JornadaType[] = ['heroina', 'sombra', 'expressao'];

  // Contadores
  const totalCiclos = ciclos?.filter(c => c.publicado).length || 0;
  const integrados = ciclos?.filter(c => c.publicado && getStatus(c.id) === 'integrado').length || 0;
  const emTravessia = ciclos?.filter(c => c.publicado && getStatus(c.id) === 'em_travessia').length || 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Círculo de Leitura
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Minha Travessia</span>
        </nav>

        <SectionHeader
          title="Minha Travessia"
          subtitle="Seu percurso simbólico pelos livros do Círculo de Leitura."
          icon={<Route className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Resumo simbólico — sem porcentagens */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Circle className="w-3.5 h-3.5 text-muted-foreground/40" />
              <span className="text-lg font-display text-muted-foreground">{totalCiclos - integrados - emTravessia}</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Latentes</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <CircleDot className="w-3.5 h-3.5 text-amber-400/70" />
              <span className="text-lg font-display text-amber-400">{emTravessia}</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Em Travessia</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
              <span className="text-lg font-display text-gold">{integrados}</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Integrados</p>
          </div>
        </div>

        {loadingCiclos ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-8">
            {jornadas.map(jornada => {
              const cor = JORNADA_COR[jornada];
              const livrosConfig = CLUBE_LIVRO_PORTAIS.filter(l => l.jornada === jornada);

              const ciclosDaJornada = livrosConfig
                .map(livro => {
                  const ciclo = ciclos?.find(c =>
                    c.titulo.toLowerCase().includes(livro.tituloLivro.toLowerCase()) ||
                    livro.tituloLivro.toLowerCase().includes(c.titulo.toLowerCase())
                  );
                  return { livro, ciclo };
                })
                .filter(item => item.ciclo);

              if (ciclosDaJornada.length === 0) return null;

              return (
                <section key={jornada}>
                  {/* Jornada label */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn('text-lg', cor?.corLabel)}>{cor?.simbolo}</span>
                    <h3 className="font-display text-sm text-foreground">{cor?.label}</h3>
                  </div>

                  <div className="space-y-2">
                    {ciclosDaJornada.map(({ livro, ciclo }) => {
                      if (!ciclo) return null;
                      const status = getStatus(ciclo.id);

                      return (
                        <Card
                          key={ciclo.id}
                          className={cn(
                            'transition-all cursor-pointer hover:border-gold/30',
                            status === 'integrado' && 'border-gold/20 bg-gold/5',
                          )}
                          onClick={() => navigate(`/clube-livro/${ciclo.id}`)}
                        >
                          <CardContent className="p-4 flex items-center gap-3">
                            {/* Status icon */}
                            <div className="shrink-0">
                              {statusIcon(status)}
                            </div>

                            {/* Capa */}
                            {ciclo.capa_url ? (
                              <img
                                src={ciclo.capa_url}
                                alt={ciclo.titulo}
                                className="w-9 h-12 object-cover rounded shadow-sm shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-12 bg-muted rounded flex items-center justify-center shrink-0">
                                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {ciclo.titulo}
                              </p>
                              {ciclo.autor_livro && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {ciclo.autor_livro}
                                </p>
                              )}
                            </div>

                            {/* Status badge */}
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] shrink-0',
                                status === 'integrado' && 'border-gold/30 text-gold',
                                status === 'em_travessia' && 'border-amber-700/30 text-amber-400',
                                status === 'latente' && 'border-border text-muted-foreground',
                              )}
                            >
                              {statusLabel(status)}
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
