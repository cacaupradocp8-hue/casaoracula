// ============================================
// CLUBE DO LIVRO — Tela de Portas (Multipolar)
// Escolha de jornada para livros multipolares
// ============================================

import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, Home, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const JORNADA_META: Record<string, { nome: string; subtitulo: string; simbolo: string; corLabel: string; corBg: string; corBorda: string }> = {
  heroina: {
    nome: 'Jornada da Heroína',
    subtitulo: 'Identidade, instinto, voz e sentido',
    simbolo: '◈',
    corLabel: 'text-amber-400',
    corBg: 'from-amber-950/30 to-card',
    corBorda: 'border-amber-700/30',
  },
  sombra: {
    nome: 'Jornada da Sombra',
    subtitulo: 'Projeção, ambivalência, ética e maturidade',
    simbolo: '◉',
    corLabel: 'text-violet-400',
    corBg: 'from-violet-950/30 to-card',
    corBorda: 'border-violet-700/30',
  },
  corpo: {
    nome: 'Jornada do Corpo',
    subtitulo: 'Corpo, sensorialidade, pulsão e presença',
    simbolo: '◎',
    corLabel: 'text-teal-400',
    corBg: 'from-teal-950/30 to-card',
    corBorda: 'border-teal-700/30',
  },
  instinto: {
    nome: 'Jornada do Instinto',
    subtitulo: 'Raiz corporal, pulsão e presença somática',
    simbolo: '△',
    corLabel: 'text-rose-400',
    corBg: 'from-rose-950/30 to-card',
    corBorda: 'border-rose-700/30',
  },
  lideranca: {
    nome: 'Jornada da Liderança Feminina',
    subtitulo: 'Direção, responsabilidade, poder e serviço',
    simbolo: '⬡',
    corLabel: 'text-sky-400',
    corBg: 'from-sky-950/30 to-card',
    corBorda: 'border-sky-700/30',
  },
};

export default function ClubeLivroPortas() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch ciclo info
  const { data: ciclo, isLoading: loadingCiclo } = useQuery({
    queryKey: ['clube-livro-ciclo', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('id, titulo, autor_livro, capa_url, is_multipolar')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  // Fetch portas for this ciclo
  const { data: portas, isLoading: loadingPortas } = useQuery({
    queryKey: ['clube-livro-portas', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_portas')
        .select('*')
        .eq('ciclo_id', id!)
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const isLoading = loadingCiclo || loadingPortas;

  // If not multipolar or no portas, redirect to normal page
  if (!isLoading && ciclo && (!ciclo.is_multipolar || !portas || portas.length === 0)) {
    navigate(`/clube-livro/${id}`, { replace: true });
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!ciclo) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Livro não encontrado</h2>
          <Button variant="outline" onClick={() => navigate('/clube-livro')}>
            Voltar ao Clube
          </Button>
        </div>
      </AppLayout>
    );
  }

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
            Clube do Livro
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{ciclo.titulo}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          {ciclo.capa_url && (
            <img
              src={ciclo.capa_url}
              alt={ciclo.titulo}
              className="w-24 h-36 object-cover rounded-lg mx-auto mb-4 shadow-lg"
            />
          )}
          <h1 className="text-2xl font-display text-foreground mb-2">
            Como você deseja atravessar este livro agora?
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Um mesmo livro revela camadas diferentes conforme a porta escolhida.
          </p>
        </div>

        {/* Cards de Portas */}
        <div className="space-y-4">
          {portas?.map((porta) => {
            const meta = JORNADA_META[porta.jornada] || {
              nome: porta.titulo,
              subtitulo: '',
              simbolo: '●',
              corLabel: 'text-foreground',
              corBg: 'from-muted/30 to-card',
              corBorda: 'border-border',
            };

            return (
              <Card
                key={porta.id}
                className={cn(
                  'cursor-pointer transition-all hover:scale-[1.01] bg-gradient-to-br border',
                  meta.corBg,
                  meta.corBorda,
                )}
                onClick={() => navigate(`/clube-livro/${id}/porta/${porta.jornada}`)}
              >
                <CardContent className="py-5 px-5">
                  <div className="flex items-center gap-4">
                    <span className={cn('text-3xl leading-none', meta.corLabel)}>
                      {meta.simbolo}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-display text-foreground mb-0.5">
                        {meta.nome}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {porta.descricao || meta.subtitulo}
                      </p>
                    </div>
                    <ChevronRight className={cn('w-5 h-5 shrink-0', meta.corLabel)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Botão voltar */}
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/clube-livro')} className="text-sm">
            ← Voltar ao Clube do Livro
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
