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

      <div className="min-h-[90vh] relative overflow-hidden py-28 md:py-36 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <ElectricWaves />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-primary/[0.035] blur-[140px]" />
        </div>

        {/* Divisor reutilizável */}
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}

        <div className="relative z-10 max-w-[34rem] mx-auto flex flex-col items-center text-center">
          {/* Selo de abertura */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Logo variant="vertical" size="xl" className="scale-125 md:scale-150 drop-shadow-[0_10px_40px_hsl(var(--primary)/0.35)]" />
            <span className="text-[10px] uppercase tracking-[0.45em] text-primary/55 font-serif">
              Carta de Entrada
            </span>
          </motion.div>

          {/* Divisor */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="my-20 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-center"
          />

          {/* BLOCO 1 — CHEGADA */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="space-y-8 max-w-[28rem]"
          >
            <h1 className="font-display text-4xl md:text-5xl text-primary leading-[1.05] tracking-tight">
              Você chegou.
            </h1>
            <p className="text-foreground/75 text-[15px] md:text-base font-serif leading-[1.85] italic">
              Talvez este lugar ainda pareça desconhecido. Não há problema.
              A Casa não precisa ser compreendida antes de ser atravessada.
            </p>
          </motion.section>

          {/* Divisor */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
            className="my-20 h-px w-16 bg-gradient-to-r from-transparent via-primary/35 to-transparent origin-center"
          />

          {/* BLOCO 2 — TRÊS MOVIMENTOS */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 1 }}
            className="space-y-10 max-w-[26rem]"
          >
            <p className="text-[10px] uppercase tracking-[0.45em] text-primary/55 font-serif">
              Três movimentos
            </p>
            <div className="flex flex-col gap-7 font-serif text-foreground/80 text-[15px] md:text-base leading-relaxed">
              <p>
                <span className="text-primary/70 italic mr-2">Primeiro</span>
                uma primeira leitura.
              </p>
              <p>
                <span className="text-primary/70 italic mr-2">Depois</span>
                uma pequena travessia.
              </p>
              <p>
                <span className="text-primary/70 italic mr-2">Por fim</span>
                você registrará o que ficou.
              </p>
            </div>
          </motion.section>

          {/* Divisor */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.3, duration: 1.2 }}
            className="my-20 h-px w-16 bg-gradient-to-r from-transparent via-primary/35 to-transparent origin-center"
          />

          {/* BLOCO 2.5 — POR QUE HABITAR A CASA */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 1 }}
            className="max-w-[30rem] space-y-7 font-serif text-foreground/80 text-[15px] md:text-base leading-[1.95]"
          >
            <h2 className="font-display text-2xl md:text-3xl text-primary leading-snug">
              Por que habitar a Casa?
            </h2>

            <p>Há lugares que oferecem respostas prontas.</p>
            <p>A Casa Orácula oferece algo diferente.</p>
            <p>Ela ajuda você a desenvolver uma forma de observar.</p>
            <p>
              Ao longo das travessias, você aprenderá a reconhecer padrões,
              escutar símbolos e transformar histórias em caminhos de cuidado.
            </p>
            <p>
              Mais do que acumular conhecimento, a proposta da Casa é cultivar
              uma presença clínica mais sensível, uma leitura mais profunda das
              experiências humanas e uma prática que une escuta, linguagem e
              aplicação.
            </p>
            <p>Você não precisa compreender tudo no primeiro dia.</p>
            <p className="italic text-primary/75">Basta dar o primeiro passo.</p>
          </motion.section>

          {/* Divisor */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.55, duration: 1.2 }}
            className="my-20 h-px w-16 bg-gradient-to-r from-transparent via-primary/35 to-transparent origin-center"
          />

          {/* BLOCO 3 — VÍDEO recolhido */}
          {videoId && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="w-full max-w-[28rem]"
            >
              {showVideo ? (
                <div className="rounded-xl overflow-hidden border border-primary/15 bg-background/60 shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.4)]">
                  <CloudflareStreamPlayer
                    videoId={videoId}
                    title="Voz de boas-vindas"
                    contextType="sala_visita"
                    requiredPortal="visitante"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="group inline-flex items-center gap-2.5 text-primary/65 hover:text-primary text-[13px] tracking-[0.18em] uppercase font-serif transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  <span>Assistir a voz de boas-vindas</span>
                </button>
              )}
            </motion.section>
          )}

          {/* Divisor final */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.7, duration: 1.2 }}
            className="my-20 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-center"
          />

          {/* CTA premium */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="flex flex-col items-center gap-5"
          >
            <Button
              variant="gold"
              size="lg"
              onClick={handleStartFirstReading}
              disabled={isTransitioning}
              className="group relative px-10 py-6 text-[13px] tracking-[0.22em] uppercase font-serif shadow-[0_18px_50px_-20px_hsl(var(--primary)/0.55)] hover:shadow-[0_22px_60px_-18px_hsl(var(--primary)/0.7)] transition-all"
            >
              <span>Começar minha Primeira Leitura</span>
              <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
            </Button>
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 font-serif">
              Casa Orácula
            </span>
          </motion.section>
        </div>
      </div>
    </>
  );
}
