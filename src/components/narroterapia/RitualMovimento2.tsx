import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RitualMovimento2Props {
  onComplete: () => Promise<void>;
}

export default function RitualMovimento2({ onComplete }: RitualMovimento2Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleComplete = async () => {
    if (!accepted) return;
    setIsLoading(true);
    try {
      await onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="max-w-xl mx-auto">
        {/* Título sutil */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-12 text-center"
        >
          Movimento II — Compromisso
        </motion.p>

        {/* Texto canônico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mb-12"
        >
          <h2 className="text-xl font-display text-foreground mb-8 text-center">
            Compromisso da Facilitadora
          </h2>
          
          <div className="bg-muted/20 border border-border/50 rounded-lg p-8">
            <p className="text-foreground/90 leading-relaxed mb-6">
              Ao atravessar esta Porta, eu reconheço:
            </p>
            
            <ul className="space-y-3 text-foreground/80 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">–</span>
                <span>que o símbolo não me pertence</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">–</span>
                <span>que o conto atua além da consciência</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">–</span>
                <span>que o silêncio é parte do método</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">–</span>
                <span>que não devo interpretar, conduzir ou acelerar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">–</span>
                <span>que minha voz é campo, não ferramenta</span>
              </li>
            </ul>
            
            <p className="text-foreground/90 leading-relaxed mt-6">
              Comprometo-me a sustentar a Narroterapia
              <br />
              com limite, rigor e respeito ao tempo da psique.
            </p>
          </div>
        </motion.div>

        {/* Checkbox */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3">
            <Checkbox
              id="accept-commitment"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <Label 
              htmlFor="accept-commitment" 
              className="text-foreground cursor-pointer select-none"
            >
              Assumo este compromisso
            </Label>
          </div>
        </motion.div>

        {/* Botão */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="text-center"
        >
          <Button
            variant="mystical"
            size="lg"
            onClick={handleComplete}
            disabled={!accepted || isLoading}
            className="px-10"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <span className="mr-2">🜂</span>
            )}
            Prosseguir
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
