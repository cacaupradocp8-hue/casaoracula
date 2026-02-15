import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroVideo from '@/assets/formacao/hero-banner-enraizamento.mp4';
import heroFallback from '@/assets/formacao/hero-banner-fallback.jpg';

/**
 * HeroVideoBanner — Banner cinematográfico com vídeo em loop
 * Conceito: enraizamento, presença, maturidade
 * Estilo: escola iniciática contemporânea
 */
export function HeroVideoBanner() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative w-full h-[50vh] md:h-[55vh] lg:h-[60vh] overflow-hidden">
      {/* Fallback image — always rendered behind video */}
      <img
        src={heroFallback}
        alt="Pés descalços tocando a terra — enraizamento"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Video — loops silently on top of fallback */}
      <video
        ref={videoRef}
        src={heroVideo}
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

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,4%)] via-[hsl(220,20%,4%)]/50 to-[hsl(220,20%,4%)]/30" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Text content — centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground/90 leading-relaxed tracking-wide max-w-2xl italic"
        >
          "Toda travessia começa com os pés na terra."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8"
        >
          <Button
            variant="hero"
            size="xl"
            className="gap-3 border-gold/30 hover:border-gold/60 hover:bg-gold/5"
            onClick={() => navigate('/salas')}
          >
            Continuar minha travessia
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[hsl(220,20%,4%)] to-transparent" />
    </section>
  );
}
