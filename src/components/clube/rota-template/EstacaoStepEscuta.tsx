import React from 'react';
import { Headphones, Sparkles, BookOpen } from 'lucide-react';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { RotaLivroBanner } from './RotaLivroBanner';

interface EstacaoStepEscutaProps {
  estacaoId: string;
  obraRegente: string;
  livroCapaUrl: string;
  livroBannerUrl: string;
  audioVozClareiraUrl?: string;
}

export const EstacaoStepEscuta: React.FC<EstacaoStepEscutaProps> = ({
  estacaoId,
  obraRegente,
  livroCapaUrl,
  livroBannerUrl,
  audioVozClareiraUrl
}) => {
  return (
    <div className="space-y-10 text-center max-w-2xl mx-auto">
      <RotaLivroBanner 
        obraRegente={obraRegente}
        capaUrl={livroCapaUrl}
        fraseObra="Onde a voz silenciada volta a encontrar o corpo."
        onAction={() => {}}
      />

      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-gold">
            <Headphones className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Álbum da Estação</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white">Voz da Clareira</h2>
        </div>
        
        <EscutaPremium 
          audioUrl={audioVozClareiraUrl}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-8">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <Sparkles className="w-5 h-5 text-gold/40 mx-auto" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Série de Áudios</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <BookOpen className="w-5 h-5 text-gold/40 mx-auto" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Leitura Regente</p>
        </div>
      </div>
    </div>
  );
};
