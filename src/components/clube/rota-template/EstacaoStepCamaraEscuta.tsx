import React from 'react';
import { Headphones, Sparkles, BookOpen } from 'lucide-react';
import { RotaLivroBanner } from './RotaLivroBanner';

interface EstacaoStepCamaraEscutaProps {
  estacaoId: string;
}

export const EstacaoStepCamaraEscuta: React.FC<EstacaoStepCamaraEscutaProps> = ({
  estacaoId,
}) => {
  return (
    <div className="space-y-12 text-center max-w-4xl mx-auto py-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-gold">
          <Headphones className="w-5 h-5" />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Câmara da Escuta</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-white">Treinamento de Percepção</h2>
        <p className="text-white/60 font-serif italic max-w-lg mx-auto">
          Não consuma obras. Aprenda a observar através delas.
        </p>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 md:p-12 space-y-8">
         {/* Câmara da Escuta Content - Linked to Supabase soon */}
         <div className="text-center py-20 text-white/30 border-2 border-dashed border-white/10 rounded-2xl">
            Câmara da Escuta (Integrando...)
         </div>
      </div>
    </div>
  );
};
