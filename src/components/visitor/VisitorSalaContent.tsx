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
 * 1. Logo da Casa — Identidade e limpeza visual
 * 2. Texto como porta — curto, profundo, claro (refinado)
 * 3. Primeira Leitura — O novo limiar público
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
            <Logo variant="vertical" size="md" className="mb-2" />
          </motion.div>

          {/* Texto — porta simbólica */}
          <div className="space-y-4">
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
              className="text-foreground/70 text-sm md:text-base leading-relaxed px-4 font-serif italic max-w-sm"
            >
              "A Casa Orácula é um espaço para mulheres que escutam o invisível e transformam essa escuta em inteligência simbólica."
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="font-display text-xl md:text-2xl text-primary pt-2 tracking-wide leading-tight"
            >
              Antes de escolher um caminho, observe como você lê uma história.
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
              <h2 className="font-display text-xl md:text-2xl text-primary leading-tight">
                Antes de escolher um caminho, descubra como a sua escuta lê uma história.
              </h2>
              <p className="text-foreground/70 text-sm md:text-base leading-relaxed italic max-w-[320px] mx-auto">
                Leitura Orácular é uma experiência, para revelar o primeiro modo como você organiza sentido, cuidado e travessia diante de um caso-espelho.
              </p>
            </div>

            <div className="space-y-1 py-2">
              <p className="text-muted-foreground text-xs leading-relaxed">Não é um teste de personalidade.</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Não é uma previsão.</p>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium text-primary/60">É uma demonstração do método da Casa.</p>
            </div>

            <Button
              variant="gold"
              size="lg"
              onClick={handleStartFirstReading}
              disabled={isTransitioning}
              className="w-full gap-2.5 py-7 text-base relative overflow-hidden group/btn bg-primary hover:bg-primary/90"
            >
              <span className="relative z-10">Iniciar Primeira Leitura</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
            
            <p className="text-[10px] text-muted-foreground/30 tracking-[0.2em] uppercase">
              Demonstração de Método • Gratuito
            </p>
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