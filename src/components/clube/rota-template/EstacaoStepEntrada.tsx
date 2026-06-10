import React from 'react';
import { TreePine, Ghost, Sparkles, Map, Music, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { EscutaPremium } from '@/components/clube/EscutaPremium';

interface EstacaoStepEntradaProps {
  titulo: string;
  fraseAbertura: string;
  fraseVozClareira: string;
  onNext: () => void;
  onJumpToStep: (step: number) => void;
  audioAberturaUrl?: string;
  audioVozClareiraUrl?: string;
  audioFlorestaUrl?: string;
  imagemEscuta?: string;
  obraRegente?: string;
  infoContent?: {
    distrito: string;
    tese: string;
    detalhes: string[];
  };
}

export const EstacaoStepEntrada: React.FC<EstacaoStepEntradaProps> = ({
  titulo,
  fraseAbertura,
  onNext,
  audioAberturaUrl,
  obraRegente,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 text-center max-w-4xl mx-auto pb-20">
      {/* Header Info - Minimalist */}
      <div className="space-y-4 pt-4">
        <h4 className="text-gold text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-gold/30" />
          {obraRegente || "Obra Regente"}
          <span className="w-8 h-px bg-gold/30" />
        </h4>
        <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-[0.1em] leading-tight uppercase relative inline-block group">
          <span className="bg-gradient-to-b from-white via-[#e2c186] to-[#b89555] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter contrast-[1.1]">
            {titulo.replace('Estação', '').replace('—', '').trim()}
          </span>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#b89555] to-transparent opacity-50" />
        </h1>
      </div>

      {/* Main Player */}
      <div className="relative">
        <EscutaPremium 
          audioUrl={audioAberturaUrl} 
          titulo="Abertura da Estação" 
          imagemEscuta="/clareira-disco.png"
          className="py-0"
        />
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="space-y-4 max-w-xl">
          <p className="text-white/80 font-serif text-lg leading-relaxed italic">
            "{fraseAbertura}"
          </p>
        </div>

        <Button 
          className="rounded-full bg-gold text-[#020617] font-bold px-10 h-14 hover:bg-gold/90 shadow-[0_10px_40px_rgba(212,175,55,0.3)] active:scale-95 transition-all text-xs tracking-[0.2em] uppercase group"
          onClick={onNext}
        >
          <TreePine className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
          Entrar na Clareira
        </Button>
      </div>

      <div className="pt-12 border-t border-white/10 w-full max-w-xl mx-auto flex flex-col items-center gap-6">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black">Siga o fluxo da estação</p>
        
        <div className="flex justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
          {[
            { icon: Ghost, label: 'Câmara', path: '/clube/camara-do-sussurro' },
            { icon: Map, label: 'Atlas', path: '/clube/rota-dos-lobos' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.path) navigate(item.path);
              }}
              className="group flex flex-col items-center gap-2 transition-all"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                <item.icon className="w-4 h-4 text-white/40 group-hover:text-gold" />
              </div>
              <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold group-hover:text-gold transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};