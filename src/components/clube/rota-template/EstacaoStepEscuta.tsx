import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { EscutaPremium } from '@/components/clube/EscutaPremium';

interface EstacaoStepEscutaProps {
  estacaoId: string;
  obraRegente: string;
  livroCapaUrl: string;
  livroBannerUrl: string;
  audioVozClareiraUrl?: string;
  isVozDaFloresta?: boolean;
}

export const EstacaoStepEscuta: React.FC<EstacaoStepEscutaProps> = ({
  estacaoId,
  obraRegente,
  livroCapaUrl,
  livroBannerUrl,
  audioVozClareiraUrl,
  isVozDaFloresta = false
}) => {
  return (
    <div className="space-y-12 text-center max-w-2xl mx-auto pb-12">
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="flex items-center gap-4 text-gold/60">
          <div className="w-8 h-px bg-current opacity-20" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">{obraRegente}</span>
          <div className="w-8 h-px bg-current opacity-20" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
          {isVozDaFloresta ? "Álbum — Voz da Floresta" : "Estação — Chamado Selvagem"}
        </h1>
      </div>

      <div className="space-y-0">
        <EscutaPremium 
          audioUrl={audioVozClareiraUrl}
          titulo={isVozDaFloresta ? "A Voz da Floresta" : "Voz da Clareira"}
          imagemEscuta={livroCapaUrl}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-8">
        <div className="p-4 rounded-2xl bg-[#0a0a0b]/40 backdrop-blur-md border border-gold/10 space-y-2">
          <Sparkles className="w-5 h-5 text-gold/40 mx-auto" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Série de Áudios</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0a0b]/40 backdrop-blur-md border border-gold/10 space-y-2">
          <BookOpen className="w-5 h-5 text-gold/40 mx-auto" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Leitura Regente</p>
        </div>
      </div>
    </div>
  );
};
