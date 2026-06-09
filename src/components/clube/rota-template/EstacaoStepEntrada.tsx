import React from 'react';
import { TreePine, Ghost, Sparkles, BookOpen, Map, Info, X, Moon, Music, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  fraseVozClareira,
  onNext,
  onJumpToStep,
  audioAberturaUrl,
  audioVozClareiraUrl,
  audioFlorestaUrl,
  imagemEscuta,
  obraRegente,
  infoContent
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 text-center max-w-4xl mx-auto pb-20">
      {/* Header Info - Minimalist as per screenshot */}
      <div className="space-y-4 pt-4">
        <h4 className="text-gold text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-gold/30" />
          {obraRegente || "Obra Regente"}
          <span className="w-8 h-px bg-gold/30" />
        </h4>
        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight">
          Estação — <span className="italic">{titulo.replace('Estação', '').replace('—', '').trim()}</span>
        </h1>
      </div>

      {/* Main Player - The "Abertura" experience */}
      <div className="relative">
        <EscutaPremium 
          audioUrl={audioAberturaUrl} 
          titulo="Abertura da Estação" 
          imagemEscuta={imagemEscuta}
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

      <div className="pt-12 border-t border-white/10 w-full max-w-xl mx-auto">
        <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black mb-8">Outros Audios da Jornada</p>
        <div className="grid grid-cols-2 gap-6 w-full">
          {audioVozClareiraUrl && (
            <button
              onClick={() => onJumpToStep(1)}
              className="group relative flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40">
                <Music className="w-8 h-8 text-gold" />
              </div>
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5 group-hover:bg-gold/20 transition-all">
                <Headphones className="w-5 h-5 text-gold/60 group-hover:text-gold" />
              </div>
              <div className="text-center">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block mb-1">Escutar</span>
                <span className="text-xs text-gold font-serif italic font-bold">Voz da Clareira</span>
              </div>
            </button>
          )}

          {audioFlorestaUrl && (
            <button
              onClick={() => onJumpToStep(1)}
              className="group relative flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5 group-hover:bg-gold/20 transition-all">
                <TreePine className="w-5 h-5 text-gold/60 group-hover:text-gold" />
              </div>
              <div className="text-center">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block mb-1">Escutar</span>
                <span className="text-xs text-gold font-serif italic font-bold">Voz da Floresta</span>
              </div>
            </button>
          )}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {[
            { icon: Ghost, label: 'Câmara', path: '/clube/camara-do-sussurro' },
            { icon: Map, label: 'Atlas Orácula', path: '/clube/rota-dos-lobos' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.path) navigate(item.path);
              }}
              className="group flex flex-col items-center gap-2 transition-all"
            >
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all">
                <item.icon className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
              </div>
              <span className="text-[9px] text-white/60 uppercase tracking-widest font-bold group-hover:text-gold transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {infoContent && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-gold hover:text-white hover:bg-gold/10 text-xs md:text-sm uppercase tracking-[0.2em] font-black gap-3 py-6 px-8 border border-gold/30 rounded-2xl animate-pulse bg-gold/5"
              >
                <Info className="w-5 h-5" /> ABRA, ENTRE, OLHE
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-gold/20 text-white max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 rounded-3xl">
              <DialogHeader className="p-8 pb-4">
                <DialogTitle className="text-2xl font-serif text-gold flex items-center gap-3">
                  <TreePine className="w-6 h-6" /> Cartografia da Estação
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-grow p-8 pt-0">
                <div className="space-y-8 font-serif leading-relaxed text-white/80 pb-8">
                  <div className="space-y-4">
                    <span className="text-gold/60 text-[10px] uppercase tracking-widest font-bold">Localização</span>
                    <h3 className="text-2xl text-white">{titulo}</h3>
                    <p className="text-gold italic">{infoContent.distrito}</p>
                    <div className="bg-white/5 border-l-2 border-gold/40 p-6 rounded-r-2xl space-y-4">
                      {infoContent.detalhes.map((d, i) => <p key={i}>{d}</p>)}
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-gold">
                      <Moon className="w-4 h-4" />
                      <h4 className="text-sm font-bold uppercase tracking-widest">Tese Central</h4>
                    </div>
                    <p className="text-xl italic text-white/90">{infoContent.tese}</p>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
