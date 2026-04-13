import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { useClubeConteudoSemanal, useClubeReflexoes, useClubeEngajamento, useClubeProximoEncontro } from '@/hooks/useClubeOracular';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ClubeBannerCicloAtual } from '@/components/clube-oracular/ClubeBannerCicloAtual';
import { ClubeConteudoSemanal } from '@/components/clube-oracular/ClubeConteudoSemanal';
import { ClubeProximoEncontro } from '@/components/clube-oracular/ClubeProximoEncontro';
import { ClubeProgressoTravessia } from '@/components/clube-oracular/ClubeProgressoTravessia';
import { JornadaAnualTimeline } from '@/components/clube-oracular/JornadaAnualTimeline';
import { VozDoMes } from '@/components/clube-oracular/VozDoMes';
import { CicloMesDetalhe } from '@/components/clube-oracular/CicloMesDetalhe';
import { JORNADA_ANO_1 } from '@/constants/jornadaAnual';
import { BookOpen, Loader2, Sparkles, ArrowRight, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function ClubeOracular() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cicloAtual, loadingCiclos } = useClubeLivro();

  // Determine current month (1-12)
  const currentMonth = new Date().getMonth() + 1;
  const [mesSelecionado, setMesSelecionado] = useState(currentMonth);
  const mesData = JORNADA_ANO_1.find(m => m.mes === mesSelecionado) || JORNADA_ANO_1[0];

  const { data: conteudoSemanal } = useClubeConteudoSemanal(cicloAtual?.id);
  const { data: conteudoSemanal } = useClubeConteudoSemanal(cicloAtual?.id);
  const { reflexoes, salvarReflexao } = useClubeReflexoes(cicloAtual?.id);
  const { engajamento } = useClubeEngajamento(cicloAtual?.id);
  const { data: proximoEncontro } = useClubeProximoEncontro(cicloAtual?.id);

  // Check if user has completed cartografia
  const { data: hasCartografia, isLoading: loadingCarto } = useQuery({
    queryKey: ['clube-has-cartografia', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await (supabase as any)
        .from('cartografia_psiquica')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user?.id,
  });

  const loading = loadingCiclos || loadingCarto;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      </AppLayout>
    );
  }

  // ─── STEP 1: No cartografia yet → single CTA ───
  if (!hasCartografia) {
    return (
      <AppLayout>
        <div className="min-h-screen">
          <section className="relative py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-background" />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, hsl(var(--mystic) / 0.08), hsl(var(--gold) / 0.04), transparent)',
                filter: 'blur(40px)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative z-10 container mx-auto px-6 text-center max-w-lg"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/8 border border-gold/12 mb-6">
                <BookOpen className="w-7 h-7 text-gold/70" />
              </div>

              <p className="text-[11px] uppercase tracking-[0.4em] text-gold/40 font-medium mb-4">
                Clube de Leitura Oracular
              </p>

              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-4 leading-tight">
                Você escolheu entrar em uma jornada guiada.
              </h1>

              <p className="text-muted-foreground/60 text-sm mb-10">
                Antes de iniciar sua travessia pelo primeiro livro, precisamos traçar o mapa do seu campo simbólico.
              </p>

              <Card className="border-gold/20 bg-card/50 backdrop-blur-sm max-w-sm mx-auto">
                <CardContent className="p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold/50 font-medium mb-2">
                    Seu próximo passo agora é:
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Map className="w-5 h-5 text-gold/60" />
                    <h3 className="font-display text-lg text-foreground">Cartografia da Cidadela</h3>
                  </div>
                  <p className="text-xs text-muted-foreground/50 mb-5">
                    Mapeamento do seu campo simbólico interior.
                  </p>
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
                  >
                    Fazer sua Cartografia
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </div>
      </AppLayout>
    );
  }

  // ─── STEP 2+: Has cartografia → guided cycle experience ───
  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* ─── HERO (compact) ─── */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container mx-auto px-6 text-center max-w-xl"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/20" />
              <BookOpen className="w-5 h-5 text-gold/50" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/20" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2 tracking-wide">
              Sua Jornada de Leitura
            </h1>
            <p className="text-muted-foreground/50 text-sm font-display italic">
              Cada livro é uma travessia. Cada encontro, um portal.
            </p>
          </motion.div>
        </section>

        {/* ─── CONTENT (single column, focused) ─── */}
        <div className="container mx-auto px-6 pb-24 max-w-2xl space-y-10">

          {/* Next step indicator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-gold/50 font-medium">
              Seu próximo passo agora é:
            </p>
          </motion.div>

          {/* Ciclo Atual — Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <ClubeBannerCicloAtual
              ciclo={cicloAtual}
              onAcessar={() => cicloAtual && navigate(`/clube-livro/${cicloAtual.id}`)}
            />
          </motion.div>

          {/* Ritual da Semana */}
          {conteudoSemanal && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <ClubeConteudoSemanal
                conteudo={conteudoSemanal}
                onSalvarReflexao={(texto) =>
                  salvarReflexao.mutate({ texto, conteudoSemanalId: conteudoSemanal?.id })
                }
                salvando={salvarReflexao.isPending}
              />
            </motion.div>
          )}

          {/* Próximo Encontro (inline, not sidebar) */}
          {proximoEncontro && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <ClubeProximoEncontro encontro={proximoEncontro} />
            </motion.div>
          )}

          {/* Progresso — compact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <ClubeProgressoTravessia
              progresso={engajamento?.progresso ?? 0}
              totalTerritorios={4}
              explorados={Math.round((engajamento?.progresso ?? 0) * 4)}
            />
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
