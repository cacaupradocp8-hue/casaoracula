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
      <Button
        onClick={onClick}
        variant="gold"
        size="icon"
        className="h-14 w-14 rounded-full shadow-glow ring-2 ring-gold/10 hover:ring-gold/25 transition-all overflow-hidden p-0"
        aria-label="Abrir Therabot"
      >
        <img
          src={cosmicIcon}
          alt="Assistente Cósmica"
          className="w-full h-full object-cover scale-125"
          loading="lazy"
          width={512}
          height={512}
        />
      </Button>
    </motion.div>
  );
}
