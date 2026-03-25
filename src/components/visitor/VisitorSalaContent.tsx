import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { BreathingMandala } from '@/components/visitor/BreathingMandala';

/**
 * VisitorSalaContent - Portal Vivo de Entrada na Casa Orácula
 * 
 * Experiência sensorial de chegada:
 * 1. Mandala respirando — presença contemplativa
 * 2. Clareza em 3 segundos — o que é + o que fazer
 * 3. CTA único — Descobrir minha Voz
 * 4. Caminho simbólico visível — Quiz → Travessia → Casa
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
    }, 1200);
  }, [navigate]);

  return (
    <>
      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gold/80 font-display text-lg tracking-wide"
            >
              Abrindo a primeira porta…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden py-8">
        
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.06] blur-[80px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-gold/[0.03] blur-[60px]" />
        </div>

        {/* SECTION 1 — Breathing mandala + Welcome */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 flex flex-col items-center text-center px-4 space-y-8 max-w-xl"
        >
          {/* Breathing mandala */}
          <BreathingMandala />

          {/* Welcome text */}
          <div className="space-y-4">
            <h1 className="font-display text-2xl md:text-3xl text-foreground leading-snug">
              Bem-vinda à{' '}
              <span className="text-gold">Casa Orácula.</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
              Antes de entrar na Casa, existe uma pergunta que precisa ser ouvida.
            </p>
          </div>
        </motion.section>

        {/* SECTION 2 — Video (if configured) */}
        {videoId && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative z-10 w-full max-w-lg px-4 mt-10"
          >
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-gold/30 via-gold/10 to-gold/30">
              <div className="rounded-[15px] overflow-hidden bg-black">
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

        {/* SECTION 3 — CTA Principal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center px-4 mt-12 space-y-6"
        >
          <p className="text-foreground/80 text-sm max-w-xs leading-relaxed">
            Descubra sua Voz e inicie sua travessia.
          </p>

          <Button
            variant="gold"
            size="lg"
            onClick={handleStartQuiz}
            disabled={isTransitioning}
            className="gap-2 px-10 text-base"
          >
            Descobrir minha Voz
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-[11px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            Leva menos de 3 minutos
          </p>
        </motion.section>

        {/* SECTION 4 — Symbolic journey path */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="relative z-10 mt-16 px-4"
        >
          <div className="flex items-center gap-3 text-xs text-muted-foreground/30">
            <span className="text-gold/50">●</span>
            <span>Quiz da Voz</span>
            <span className="text-gold/20">→</span>
            <span>Travessia</span>
            <span className="text-gold/20">→</span>
            <span>Casa Orácula</span>
          </div>
        </motion.section>

        {/* Closing whisper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.2 }}
          className="relative z-10 text-center px-4 mt-16 pb-8"
        >
          <div className="w-8 h-px bg-gold/15 mx-auto mb-5" />
          <p className="text-[11px] text-muted-foreground/30 leading-relaxed max-w-xs mx-auto italic">
            A Casa Orácula ensina como sustentar processos humanos com consciência.
          </p>
        </motion.div>
      </div>
    </>
  );
}
