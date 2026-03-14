import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { useClubeConteudoSemanal, useClubeReflexoes, useClubeEngajamento, useClubeProximoEncontro } from '@/hooks/useClubeOracular';
import { useAuth } from '@/contexts/AuthContext';
import { ClubeBannerCicloAtual } from '@/components/clube-oracular/ClubeBannerCicloAtual';
import { ClubeConteudoSemanal } from '@/components/clube-oracular/ClubeConteudoSemanal';
import { ClubeProximoEncontro } from '@/components/clube-oracular/ClubeProximoEncontro';
import { ClubeProgressoTravessia } from '@/components/clube-oracular/ClubeProgressoTravessia';
import { ClubeBlocoProgressao } from '@/components/clube-oracular/ClubeBlocoProgressao';
import { BookOpen, Loader2 } from 'lucide-react';
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
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90" />
          
          {/* Breathing orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-mystic/8 via-gold/5 to-transparent blur-3xl animate-breathe pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 container mx-auto px-6 text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/15 to-mystic/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gold" />
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold/50 font-medium mb-4">
              Clube de Leitura Oracular
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-wide">
              Sua Jornada Começa Aqui
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto font-display italic leading-relaxed">
              Território de leitura viva, reflexão e atravessamento simbólico.
            </p>
          </motion.div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-6 pb-24 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-10">
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
            <div className="space-y-8">
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
