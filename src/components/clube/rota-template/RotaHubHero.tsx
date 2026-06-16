import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RotaHubHeroProps {
  titulo: string;
  fraseGuia: string;
  descricao: string;
  bannerUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onEnter: () => void;
}

export const RotaHubHero: React.FC<RotaHubHeroProps> = ({
  titulo,
  fraseGuia,
  descricao,
  bannerUrl,
  isPlaying,
  onTogglePlay,
  onEnter
}) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-[#0A0A0B] border border-white/10 shadow-2xl">
      {/* MOBILE LAYOUT */}
      <div className="md:hidden flex flex-col bg-[#020617] rounded-[32px] overflow-hidden border border-white/10">
        <div className="relative min-h-[520px] overflow-hidden">
          <img src={bannerUrl} alt={titulo} className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-[#020617]" />
          <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-6 pb-4">
            <div className="space-y-4">
              <h1 className="text-4xl font-serif text-white leading-[0.9] tracking-tight">{titulo}</h1>
              <p className="text-sm text-gold/90 font-serif italic border-l-2 border-gold/30 pl-4">{fraseGuia}</p>
              <p className="text-[11px] text-white/60 leading-relaxed max-w-[280px]">{descricao}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-10 space-y-6 bg-[#020617]">
          <button
            onClick={onEnter}
            className="group relative w-full h-12 rounded-full border border-gold/40 bg-gold/5 backdrop-blur-sm overflow-hidden transition-all duration-500 active:scale-[0.98] hover:border-gold/70 hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.5)]"
          >
            <span className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-[11px] font-bold tracking-[0.25em] uppercase text-gold">Entrar na Jornada</span>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <div onClick={onTogglePlay} className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
                {isPlaying ? <Pause className="w-3 h-3 text-gold fill-gold" /> : <Play className="w-3 h-3 text-gold fill-gold ml-0.5" />}
              </div>
              <span className="text-[10px] text-gold font-bold uppercase tracking-wider">Acolhimento</span>
            </div>
            <div onClick={() => navigate('/clube/camara-do-sussurro')} className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
                <Ghost className="w-3 h-3 text-gold" />
              </div>
              <span className="text-[10px] text-gold font-bold uppercase tracking-wider">Câmara</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:grid md:grid-cols-2 min-h-[680px]">
        <div className="relative z-20 flex flex-col justify-start p-14 lg:p-20 pt-16">
          <div className="max-w-xl space-y-8">
            <h1 className="text-6xl lg:text-7xl font-serif text-white leading-[0.9] tracking-tight">{titulo}</h1>
            <div className="space-y-3">
              <p className="text-xl text-gold/90 font-serif italic leading-tight border-l-2 border-gold/30 pl-4">{fraseGuia}</p>
              <p className="text-sm text-white/60 leading-relaxed max-w-sm">{descricao}</p>
            </div>
            <div className="flex items-center gap-6">
              <div onClick={onTogglePlay} className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10 group-hover:bg-gold/20">
                  {isPlaying ? <Pause className="w-3 h-3 text-gold fill-gold" /> : <Play className="w-3 h-3 text-gold fill-gold ml-0.5" />}
                </div>
                <span className="text-xs text-gold font-semibold uppercase tracking-wider">Ouvir Acolhimento</span>
              </div>
              <Button variant="ghost" onClick={() => navigate('/clube/camara-do-sussurro')} className="text-white/40 hover:text-gold hover:bg-gold/5 text-[10px] uppercase tracking-widest font-bold h-8 px-4 border border-white/10 rounded-full">
                <Ghost className="w-3.5 h-3.5 mr-2" /> Câmara do Sussurro
              </Button>
            </div>
            <button
              onClick={onEnter}
              className="group relative w-fit px-12 py-4 rounded-full border border-gold/40 bg-gold/[0.04] backdrop-blur-sm overflow-hidden transition-all duration-500 active:scale-[0.98] hover:border-gold/70 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.55)]"
            >
              <span className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-[12px] font-bold tracking-[0.3em] uppercase text-gold">Entrar na Jornada</span>
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-center bg-[#0A0A0B] overflow-hidden">
          <img src={bannerUrl} alt={titulo} className="w-full h-full object-contain object-right-bottom" />
        </div>
      </div>
    </section>
  );
};
