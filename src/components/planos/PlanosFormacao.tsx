import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const beneficios = [
  'Formação completa com método estruturado',
  'Jornada com começo, meio e fim',
  'Certificação reconhecida',
  'Supervisão e mentoria em profundidade',
];

export function PlanosFormacao() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 border-t border-border/10">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold/40 text-xs uppercase tracking-[0.25em] mb-4 font-medium">
            Próximo nível
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-4">
            Para quem decide ir além
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto">
            O Clube abre a porta. A Formação te conduz pela jornada inteira — com estrutura,
            profundidade e acompanhamento real.
          </p>

          <ul className="space-y-3 text-left max-w-sm mx-auto mb-10">
            {beneficios.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold/30 shrink-0" />
                {b}
              </motion.li>
            ))}
          </ul>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/metodo')}
            className="border-gold/15 text-foreground hover:bg-gold/5 hover:border-gold/25 px-8"
          >
            Conhecer a formação completa
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
