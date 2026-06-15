import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GavetaTrilha } from './GavetaTrilha';
import type { TrainingCase } from '@/components/treinamento/simulador/types';

interface Props {
  sussurros: TrainingCase[];
  onSelect: (caso: TrainingCase) => void;
  onBack: () => void;
}

// Heurística de categorização: lê raw.categoria; fallback por título.
function categorizar(c: TrainingCase): 'conto' | 'vida' | 'sonoro' {
  const raw: any = (c as any).rawCamara || {};
  const cat = String(raw.categoria || '').toLowerCase();
  if (cat.includes('conto')) return 'conto';
  if (cat.includes('vida')) return 'vida';
  if (cat.includes('sonor') || cat.includes('musica') || cat.includes('música')) return 'sonoro';
  const t = c.title.toLowerCase();
  if (t.includes('la loba')) return 'conto';
  if (/(revela|maria|moana|canç|cantiga)/.test(t)) return 'sonoro';
  return 'vida';
}

export function VestibuloCamara({ sussurros, onSelect, onBack }: Props) {
  const conto = sussurros.filter(s => categorizar(s) === 'conto');
  const vida = sussurros.filter(s => categorizar(s) === 'vida');
  const sonoro = sussurros.filter(s => categorizar(s) === 'sonoro');

  return (
    <div className="min-h-screen bg-[#0a0807] text-foreground relative overflow-hidden">
      {/* Atmosfera floresta noturna / ouro envelhecido */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(180,130,60,0.10),transparent_55%)] pointer-events-none" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,191,36,0.05),transparent_70%)] pointer-events-none"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.6%22/></svg>")' }} />

      <div className="relative max-w-3xl mx-auto px-6 py-12 space-y-14">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-amber-200/60 hover:text-amber-100 hover:bg-transparent -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar à Clareira
        </Button>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4 py-8"
        >
          <p className="text-[10px] tracking-[0.6em] uppercase text-amber-200/40">Rota dos Lobos · Clareira do Chamado</p>
          <h1 className="font-display text-5xl md:text-6xl italic text-amber-100/95 leading-tight">
            Câmara do <span className="text-amber-300/90">Sussurro</span>
          </h1>
          <p className="font-display italic text-lg text-amber-200/70">
            Escute antes de interpretar.
          </p>
          <p className="max-w-md mx-auto text-sm text-foreground/55 font-body leading-relaxed pt-4">
            Algumas leituras não começam com respostas.<br />Começam com sinais.
          </p>
        </motion.header>

        {sussurros.length === 0 ? (
          <div className="text-center py-20 border-t border-b border-amber-200/10">
            <p className="font-display italic text-amber-200/40">
              A Câmara ainda repousa em silêncio.
            </p>
            <p className="text-xs text-foreground/30 mt-2">Os Sussurros serão cadastrados pelo Admin.</p>
          </div>
        ) : (
          <div className="pt-4">
            <GavetaTrilha
              titulo="Sussurros do Conto"
              subtitulo="La Loba e seus mistérios"
              sussurros={conto}
              startIndex={0}
              defaultOpen
              onSelect={onSelect}
            />
            <GavetaTrilha
              titulo="Sussurros da Vida"
              subtitulo="Sinais que passam despercebidos"
              sussurros={vida}
              startIndex={conto.length}
              onSelect={onSelect}
            />
            <GavetaTrilha
              titulo="Sussurros Sonoros"
              subtitulo="O que a canção sabe antes do pensamento"
              sussurros={sonoro}
              startIndex={conto.length + vida.length}
              onSelect={onSelect}
            />
            <div className="border-t border-amber-200/10" />
          </div>
        )}
      </div>
    </div>
  );
}
