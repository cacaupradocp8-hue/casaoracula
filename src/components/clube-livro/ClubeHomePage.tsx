import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  Loader2, 
  Calendar, 
  ExternalLink, 
  Quote, 
  Zap, 
  Sparkles,
  Play,
  Trophy,
  Target,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { RotaEstrada } from '@/components/clube-livro/RotaEstrada';
import { RotaEntrada } from '@/components/clube-livro/RotaEntrada';
import { RotaImersao } from '@/components/clube-livro/RotaImersao';
import { RotaAplicacao } from '@/components/clube-livro/RotaAplicacao';
import { RotaLaboratorio } from '@/components/clube-livro/RotaLaboratorio';
import { MiniMandalaCidadela } from '@/components/casa-maquinas/MiniMandalaCidadela';
import { useRef } from 'react';

/**
 * ClubeHomePage — Rota Oracular Premium
 * Versão evoluída integrando o design Casa Orácula com a lógica do Clube.
 */
export function ClubeHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rotaData = useRotaOracular();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const {
    estacaoAtual,
    estacoesPrevias,
    pontos,
    pontoAtual,
    progresso,
    encontro,
    concluirPonto,
    estacaoIncompleta,
    isLoading,
  } = rotaData || {
    estacaoAtual: null,
    estacoesPrevias: [],
    pontos: [],
    pontoAtual: undefined,
    progresso: 0,
    encontro: null,
    concluirPonto: { mutate: () => {} },
    estacaoIncompleta: false,
    isLoading: false,
  };

  const welcomeName = user?.name?.split(' ')[0] || 'Assinante';

  if (isLoading) {
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
      <div ref={containerRef} className="relative min-h-screen bg-[#000814] text-white -mt-16 md:-mt-20 pt-16 md:pt-20">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          
          {/* ============================================
              1. HERO SUPERIOR (Premium Contextual)
              ============================================ */}
          <section className="relative py-12 md:py-20 flex flex-col items-center text-center overflow-hidden">
            {/* Ambient Background for Hero */}
            <div className="absolute inset-0 z-[-1] opacity-20">
               {estacaoAtual?.livro_capa_url ? (
                 <motion.img 
                   initial={{ scale: 1.1, opacity: 0 }} 
                   animate={{ scale: 1, opacity: 0.3 }} 
                   transition={{ duration: 3 }}
                   src={estacaoAtual.livro_capa_url} 
                   className="w-full h-full object-cover grayscale blur-xl"
                 />
               ) : (
                 <div className="w-full h-full bg-blue-900/20 blur-3xl" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-transparent to-transparent" />
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className="max-w-3xl space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-blue-400/80">
                  Continuar no Portal
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight italic text-slate-100 tracking-tighter">
                  {estacaoAtual?.livro_titulo || "Sua Travessia"}
                </h2>
              </div>
              
              {estacaoAtual?.essencia_nucleo && (
                <p className="text-sm md:text-base text-white/40 font-light max-w-lg mx-auto italic">
                  "{estacaoAtual.essencia_nucleo}"
                </p>
              )}

              <div className="flex flex-col items-center gap-4 pt-4">
                {pontoAtual && (
                  <Button 
                    size="lg" 
                    className="h-14 px-10 rounded-full bg-white text-black hover:bg-blue-50 transition-all duration-700 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    onClick={() => navigate(pontoAtual.rota)}
                  >
                    <Play className="w-4 h-4 fill-current" /> Retomar Travessia
                  </Button>
                )}
                
                <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  <span>Estação {estacaoAtual?.numero || '01'}</span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{Math.round(progresso)}% Concluído</span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* ============================================
              2. ESTRADA CENTRAL (Protagonista Visual)
              ============================================ */}
          <section className="relative py-20 md:py-40">
            {/* Road Design Elements */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/[0.03] -translate-x-1/2" />
            <motion.div 
              style={{ scaleY }} 
              className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-blue-400 to-transparent -translate-x-1/2 origin-top shadow-[0_0_30px_rgba(59,130,246,0.3)] z-0" 
            />

            {/* Desktop Side Cards (Contextual Stats) */}
            <div className="hidden lg:block">
              <SideFloatingCard 
                top="20%" 
                left="5%" 
                icon={Target} 
                label="Sua Próxima Meta" 
                title={pontoAtual?.nome || "Próximo Passo"} 
                sub={pontoAtual?.subtitulo || "Travessia"} 
              />
              <SideFloatingCard 
                top="45%" 
                right="5%" 
                icon={Crown} 
                label="Nível de Maestria" 
                title={progresso >= 100 ? "Exploradora Sênior" : "Em Ascensão"} 
                sub={`${Math.round(progresso)}% do Portal`} 
                variant="gold" 
              />
            </div>

            {/* Road Engine Integration */}
            <div className="max-w-4xl mx-auto">
              {pontos.length > 0 ? (
                <RotaEstrada 
                  pontos={pontos} 
                  pontoAtual={pontoAtual} 
                  concluirPonto={(id) => concluirPonto.mutate(id)}
                  isConcluindo={concluirPonto.isPending}
                />
              ) : (
                <div className="py-20">
                  <RotaEntrada />
                </div>
              )}
            </div>

            {/* Station incomplete notice */}
            {estacaoIncompleta && (
              <p className="text-center text-[10px] uppercase tracking-widest text-white/20 italic mt-10">
                Esta estrada está sendo preparada pela Casa Orácula.
              </p>
            )}
          </section>

          {/* ============================================
              3. BLOCOS SECUNDÁRIOS (Biblioteca, Ao Vivo, Ferramentas)
              ============================================ */}
          <section className="relative grid grid-cols-1 md:grid-cols-3 gap-8 pb-32 pt-20 border-t border-white/5">
            {/* Bloco 1: Biblioteca & Imersão */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.3em] text-white/20 font-bold px-2">Mergulho Semanal</h3>
              <RotaImersao estacaoId={estacaoAtual?.id} />
            </div>

            {/* Bloco 2: Ao Vivo & Laboratório */}
            <div className="space-y-6">
               <h3 className="text-xs uppercase tracking-[0.3em] text-white/20 font-bold px-2">Laboratório 80/20</h3>
               <RotaLaboratorio 
                 estacaoId={estacaoAtual?.id} 
                 livroTitulo={estacaoAtual?.livro_titulo} 
               />
               
               {encontro && (
                 <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-4">
                    <Card className="border-blue-900/30 bg-blue-950/20 backdrop-blur-sm">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400/60" />
                          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400/60 font-bold">Ao Vivo esta semana</p>
                        </div>
                        <h4 className="text-sm font-medium text-white/90">{encontro.titulo}</h4>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-[10px] border-blue-900/50 text-blue-400 hover:bg-blue-400/10"
                          onClick={() => window.open(encontro.link_ao_vivo!, '_blank')}
                        >
                          Entrar no Encontro <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                 </motion.div>
               )}
            </div>

            {/* Bloco 3: Ferramenta Liberada & Cidadela */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.3em] text-white/20 font-bold px-2">Sua CidaDELA</h3>
              <RotaAplicacao />
              {user?.id && (
                <div className="pt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <MiniMandalaCidadela clienteId={user.id} />
                </div>
              )}
            </div>
          </section>

          {/* ============================================
              4. FOOTER (Portais Anteriores)
              ============================================ */}
          {estacoesPrevias.length > 0 && (
            <section className="py-20 border-t border-white/5">
              <div className="text-center space-y-12">
                <h3 className="text-xl font-serif italic text-white/40 uppercase tracking-[0.3em]">
                  Portais Atravessados
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {estacoesPrevias.map(est => (
                    <motion.div 
                      key={est.id}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="group cursor-pointer flex flex-col items-center gap-3"
                      onClick={() => navigate(`/clube/rota/${est.id}`)}
                    >
                      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-blue-900/10 group-hover:border-blue-400/30 transition-all duration-500">
                        <Trophy className="w-6 h-6 text-white/20 group-hover:text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">
                          Estação {est.numero}
                        </p>
                        <p className="text-[10px] text-white/10 truncate max-w-[120px]">{est.titulo}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </AppLayout>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────

function SideFloatingCard({ top, left, right, icon: Icon, label, title, sub, variant = 'blue' }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: left ? -30 : 30 }} 
      whileInView={{ opacity: 1, x: 0 }} 
      transition={{ duration: 1.5 }} 
      style={{ top, left, right }} 
      className="fixed z-20 w-60 p-5 bg-[#000814]/40 backdrop-blur-3xl border border-white/5 rounded-2xl space-y-3"
    >
      <div className={`flex items-center gap-3 ${variant === 'gold' ? 'text-amber-400/80' : 'text-blue-400/80'}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-serif italic text-white/90 truncate">{title}</h4>
        <p className="text-[9px] text-white/30 uppercase tracking-widest truncate">{sub}</p>
      </div>
    </motion.div>
  );
}

