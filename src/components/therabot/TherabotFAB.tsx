import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
}

export function TherabotFAB({ onClick }: Props) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={onClick}
        variant="gold"
        size="icon"
        className="h-14 w-14 rounded-full shadow-glow ring-2 ring-gold/10 hover:ring-gold/25 transition-all"
        aria-label="Abrir Therabot"
      >
        <Bot className="w-6 h-6" />
      </Button>
    </motion.div>
  );
}
