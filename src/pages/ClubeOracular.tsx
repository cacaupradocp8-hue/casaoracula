import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { useUserVoz } from '@/hooks/useUserVoz';
import { supabase } from '@/integrations/supabase/client';
import { ClubeBannerCicloAtual } from '@/components/clube-oracular/ClubeBannerCicloAtual';
import CidadelaMapSVG, { type DistrictDisplayState } from '@/components/cidadela/CidadelaMapSVG';
import { VOZES } from '@/data/vozes';
import { BookOpen, Loader2, ArrowRight, Map, Compass, Mic, Users, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function ClubeOracular() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cicloAtual, loadingCiclos } = useClubeLivro();
  const { voz_primaria, loading: vozLoading } = useUserVoz();

  // Check if user has completed cartografia
  const { data: cartografiaData, isLoading: loadingCarto } = useQuery({
    queryKey: ['clube-cartografia-full', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const [{ data: carto }, { data: mapa }] = await Promise.all([
        supabase
          .from('cartografia_psiquica')
          .select('territorios_principais, cor_predominante, simbolo_pessoal, resumo_narrativo')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('auto_mapeamento')
          .select('distritos_json')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);
      const cartoRow = (carto as any[])?.[0] || null;
      return { carto: cartoRow, mapa: mapa as any };
    },
    enabled: !!user?.id,
  });

  const hasCartografia = !!cartografiaData?.carto;
  const loading = loadingCiclos || loadingCarto || vozLoading;

  // Build district states for mini mandala
  const districtStates: Record<string, DistrictDisplayState> = {};
  if (cartografiaData?.mapa?.distritos_json) {
    const dj = cartografiaData.mapa.distritos_json as Record<string, { estado?: string }>;
    Object.entries(dj).forEach(([key, val]) => {
      const estado = val?.estado;
      if (estado === 'ativo' || estado === 'em_tensao' || estado === 'integrado') {
        districtStates[key] = estado as DistrictDisplayState;
      }
    });
  }

  // Dominant district from cartografia
  const distritoDominante = cartografiaData?.carto?.territorios_principais?.[0] || null;
  const vozData = voz_primaria ? VOZES.find(v => v.id === voz_primaria) : null;

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

  // ─── STEP 2+: Has cartografia → Home com 5 blocos ───
  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* ─── HERO (compact) ─── */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <motion.div {...anim(0)} className="relative z-10 container mx-auto px-6 text-center max-w-xl">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/20" />
              <BookOpen className="w-5 h-5 text-gold/50" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/20" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground mb-1 tracking-wide">
              Sua Jornada de Leitura
            </h1>
            <p className="text-muted-foreground/50 text-sm font-display italic">
              Cada livro é uma travessia. Cada encontro, um portal.
            </p>
          </motion.div>
        </section>

        {/* ─── 5 BLOCOS ─── */}
        <div className="container mx-auto px-6 pb-24 max-w-2xl space-y-6">

          {/* BLOCO 1 — STATUS */}
          <motion.div {...anim(0.1)}>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-border/30 bg-card/40">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-gold/50" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Voz</span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {vozData?.nome || 'Ainda não definida'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/30 bg-card/40">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-gold/50" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Distrito</span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {distritoDominante || '—'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* BLOCO 2 — DIREÇÃO */}
          {distritoDominante && (
            <motion.div {...anim(0.15)}>
              <Card className="border-gold/10 bg-gold/[0.02]">
                <CardContent className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold/40 font-medium mb-1">
                    Você está em:
                  </p>
                  <p className="font-display text-lg text-foreground mb-1">{distritoDominante}</p>
                  {cartografiaData?.carto?.resumo_narrativo && (
                    <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-3">
                      {cartografiaData.carto.resumo_narrativo}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* BLOCO 3 — TRAVESSIA ATIVA (próximo passo) */}
          <motion.div {...anim(0.2)}>
            <p className="text-xs uppercase tracking-[0.25em] text-gold/50 font-medium text-center mb-3">
              Seu próximo passo agora é:
            </p>
            <ClubeBannerCicloAtual
              ciclo={cicloAtual}
              onAcessar={() => cicloAtual && navigate(`/clube-livro/${cicloAtual.id}`)}
            />
          </motion.div>

          {/* BLOCO 4 — MINI MAPA */}
          <motion.div {...anim(0.3)}>
            <Card className="border-border/20 bg-card/30 overflow-hidden">
              <CardContent className="p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium mb-3 text-center">
                  Sua CidaDELA
                </p>
                <div className="max-w-[280px] mx-auto">
                  <CidadelaMapSVG
                    districtStates={districtStates}
                    activeDistrict={distritoDominante}
                    maxWidth={280}
                    forceCircular
                  />
                </div>
                <div className="text-center mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/casa-das-maquinas/mapa-vivo')}
                    className="text-xs text-gold/60 hover:text-gold gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Ver mapa completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* BLOCO 5 — APLICAÇÃO */}
          <motion.div {...anim(0.35)}>
            <Card className="border-border/20 bg-card/30">
              <CardContent className="p-5 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium text-center">
                  Leve isso para a prática
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/jardim-da-psique')}
                    className="flex flex-col items-center gap-1.5 h-auto py-3 border-border/20 text-xs"
                  >
                    <User className="w-4 h-4 text-gold/50" />
                    Aplicar em mim
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/casa-das-maquinas/sessoes')}
                    className="flex flex-col items-center gap-1.5 h-auto py-3 border-border/20 text-xs"
                  >
                    <Compass className="w-4 h-4 text-gold/50" />
                    Em sessão
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/casa-das-maquinas/jardim-oficio')}
                    className="flex flex-col items-center gap-1.5 h-auto py-3 border-border/20 text-xs"
                  >
                    <Users className="w-4 h-4 text-gold/50" />
                    Em grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}
