import { motion } from 'framer-motion';
import { Headphones, BookOpen, Sparkles, Feather } from 'lucide-react';

const arquitetura = [
  {
    icon: Headphones,
    titulo: '1. Áudio de Introdução ao Tema',
    desc: 'Abre o campo simbólico da rota e apresenta o eixo central da travessia.',
  },
  {
    icon: BookOpen,
    titulo: '2. Áudio Principal da Rota',
    desc: 'Sustenta a tese simbólica da estação e organiza a leitura profunda do tema.',
  },
  {
    icon: Sparkles,
    titulo: '3. Áudio 80/20',
    desc: 'Revela o núcleo vivo da obra: aquilo que, se realmente compreendido, muda toda a experiência.',
  },
  {
    icon: Feather,
    titulo: '4. Áudio do Conto',
    desc: 'Conduz a leitura simbólica de um conto como lente de autoconhecimento, prática e aplicação terapêutica.',
  },
];

const extras = [
  'tese simbólica',
  'aplicação terapêutica',
  'pergunta narrativa final',
  'relação com Portas, Torres e Labirintos',
  'prática de integração',
  'direção para registro no Jardim da Psique',
];

export function PlanosExplicacao() {
  return (
    <section className="py-16 md:py-24 border-t border-border/10">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-6">
            Rotas da Casa Orácula
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Uma assinatura de leitura simbólica aplicada, onde livros, contos, mitos e práticas
            deixam de ser apenas conteúdo e se tornam <span className="text-gold">mapas de travessia</span>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cada rota é uma estação. Cada estação abre um tema da psique feminina. Cada áudio
            conduz uma camada. Cada conto revela uma porta.
          </p>
          <p className="font-display italic text-foreground/85 mt-6">
            Você não entra para "assistir aulas". Você entra para atravessar processos.
          </p>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-xl md:text-2xl text-foreground text-center mb-10"
        >
          Como funcionam as Rotas
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {arquitetura.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-gold/15 bg-card/30 p-6 backdrop-blur-sm"
              >
                <Icon className="w-5 h-5 text-gold mb-3" />
                <h4 className="font-display text-lg text-foreground mb-2">{a.titulo}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-3">
            Além dos áudios, cada conto pode trazer:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {extras.map((e) => (
              <span
                key={e}
                className="text-xs px-3 py-1.5 rounded-full border border-gold/20 text-foreground/75 bg-background/30"
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
