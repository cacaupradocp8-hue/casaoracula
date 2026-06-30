import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { Logo } from '@/components/layout/Logo';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';
import { trackLearningEvent } from '@/services/studentTrackingService';

/**
 * VisitorSalaContent — Recepção única da Casa Orácula.
 * Mesma experiência para visitante e fundadora.
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackLearningEvent({
      contextArea: 'clube',
      actionType: 'opened',
      objectType: 'estacao',
      metadata: { rastro: 'sala_da_visitante' },
    });
  }, []);

  const videoUrl = getSetting('sala_visita_video_url', '');
  const videoId = videoUrl
    ? isCloudflareVideoId(videoUrl)
      ? videoUrl
      : extractVideoId(videoUrl)
    : null;

  const handleStartFirstReading = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/primeira-leitura');
    }, 1400);
  }, [navigate]);

  return (
    <>
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

      <div className="min-h-[85vh] relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <ElectricWaves />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Logo variant="vertical" size="lg" />
          </motion.div>

          {/* BLOCO 1 — CHEGADA */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="space-y-5 max-w-md"
          >
            <h1 className="font-display text-2xl md:text-3xl text-primary leading-snug">
              Você chegou.
            </h1>
            <p className="text-foreground/80 text-base md:text-lg font-serif leading-relaxed">
              Talvez este lugar ainda pareça desconhecido. Não há problema.
              A Casa não precisa ser compreendida antes de ser atravessada.
            </p>
          </motion.section>

          {/* BLOCO 2 — TRÊS MOVIMENTOS */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="space-y-6 max-w-md"
          >
            <p className="text-foreground/85 font-serif text-base md:text-lg leading-relaxed">
              Hoje você fará apenas três movimentos.
            </p>
            <div className="flex flex-col gap-3 text-foreground/75 font-serif text-base md:text-lg leading-relaxed">
              <p>Primeiro — uma primeira leitura.</p>
              <p>Depois — uma pequena travessia.</p>
              <p>Por fim — você registrará o que ficou.</p>
            </div>
          </motion.section>

          {/* BLOCO 3 — VÍDEO (acessível, discreto) */}
          {videoId && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.9 }}
              className="w-full max-w-md space-y-4"
            >
              <p className="text-foreground/70 text-sm md:text-base font-serif leading-relaxed">
                Antes de começar, se quiser, há uma voz aqui.
                Não explica a Casa — apenas abre uma pergunta.
              </p>

              {showVideo ? (
                <div className="rounded-2xl overflow-hidden border border-primary/10 bg-background">
                  <CloudflareStreamPlayer
                    videoId={videoId}
                    title="Uma voz"
                    contextType="sala_visita"
                    requiredPortal="visitante"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className="inline-flex items-center gap-2 text-primary/70 hover:text-primary text-sm font-serif italic transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    escutar a voz
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* CTA ÚNICO */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.9 }}
            className="w-full flex justify-center pt-4"
          >
            <Button
              variant="gold"
              size="lg"
              onClick={handleStartFirstReading}
              disabled={isTransitioning}
              className="w-full max-w-sm gap-2.5 py-7 text-base"
            >
              <span>Começar minha Primeira Leitura</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.section>
        </div>
      </div>
    </>
  );
}
