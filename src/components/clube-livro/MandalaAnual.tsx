// ============================================
// MANDALA ANUAL — Mapa Simbólico Circular
// 4 Quadrantes × 3 Livros = 12 Ciclos
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, ArrowRight, X, Pencil, DoorOpen, Headphones, Power } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ClubeCiclo } from '@/hooks/useClubeLivro';

// ============================================
// QUADRANTES SIMBÓLICOS
// ============================================

interface Quadrante {
  chave: string;
  nome: string;
  descricao: string;
  simbolo: string;
  corLabel: string;
  corBg: string;
  corBorda: string;
  corAccent: string;
  angulo: number; // ângulo central do quadrante (graus)
  livros: string[];
}

const QUADRANTES: Quadrante[] = [
  {
    chave: 'chamado',
    nome: 'CHAMADO',
    descricao: 'Despertar, identidade, instinto primordial',
    simbolo: '◈',
    corLabel: 'text-amber-400',
    corBg: 'from-amber-950/40 to-card',
    corBorda: 'border-amber-700/30',
    corAccent: '#F59E0B',
    angulo: 0,
    livros: [
      'Mulheres que Correm com os Lobos',
      'O Código do Ser',
      'A Coruja Era Filha do Padeiro',
    ],
  },
  {
    chave: 'ruptura',
    nome: 'RUPTURA',
    descricao: 'Espaço potencial, desejo, queda',
    simbolo: '◉',
    corLabel: 'text-violet-400',
    corBg: 'from-violet-950/40 to-card',
    corBorda: 'border-violet-700/30',
    corAccent: '#8B5CF6',
    angulo: 90,
    livros: [
      'O Brincar e a Realidade',
      'Inteligência Erótica',
      'O Acontecimento',
    ],
  },
  {
    chave: 'reorganizacao',
    nome: 'REORGANIZAÇÃO',
    descricao: 'Narrativa como cura, casa psíquica, atenção',
    simbolo: '◎',
    corLabel: 'text-teal-400',
    corBg: 'from-teal-950/40 to-card',
    corBorda: 'border-teal-700/30',
    corAccent: '#14B8A6',
    angulo: 180,
    livros: [
      'Ficções que Curam',
      'A Poética do Espaço',
      'A Gravidade e a Graça',
    ],
  },
  {
    chave: 'integracao',
    nome: 'INTEGRAÇÃO',
    descricao: 'Responsabilidade, escrita, linguagem viva',
    simbolo: '⬡',
    corLabel: 'text-rose-400',
    corBg: 'from-rose-950/40 to-card',
    corBorda: 'border-rose-700/30',
    corAccent: '#F43F5E',
    angulo: 270,
    livros: [
      'A Condição Humana',
      'O Poder da Escrita',
      'Água Viva',
    ],
  },
];

// ============================================
// UTILS
// ============================================

function matchLivro(ciclo: ClubeCiclo, titulo: string): boolean {
  return (
    ciclo.titulo.toLowerCase().includes(titulo.toLowerCase()) ||
    titulo.toLowerCase().includes(ciclo.titulo.toLowerCase())
  );
}

function polarToXY(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

// ============================================
// PAINEL LATERAL
// ============================================

interface SidePanelProps {
  ciclo: ClubeCiclo;
  quadrante: Quadrante;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

function SidePanel({ ciclo, quadrante, onClose, onNavigate }: SidePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className={cn('text-xs mb-2', quadrante.corLabel, quadrante.corBorda)}>
              {quadrante.simbolo} {quadrante.nome}
            </Badge>
            <h3 className="font-display text-lg text-foreground">{ciclo.titulo}</h3>
            <p className="text-sm text-muted-foreground">{ciclo.autor_livro}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Capa */}
        {ciclo.capa_url && (
          <img
            src={ciclo.capa_url}
            alt={ciclo.titulo}
            className="w-full h-48 object-cover rounded-lg shadow-lg"
          />
        )}

        {/* Tema */}
        {ciclo.tema_simbolico && (
          <div className="text-sm text-muted-foreground italic border-l-2 border-gold/30 pl-3">
            {ciclo.tema_simbolico}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', ciclo.publicado ? 'bg-emerald-500' : 'bg-muted-foreground/40')} />
          <span className="text-xs text-muted-foreground">
            {ciclo.publicado ? 'Publicado' : 'Não publicado'}
          </span>
          <div className={cn('w-2 h-2 rounded-full ml-2', ciclo.ativo ? 'bg-gold' : 'bg-muted-foreground/40')} />
          <span className="text-xs text-muted-foreground">
            {ciclo.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        {/* Ações */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate(`/clube-livro/${ciclo.id}`)}
          >
            <BookOpen className="w-4 h-4" /> Acessar Ciclo
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate(`/clube-livro/${ciclo.id}`)}
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

interface MandalaAnualProps {
  ciclos: ClubeCiclo[];
  cicloAtualId?: string;
}

export function MandalaAnual({ ciclos, cicloAtualId }: MandalaAnualProps) {
  const navigate = useNavigate();
  const [selectedCiclo, setSelectedCiclo] = useState<{ ciclo: ClubeCiclo; quadrante: Quadrante } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const size = 600;
  const cx = size / 2;
  const cy = size / 2;
  const ringRadius = [0, 120, 200]; // center, inner ring (quadrant labels), outer ring (books)

  return (
    <div className="relative">
      {/* SVG Mandala */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[600px] aspect-square"
        >
          {/* Background circles */}
          {[80, 160, 240, 280].map((r) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
              strokeOpacity={0.12}
              strokeDasharray="4 8"
            />
          ))}

          {/* Quadrant divider lines */}
          {[45, 135, 225, 315].map((angle) => {
            const p = polarToXY(angle, 280, cx, cy);
            return (
              <line
                key={angle}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={0.5}
                strokeOpacity={0.1}
              />
            );
          })}

          {/* Center */}
          <circle cx={cx} cy={cy} r={40} className="fill-gold/10 stroke-gold/30" strokeWidth={2} />
          <foreignObject x={cx - 20} y={cx - 20} width={40} height={40}>
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-gold text-lg">☽</span>
            </div>
          </foreignObject>
          <text
            x={cx}
            y={cy + 55}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
            fontFamily="sans-serif"
          >
            Travessia Anual
          </text>

          {/* Quadrant labels + books */}
          {QUADRANTES.map((quad) => {
            const labelPos = polarToXY(quad.angulo, 100, cx, cy);

            return (
              <g key={quad.chave}>
                {/* Quadrant label */}
                <foreignObject
                  x={labelPos.x - 40}
                  y={labelPos.y - 20}
                  width={80}
                  height={40}
                >
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <span className={cn('text-lg leading-none', quad.corLabel)}>{quad.simbolo}</span>
                    <span className={cn('text-[8px] font-semibold uppercase tracking-widest mt-0.5', quad.corLabel)}>
                      {quad.nome}
                    </span>
                  </div>
                </foreignObject>

                {/* Books in this quadrant */}
                {quad.livros.map((titulo, i) => {
                  const ciclo = ciclos.find((c) => matchLivro(c, titulo));
                  const bookAngle = quad.angulo - 25 + i * 25;
                  const bookPos = polarToXY(bookAngle, 210, cx, cy);
                  const isAtual = ciclo?.id === cicloAtualId;
                  const isPublicado = ciclo?.publicado;
                  const isHovered = ciclo && hoveredId === ciclo.id;
                  const nodeSize = 28;

                  return (
                    <g key={titulo}>
                      {/* Connection line */}
                      <line
                        x1={labelPos.x}
                        y1={labelPos.y}
                        x2={bookPos.x}
                        y2={bookPos.y}
                        stroke={quad.corAccent}
                        strokeWidth={1}
                        strokeOpacity={0.2}
                      />

                      {/* Book node */}
                      <g
                        className="cursor-pointer"
                        onClick={() => {
                          if (ciclo) setSelectedCiclo({ ciclo, quadrante: quad });
                        }}
                        onMouseEnter={() => ciclo && setHoveredId(ciclo.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {/* Outer glow on hover/active */}
                        {(isHovered || isAtual) && (
                          <circle
                            cx={bookPos.x}
                            cy={bookPos.y}
                            r={nodeSize + 6}
                            fill="none"
                            stroke={quad.corAccent}
                            strokeWidth={1}
                            strokeOpacity={0.4}
                          />
                        )}

                        {/* Node circle */}
                        <circle
                          cx={bookPos.x}
                          cy={bookPos.y}
                          r={nodeSize}
                          fill={isPublicado ? `${quad.corAccent}20` : 'hsl(var(--muted)/0.3)'}
                          stroke={isAtual ? quad.corAccent : isPublicado ? `${quad.corAccent}60` : 'hsl(var(--muted-foreground)/0.3)'}
                          strokeWidth={isAtual ? 2.5 : 1.5}
                        />

                        {/* Capa or icon inside node */}
                        <foreignObject
                          x={bookPos.x - 14}
                          y={bookPos.y - 14}
                          width={28}
                          height={28}
                        >
                          <div className="flex items-center justify-center w-full h-full">
                            {ciclo?.capa_url ? (
                              <img
                                src={ciclo.capa_url}
                                alt={ciclo.titulo}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : isPublicado ? (
                              <BookOpen className={cn('w-3.5 h-3.5', quad.corLabel)} />
                            ) : (
                              <Lock className="w-3 h-3 text-muted-foreground/50" />
                            )}
                          </div>
                        </foreignObject>

                        {/* Title label */}
                        <foreignObject
                          x={bookPos.x - 45}
                          y={bookPos.y + nodeSize + 4}
                          width={90}
                          height={36}
                        >
                          <div className="text-center">
                            <span className="text-[8px] leading-tight text-foreground/80 line-clamp-2 font-medium">
                              {ciclo?.titulo || titulo}
                            </span>
                          </div>
                        </foreignObject>

                        {/* Current badge */}
                        {isAtual && (
                          <foreignObject
                            x={bookPos.x - 15}
                            y={bookPos.y - nodeSize - 14}
                            width={30}
                            height={14}
                          >
                            <div className="flex justify-center">
                              <span className="bg-gold/20 text-gold text-[6px] px-1 py-0.5 rounded font-semibold uppercase">
                                Atual
                              </span>
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile card list below mandala */}
      <div className="mt-8 space-y-4 md:hidden">
        {QUADRANTES.map((quad) => (
          <div key={quad.chave} className="space-y-2">
            <div className={cn('flex items-center gap-2 px-2', quad.corLabel)}>
              <span className="text-lg">{quad.simbolo}</span>
              <span className="text-xs font-semibold uppercase tracking-widest">{quad.nome}</span>
            </div>
            <div className="grid gap-2">
              {quad.livros.map((titulo) => {
                const ciclo = ciclos.find((c) => matchLivro(c, titulo));
                const isAtual = ciclo?.id === cicloAtualId;

                return (
                  <Card
                    key={titulo}
                    className={cn(
                      'cursor-pointer transition-all hover:border-gold/40',
                      isAtual && 'border-gold/50 bg-gold/5',
                      !ciclo?.publicado && 'opacity-60',
                    )}
                    onClick={() => {
                      if (ciclo) setSelectedCiclo({ ciclo, quadrante: quad });
                    }}
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
                        <p className="text-sm font-display text-foreground truncate">{ciclo?.titulo || titulo}</p>
                        <p className="text-xs text-muted-foreground">{ciclo?.autor_livro || '—'}</p>
                        {isAtual && <Badge variant="secondary" className="text-[10px] mt-1">Atual</Badge>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {selectedCiclo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedCiclo(null)}
            />
            <SidePanel
              ciclo={selectedCiclo.ciclo}
              quadrante={selectedCiclo.quadrante}
              onClose={() => setSelectedCiclo(null)}
              onNavigate={(path) => {
                setSelectedCiclo(null);
                navigate(path);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
