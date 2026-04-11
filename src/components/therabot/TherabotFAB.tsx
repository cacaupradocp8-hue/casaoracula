import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import cosmicIcon from '@/assets/therabot-cosmic-icon.png';

interface Props {
  onClick: () => void;
}

export function TherabotFAB({ onClick }: Props) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50"
    >
      <button
        onClick={onClick}
        className="h-16 w-16 rounded-full bg-[#0a0a1a] border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,200,255,0.4)] hover:shadow-[0_0_30px_rgba(0,200,255,0.6)] transition-all duration-300 overflow-hidden p-1 hover:scale-105 active:scale-95"
        aria-label="Abrir Therabot"
      >
        <img
          src={cosmicIcon}
          alt="Assistente Cósmica"
          className="w-full h-full object-contain"
          loading="lazy"
          width={512}
          height={512}
        />
      </button>
    </motion.div>
  );
}
