// ============================================
// CLUBE DO LIVRO — Calendário por Jornadas Simbólicas
// Mapa de travessia formativa anual
// ============================================

import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClubeCiclo } from '@/hooks/useClubeLivro';
import { JornadaType } from '@/constants/clubeLivroPortais';

// Mapeamento canônico: título do livro → jornada
// Baseado exatamente nos 12 livros existentes em CALENDARIO_ANUAL
const JORNADAS_SIMBOLICAS = [
  {
    chave: 'heroina' as JornadaType,
    nome: 'Jornada da Heroína',
    subtitulo: 'Fundadora',
    descricao: 'Identidade, instinto, voz e sentido.',
    cor: 'from-amber-950/40 to-card',
    corBorda: 'border-amber-700/30',
    corLabel: 'text-amber-400',
    corBadge: 'border-amber-700/30 text-amber-400',
    simbolo: '◈',
    livros: [
      'Mulheres que Correm com os Lobos',
      'O Código do Ser',
      'A Coruja Era Filha do Padeiro',
      'Água Viva',
    ],
  },
  {
    chave: 'sombra' as JornadaType,
    nome: 'Jornada da Sombra',
    subtitulo: 'Aprofundamento',
    descricao: 'Projeção, ambivalência, ética e maturidade psíquica.',
    cor: 'from-violet-950/40 to-card',
    corBorda: 'border-violet-700/30',
    corLabel: 'text-violet-400',
    corBadge: 'border-violet-700/30 text-violet-400',
    simbolo: '◉',
    livros: [
      'O Brincar e a Realidade',
      'A Gravidade e a Graça',
      'O Acontecimento',
      'Ficções que Curam',
    ],
  },
  {
    chave: 'expressao' as JornadaType,
    nome: 'Jornada da Expressão & Mundo',
    subtitulo: 'Presença Pública',
    descricao: 'Linguagem, desejo, ação e presença pública.',
    cor: 'from-teal-950/40 to-card',
    corBorda: 'border-teal-700/30',
    corLabel: 'text-teal-400',
    corBadge: 'border-teal-700/30 text-teal-400',
    simbolo: '◎',
    livros: [
      'O Poder da Escrita',
      'A Poética do Espaço',
      'Inteligência Erótica',
      'A Condição Humana',
    ],
  },
  {
    chave: 'instinto' as JornadaType,
    nome: 'Jornada do Instinto',
    subtitulo: 'Raiz Corporal',
    descricao: 'Corpo, sensorialidade, pulsão e presença somática.',
    cor: 'from-rose-950/40 to-card',
    corBorda: 'border-rose-700/30',
    corLabel: 'text-rose-400',
    corBadge: 'border-rose-700/30 text-rose-400',
    simbolo: '△',
    livros: [],
  },
  {
    chave: 'lideranca' as JornadaType,
    nome: 'Jornada da Liderança',
    subtitulo: 'Autoridade Interior',
    descricao: 'Direção, responsabilidade, poder e serviço.',
    cor: 'from-sky-950/40 to-card',
    corBorda: 'border-sky-700/30',
    corLabel: 'text-sky-400',
    corBadge: 'border-sky-700/30 text-sky-400',
    simbolo: '⬡',
    livros: [],
  },
];

// Associar ciclo do banco ao livro pelo título (match parcial, case-insensitive)
function matchLivro(ciclo: ClubeCiclo, titulo: string): boolean {
  return ciclo.titulo.toLowerCase().includes(titulo.toLowerCase()) ||
    titulo.toLowerCase().includes(ciclo.titulo.toLowerCase());
}

interface CalendarioJornadasProps {
  ciclos: ClubeCiclo[];
  cicloAtualId?: string;
  filtroJornada?: JornadaType | null;
}

export function CalendarioJornadas({ ciclos, cicloAtualId, filtroJornada }: CalendarioJornadasProps) {
  const navigate = useNavigate();

  const jornadasVisiveis = filtroJornada
    ? JORNADAS_SIMBOLICAS.filter(j => j.chave === filtroJornada)
    : JORNADAS_SIMBOLICAS;

  return (
    <section className="space-y-10">
      {/* Cabeçalho do mapa */}
      <div className="text-center space-y-2 mb-8">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-xs uppercase tracking-widest text-gold font-medium">
            Travessia Formativa Anual
          </span>
          <Sparkles className="w-4 h-4 text-gold" />
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Doze livros, três travessias. Cada jornada aprofunda um território
          simbólico da formação.
        </p>
      </div>

      {/* Seções de jornada */}
      {jornadasVisiveis.map((jornada, jornadaIndex) => {
        // Filtrar ciclos do banco que pertencem a esta jornada
        const ciclosDaJornada = jornada.livros
          .map((titulo, i) => {
            const ciclo = ciclos.find(c => matchLivro(c, titulo));
            return { titulo, ciclo, ordemNaJornada: i + 1 };
          });

        // Número do mês global (1–12) baseado na posição da jornada
        const mesBase = jornadaIndex * 4;

        return (
          <div key={jornada.chave} className="space-y-4">
            {/* Cabeçalho da seção */}
            <div className={cn(
              'rounded-xl p-4 bg-gradient-to-br border',
              jornada.cor,
              jornada.corBorda,
            )}>
              <div className="flex items-start gap-3">
                <span className={cn('text-2xl leading-none mt-0.5', jornada.corLabel)}>
                  {jornada.simbolo}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={cn('font-display text-lg text-foreground')}>
                      {jornada.nome}
                    </h2>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', jornada.corBadge)}
                    >
                      {jornada.subtitulo}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {jornada.descricao}
                  </p>
                </div>
              </div>
            </div>

            {/* Cards dos livros ou Em breve */}
            {jornada.livros.length === 0 ? (
              <div className="rounded-lg border border-dashed border-muted-foreground/20 p-6 text-center">
                <p className="text-sm text-muted-foreground italic">Em breve — livros desta jornada serão anunciados.</p>
              </div>
            ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {ciclosDaJornada.map(({ titulo, ciclo, ordemNaJornada }) => {
                const mes = mesBase + ordemNaJornada;
                const isAtual = ciclo?.id === cicloAtualId;
                const isPublicado = ciclo?.publicado;
                const isAcessivel = isPublicado;

                return (
                  <Card
                    key={titulo}
                    className={cn(
                      'transition-all group overflow-hidden',
                      isAcessivel && 'cursor-pointer hover:border-gold/40',
                      isAtual && 'border-gold/50 bg-gold/5',
                      !isAcessivel && 'opacity-60',
                    )}
                    onClick={() => {
                      if (ciclo && isAcessivel) {
                        navigate(`/clube-livro/${ciclo.id}`);
                      }
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
                              {isAcessivel ? (
                                <BookOpen className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {/* Mês + jornada */}
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[10px] font-mono text-muted-foreground">
                              Mês {mes.toString().padStart(2, '0')}
                            </span>
                            <span className="text-muted-foreground/40 text-[10px]">·</span>
                            <span className={cn('text-[10px] font-medium uppercase tracking-wider', jornada.corLabel)}>
                              {jornada.nome.replace('Jornada da ', '').replace('Jornada do ', '')}
                            </span>
                            {isAtual && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                Atual
                              </Badge>
                            )}
                          </div>

                          {/* Título */}
                          <p className={cn(
                            'font-display text-sm leading-snug text-foreground mb-0.5',
                            'group-hover:text-gold transition-colors',
                            isAtual && 'text-gold',
                          )}>
                            {ciclo?.titulo || titulo}
                          </p>

                          {/* Autor */}
                          <p className="text-xs text-muted-foreground leading-tight">
                            {ciclo?.autor_livro || '—'}
                          </p>

                          {/* Tema simbólico */}
                          {ciclo?.tema_simbolico && (
                            <p className="text-[10px] text-muted-foreground/60 mt-1 italic">
                              {ciclo.tema_simbolico}
                            </p>
                          )}
                        </div>

                        {/* Seta */}
                        {isAcessivel && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors shrink-0 mt-4" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
