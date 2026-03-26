import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { useClubeConteudoSemanal, useClubeReflexoes, useClubeEngajamento, useClubeProximoEncontro } from '@/hooks/useClubeOracular';
import { useAuth } from '@/contexts/AuthContext';
import { ClubeBannerCicloAtual } from '@/components/clube-oracular/ClubeBannerCicloAtual';
import { ClubeConteudoSemanal } from '@/components/clube-oracular/ClubeConteudoSemanal';
import { ClubeProximoEncontro } from '@/components/clube-oracular/ClubeProximoEncontro';
import { ClubeProgressoTravessia } from '@/components/clube-oracular/ClubeProgressoTravessia';
import { ClubeBlocoProgressao } from '@/components/clube-oracular/ClubeBlocoProgressao';
import { ClubeJardinsIntegracao } from '@/components/clube-oracular/ClubeJardinsIntegracao';
import { BookOpen, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function ClubeOracular() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cicloAtual, loadingCiclos } = useClubeLivro();
  const { data: conteudoSemanal } = useClubeConteudoSemanal(cicloAtual?.id);
  const { reflexoes, salvarReflexao } = useClubeReflexoes(cicloAtual?.id);
  const { engajamento } = useClubeEngajamento(cicloAtual?.id);
  const { data: proximoEncontro } = useClubeProximoEncontro(cicloAtual?.id);

  if (loadingCiclos) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* ─── HERO ─────────────────────────────────────── */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-background" />

          {/* Breathing orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(var(--mystic) / 0.08), hsl(var(--gold) / 0.04), transparent)',
              filter: 'blur(40px)',
              animation: 'clube-breathe 4s ease-in-out infinite',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative z-10 container mx-auto px-6 text-center max-w-2xl"
          >
            {/* Breathing symbol */}
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/8 border border-gold/12 mb-6"
              style={{ animation: 'clube-breathe-icon 4s ease-in-out infinite' }}
            >
              <BookOpen className="w-7 h-7 text-gold/70" />
            </div>

            <p className="text-[11px] uppercase tracking-[0.4em] text-gold/40 font-medium mb-4">
              Clube de Leitura Oracular
            </p>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 tracking-wide leading-tight">
              Território de Leitura Viva
            </h1>

            <p className="text-muted-foreground/60 text-sm md:text-base max-w-md mx-auto font-display italic leading-relaxed">
              Cada livro é uma travessia. Cada encontro, um portal.
            </p>

            <div className="flex items-center justify-center gap-3 mt-7">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/20" />
              <Sparkles className="w-3 h-3 text-gold/25" />
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/20" />
            </div>
          </motion.div>
        </section>

        {/* ─── CONTENT ──────────────────────────────────── */}
        <div className="container mx-auto px-6 pb-28 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-14">

            {/* ── Main column ─────────────────────────── */}
            <div className="lg:col-span-2 space-y-14">
              {/* 1. Banner do Ciclo Atual */}
              <motion.div {...fadeInUp} transition={{ duration: 0.7 }}>
                <ClubeBannerCicloAtual
                  ciclo={cicloAtual}
                  onAcessar={() => cicloAtual && navigate(`/clube-livro/${cicloAtual.id}`)}
                />
              </motion.div>

              {/* 2. Ritual da Semana (podcast, carta, pergunta, prática) */}
              <motion.div {...fadeInUp} transition={{ duration: 0.7, delay: 0.08 }}>
                <ClubeConteudoSemanal
                  conteudo={conteudoSemanal}
                  onSalvarReflexao={(texto) =>
                    salvarReflexao.mutate({ texto, conteudoSemanalId: conteudoSemanal?.id })
                  }
                  salvando={salvarReflexao.isPending}
                />
              </motion.div>

              {/* 3. Integração com os Jardins */}
              <motion.div {...fadeInUp} transition={{ duration: 0.7, delay: 0.12 }}>
                <ClubeJardinsIntegracao />
              </motion.div>
            </div>

            {/* ── Sidebar ─────────────────────────────── */}
            <div className="space-y-8">
              {/* 5. Próximo Encontro */}
              <motion.div {...fadeInUp} transition={{ duration: 0.7, delay: 0.1 }}>
                <ClubeProximoEncontro encontro={proximoEncontro} />
              </motion.div>

              {/* 6. Progresso da Travessia */}
              <motion.div {...fadeInUp} transition={{ duration: 0.7, delay: 0.15 }}>
                <ClubeProgressoTravessia
                  progresso={engajamento?.progresso ?? 0}
                  totalTerritorios={4}
                  explorados={Math.round((engajamento?.progresso ?? 0) * 4)}
                />
              </motion.div>

              {/* Bloco de Progressão */}
              <motion.div {...fadeInUp} transition={{ duration: 0.7, delay: 0.2 }}>
                <ClubeBlocoProgressao
                  portal={user?.portal}
                  engajamento={engajamento?.nivel ?? 'baixo'}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Breathing animation keyframes */}
        <style>{`
          @keyframes clube-breathe {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
            50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
          }
          .inline-flex[style*="clube-breathe"] {
            animation: clube-breathe-icon 4s ease-in-out infinite;
          }
          @keyframes clube-breathe-icon {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
