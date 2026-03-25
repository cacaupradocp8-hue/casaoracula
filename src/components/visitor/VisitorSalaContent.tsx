import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';

/**
 * VisitorSalaContent - Porta Principal da Casa Orácula
 * 
 * Experiência de chegada com clareza em 3 segundos:
 * 1. O que é isso
 * 2. Vídeo de boas-vindas
 * 3. O que faço agora (Quiz da Voz → Travessia)
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();

  const videoUrl = getSetting('sala_visita_video_url', '');
  const videoId = videoUrl ? (
    isCloudflareVideoId(videoUrl) ? videoUrl : extractVideoId(videoUrl)
  ) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-16 py-8">

      {/* SEÇÃO 1 — BOAS-VINDAS (clareza em 3 segundos) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-5 px-4"
      >
        <h1 className="font-display text-2xl md:text-3xl text-foreground leading-snug">
          Bem-vinda à<br />
          <span className="text-gold">Casa Orácula.</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Um espaço de autoconhecimento guiado.
        </p>
        <div className="w-12 h-px bg-gold/30 mx-auto" />
        <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Aqui você descobre como conduz processos humanos
          e aprende a sustentar transformações com consciência.
        </p>
      </motion.section>

      {/* SEÇÃO 2 — VÍDEO DE BOAS-VINDAS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="space-y-4 px-4"
      >
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground/80">
            Este vídeo é uma porta de entrada.
          </p>
          <p className="text-sm text-muted-foreground/60 italic">
            Assista com calma.
          </p>
        </div>

        <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-gold/40 via-gold/15 to-gold/40 shadow-[0_0_40px_-10px_hsl(var(--gold)/0.2)]">
          <div className="rounded-[14px] overflow-hidden bg-black">
            {videoId ? (
              <CloudflareStreamPlayer
                videoId={videoId}
                title="Vídeo de Boas-Vindas"
                contextType="sala_visita"
                requiredPortal="visitante"
              />
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gold/10 to-background flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gold ml-1" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Vídeo de Boas-Vindas
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    (Configure o ID do vídeo em Admin → Configurações)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* SEÇÃO 3 — CTA PRINCIPAL: DESCOBRIR MINHA VOZ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="text-center space-y-6 px-4"
      >
        <div className="space-y-4 max-w-md mx-auto">
          <p className="text-foreground/90 leading-relaxed">
            Toda jornada começa com uma descoberta:<br />
            <span className="text-gold font-medium">qual é a sua Voz?</span>
          </p>
          <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
            Leva menos de 3 minutos
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <Button
            variant="gold"
            size="lg"
            onClick={() => navigate('/quiz/descubra-seu-eixo')}
            className="gap-2 px-8 text-base"
          >
            Descobrir minha Voz
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Indicação do caminho */}
        <div className="pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/40">
            <Sparkles className="w-3 h-3" />
            <span>Quiz da Voz → Travessia Inicial → Entrada na Casa</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </motion.section>

      {/* Frase de encerramento */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center px-4 pb-8"
      >
        <div className="w-8 h-px bg-gold/20 mx-auto mb-6" />
        <p className="text-xs text-muted-foreground/40 leading-relaxed max-w-sm mx-auto italic">
          A Casa Orácula não ensina apenas ferramentas.<br />
          Ela ensina como sustentar processos humanos com consciência.
        </p>
      </motion.div>
    </div>
  );
}
