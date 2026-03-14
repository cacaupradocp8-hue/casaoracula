import { motion } from 'framer-motion';
import { Eye, Ear, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCopy } from '@/hooks/useCopy';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const PILAR_ICONS = [Eye, Ear, Sparkles];

export function MetodoPilares() {
  const { getCopyByKey } = useCopy();

  const pilares = [
    {
      titulo: getCopyByKey('casa_pilar_1_titulo', 'Leitura Simbólica'),
      texto: getCopyByKey('casa_pilar_1_texto', 'A arte de ler imagens e arquétipos como linguagem da alma.'),
      Icon: PILAR_ICONS[0],
    },
    {
      titulo: getCopyByKey('casa_pilar_2_titulo', 'Escuta Oracular'),
      texto: getCopyByKey('casa_pilar_2_texto', 'A presença que sustenta o processo de travessia.'),
      Icon: PILAR_ICONS[1],
    },
    {
      titulo: getCopyByKey('casa_pilar_3_titulo', 'Travessia Iniciática'),
      texto: getCopyByKey('casa_pilar_3_texto', 'A formação como passagem, não acúmulo.'),
      Icon: PILAR_ICONS[2],
    },
  ];

  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-display text-gold/90 mb-12 text-center tracking-wide">
        Os Três Pilares
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {pilares.map((pilar, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-gold/10 h-full hover:border-gold/20 transition-colors duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <pilar.Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-display text-gold mb-4 tracking-wide">{pilar.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pilar.texto}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
