import { motion } from 'framer-motion';
import { Headphones, BookOpen, Sparkles, Feather } from 'lucide-react';

const arquitetura = [
  {
    icon: Headphones,
    titulo: 'Áudio de Introdução',
    desc: 'Abre o campo simbólico da rota e apresenta o eixo central da travessia.',
  },
  {
    icon: BookOpen,
    titulo: 'Áudio Principal',
    desc: 'Sustenta a tese simbólica da estação e organiza a leitura profunda do tema.',
  },
  {
    icon: Sparkles,
    titulo: 'Áudio 80/20',
    desc: 'Revela o núcleo vivo: aquilo que, se realmente compreendido, muda toda a experiência.',
  },
  {
    icon: Feather,
    titulo: 'Áudio do Conto',
    desc: 'Conduz a leitura simbólica como lente de autoconhecimento e aplicação terapêutica.',
  },
];

export function PlanosExplicacao() {
  return (
    <section id="secao-funcionamento" className="py-24 md:py-32 bg-muted/5">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 leading-tight">
              O mapa não serve para te definir.<br />
              <span className="text-gold italic">Serve para te devolver direção.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              As Rotas da Casa Orácula são jornadas de leitura simbólica aplicada. Cada rota transforma livros, contos, áudios e práticas em um percurso de travessia.
            </p>
          </motion.div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {arquitetura.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card/40 backdrop-blur-sm border border-gold/10 p-6 rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h4 className="font-display text-lg text-foreground mb-2">{item.titulo}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-border/10"
        >
          <p className="font-display italic text-xl text-foreground/80">
            “Cada conto abre uma porta. Cada áudio sustenta uma camada.”
          </p>
        </motion.div>
      </div>
    </section>
  );
}
