import { motion } from 'framer-motion';
import goddessIcon from '@/assets/therabot-goddess-icon.png';

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
        className="h-16 w-16 rounded-full bg-[#110a20] border-2 border-[#c9a84c]/60 shadow-[0_0_18px_rgba(201,168,76,0.4)] hover:shadow-[0_0_28px_rgba(201,168,76,0.6)] transition-all duration-300 overflow-hidden p-0.5 hover:scale-110 active:scale-95"
        aria-label="Abrir Sintheya"
      >
        <img
          src={goddessIcon}
          alt="Sintheya — Assistente Oracular"
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
          width={512}
          height={512}
        />
      </button>
    </motion.div>
  );
}
