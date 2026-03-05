import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';

/**
 * VisitorSalaContent - Conteúdo da Sala de Visita (Plano Gratuito)
 * 
 * Blocos:
 * 1. Vídeo de Boas-Vindas
 * 2. Texto curto de acolhimento
 * 3. Botão para Experiência Gratuita
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();

  const videoUrl = getSetting('sala_visita_video_url', '');
  const videoId = videoUrl ? (
    isCloudflareVideoId(videoUrl) ? videoUrl : extractVideoId(videoUrl)
  ) : null;

  return (
    <div className="space-y-8">
      {/* Bloco 1: Vídeo de Boas-Vindas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-gold/40 via-gold/15 to-gold/40 shadow-[0_0_40px_-10px_hsl(var(--gold)/0.2)] w-full max-w-2xl">
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
                    (Configure o ID do Cloudflare Stream em Admin → Configurações)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bloco 2: Texto de Acolhimento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center px-4"
      >
        <h2 className="font-display text-xl text-foreground mb-3">
          {getCopyByKey('sala_visita_titulo', 'Sala de Visita')}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          {getCopyByKey('sala_visita_texto', 
            'Este é o espaço onde você pode experimentar o método antes de atravessar. Sem pressa. Sem compromisso. Apenas presença.'
          )}
        </p>
      </motion.div>

      {/* Bloco 3: CTA para Experiência Gratuita */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex justify-center"
      >
        <Button
          variant="gold"
          size="lg"
          onClick={() => navigate('/experiencia-gratuita')}
          className="gap-2"
        >
          Iniciar Experiência Gratuita
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
