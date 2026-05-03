import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PontoRota, Estacao } from '@/hooks/useRotaOracular';

interface RotaAtualHeroProps {
  estacao: Estacao | null;
  pontos: PontoRota[];
  pontoAtual?: PontoRota;
  progresso: number;
  welcomeName: string;
}

/**
 * RotaAtualHero — Apresentação cinemática da Rota atual no Home do Clube.
 * Paleta midnight + gold, mobile-first, microinterações suaves.
 */
export function RotaAtualHero({
  estacao,
  pontos,
  pontoAtual,
  progresso,
  welcomeName,
}: RotaAtualHeroProps) {
  const navigate = useNavigate();
  const total = pontos.length;
  const concluidos = pontos.filter(p => p.estado === 'completed').length;
  const ponto = pontoAtual || pontos.find(p => p.estado === 'available') || pontos[0];

  if (!estacao) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative overflow-hidden rounded-[28px] border border-gold/15 bg-midnight"
    >
      {/* Background atmospheric */}
      <div className="absolute inset-0 pointer-events-none">
        {estacao.banner_url || estacao.livro_imagem_banner_url ? (
          <img
            src={estacao.banner_url || estacao.livro_imagem_banner_url || ''}
            alt=""
            className="w-full h-full object-cover opacity-30 scale-110"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/80 to-midnight" />
        <div className="absolute -top-40 -right-20 w-[420px] h-[420px] bg-gold/[0.08] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 w-[360px] h-[360px] bg-[hsl(206_70%_30%/0.25)] rounded-full blur-[120px]" />
      </div>

      <div className="relative p-6 md:p-10 space-y-7">
        {/* Saudação */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-gold/40" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-gold/70">
              Sua rota atual
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl text-foreground/90">
            Olá, <span className="text-gold">{welcomeName}</span>
          </h2>
        </div>

        {/* Capa + título da estação */}
        <div className="flex items-start gap-4 md:gap-5">
          {estacao.livro_capa_url ? (
            <motion.img
              whileHover={{ scale: 1.04, rotate: -1 }}
              transition={{ duration: 0.6 }}
              src={estacao.livro_capa_url}
              alt={estacao.livro_titulo}
              className="w-[88px] md:w-[112px] aspect-[2/3] object-cover rounded shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] ring-1 ring-foreground/10"
            />
          ) : (
            <div className="w-[88px] md:w-[112px] aspect-[2/3] rounded bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Compass className="w-7 h-7 text-gold/60" />
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-2 pt-1">
            <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/40">
              Estação {estacao.numero}
            </p>
            <h3 className="font-display text-2xl md:text-3xl text-foreground leading-[1.1]">
              {estacao.livro_titulo}
            </h3>
            {estacao.livro_autor && (
              <p className="font-serif italic text-sm text-foreground/50">
                {estacao.livro_autor}
              </p>
            )}
            {estacao.essencia_nucleo && (
              <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 pt-1">
                {estacao.essencia_nucleo}
              </p>
            )}
          </div>
        </div>

        {/* Pontos de progresso visuais (Apple style) */}
        {total > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/40">
                Progresso
              </span>
              <span className="text-[10px] text-gold/80 font-medium tracking-wide">
                {concluidos}/{total} · {Math.round(progresso)}%
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {pontos.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className={cn(
                    'h-1 flex-1 rounded-full origin-left transition-colors duration-500',
                    p.estado === 'completed' && 'bg-gold',
                    p.estado === 'in_progress' &&
                      'bg-gradient-to-r from-gold to-gold/40',
                    p.estado === 'available' && 'bg-gold/30',
                    p.estado === 'locked' && 'bg-foreground/10'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ponto atual + CTA */}
        {ponto && (
          <button
            onClick={() => navigate(`/clube/rota/${ponto.slug}`)}
            className="group block w-full text-left rounded-2xl border border-foreground/[0.08] bg-foreground/[0.03] hover:bg-foreground/[0.06] hover:border-gold/25 backdrop-blur p-5 transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 shrink-0 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:scale-105 transition-all">
                {ponto.estado === 'completed' ? (
                  <Check className="w-4 h-4 text-gold group-hover:text-midnight" strokeWidth={3} />
                ) : ponto.estado === 'locked' ? (
                  <Lock className="w-4 h-4 text-gold group-hover:text-midnight" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-gold group-hover:text-midnight" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] tracking-[0.3em] uppercase text-gold/70 mb-0.5">
                  {ponto.estado === 'completed'
                    ? 'Continuar travessia'
                    : ponto.estado === 'locked'
                    ? 'Próximo destino'
                    : 'Continuar de onde parou'}
                </p>
                <p className="font-display text-base md:text-lg text-foreground truncate">
                  {ponto.nome}
                </p>
                {ponto.subtitulo && (
                  <p className="font-serif italic text-xs text-foreground/45 truncate mt-0.5">
                    {ponto.subtitulo}
                  </p>
                )}
              </div>
            </div>
          </button>
        )}

        {/* Link para catálogo completo */}
        <button
          onClick={() => navigate('/clube/rotas')}
          className="group w-full flex items-center justify-center gap-2 pt-2 text-[10px] tracking-[0.35em] uppercase text-foreground/40 hover:text-gold/80 transition-colors"
        >
          <span className="h-px w-6 bg-foreground/15 group-hover:bg-gold/40 transition-colors" />
          Ver todas as rotas
          <span className="h-px w-6 bg-foreground/15 group-hover:bg-gold/40 transition-colors" />
        </button>
      </div>
    </motion.section>
  );
}
