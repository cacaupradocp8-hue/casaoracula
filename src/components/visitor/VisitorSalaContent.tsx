import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react';
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
  const { isActive: isFounder } = useFounderAccess();
  const [showVideo, setShowVideo] = useState(false);
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


  const transitionOverlay = (
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
  );

  // =====================================================================
  // VIEW ÚNICA — Sala de Visita (visível para todas, sem exigir login)
  // A Fundadora só é identificada APÓS a Primeira Leitura.
  // =====================================================================
  {
    const mapa = [
      'Sala de Visita',
      'Primeira Leitura',
      'Rota dos Lobos',
      'Clareira do Chamado',
      'Parecer Fundadora',
    ];


    return (
      <>
        {transitionOverlay}

        <div className="min-h-[85vh] relative overflow-hidden py-14 px-4">
          <div className="absolute inset-0 pointer-events-none">
            <ElectricWaves />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-14">

            {/* Selo de entrada */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <Logo variant="vertical" size="lg" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-primary/60">
                Carta de Orientação · Fundadora
              </span>
            </motion.div>

            {/* BLOCO 1 — Você chegou */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="text-center space-y-4"
            >
              <h1 className="font-display text-2xl md:text-3xl text-primary leading-tight">
                Você chegou à Sala de Visita
              </h1>
              <div className="w-8 h-px bg-primary/30 mx-auto" />
              <p className="text-foreground/80 text-base font-serif leading-relaxed max-w-sm mx-auto">
                Antes de conhecer a Casa inteira, você será conduzida por uma primeira travessia.
                Não precisa entender tudo agora. Apenas seguir o fio.
              </p>
            </motion.section>

            {/* BLOCO 2 — Por que esta experiência existe */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="w-full rounded-3xl p-[1px] bg-gradient-to-br from-primary/30 via-primary/5 to-transparent"
            >
              <div className="rounded-[23px] bg-card/50 backdrop-blur-xl border border-primary/10 p-7 md:p-9 space-y-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 text-center">
                  Esta é uma experiência fundadora
                </p>
                <p className="text-foreground/85 text-[15px] md:text-base font-serif leading-relaxed text-center">
                  Você não está aqui para testar uma plataforma.
                  Está aqui para perceber se a Casa oferece estrutura, linguagem e aplicação
                  para a escuta simbólica no ofício.
                </p>
                <div className="pt-2">
                  <p className="text-primary font-display text-lg md:text-xl italic text-center leading-snug">
                    “Esta experiência mudaria sua forma de atender?”
                  </p>
                </div>
              </div>
            </motion.section>

            {/* BLOCO 3 — O que acontece agora (mini-mapa) */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9 }}
              className="w-full space-y-6"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 text-center">
                O que acontece agora
              </p>

              <ol className="relative flex flex-col gap-3">
                {mapa.map((step, i) => {
                  const active = i === 0;
                  return (
                    <li
                      key={step}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 border ${
                        active
                          ? 'border-primary/40 bg-primary/[0.06]'
                          : 'border-border/40 bg-background/30'
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-7 h-7 rounded-full font-display text-xs ${
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/40 text-muted-foreground/60'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`font-serif text-sm md:text-base ${
                          active ? 'text-foreground' : 'text-muted-foreground/70'
                        }`}
                      >
                        {step}
                      </span>
                      {active && (
                        <span className="ml-auto text-[10px] uppercase tracking-wider text-primary/70">
                          hoje
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>

              <p className="text-center text-muted-foreground/70 text-sm font-serif italic">
                Hoje você atravessa apenas o primeiro território. O restante da Casa se revela depois.
              </p>
            </motion.section>

            {/* BLOCO 4 — Vídeo contextualizado */}
            {videoId && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.9 }}
                className="w-full space-y-4"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 text-center">
                  A Voz de Boas-vindas
                </p>
                <p className="text-foreground/70 text-sm font-serif leading-relaxed text-center max-w-md mx-auto">
                  Este vídeo não explica toda a Casa. Ele abre o campo da experiência:
                  a terapeuta que sabe muito, mas procura pouso, estrutura e aplicação.
                </p>

                {showVideo ? (
                  <div className="rounded-2xl p-[1px] bg-gradient-to-br from-primary/25 via-primary/5 to-primary/25">
                    <div className="rounded-[15px] overflow-hidden bg-background">
                      <CloudflareStreamPlayer
                        videoId={videoId}
                        title="A Voz de Boas-vindas"
                        contextType="sala_visita"
                        requiredPortal="visitante"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVideo(true)}
                      className="gap-2 border-primary/30 text-primary/90 hover:bg-primary/10"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Assistir
                    </Button>
                  </div>
                )}
              </motion.section>
            )}

            {/* CTA FINAL */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.9 }}
              className="w-full flex justify-center pt-2"
            >
              <Button
                variant="gold"
                size="lg"
                onClick={handleStartFirstReading}
                disabled={isTransitioning}
                className="w-full max-w-sm gap-2.5 py-7 text-base"
              >
                <span>Começar Primeira Leitura</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.section>


          </div>
        </div>
      </>
    );
  }
}

