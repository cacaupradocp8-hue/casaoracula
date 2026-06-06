import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Quote as QuoteIcon, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EstacaoHeroProps {
  estacaoNumero: number;
  titulo: string;
  subtitulo: string;
  backgroundImage?: string;
  estacaoNome?: string;
  kicker?: string;
  descricao?: string;
  citacao?: string;
}

import { cn } from '@/lib/utils';

export function EstacaoHero({ 
  estacaoNumero, 
  titulo, 
  subtitulo, 
  backgroundImage, 
  estacaoNome,
  kicker = "BEM-VINDA À",
  descricao,
  citacao
}: EstacaoHeroProps) {
  // Fix for repeated title in breadcrumb
  const parentName = estacaoNome === titulo ? 'Rota dos Lobos' : (estacaoNome || 'Rota dos Lobos');

  return (
    <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 md:px-12 lg:px-24 z-10 overflow-hidden pt-20">
      {/* Background with Dark Forest Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={backgroundImage || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80'} 
          alt="" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-[20s]" 
        />
        {/* Cinematic Vignette and Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#010816] via-[#010816]/95 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010816] via-transparent to-[#010816]/80" />
        <div className="absolute inset-0 bg-[#010816]/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="lg:col-span-7 space-y-10"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold mb-4">
            <span className="hover:text-gold/60 transition-colors cursor-default" onClick={() => window.location.href = '/clube'}>Clube da Casa</span>
            <ChevronRight className="w-2.5 h-2.5 opacity-40" />
            <span className="hover:text-gold/60 transition-colors cursor-default" onClick={() => window.location.href = '/clube/rota/rota-dos-lobos'}>{parentName}</span>
            <ChevronRight className="w-2.5 h-2.5 opacity-40" />
            <span className="text-gold/80">{titulo}</span>
          </nav>

          {/* Titles Section */}
          <div className="space-y-6">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="block text-gold/60 text-xs tracking-[0.5em] font-bold uppercase"
            >
              {kicker}
            </motion.span>
            
            <h1 className="font-display font-light leading-[0.85] tracking-tighter text-6xl md:text-8xl lg:text-9xl">
              <span className="bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent inline-block pb-4">
                {titulo.split(' ').map((word, i) => (
                  <span key={i} className={cn(
                    "block",
                    i === 0 ? "font-serif italic font-light" : "font-sans font-black uppercase tracking-tighter"
                  )}>
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            <div className="relative border-l-2 border-gold/30 pl-8 py-2 max-w-2xl">
              <h2 className="font-serif italic text-xl md:text-2xl text-gold/80 leading-relaxed uppercase tracking-widest">
                {subtitulo}
              </h2>
            </div>
          </div>

          {/* Description */}
          {descricao ? (
            <div className="max-w-xl space-y-4 font-serif text-lg text-white/60 leading-relaxed">
              {descricao.split('\n').map((para, i) => (para && <p key={i}>{para}</p>))}
            </div>
          ) : (
            <div className="max-w-xl space-y-4 font-serif text-lg text-white/60 leading-relaxed">
              <p>Seis travessias. Seis portais.</p>
              <p>Um retorno ao que nunca deixou de viver em você.</p>
              <p className="italic text-white/40">Inspirada na obra Mulheres que Correm com os Lobos, de Clarissa Pinkola Estés.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
            <Button
              size="lg"
              variant="gold"
              className="rounded-full px-12 h-16 shadow-glow text-midnight font-bold group w-full sm:w-auto"
              onClick={() => document.getElementById('ativo-agora')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <PawPrint className="w-4 h-4 mr-2 group-hover:animate-bounce" /> Iniciar Travessia
            </Button>
            
            <div className="flex items-center gap-4 px-8 py-5 rounded-[2rem] border border-gold/30 bg-gold/5 backdrop-blur-2xl shadow-premium-glow relative group/estacao overflow-hidden">
              {/* Animated Inner Shine */}
              <div className="absolute -inset-x-full inset-y-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent skew-x-[-30deg] animate-[shimmer_4s_infinite] pointer-events-none" />
              
              <div className="absolute -inset-1 bg-gold/10 rounded-[2rem] blur-xl opacity-0 group-hover/estacao:opacity-100 transition duration-700" />
              
              <div className="relative flex items-center gap-4 z-10">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_15px_rgba(212,175,55,1)] animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.4em] uppercase text-gold/80 font-black leading-none mb-1.5">
                    Estação Ativa
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-serif italic text-white leading-none">
                      {estacaoNumero}
                    </span>
                    <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                      de 6
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quote Box - Inspired by the image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="lg:col-span-5 relative group hidden lg:block"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-gold/20 via-white/5 to-transparent rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          
          <div className="relative bg-black/40 border border-white/10 p-10 md:p-12 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <QuoteIcon className="absolute top-6 left-6 w-8 h-8 text-gold/20" />
            
            <div className="space-y-6 pt-4">
              <p className="font-serif italic text-xl md:text-2xl text-white/80 leading-relaxed text-center">
                {citacao || "A mulher selvagem é a natureza instintiva, criativa, apaixonada e livre que habita em cada uma de nós. Não é algo que precisamos nos tornar. É algo que precisamos lembrar."}
              </p>
              
              <div className="flex justify-center items-center gap-4">
                <div className="h-px w-8 bg-gold/30" />
                <PawPrint className="w-4 h-4 text-gold/40" />
                <div className="h-px w-8 bg-gold/30" />
              </div>
            </div>
          </div>

          {/* Decorative Corner Seals */}
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-xl" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-xl" />
        </motion.div>
      </div>
    </section>
  );
}
