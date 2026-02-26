import { motion } from 'framer-motion';
import { BookOpen, Users, Mic, Stethoscope } from 'lucide-react';
import clubeImg from '@/assets/section-clube-leitura.jpg';

const aplicacoes = [
  { icon: BookOpen, label: 'Aula formativa' },
  { icon: Users, label: 'Círculo terapêutico' },
  { icon: Mic, label: 'Palestra simbólica' },
  { icon: Stethoscope, label: 'Aplicação clínica' },
];

export function ClubeLeituraSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            Clube do <span className="text-gold-gradient font-semibold">Livro</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              O Clube do Livro Formativo é o espaço onde cada obra se transforma em instrumento de trabalho clínico. Não é leitura recreativa — é tradução simbólica aplicada.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cada ciclo ativa uma Porta Simbólica, gerando material para uso direto em sessão, círculo e supervisão.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {aplicacoes.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white/[0.02] p-4"
                >
                  <a.icon className="w-4 h-4 text-primary/60 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-foreground/80 text-sm">{a.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl overflow-hidden"
          >
            <img
              src={clubeImg}
              alt="Livro aberto com anotações"
              className="w-full h-auto object-cover opacity-60 grayscale"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
