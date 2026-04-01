import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const FRASES = [
  'Hoje seu Jardim pede pausa, escuta e delicadeza.',
  'Há um território em movimento dentro de você.',
  'Algo quer nascer — cuide do solo.',
  'A travessia pede presença, não pressa.',
  'Escute antes de nomear.',
  'O silêncio também é semente.',
  'Deixe que o campo se revele.',
];

export function MomentoJardimBloco() {
  const frase = FRASES[new Date().getDate() % FRASES.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <Card className="border-accent/15 bg-accent/5">
        <CardContent className="py-6 px-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent/40 mb-3">
            Seu momento no Jardim
          </p>
          <p className="text-sm font-display text-foreground/70 italic leading-relaxed">
            "{frase}"
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
