import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Map, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormationMapModal } from './FormationMapModal';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Motion div com forwardRef para compatibilidade com Radix
const MotionDiv = forwardRef<HTMLDivElement, React.ComponentProps<typeof motion.div>>(
  (props, ref) => <motion.div ref={ref} {...props} />
);

/**
 * FormationMapTrigger — Botão flutuante para abrir o mapa da formação
 * 
 * Posicionado no canto da tela em páginas relevantes
 */

interface FormationMapTriggerProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export function FormationMapTrigger({ 
  variant = 'floating',
  className = ''
}: FormationMapTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Only show for authenticated users
  if (!user) return null;

  if (variant === 'inline') {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className={className}
        >
          <Compass className="w-4 h-4 mr-2" />
          Mapa da Formação
        </Button>
        <FormationMapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MotionDiv
              className={`fixed bottom-20 right-4 z-40 ${className}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-gold/30 hover:border-gold/60 hover:bg-gold/10 shadow-lg"
              >
                <Map className="w-5 h-5 text-gold" />
              </Button>
            </MotionDiv>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Mapa da Formação</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <FormationMapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
