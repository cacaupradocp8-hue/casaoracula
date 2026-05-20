import { motion } from 'framer-motion';
import { Map, BookOpen, Sparkles, Headphones, FlaskConical, Leaf } from 'lucide-react';

const contos = [
  'La Loba', 'Barba Azul', 'Vasalisa', 'Mulher Esqueleto',
  'Pele de Foca', 'Donzela sem Mãos', 'Patinho Feio', 'Baba Yaga', 'La Llorona',
];

const blocosInclusos = [
  {
    icon: Map,
    titulo: 'Mapa: CidaDELA Interior',
    desc: 'Seu mapa simbólico-estrutural para reconhecer padrões, recursos e caminhos possíveis.'
  },
  {
    icon: BookOpen,
    titulo: 'Leitura: Rotas e Clínica',
    desc: 'Jornadas guiadas por obras e contos que se tornam espelhos e ferramentas de elaboração.'
  },
  {
    icon: Sparkles,
    titulo: 'Prática: Laboratório 80/20',
    desc: 'Exercícios de integração e o núcleo essencial que realmente sustenta a transformação.'
  },
  {
    icon: Leaf,
    titulo: 'Registro: Jardim da Psique',
    desc: 'Espaço para registrar símbolos, sonhos, percepções e movimentos internos.'
  }
];

export function PlanosRotasDetalhes() {
  return (
    <>
      {/* Estação Lobos */}
      <section className="py-24 md:py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[120px] -z-10" />
        
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <p className="text-gold/80 text-xs uppercase tracking-[0.3em] font-medium mb-4">Primeira estação</p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
                Mulheres que Correm com os Lobos
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                A Estação Lobos abre a travessia do instinto, da escuta profunda e da mulher que retorna a si.
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {contos.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-4 py-2 rounded-full border border-gold/15 bg-background/50 text-foreground/70 font-display italic"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="space-y-4 border-l-2 border-gold/20 pl-8">
                <p className="text-lg text-muted-foreground italic">
                  “Não como resumo de livro. Como laboratório de leitura simbólica aplicada.”
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square max-w-md mx-auto lg:ml-auto flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border border-gold/10 animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-gold/5" />
              <div className="relative z-10 p-12 text-center">
                <p className="text-gold/60 text-xs uppercase tracking-widest mb-4">A pergunta central</p>
                <p className="font-display text-2xl md:text-3xl text-foreground italic leading-snug">
                  O que em você precisou ser domesticado para ser aceita?
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* O que está incluso */}
      <section className="py-24 md:py-32 border-t border-border/10 bg-muted/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">O que está incluso</h2>
            <p className="text-muted-foreground">Sua estrutura de suporte para a travessia diária.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blocosInclusos.map((bloco, i) => {
              const Icon = bloco.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card/30 border border-gold/10 p-8 rounded-2xl hover:border-gold/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{bloco.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{bloco.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
