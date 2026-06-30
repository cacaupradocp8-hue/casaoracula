import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { trackLearningEvent } from '@/services/studentTrackingService';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';
import casaOraculaLogo from '@/assets/casa-oracula-logo.png.asset.json';

/**
 * VisitorSalaContent — Experiência cinematográfica em 3 cenas.
 * Cena 1: A Porta · Cena 2: Vídeo · Cena 3: Próximo passo.
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();
  const [scene, setScene] = useState<1 | 2 | 3>(1);
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

  const sceneTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 1.2, ease: 'easeInOut' as const },
  };

  return (
    <main className="relative min-h-screen text-foreground overflow-hidden flex items-center justify-center px-6" style={{ background: 'radial-gradient(ellipse at center, #102a5c 0%, #0a1d44 40%, #061330 75%, #030a1f 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <ElectricWaves />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(2,8,24,0.85)_100%)]" />
      <div className="relative z-10 w-full flex items-center justify-center">
      <AnimatePresence mode="wait">


        {scene === 1 && (
          <motion.section
            key="scene-1"
            {...sceneTransition}
            className="w-full max-w-xl flex flex-col items-center text-center gap-16 py-24"
          >
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="absolute inset-0 -m-20 rounded-full blur-3xl animate-pulse"
                style={{
                  background:
                    'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.10) 35%, rgba(212,175,55,0.04) 60%, transparent 78%)',
                }}
              />
              <img
                src={casaOraculaLogo.url}
                alt="Casa Orácula"
                className="relative w-[22rem] md:w-[28rem] h-auto drop-shadow-[0_0_25px_rgba(212,175,55,0.25)]"
              />
            </div>
            <p className="font-serif italic text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Você chegou à porta da Casa Orácula.
            </p>
            <Button
              variant="gold"
              size="lg"
              onClick={() => setScene(2)}
              className="tracking-[0.3em] uppercase text-xs px-10"
            >
              Entrar
            </Button>
          </motion.section>
        )}

        {scene === 2 && (
          <motion.section
            key="scene-2"
            {...sceneTransition}
            className="w-full max-w-2xl flex flex-col items-center text-center gap-12 py-20"
          >
            <p className="font-serif italic text-lg md:text-xl text-foreground/75 leading-relaxed max-w-md">
              Antes de qualquer passo, escute a voz que abre esta Casa.
            </p>
            {videoId ? (
              <div className="w-full rounded-xl overflow-hidden border border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
                <CloudflareStreamPlayer
                  videoId={videoId}
                  title="Voz de Boas-vindas"
                  contextType="sala_visitante"
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-card/40 border border-border flex items-center justify-center text-muted-foreground text-sm">
                Vídeo em preparação
              </div>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setScene(3)}
              className="tracking-[0.3em] uppercase text-xs px-10 group"
            >
              Continuar
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.section>
        )}

        {scene === 3 && (
          <motion.section
            key="scene-3"
            {...sceneTransition}
            className="w-full max-w-xl flex flex-col items-center text-center gap-14 py-24"
          >
            <div className="space-y-6">
              <p className="font-serif text-2xl md:text-3xl text-foreground/90 leading-relaxed">
                Hoje você fará apenas uma coisa.
              </p>
              <p className="font-serif italic text-xl md:text-2xl text-gold/90">
                Sua primeira leitura.
              </p>
            </div>
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/primeira-leitura')}
              className="tracking-[0.25em] uppercase text-xs px-10"
            >
              Começar minha primeira leitura
            </Button>
          </motion.section>
        )}
      </AnimatePresence>
      </div>
    </main>
  );
}
