import { motion } from 'framer-motion';

const frases = [
  'A psique não se move em linha reta.',
  'Nem toda abertura pede avanço.',
  'O Labirinto não é erro. É processo.',
  'Nada aqui é defeito.',
  'A postura antecede a técnica.',
];

export function MicroFrasesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="space-y-24 sm:space-y-32">
          {frases.map((frase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <p className="text-foreground/90 text-xl sm:text-2xl font-display font-light italic leading-relaxed">
                "{frase}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
