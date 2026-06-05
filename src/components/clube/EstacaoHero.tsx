import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EstacaoHeroProps {
  estacaoNumero: number;
  titulo: string;
  subtitulo: string;
  backgroundImage?: string;
}

export function EstacaoHero({ estacaoNumero, titulo, subtitulo, backgroundImage }: EstacaoHeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 z-10 overflow-hidden">
      {/* Background with Dark Forest Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={backgroundImage || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80'} 
          alt="" 
          className="w-full h-full object-cover opacity-50 mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/60 to-midnight" />
        <div className="absolute inset-0 bg-midnight/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center w-full max-w-4xl mx-auto space-y-8"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">
          <span>Clube da Casa</span>
          <ChevronRight className="w-3 h-3" />
          <span>Rota dos Lobos</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gold/60">Clareira do Chamado</span>
        </nav>

        {/* Seal */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold/80 font-bold">
            Estação {estacaoNumero} de 6
          </span>
        </div>

        {/* Titles */}
        <div className="space-y-6">
          <h1 className="font-display font-light leading-tight tracking-tighter text-5xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
              {titulo}
            </span>
          </h1>
          <p className="font-serif italic text-xl md:text-3xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            "{subtitulo}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button
            size="lg"
            variant="gold"
            className="rounded-full px-12 h-16 shadow-glow text-midnight font-bold"
            onClick={() => document.getElementById('ativo-agora')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="w-4 h-4 fill-current mr-2" /> Iniciar Travessia
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
