import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { Logo } from '@/components/layout/Logo';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';

/**
 * VisitorSalaContent — Portal Vivo de Entrada na Casa Orácula
 * 
 * Experiência sensorial de chegada:
 * 1. Mandala respirando — presença contemplativa
 * 2. Texto como porta — curto, profundo, claro
 * 3. Micro-ritual — convite à pausa
 * 4. CTA como portal — Descobrir minha Voz
 * 5. Caminho simbólico — Quiz → Travessia → Casa
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoUrl = getSetting('sala_visita_video_url', '');
  const videoId = videoUrl ? (
    isCloudflareVideoId(videoUrl) ? videoUrl : extractVideoId(videoUrl)
  ) : null;

  const handleStartQuiz = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/quiz/descubra-seu-eixo');
    }, 1400);
  }, [navigate]);

  const handleStartFirstReading = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/sala-da-visitante/primeira-leitura');
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

      <style>{`
        @keyframes sala-breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
      <div className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden py-10 px-4">

        {/* Background atmosphere — partículas + gradientes */}
        <div className="absolute inset-0 pointer-events-none">
          <ElectricWaves />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-primary/[0.05] blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[180px] rounded-full bg-primary/[0.03] blur-[80px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] rounded-full bg-accent/[0.04] blur-[60px]" />
        </div>

        {/* SECTION 1 — Mandala + Texto */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-lg"
        >
          {/* Mandala with breathing */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                position: 'absolute',
                width: 320,
                height: 320,
                background: 'radial-gradient(circle, rgba(201,164,92,0.1) 0%, transparent 65%)',
                animation: 'sala-breathe 6s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', zIndex: 2, animation: 'sala-breathe 6s ease-in-out infinite' }}>
              <BreathingMandala />
            </div>
          </div>

          {/* Texto — porta simbólica */}
          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-muted-foreground text-sm md:text-base tracking-wide"
            >
              Antes de entrar na Casa…
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-foreground/90 text-base md:text-lg leading-relaxed"
            >
              existe uma pergunta que precisa ser ouvida.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="font-display text-3xl md:text-4xl text-primary pt-2"
            >
              Sua Voz.
            </motion.h1>
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

      {/* SECTION 3 — Primeira Leitura (Novo Convite Premium) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="relative z-10 w-full max-w-lg mt-14"
      >
        <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-primary/30 via-primary/5 to-transparent overflow-hidden">
          <div className="relative rounded-[23px] bg-card/40 backdrop-blur-md border border-primary/10 p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-2xl text-primary">Primeira Leitura Orácula</h2>
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                "Antes de escolher um caminho, observe como você lê uma travessia."
              </p>
            </div>

            <p className="text-foreground/70 text-sm leading-relaxed max-w-[280px]">
              Uma experiência simbólica gratuita para perceber seu modo de escuta e receber um primeiro espelho da Casa.
            </p>

            <Button
              variant="gold"
              size="lg"
              onClick={handleStartFirstReading}
              disabled={isTransitioning}
              className="w-full gap-2.5 py-6 text-base relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Atravessar o Limiar</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
            
            <p className="text-[10px] text-muted-foreground/40 tracking-[0.15em] uppercase">
              Início Contemplativo • Gratuito
            </p>
          </div>
        </div>
      </motion.section>

      {/* SECTION 4 — Quiz da Voz (Caminho Complementar) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center mt-12 space-y-6"
      >
        <div className="w-10 h-px bg-primary/15" />
        
        <div className="space-y-4">
          <p className="text-muted-foreground/60 text-xs md:text-sm max-w-xs leading-relaxed">
            Ou, se preferir o caminho identitário da Formação:
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartQuiz}
            disabled={isTransitioning}
            className="text-primary hover:text-primary/80 hover:bg-primary/5 gap-2 group px-6"
          >
            Descobrir minha Voz (Quiz)
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
          
          <p className="text-[10px] text-muted-foreground/30 tracking-[0.1em]">
            Leva menos de 3 minutos
          </p>
        </div>
      </motion.section>

        {/* SECTION 4 — Caminho simbólico (discreto) */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8, duration: 1.2 }}
          className="relative z-10 mt-20"
        >
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/25">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span>Quiz da Voz</span>
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
          className="relative z-10 text-center mt-16 pb-6"
        >
          <div className="w-6 h-px bg-primary/10 mx-auto mb-4" />
          <p className="text-[10px] text-muted-foreground/20 leading-relaxed max-w-[260px] mx-auto italic">
            A Casa Orácula ensina como sustentar processos humanos com consciência.
          </p>
        </motion.div>
      </div>
    </>
  );
}
