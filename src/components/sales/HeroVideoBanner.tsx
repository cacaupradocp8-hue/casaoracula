import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import heroFallback from '@/assets/formacao/hero-banner-fallback.jpg';

/**
 * HeroVideoBanner — Banner cinematográfico com vídeo em loop
 * Conceito: enraizamento, presença, maturidade
 * Estilo: escola iniciática contemporânea
 * Configurável via app_settings
 */
export function HeroVideoBanner() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['vitrine-hero-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', [
          'vitrine_hero_video_url',
          'vitrine_hero_texto',
          'vitrine_hero_btn_texto',
          'vitrine_hero_btn_link',
          'vitrine_hero_overlay_opacity',
          'vitrine_hero_ativo',
        ]);
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value));
      return map;
    },
    staleTime: 10 * 60 * 1000,
  });

  const videoSrc = settings?.vitrine_hero_video_url?.trim() || '';

  const heroText = settings?.vitrine_hero_texto || 'Aqui, a travessia começa com presença';
  const btnText = settings?.vitrine_hero_btn_texto || 'Continuar minha travessia';
  const btnLink = settings?.vitrine_hero_btn_link || '/salas';
  const overlayOpacity = Math.min(80, Math.max(0, Number(settings?.vitrine_hero_overlay_opacity ?? 30))) / 100;
  const isActive = settings?.vitrine_hero_ativo !== 'false';

  if (!isActive) return null;

  return (
    <section className="relative w-full h-[50vh] md:h-[55vh] lg:h-[60vh] overflow-hidden">
      {/* Fallback image */}
      <img
        src={heroFallback}
        alt="Pés descalços tocando a terra — enraizamento"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Video — loops silently */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dark overlay — opacity from admin */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Text content — centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[6%] md:pb-[5%] px-6 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground/90 leading-relaxed tracking-wider max-w-2xl font-medium"
        >
          {heroText}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8"
        >
          <Button
            variant="hero"
            size="xl"
            className="gap-3 border-[hsl(40,35%,60%)]/40 text-[hsl(40,35%,60%)] hover:border-[hsl(40,35%,60%)]/80 hover:bg-[hsl(40,35%,60%)]/10 transition-all duration-300"
            onClick={() => navigate(btnLink)}
          >
            {btnText}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom blur + fade transition into page */}
      <div className="absolute bottom-0 left-0 right-0 h-32 backdrop-blur-md [mask-image:linear-gradient(to_top,black_40%,transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}
