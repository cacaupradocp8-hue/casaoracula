import React from 'react';
import { TreePine, Ghost, Sparkles, Map, Music, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  estacaoSlug?: string;
  rotaSlug?: string;
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
  estacaoSlug,
  rotaSlug = 'rota-dos-lobos',
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 text-center max-w-4xl mx-auto pb-20">

      {/* Header Info - Minimalist */}
      <div className="space-y-4 md:space-y-6 pt-4 md:pt-8">
        <h4 className="text-gold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] font-black flex items-center justify-center gap-2 md:gap-4 px-2">
          <span className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent shrink-0" />
          <span className="truncate">{obraRegente || "Obra Regente"}</span>
          <span className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent shrink-0" />
        </h4>
        <h1 className="text-2xl xs:text-3xl sm:text-6xl md:text-8xl font-display font-black text-white tracking-[0.1em] sm:tracking-[0.15em] leading-[1.1] uppercase relative inline-block group px-4 break-words">
          <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            {titulo.replace('Estação', '').replace('—', '').trim()}
          </span>
        </h1>
      </div>

      {/* Main Player */}
      <div className="relative">
        <EscutaPremium 
          audioUrl={audioAberturaUrl} 
          titulo="Abertura da Estação" 
          imagemEscuta="/__l5e/assets-v1/6890f537-199d-46e1-9f3c-0c52f74c483f/disco-vinil-premium.png"
          className="py-0"
        />
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="space-y-3 max-w-2xl text-center">
          <h2 className="text-2xl md:text-4xl font-display text-white tracking-wide">
            O Retorno da Mulher que Sabe
          </h2>
          <p className="text-gold/70 font-cormorant italic text-base md:text-lg">
            Uma introdução à Rota dos Lobos e à linguagem da mulher selvagem.
          </p>
        </div>
        <div className="space-y-4 max-w-xl">

          <p className="text-white/80 font-cormorant text-xl leading-relaxed italic">
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
        
        <div className="flex justify-center gap-8 opacity-20 transition-opacity">
          {[
            { icon: Ghost, label: 'Câmara', path: '/clube/camara-do-sussurro' },
            { icon: Map, label: 'Atlas', path: '/clube/rota-dos-lobos' }
          ].map((item, idx) => (
            <button
              key={idx}
              disabled
              className="group flex flex-col items-center gap-2 transition-all cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 transition-all">
                <item.icon className="w-4 h-4 text-white/20" />
              </div>
              <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {estacaoSlug === 'clareira-do-chamado' && (
        <div className="pt-8 w-full max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-white/[0.04] via-gold/[0.03] to-transparent backdrop-blur-sm p-8 md:p-10 text-left shadow-[0_20px_60px_-20px_rgba(212,175,55,0.25)]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[80px] -z-0" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10">
                <Ghost className="w-3 h-3 text-gold" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold">
                  Camada de Aprofundamento
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-display text-white tracking-wide">
                  Aprofundar na Câmara do Sussurro
                </h3>
                <p className="text-xs uppercase tracking-[0.25em] text-gold/70 font-bold">
                  Treino de Observação Simbólica
                </p>
              </div>
              <p className="text-base text-white/70 font-cormorant italic leading-relaxed max-w-xl">
                Entre na Câmara para observar os sinais da Clareira em três campos: o conto, a vida cotidiana e a escuta sonora.
              </p>
              <Button
                onClick={() => navigate(`/clube/camara-do-sussurro?rota=${rotaSlug}&estacao=${estacaoSlug}&modo=aprofundamento`)}
                className="rounded-full bg-gold text-[#020617] font-bold px-8 h-12 hover:bg-gold/90 shadow-[0_10px_30px_rgba(212,175,55,0.3)] text-[10px] tracking-[0.25em] uppercase group"
              >
                <Ghost className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Entrar na Câmara
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};