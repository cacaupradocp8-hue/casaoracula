import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { Logo } from '@/components/layout/Logo';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';
import { trackLearningEvent } from '@/services/studentTrackingService';
import { useFounderAccess } from '@/hooks/useFounderAccess';

/**
 * VisitorSalaContent — Portal Vivo de Entrada na Casa Orácula
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackLearningEvent({ contextArea: 'clube', actionType: 'opened', objectType: 'estacao', metadata: { rastro: 'sala_da_visitante' } });
  }, []);

  const videoUrl = getSetting('sala_visita_video_url', '');
  const videoId = videoUrl ? (
    isCloudflareVideoId(videoUrl) ? videoUrl : extractVideoId(videoUrl)
  ) : null;

  const handleStartFirstReading = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/primeira-leitura');
    }, 1400);
  }, [navigate]);

  return (
    <>
      {/* Transition overlay — sensação de passagem */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-12 h-12 rounded-full border border-primary/30"
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-primary/70 font-display text-base tracking-wide"
            >
              Atravessando o primeiro limiar…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden py-10 px-4">

        {/* Background atmosphere — partículas + gradientes */}
        <div className="absolute inset-0 pointer-events-none">
          <ElectricWaves />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-primary/[0.05] blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[180px] rounded-full bg-primary/[0.03] blur-[80px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] rounded-full bg-accent/[0.04] blur-[60px]" />
        </div>

        {/* SECTION 1 — Logo + Boas-vindas */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md"
        >
          {/* Logo — porta de entrada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <Logo variant="vertical" size="xl" className="mb-2 scale-125 md:scale-150" />
          </motion.div>

          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-muted-foreground text-xs tracking-[0.15em] uppercase"
            >
              Bem-vinda à Casa Orácula
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-foreground/90 text-base md:text-lg font-display tracking-wide px-4 leading-relaxed"
            >
              Nem toda terapeuta escuta uma história da mesma forma.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="space-y-6 px-4"
            >
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
                Aqui, símbolos não substituem a realidade.<br />
                Eles ajudam a organizar sentido, leitura e travessia.
              </p>

              <p className="text-foreground/70 text-sm md:text-base leading-relaxed font-serif italic max-w-sm mx-auto">
                A Casa Orácula é um espaço de formação e prática para terapeutas que trabalham com linguagem simbólica, histórias e processos de transformação.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 2 — Video (if configured) */}
        {videoId && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="relative z-10 w-full max-w-lg mt-10"
          >
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20">
              <div className="rounded-[15px] overflow-hidden bg-background">
                <CloudflareStreamPlayer
                  videoId={videoId}
                  title="Vídeo de Boas-Vindas"
                  contextType="sala_visita"
                  requiredPortal="visitante"
                />
              </div>
            </div>
          </motion.section>
        )}

      {/* SECTION 2.5 — Apresentação narrativa da Casa (3 perguntas) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 1 }}
        className="relative z-10 w-full max-w-lg mt-10 space-y-6 text-center px-2"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Você está iniciando sua travessia
        </p>
        <div className="space-y-5 text-foreground/75 text-sm md:text-base leading-relaxed font-serif">
          <p>
            <span className="text-primary/80 not-italic font-display text-xs uppercase tracking-widest block mb-1">A Casa Orácula</span>
            é um espaço de formação simbólica para mulheres que escutam histórias — as suas e as de outras.
          </p>
          <p>
            <span className="text-primary/80 not-italic font-display text-xs uppercase tracking-widest block mb-1">Como funciona</span>
            a experiência se revela em camadas. Cada etapa abre a próxima, no seu tempo.
          </p>
          <p>
            <span className="text-primary/80 not-italic font-display text-xs uppercase tracking-widest block mb-1">Nesta primeira visita</span>
            você fará uma Primeira Leitura — uma demonstração breve do método da Casa.
          </p>
        </div>
      </motion.section>

      {/* SECTION 3 — Atravessar o Limiar (Convite Principal) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="relative z-10 w-full max-w-md mt-12"
      >
        <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-primary/40 via-primary/5 to-transparent overflow-hidden">
          <div className="relative rounded-[23px] bg-card/60 backdrop-blur-xl border border-primary/10 p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              <p className="text-primary/60 text-[10px] tracking-[0.2em] uppercase font-medium">Primeira Leitura</p>
              <h2 className="font-display text-xl md:text-2xl text-primary leading-tight">
                Agora faça a Primeira Leitura
              </h2>
              <div className="space-y-4">
                <p className="text-foreground/80 text-sm md:text-base leading-relaxed max-w-[340px] mx-auto">
                  Leia um caso-espelho, escolha o que sua escuta percebe primeiro e receba uma devolutiva breve sobre esse olhar.
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5 pt-2">
                <p className="text-[10px] text-muted-foreground/60 italic uppercase tracking-wider">Não é teste de personalidade.</p>
                <p className="text-[10px] text-muted-foreground/60 italic uppercase tracking-wider">Não é previsão.</p>
                <p className="text-[10px] text-muted-foreground/60 italic uppercase tracking-wider">É uma demonstração prática do método da Casa.</p>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              onClick={handleStartFirstReading}
              disabled={isTransitioning}
              className="w-full gap-2.5 py-7 text-base relative overflow-hidden group/btn bg-primary hover:bg-primary/90"
            >
              <span className="relative z-10">Começar agora</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </motion.section>





        {/* SECTION 5 — Caminho simbólico (discreto) */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8, duration: 1.2 }}
          className="relative z-10 mt-16"
        >
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/25">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span>Primeira Leitura</span>
            <span className="w-4 h-px bg-primary/15" />
            <span>Travessia</span>
            <span className="w-4 h-px bg-primary/15" />
            <span>Casa Orácula</span>
          </div>
        </motion.section>

        {/* Whisper final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 1.5 }}
          className="relative z-10 text-center mt-12 pb-6"
        >
          <div className="w-6 h-px bg-primary/10 mx-auto mb-4" />
          <p className="text-[9px] md:text-[10px] text-muted-foreground/20 leading-relaxed max-w-[240px] mx-auto italic">
            A Casa Orácula ensina como sustentar processos humanos com consciência.
          </p>
        </motion.div>
      </div>
    </>
  );
}