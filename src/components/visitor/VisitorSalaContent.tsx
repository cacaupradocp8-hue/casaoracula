import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCopy } from '@/hooks/useCopy';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { supabase } from '@/integrations/supabase/client';
import * as LucideIcons from 'lucide-react';

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  icone: string | null;
  rota: string;
  ordem: number;
}

// Dynamic icon component
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wrench: LucideIcons.Wrench,
  brain: LucideIcons.Brain,
  compass: LucideIcons.Compass,
  helpCircle: LucideIcons.HelpCircle,
  book: LucideIcons.Book,
  bookOpen: LucideIcons.BookOpen,
  star: LucideIcons.Star,
  heart: LucideIcons.Heart,
  sparkles: LucideIcons.Sparkles,
  lightbulb: LucideIcons.Lightbulb,
  target: LucideIcons.Target,
  users: LucideIcons.Users,
  messageCircle: LucideIcons.MessageCircle,
  messageCircleQuestion: LucideIcons.MessageCircleQuestion,
  pencil: LucideIcons.Pencil,
  clipboardList: LucideIcons.ClipboardList,
  map: LucideIcons.Map,
  eye: LucideIcons.Eye,
};

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = iconMap[name] || LucideIcons.Wrench;
  return <IconComponent className={className} />;
};

// Color palette for ferramentas
const colorPalette = [
  { bg: 'from-purple-500/10', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/50', iconBg: 'bg-purple-500/20', iconHover: 'group-hover:bg-purple-500/30', text: 'text-purple-400', btnBorder: 'border-purple-500/30', btnHover: 'hover:bg-purple-500/10' },
  { bg: 'from-blue-500/10', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/50', iconBg: 'bg-blue-500/20', iconHover: 'group-hover:bg-blue-500/30', text: 'text-blue-400', btnBorder: 'border-blue-500/30', btnHover: 'hover:bg-blue-500/10' },
  { bg: 'from-emerald-500/10', border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/50', iconBg: 'bg-emerald-500/20', iconHover: 'group-hover:bg-emerald-500/30', text: 'text-emerald-400', btnBorder: 'border-emerald-500/30', btnHover: 'hover:bg-emerald-500/10' },
  { bg: 'from-amber-500/10', border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-500/50', iconBg: 'bg-amber-500/20', iconHover: 'group-hover:bg-amber-500/30', text: 'text-amber-400', btnBorder: 'border-amber-500/30', btnHover: 'hover:bg-amber-500/10' },
];

/**
 * VisitorSalaContent - Conteúdo da Sala de Visita (Plano Gratuito)
 * 
 * Blocos (ordem):
 * 1. Vídeo de Boas-Vindas (Cloudflare Stream - gerenciável via Admin)
 * 2. Texto curto de acolhimento (sem CTA comercial)
 * 3. Ferramentas da Sala (dinâmico - configuradas no Admin via sala_ferramentas)
 * 4. Convite para a Travessia 00 (texto explicativo + botão)
 * 
 * Esta sala é o CENTRO DA EXPERIÊNCIA DA VISITANTE.
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();

  // URL do vídeo configurada pelo Admin (pode ser ID ou URL do Cloudflare Stream)
  const videoUrl = getSetting('sala_visita_video_url', '');
  
  // Extract Cloudflare video ID
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

      {/* Bloco 2: Texto + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center px-4 max-w-lg mx-auto"
      >
        <h2 className="font-display text-xl text-foreground mb-3">
          {getCopyByKey('sala_visita_titulo', 'Sala de Visita')}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Este é o espaço onde você pode experimentar o método antes de atravessar.
        </p>
        <p className="text-muted-foreground/70 text-sm italic mb-8">
          Sem pressa. Sem compromisso. Apenas presença.
        </p>

        <Button
          variant="gold"
          size="lg"
          onClick={() => navigate('/experiencia-gratuita')}
          className="gap-2 w-full sm:w-auto"
        >
          Entrar na Sala de Visita
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
