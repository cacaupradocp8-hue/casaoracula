import { motion, AnimatePresence } from 'framer-motion';
import { FAMILY_COLORS, FAMILY_ICONS, type CidadelaCard } from '@/hooks/useCidadelaOracle';

interface Props {
  card: CidadelaCard;
  isRevealing?: boolean;
  recurrenceCount?: number;
  onClick?: () => void;
  compact?: boolean;
}

export function OracleCardVisual({ card, isRevealing, recurrenceCount, onClick, compact }: Props) {
  const colors = FAMILY_COLORS[card.family] || FAMILY_COLORS.TORRES;
  const icon = FAMILY_ICONS[card.family] || '✦';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={card.id}
        initial={isRevealing ? { rotateY: 180, opacity: 0 } : { opacity: 0, scale: 0.95 }}
        animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onClick={onClick}
        className={`relative cursor-pointer group ${compact ? 'w-32' : 'w-44'}`}
      >
        {/* Recurrence badge */}
        {recurrenceCount && recurrenceCount >= 3 && (
          <div className="absolute -top-2 -right-2 z-10 bg-[#C9A24A] text-[#0B1B2B] text-[10px] font-bold px-2 py-0.5 rounded-full">
            ×{recurrenceCount}
          </div>
        )}

        <div className={`${colors.bg} ${colors.border} border-2 rounded-xl overflow-hidden transition-all group-hover:shadow-lg group-hover:shadow-[#C9A24A]/10 ${compact ? 'p-3' : 'p-5'}`}
          style={{ aspectRatio: compact ? '3/4' : '10/16' }}
        >
          {/* Top label */}
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[9px] uppercase tracking-widest ${colors.text} opacity-70`}>{card.family}</span>
            <span className="text-[9px] text-[#F5F1E8]/30">#{card.ordem}</span>
          </div>

          {/* Central symbol area */}
          <div className="flex-1 flex flex-col items-center justify-center text-center my-3">
            <div className={`${compact ? 'text-3xl' : 'text-5xl'} mb-3 opacity-60`}>{icon}</div>
            
            {/* Geometric border placeholder */}
            <div className={`${colors.border} border rounded-lg ${compact ? 'p-2' : 'p-4'} bg-[#0B1B2B]/30 w-full`}>
              <p className={`font-display ${compact ? 'text-xs' : 'text-sm'} ${colors.text} leading-tight`}>
                {card.name}
              </p>
              {card.keyword && !compact && (
                <p className="text-[10px] text-[#F5F1E8]/40 mt-1 italic">{card.keyword}</p>
              )}
            </div>
          </div>

          {/* Description */}
          {!compact && card.description && (
            <p className="text-[9px] text-[#F5F1E8]/40 text-center mt-1 leading-tight">
              {card.description}
            </p>
          )}

          {/* Base question */}
          {!compact && card.base_question && (
            <div className="mt-auto pt-2 border-t border-[#F5F1E8]/10">
              <p className="text-[10px] text-[#F5F1E8]/50 italic text-center leading-tight">
                "{card.base_question}"
              </p>
            </div>
          )}

          {/* Suggested tool */}
          {!compact && card.suggested_tool && (
            <p className="text-[8px] text-[#C9A24A]/40 text-center mt-1">
              🔧 {card.suggested_tool}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
