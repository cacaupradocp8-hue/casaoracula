// ============================================
// MANDALA ANUAL — Mapa Simbólico em Camadas Concêntricas
// Núcleo → Travessia → Porta → Ponte → Fundação
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, X, Headphones, Columns } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ClubeCiclo } from '@/hooks/useClubeLivro';

// ============================================
// CAMADAS & DADOS
// ============================================

type Categoria = 'travessia' | 'porta' | 'ponte' | 'fundacao';

interface LivroNode {
  titulo: string;
  categoria: Categoria;
  angulo: number; // posição em graus
  parentIndex?: number; // para Porta → ligação ao Travessia
}

const CATEGORIAS: Record<Categoria, { label: string; cor: string; corAccent: string; raio: number; nodeSize: number }> = {
  travessia: { label: 'Travessia', cor: 'text-gold', corAccent: '#D4A843', raio: 120, nodeSize: 34 },
  porta:     { label: 'Porta',     cor: 'text-violet-400', corAccent: '#8B5CF6', raio: 195, nodeSize: 26 },
  ponte:     { label: 'Ponte',     cor: 'text-teal-400', corAccent: '#14B8A6', raio: 255, nodeSize: 20 },
  fundacao:  { label: 'Fundação',  cor: 'text-muted-foreground', corAccent: '#78716C', raio: 295, nodeSize: 16 },
};

// 4 Livros-Travessia em cruz (0°, 90°, 180°, 270°)
// 5 Livros-Porta ligados aos Travessia
// 3 Livros-Ponte na borda
// 2 Livros-Fundação no anel externo
const LIVROS: LivroNode[] = [
  // TRAVESSIA (index 0-3)
  { titulo: 'Mulheres que Correm com os Lobos', categoria: 'travessia', angulo: 0 },
  { titulo: 'O Código do Ser',                  categoria: 'travessia', angulo: 90 },
  { titulo: 'Ficções que Curam',                 categoria: 'travessia', angulo: 180 },
  { titulo: 'A Gravidade e a Graça',             categoria: 'travessia', angulo: 270 },

  // PORTA (index 4-8) — conectados a Travessia
  { titulo: 'A Coruja Era Filha do Padeiro', categoria: 'porta', angulo: 30,  parentIndex: 0 },
  { titulo: 'Brincar de Realidade',          categoria: 'porta', angulo: 120, parentIndex: 1 },
  { titulo: 'Acontecimentos',               categoria: 'porta', angulo: 150, parentIndex: 1 },
  { titulo: 'Água Viva',                    categoria: 'porta', angulo: 210, parentIndex: 2 },
  { titulo: 'A Condição Humana',             categoria: 'porta', angulo: 300, parentIndex: 3 },

  // PONTE (index 9-11)
  { titulo: 'Inteligência Sexual',  categoria: 'ponte', angulo: 60 },
  { titulo: 'A Poética do Espaço',  categoria: 'ponte', angulo: 240 },
  { titulo: 'O Poder da Escrita',   categoria: 'ponte', angulo: 330 },
];

// ============================================
// UTILS
// ============================================

function matchLivro(ciclo: ClubeCiclo, titulo: string): boolean {
  const a = ciclo.titulo.toLowerCase().replace(/\s+/g, ' ').trim();
  const b = titulo.toLowerCase().replace(/\s+/g, ' ').trim();
  return a.includes(b) || b.includes(a);
}

function polarToXY(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

// ============================================
// SIDE PANEL
// ============================================

interface SidePanelProps {
  ciclo: ClubeCiclo;
  categoria: Categoria;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

function SidePanel({ ciclo, categoria, onClose, onNavigate }: SidePanelProps) {
  const cat = CATEGORIAS[categoria];
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
            <Badge variant="outline" className={cn('text-xs mb-2', cat.cor)}>
              {cat.label}
            </Badge>
            <h3 className="font-display text-lg text-foreground">{ciclo.titulo}</h3>
            <p className="text-sm text-muted-foreground">{ciclo.autor_livro}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {ciclo.capa_url && (
          <img src={ciclo.capa_url} alt={ciclo.titulo} className="w-full h-48 object-cover rounded-lg shadow-lg" />
        )}

        {ciclo.tema_simbolico && (
          <div className="text-sm text-muted-foreground italic border-l-2 border-gold/30 pl-3">
            {ciclo.tema_simbolico}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', ciclo.publicado ? 'bg-emerald-500' : 'bg-muted-foreground/40')} />
          <span className="text-xs text-muted-foreground">{ciclo.publicado ? 'Publicado' : 'Não publicado'}</span>
          <div className={cn('w-2 h-2 rounded-full ml-2', ciclo.ativo ? 'bg-gold' : 'bg-muted-foreground/40')} />
          <span className="text-xs text-muted-foreground">{ciclo.ativo ? 'Ativo' : 'Inativo'}</span>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate(`/clube-livro/${ciclo.id}`)}>
            <BookOpen className="w-4 h-4" /> Acessar Ciclo
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate(`/clube-livro/${ciclo.id}`)}>
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

interface MandalaAnualProps {
  ciclos: ClubeCiclo[];
  cicloAtualId?: string;
}

export function MandalaAnual({ ciclos, cicloAtualId }: MandalaAnualProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<{ ciclo: ClubeCiclo; categoria: Categoria } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const size = 660;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative">
      {/* SVG Mandala */}
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[660px] aspect-square">
          {/* Background orbit rings */}
          {[120, 195, 255, 295].map((r) => (
            <circle
              key={r}
              cx={cx} cy={cy} r={r}
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
              <span className="text-gold text-xl leading-none" style={{ opacity: 0.85 }}>☽◯☾</span>
              <span className="text-gold/60 text-[6px] uppercase tracking-[0.2em] mt-1 font-semibold">Matriz</span>
            </div>
          </foreignObject>

          {/* ── LINHAS: Porta → Travessia ── */}
          {LIVROS.filter((l) => l.parentIndex !== undefined).map((livro) => {
            const parent = LIVROS[livro.parentIndex!];
            const from = polarToXY(livro.angulo, CATEGORIAS[livro.categoria].raio, cx, cy);
            const to = polarToXY(parent.angulo, CATEGORIAS[parent.categoria].raio, cx, cy);
            return (
              <line
                key={`line-${livro.titulo}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={CATEGORIAS[livro.categoria].corAccent}
                strokeWidth={0.8}
                strokeOpacity={0.18}
              />
            );
          })}

          {/* ── LIVROS ── */}
          {LIVROS.map((livro) => {
            const cat = CATEGORIAS[livro.categoria];
            const pos = polarToXY(livro.angulo, cat.raio, cx, cy);
            const ciclo = ciclos.find((c) => matchLivro(c, livro.titulo));
            const isAtual = ciclo?.id === cicloAtualId;
            const isHovered = ciclo && hoveredId === ciclo.id;
            const ns = cat.nodeSize;

            return (
              <g
                key={livro.titulo}
                className="cursor-pointer"
                onClick={() => { if (ciclo) setSelected({ ciclo, categoria: livro.categoria }); }}
                onMouseEnter={() => ciclo && setHoveredId(ciclo.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Hover / active glow */}
                {(isHovered || isAtual) && (
                  <circle cx={pos.x} cy={pos.y} r={ns + 6} fill="none" stroke={cat.corAccent} strokeWidth={1} strokeOpacity={0.4} />
                )}

                {/* Node */}
                <circle
                  cx={pos.x} cy={pos.y} r={ns}
                  fill={ciclo ? `${cat.corAccent}15` : 'hsl(var(--muted)/0.2)'}
                  stroke={isAtual ? cat.corAccent : ciclo ? `${cat.corAccent}50` : 'hsl(var(--muted-foreground)/0.2)'}
                  strokeWidth={isAtual ? 2.5 : 1.2}
                />

                {/* Icon / cover */}
                <foreignObject x={pos.x - ns + 6} y={pos.y - ns + 6} width={(ns - 6) * 2} height={(ns - 6) * 2}>
                  <div className="flex items-center justify-center w-full h-full">
                    {ciclo?.capa_url ? (
                      <img src={ciclo.capa_url} alt={ciclo.titulo} className="rounded-full object-cover" style={{ width: (ns - 8) * 2, height: (ns - 8) * 2 }} />
                    ) : ciclo ? (
                      <BookOpen className={cn('opacity-60', cat.cor)} style={{ width: ns * 0.5, height: ns * 0.5 }} />
                    ) : (
                      <Lock className="text-muted-foreground/40" style={{ width: ns * 0.4, height: ns * 0.4 }} />
                    )}
                  </div>
                </foreignObject>

                {/* Label */}
                <foreignObject x={pos.x - 48} y={pos.y + ns + 3} width={96} height={32}>
                  <div className="text-center">
                    <span className={cn(
                      'leading-tight line-clamp-2 font-medium',
                      livro.categoria === 'fundacao' ? 'text-[7px] text-muted-foreground/60' : 'text-[8px] text-foreground/80'
                    )}>
                      {ciclo?.titulo || livro.titulo}
                    </span>
                  </div>
                </foreignObject>

                {/* Atual badge */}
                {isAtual && (
                  <foreignObject x={pos.x - 15} y={pos.y - ns - 14} width={30} height={14}>
                    <div className="flex justify-center">
                      <span className="bg-gold/20 text-gold text-[6px] px-1 py-0.5 rounded font-semibold uppercase">Atual</span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── MOBILE LIST ── */}
      <div className="mt-8 space-y-6 md:hidden">
        {(['travessia', 'porta', 'ponte', 'fundacao'] as Categoria[]).map((cat) => {
          const info = CATEGORIAS[cat];
          const livrosCat = LIVROS.filter((l) => l.categoria === cat);
          return (
            <div key={cat} className="space-y-2">
              <div className={cn('flex items-center gap-2 px-2', info.cor)}>
                {cat === 'fundacao' ? <Columns className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                <span className="text-xs font-semibold uppercase tracking-widest">{info.label}</span>
              </div>
              <div className="grid gap-2">
                {livrosCat.map((livro) => {
                  const ciclo = ciclos.find((c) => matchLivro(c, livro.titulo));
                  const isAtual = ciclo?.id === cicloAtualId;
                  return (
                    <Card
                      key={livro.titulo}
                      className={cn(
                        'cursor-pointer transition-all hover:border-gold/40',
                        isAtual && 'border-gold/50 bg-gold/5',
                        !ciclo && 'opacity-50',
                      )}
                      onClick={() => { if (ciclo) setSelected({ ciclo, categoria: cat }); }}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        {ciclo?.capa_url ? (
                          <img src={ciclo.capa_url} alt={ciclo.titulo} className="w-10 h-14 object-cover rounded shadow" />
                        ) : (
                          <div className="w-10 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-display text-foreground truncate">{ciclo?.titulo || livro.titulo}</p>
                          <p className="text-xs text-muted-foreground">{ciclo?.autor_livro || '—'}</p>
                          {isAtual && <Badge variant="secondary" className="text-[10px] mt-1">Atual</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SIDE PANEL ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelected(null)}
            />
            <SidePanel
              ciclo={selected.ciclo}
              categoria={selected.categoria}
              onClose={() => setSelected(null)}
              onNavigate={(path) => { setSelected(null); navigate(path); }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
