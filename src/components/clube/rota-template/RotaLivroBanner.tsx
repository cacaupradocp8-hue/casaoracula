import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RotaLivroBannerProps {
  obraRegente: string;
  capaUrl: string;
  fraseObra?: string;
  onAction: () => void;
  compact?: boolean;
}

export const RotaLivroBanner: React.FC<RotaLivroBannerProps> = ({
  obraRegente,
  capaUrl,
  fraseObra,
  onAction,
  compact = false
}) => {
  return (
    <div className={`relative group overflow-hidden rounded-[24px] md:rounded-[32px] border border-gold/20 bg-midnight/40 p-5 md:p-6 flex items-center gap-4 md:gap-6 ${compact ? 'max-w-lg' : 'w-full'}`}>
      <div className={`${compact ? 'w-16 h-24 md:w-24 md:h-36' : 'w-20 h-30 md:w-28 md:h-42'} shrink-0 shadow-2xl rounded-lg border border-white/10 overflow-hidden`}>
        <img src={capaUrl} alt={obraRegente} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 space-y-1 md:space-y-2 text-left">
        <div className="flex items-center gap-2">
          <span className="h-px w-4 bg-gold/40" />
          <p className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-gold font-bold">Obra Regente</p>
        </div>
        <h3 className={`${compact ? 'text-sm md:text-xl' : 'text-lg md:text-2xl'} font-serif text-white leading-tight`}>{obraRegente}</h3>
        {fraseObra && <p className="hidden md:block text-white/40 text-[10px] font-serif italic">{fraseObra}</p>}
        <Button variant="ghost" size="sm" onClick={onAction} className="h-8 text-[9px] md:text-[10px] uppercase tracking-widest text-gold hover:bg-gold/10 p-0">
          Ver Áudio de Abertura <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
};
