import React from 'react';
import { TreePine, Ghost, Sparkles, BookOpen, Map, Info, X, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

interface EstacaoStepEntradaProps {
  titulo: string;
  fraseAbertura: string;
  fraseVozClareira: string;
  onNext: () => void;
  onJumpToStep: (step: number) => void;
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
  infoContent
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 text-center max-w-2xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight">{titulo}</h1>
        <div className="w-24 h-px bg-gold/40 mx-auto" />
        <p className="text-white font-serif text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
          {fraseAbertura}
        </p>
        <p className="text-gold font-serif italic text-lg leading-relaxed max-w-xl mx-auto">
          {fraseVozClareira}
        </p>
      </div>

      <Button 
        className="rounded-full bg-gold text-[#020617] font-bold px-8 h-11 hover:bg-gold/90 shadow-[0_8px_30px_rgba(212,175,55,0.2)] active:scale-95 transition-all text-xs tracking-widest uppercase"
        onClick={onNext}
      >
        <TreePine className="w-4 h-4 mr-2" />
        Entrar na Clareira
      </Button>

      <div className="pt-8 border-t border-white/10">
        <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold mb-6">Acessos Rápidos</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
          {[
            { icon: Ghost, label: 'Câmara', path: '/clube/camara-do-sussurro' },
            { icon: Sparkles, label: 'Oráculo', step: 4 },
            { icon: TreePine, label: 'Psique', step: 5 },
            { icon: BookOpen, label: 'Ofício', step: 6 },
            { icon: Map, label: 'Mapa', path: '/clube/rota-dos-lobos' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.path) navigate(item.path);
                else if (item.step !== undefined) onJumpToStep(item.step);
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
