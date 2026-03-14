import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sunrise, Moon, Flame, Users, Crown } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const niveis = [
  { icon: Sunrise, nome: 'Iniciada', desc: 'Presença e contenção' },
  { icon: Moon, nome: 'Praticante', desc: 'Estrutura e linguagem' },
  { icon: Flame, nome: 'Condutora', desc: 'Decisão e travessia' },
  { icon: Users, nome: 'Guia de Grupos', desc: 'Campo coletivo' },
  { icon: Crown, nome: 'Formadora', desc: 'Transmissão e linhagem' },
];

export function MetodoFormacao() {
  const navigate = useNavigate();

  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-16 md:py-24">
      <p className="text-gold/50 text-xs uppercase tracking-[0.3em] text-center mb-4">Jornada formativa</p>
      <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4 text-center tracking-wide">
        Formação Profissional
      </h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14">
        Não se avança por tempo. Avança-se por maturidade. Cada nível exige prática, evidência e revisão.
      </p>

      {/* Timeline */}
      <div className="relative mb-14">
        <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {niveis.map((nivel, i) => (
            <motion.div
              key={nivel.nome}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border border-border/50 rounded-xl p-5 text-center hover:border-gold/20 transition-colors duration-300 bg-card/20 relative"
            >
              <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gold/40 border-2 border-background" />
              <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center mx-auto mb-3">
                <nivel.icon className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-sm text-foreground mb-1">{nivel.nome}</h3>
              <p className="text-muted-foreground text-xs">{nivel.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={() => navigate('/formacao')}
          className="bg-gold/90 hover:bg-gold text-background"
        >
          Conhecer a Formação
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.section>
  );
}
