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
        {/* Hero Section */}
        <section className="relative py-28 md:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-background" />

          {/* Breathing orb — ONLY here */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-mystic/8 via-gold/5 to-transparent blur-3xl animate-breathe pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 container mx-auto px-6 text-center max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-gold" />
              </div>
            </div>

            <p className="text-[11px] uppercase tracking-[0.4em] text-gold/50 font-medium mb-5">
              Clube de Leitura Oracular
            </p>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 tracking-wide leading-tight">
              Território de Leitura Viva
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto font-display italic leading-relaxed">
              Reflexão, prática e atravessamento simbólico — cada livro é uma travessia, cada encontro é um portal.
            </p>

            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/25" />
              <Sparkles className="w-3 h-3 text-gold/30" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/25" />
            </div>
          </motion.div>
        </section>

        {/* Content Grid */}
        <div className="container mx-auto px-6 pb-32 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-14">

            {/* Main column */}
            <div className="lg:col-span-2 space-y-14">
              <motion.div {...fadeInUp} transition={{ duration: 0.8 }}>
                <ClubeBannerCicloAtual
                  ciclo={cicloAtual}
                  onAcessar={() => cicloAtual && navigate(`/clube-livro/${cicloAtual.id}`)}
                />
              </motion.div>

              <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 }}>
                <ClubeConteudoSemanal
                  conteudo={conteudoSemanal}
                  onSalvarReflexao={(texto) =>
                    salvarReflexao.mutate({ texto, conteudoSemanalId: conteudoSemanal?.id })
                  }
                  salvando={salvarReflexao.isPending}
                />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-10">
              <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.15 }}>
                <ClubeProximoEncontro encontro={proximoEncontro} />
              </motion.div>

              <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.2 }}>
                <ClubeProgressoTravessia
                  progresso={engajamento?.progresso ?? 0}
                  totalTerritorios={4}
                  explorados={Math.round((engajamento?.progresso ?? 0) * 4)}
                />
              </motion.div>

              <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.25 }}>
                <ClubeBlocoProgressao
                  portal={user?.portal}
                  engajamento={engajamento?.nivel ?? 'baixo'}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
