import React from 'react';
import { ArrowRight } from 'lucide-react';


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
    <div className={`group relative overflow-hidden rounded-[24px] md:rounded-[28px] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5 md:p-6 flex items-center gap-4 md:gap-6 transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_-30px_rgba(212,175,55,0.35)] ${compact ? 'max-w-lg' : 'w-full'}`}>
      <div className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="pointer-events-none absolute bottom-3 right-3 w-3 h-3 border-b border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className={`${compact ? 'w-16 h-24 md:w-24 md:h-36' : 'w-20 h-30 md:w-28 md:h-40'} shrink-0 shadow-[12px_12px_30px_rgba(0,0,0,0.6)] rounded-md border border-white/10 overflow-hidden transition-transform duration-500 group-hover:-rotate-1 group-hover:scale-[1.03]`}>
        <img src={capaUrl} alt={obraRegente} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 space-y-2 text-left min-w-0">
        <div className="flex items-center gap-2">
          <span className="h-px w-4 bg-gold/50" />
          <p className="text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-gold font-bold">Obra Regente</p>
        </div>
        <h3 className={`${compact ? 'text-sm md:text-xl' : 'text-lg md:text-2xl'} font-serif text-white leading-tight`}>{obraRegente}</h3>
        {fraseObra && <p className="hidden md:block text-white/45 text-[11px] font-serif italic leading-relaxed line-clamp-2">{fraseObra}</p>}
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 mt-1 text-[10px] md:text-[10px] uppercase tracking-[0.25em] text-gold font-bold hover:text-gold/80 transition-colors group/btn"
        >
          Ver Áudio de Abertura
          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
        </button>
      </div>
    </div>
  );
};
