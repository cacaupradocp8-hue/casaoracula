// ============================================
// MANDALA ANUAL DB — SVG Concêntrico com Estações
// Layout visual idêntico ao original MandalaAnual
// Dados vindos de clube_estacoes
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, X, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEstacoes, type Estacao } from '@/hooks/useEstacoes';

// ============================================
// UTILS
// ============================================

function polarToXY(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

// Ângulos para 8 estações distribuídas uniformemente
const ANGULOS_ESTACOES = [0, 45, 90, 135, 180, 225, 270, 315];
const RAIO_ESTACOES = 180;
const NODE_SIZE = 32;

// ============================================
// SIDE PANEL
// ============================================

function SidePanel({
  estacao,
  onClose,
  onNavigate,
}: {
  estacao: Estacao;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2 text-gold border-gold/40">
              {estacao.titulo}
            </Badge>
            <p className="text-xs text-muted-foreground mb-1">{estacao.subtitulo}</p>
            <h3 className="font-display text-lg text-foreground">{estacao.livro_titulo}</h3>
            {estacao.livro_autor && (
              <p className="text-sm text-muted-foreground">{estacao.livro_autor}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {estacao.livro_capa_url && (
          <img
            src={estacao.livro_capa_url}
            alt={estacao.livro_titulo}
            className="w-full h-48 object-cover rounded-lg shadow-lg"
          />
        )}

        <div className="text-2xl text-center select-none py-1">{estacao.fase_lunar || '◯'}</div>

        {estacao.essencia_nucleo && (
          <div className="text-sm text-muted-foreground italic border-l-2 border-gold/30 pl-3">
            {estacao.essencia_nucleo}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', estacao.ativa ? 'bg-gold' : 'bg-muted-foreground/40')} />
          <span className="text-xs text-muted-foreground">{estacao.ativa ? 'Ativa' : 'Inativa'}</span>
          <div className={cn('w-2 h-2 rounded-full ml-2', estacao.publicada ? 'bg-emerald-500' : 'bg-muted-foreground/40')} />
          <span className="text-xs text-muted-foreground">{estacao.publicada ? 'Publicada' : 'Não publicada'}</span>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate(`/clube-livro/estacao/${estacao.id}`)}
          >
            <BookOpen className="w-4 h-4" /> Entrar na Estação
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate(`/clube-livro/estacao/${estacao.id}`)}
          >
            <Headphones className="w-4 h-4" /> Aula-Álbum
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MANDALA SVG
// ============================================

export function MandalaAnualDB() {
  const navigate = useNavigate();
  const { data: estacoes, isLoading } = useEstacoes();
  const [selected, setSelected] = useState<Estacao | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const size = 660;
  const cx = size / 2;
  const cy = size / 2;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="text-muted-foreground text-sm animate-pulse">Carregando jornada…</span>
      </div>
    );
  }

  if (!estacoes?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhuma estação encontrada.</div>;
  }

  return (
    <div className="relative">
      {/* SVG Mandala */}
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[660px] aspect-square">
          {/* Background orbit rings */}
          {[120, 180, 250].map((r) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
              strokeOpacity={0.1}
              strokeDasharray="3 8"
            />
          ))}

          {/* ── NÚCLEO: Deusa Tríplice ── */}
          <circle cx={cx} cy={cy} r={50} className="fill-gold/5 stroke-gold/20" strokeWidth={2}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={36} className="fill-gold/8 stroke-gold/15" strokeWidth={1} />
          <foreignObject x={cx - 28} y={cy - 22} width={56} height={44}>
            <div className="flex flex-col items-center justify-center w-full h-full select-none">
              <span className="text-gold text-xl leading-none" style={{ opacity: 0.85 }}>
                ☽◯☾
              </span>
              <span className="text-gold/60 text-[6px] uppercase tracking-[0.2em] mt-1 font-semibold">
                Matriz
              </span>
            </div>
          </foreignObject>

          {/* ── LINHAS: Estação → Núcleo ── */}
          {estacoes.map((est, i) => {
            const angulo = ANGULOS_ESTACOES[i] ?? (i * 45);
            const pos = polarToXY(angulo, RAIO_ESTACOES, cx, cy);
            return (
              <line
                key={`line-${est.id}`}
                x1={pos.x}
                y1={pos.y}
                x2={cx}
                y2={cy}
                stroke="#D4A843"
                strokeWidth={0.8}
                strokeOpacity={0.12}
              />
            );
          })}

          {/* ── ESTAÇÕES (nós) ── */}
          {estacoes.map((est, i) => {
            const angulo = ANGULOS_ESTACOES[i] ?? (i * 45);
            const pos = polarToXY(angulo, RAIO_ESTACOES, cx, cy);
            const isAtiva = est.ativa;
            const isHovered = hoveredId === est.id;
            const corAccent = '#D4A843';
            const ns = NODE_SIZE;

            return (
              <g
                key={est.id}
                className="cursor-pointer"
                onClick={() => setSelected(est)}
                onMouseEnter={() => setHoveredId(est.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Hover / active glow */}
                {(isHovered || isAtiva) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={ns + 6}
                    fill="none"
                    stroke={corAccent}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={ns}
                  fill={isAtiva ? `${corAccent}15` : 'hsl(var(--muted)/0.2)'}
                  stroke={isAtiva ? `${corAccent}` : 'hsl(var(--muted-foreground)/0.2)'}
                  strokeWidth={isAtiva ? 2.5 : 1.2}
                />

                {/* Icon / cover */}
                <foreignObject
                  x={pos.x - ns + 6}
                  y={pos.y - ns + 6}
                  width={(ns - 6) * 2}
                  height={(ns - 6) * 2}
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {est.livro_capa_url ? (
                      <img
                        src={est.livro_capa_url}
                        alt={est.livro_titulo}
                        className="rounded-full object-cover"
                        style={{ width: (ns - 8) * 2, height: (ns - 8) * 2 }}
                      />
                    ) : isAtiva ? (
                      <BookOpen
                        className="text-gold opacity-60"
                        style={{ width: ns * 0.5, height: ns * 0.5 }}
                      />
                    ) : (
                      <Lock
                        className="text-muted-foreground/40"
                        style={{ width: ns * 0.4, height: ns * 0.4 }}
                      />
                    )}
                  </div>
                </foreignObject>

                {/* Label */}
                <foreignObject x={pos.x - 52} y={pos.y + ns + 3} width={104} height={40}>
                  <div className="text-center">
                    <span className="text-[7px] font-bold uppercase tracking-widest text-gold/70 block leading-tight">
                      {est.fase_lunar} {est.titulo}
                    </span>
                    <span className="text-[8px] text-foreground/80 font-medium leading-tight line-clamp-2">
                      {est.livro_titulo}
                    </span>
                  </div>
                </foreignObject>

                {/* Ativa badge */}
                {isAtiva && (
                  <foreignObject x={pos.x - 15} y={pos.y - ns - 14} width={30} height={14}>
                    <div className="flex justify-center">
                      <span className="bg-gold/20 text-gold text-[6px] px-1 py-0.5 rounded font-semibold uppercase">
                        Atual
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── MOBILE LIST ── */}
      <div className="mt-8 space-y-2 md:hidden">
        {estacoes.map((est) => (
          <Card
            key={est.id}
            className={cn(
              'cursor-pointer transition-all hover:border-gold/40',
              est.ativa && 'border-gold/50 bg-gold/5',
              !est.ativa && 'opacity-50',
            )}
            onClick={() => setSelected(est)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <span className="text-xl select-none shrink-0">{est.fase_lunar || '◯'}</span>
              {est.livro_capa_url ? (
                <img
                  src={est.livro_capa_url}
                  alt={est.livro_titulo}
                  className="w-10 h-14 object-cover rounded shadow"
                />
              ) : (
                <div className="w-10 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70">
                  {est.titulo}
                </p>
                <p className="text-sm font-display text-foreground truncate">{est.livro_titulo}</p>
                <p className="text-xs text-muted-foreground">{est.livro_autor || '—'}</p>
                {est.ativa && (
                  <Badge variant="secondary" className="text-[10px] mt-1">
                    Atual
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── SIDE PANEL ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelected(null)}
            />
            <SidePanel
              estacao={selected}
              onClose={() => setSelected(null)}
              onNavigate={(path) => {
                setSelected(null);
                navigate(path);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
