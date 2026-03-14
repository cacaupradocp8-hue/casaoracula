import { motion } from 'framer-motion';
import { BookOpen, Headphones, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const recursos = [
  { icon: BookOpen, titulo: 'Leitura Simbólica', texto: 'Livros selecionados como dispositivos de travessia, não acúmulo intelectual.' },
  { icon: Headphones, titulo: 'Aulas-Álbum', texto: 'Obras sonoras formativas que ativam portas simbólicas específicas.' },
  { icon: Users, titulo: 'Círculo de Integração', texto: 'Espaço coletivo de reflexão e sustentação entre facilitadoras.' },
];

export function MetodoClubeLeitura() {
  const navigate = useNavigate();

  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-16 md:py-24">
      <p className="text-gold/50 text-xs uppercase tracking-[0.3em] text-center mb-4">Formação contínua</p>
      <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4 text-center tracking-wide">
        Clube do Livro Formativo
      </h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Cada ciclo é uma travessia. Cada livro, uma porta. Não se trata de ler mais — mas de ler com profundidade simbólica.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {recursos.map((item, i) => (
          <motion.div
            key={item.titulo}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border border-gold/10 rounded-lg p-6 bg-card/20 hover:border-gold/20 transition-colors duration-300"
          >
            <item.icon className="w-5 h-5 text-gold/70 mb-4" />
            <h3 className="font-display text-foreground mb-2">{item.titulo}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.texto}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => navigate('/clube-livro')}
          className="border-gold/20 hover:border-gold/40 text-foreground"
        >
          Conhecer o Clube
        </Button>
      </div>
    </motion.section>
  );
}
