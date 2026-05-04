// ============================================
// CÍRCULO DE LEITURA ORACULAR — Mapa das Jornadas
// Calendário simbólico anual: 12 livros, 3 jornadas
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Home, Lock, ArrowRight, Sparkles, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JORNADA_COR, CLUBE_LIVRO_PORTAIS, type JornadaType } from '@/constants/clubeLivroPortais';

// Estrutura das 3 jornadas com seus 4 livros cada
const JORNADAS = [
  {
    chave: 'heroina' as JornadaType,
    nome: 'Jornada da Heroína',
    subtitulo: 'Fundadora',
    descricao: 'Identidade, instinto, voz e sentido.',
    simbolo: '◈',
  },
  {
    chave: 'sombra' as JornadaType,
    nome: 'Jornada da Sombra',
    subtitulo: 'Aprofundamento',
    descricao: 'Projeção, ambivalência, ética e maturidade psíquica.',
    simbolo: '◉',
  },
  {
    chave: 'expressao' as JornadaType,
    nome: 'Jornada da Expressão & Mundo',
    subtitulo: 'Presença Pública',
    descricao: 'Linguagem, desejo, ação e presença pública.',
    simbolo: '◎',
  },
];

export default function MapaJornadas() {
  const navigate = useNavigate();
  const { ciclos, cicloAtual, loadingCiclos } = useClubeLivro();

  // Agrupar livros configurados por jornada
  const livrosPorJornada = (jornada: JornadaType) =>
    CLUBE_LIVRO_PORTAIS.filter(l => l.jornada === jornada);

  // Encontrar ciclo correspondente a um título de livro
  const findCiclo = (titulo: string) =>
    ciclos?.find(c =>
      c.titulo.toLowerCase().includes(titulo.toLowerCase()) ||
      titulo.toLowerCase().includes(c.titulo.toLowerCase())
    );

  return (
    <AppLayout>
      <ResponsiveContainer size="narrow" className="py-8 pb-20">
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
          <span className="text-foreground">Mapa das Jornadas</span>
        </nav>

        <SectionHeader
          title="Mapa das Jornadas"
          subtitle="Doze livros, três travessias. Cada jornada aprofunda um território simbólico da formação."
          icon={<Map className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Cabeçalho simbólico */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs uppercase tracking-widest text-gold font-medium">
              Travessia Formativa Anual
            </span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
        </div>

        {loadingCiclos ? (
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {JORNADAS.map((jornada, jornadaIdx) => {
              const cor = JORNADA_COR[jornada.chave];
              const livros = livrosPorJornada(jornada.chave);
              const mesBase = jornadaIdx * 4;

              return (
                <section key={jornada.chave} className="space-y-4">
                  {/* Cabeçalho da jornada */}
                  <div className={cn(
                    'rounded-xl p-4 bg-gradient-to-br border',
                    cor?.corBg || 'from-muted to-card',
                    cor?.corBorda || 'border-border',
                  )}>
                    <div className="flex items-start gap-3">
                      <span className={cn('text-2xl leading-none mt-0.5', cor?.corLabel)}>
                        {jornada.simbolo}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-display text-lg text-foreground">
                            {jornada.nome}
                          </h2>
                          <Badge variant="outline" className={cn('text-xs', cor?.corBorda, cor?.corLabel)}>
                            {jornada.subtitulo}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {jornada.descricao}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cards dos livros */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {livros.map((livro, i) => {
                      const ciclo = findCiclo(livro.tituloLivro);
                      const mes = mesBase + i + 1;
                      const isAtual = ciclo?.id === cicloAtual?.id;
                      const isPublicado = ciclo?.publicado;

                      return (
                        <Card
                          key={livro.tituloLivro}
                          className={cn(
                            'transition-all group overflow-hidden',
                            isPublicado && 'cursor-pointer hover:border-gold/40',
                            isAtual && 'border-gold/50 bg-gold/5',
                            !isPublicado && 'opacity-60',
                          )}
                          onClick={() => {
                            if (ciclo && isPublicado) navigate(`/clube-livro/${ciclo.id}`);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {/* Capa ou placeholder */}
                              <div className="shrink-0">
                                {ciclo?.capa_url ? (
                                  <img
                                    src={ciclo.capa_url}
                                    alt={ciclo.titulo}
                                    className="w-12 h-16 object-cover rounded shadow"
                                  />
                                ) : (
                                  <div className="w-12 h-16 rounded bg-muted flex items-center justify-center">
                                    {isPublicado ? (
                                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span className="text-[10px] font-mono text-muted-foreground">
                                    Mês {mes.toString().padStart(2, '0')}
                                  </span>
                                  <span className="text-muted-foreground/40 text-[10px]">·</span>
                                  <span className={cn('text-[10px] font-medium uppercase tracking-wider', cor?.corLabel)}>
                                    {jornada.nome.replace('Jornada da ', '').replace('Jornada do ', '')}
                                  </span>
                                  {isAtual && (
                                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                      Atual
                                    </Badge>
                                  )}
                                </div>

                                <p className={cn(
                                  'font-display text-sm leading-snug text-foreground mb-0.5',
                                  'group-hover:text-gold transition-colors',
                                  isAtual && 'text-gold',
                                )}>
                                  {ciclo?.titulo || livro.tituloLivro}
                                </p>

                                <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                                  {livro.orientacaoCurta}
                                </p>
                              </div>

                              {/* Seta */}
                              {isPublicado && (
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors shrink-0 mt-4" />
                              )}
                            </div>
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
      </ResponsiveContainer>
    </AppLayout>
  );
}
