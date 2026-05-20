import { motion } from 'framer-motion';
import { Map, BookOpen, Sparkles, Headphones, FlaskConical, Leaf } from 'lucide-react';

const contos = [
  'La Loba', 'Barba Azul', 'Vasalisa', 'Mulher Esqueleto',
  'Pele de Foca', 'Donzela sem Mãos', 'Patinho Feio', 'Baba Yaga', 'La Llorona',
];

const recebe = [
  { icon: Map, titulo: 'CidaDELA Interior', desc: 'Seu mapa simbólico-estrutural para reconhecer padrões, recursos, tensões e caminhos possíveis.' },
  { icon: BookOpen, titulo: 'Rotas de Leitura Simbólica', desc: 'Jornadas guiadas por obras, temas e contos para aprofundar sua percepção de si e da psique feminina.' },
  { icon: Sparkles, titulo: 'Clínica dos Contos', desc: 'Um núcleo de leitura simbólica aplicada, onde os contos se tornam espelhos, portas e ferramentas de elaboração.' },
  { icon: Headphones, titulo: 'Áudios Oraculares', desc: 'Aulas em formato de escuta guiada, criadas para conduzir a travessia com profundidade, pausa e direção.' },
  { icon: FlaskConical, titulo: 'Laboratório 80/20', desc: 'O núcleo essencial de cada obra ou conto: aquilo que realmente sustenta a transformação.' },
  { icon: Leaf, titulo: 'Jardim da Psique', desc: 'Espaço para registrar símbolos, sonhos, frases, percepções, práticas e movimentos internos.' },
];

const paraQuem = [
  'Mulheres que sentem que apenas consumir conteúdo já não basta.',
  'Terapeutas, mentoras, educadoras e mulheres de escuta que desejam aprofundar sua linguagem simbólica.',
  'Para quem quer ler livros e contos não apenas com a mente, mas com a vida.',
  'Para quem deseja transformar intuição em percepção, percepção em linguagem e linguagem em travessia.',
  'Para quem sente que sua psique pede mapa, não mais excesso.',
];

const muda = [
  'Você começa a perceber seus próprios padrões com mais clareza.',
  'Você aprende a escutar os símbolos que aparecem nas histórias, nos sonhos, nos incômodos e nas repetições.',
  'Você passa a ler contos e obras profundas como instrumentos de autoconhecimento e condução.',
  'Você deixa de acumular conteúdo solto e começa a habitar uma jornada.',
];

export function PlanosRotasDetalhes() {
  return (
    <>
      {/* Primeira Estação */}
      <section className="py-16 md:py-24 border-t border-border/10 bg-gradient-to-b from-background via-background to-background/80">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70 mb-3">Primeira estação</p>
            <h2 className="font-display text-2xl md:text-4xl text-foreground tracking-wide mb-6">
              Mulheres que Correm com os Lobos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              A primeira rota abre a <span className="text-gold">Estação Lobos</span>. Uma travessia
              pelo instinto, pela escuta profunda e pela mulher que retorna a si.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {contos.map((c) => (
                <span
                  key={c}
                  className="text-xs px-3 py-1.5 rounded-full border border-gold/25 bg-card/30 text-foreground/80 font-display italic"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="space-y-1 text-sm text-muted-foreground/80 italic mb-8">
              <p>Não como resumo de livro.</p>
              <p>Não como explicação intelectual.</p>
              <p>Não como decoração arquetípica.</p>
              <p className="text-foreground/85 not-italic font-display pt-2">
                Mas como laboratório de leitura simbólica aplicada.
              </p>
            </div>

            <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 md:p-8 max-w-xl mx-auto">
              <p className="text-xs uppercase tracking-widest text-gold/70 mb-2">A pergunta central</p>
              <p className="font-display text-lg md:text-xl text-foreground italic leading-snug">
                O que em você precisou ser domesticado para ser aceita?
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="py-16 md:py-24 border-t border-border/10">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl text-foreground tracking-wide text-center mb-12"
          >
            O que você recebe dentro das Rotas
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recebe.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-xl border border-gold/15 bg-card/30 p-6 backdrop-blur-sm hover:border-gold/30 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gold mb-3" />
                  <h3 className="font-display text-lg text-foreground mb-2">{r.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Para quem + O que muda */}
      <section className="py-16 md:py-24 border-t border-border/10">
        <div className="container mx-auto px-6 max-w-5xl grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl text-foreground tracking-wide mb-6">
              Para quem são as Rotas
            </h2>
            <ul className="space-y-4">
              {paraQuem.map((p, i) => (
                <li key={i} className="border-l-2 border-gold/20 pl-4 text-muted-foreground leading-relaxed text-sm">
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl text-foreground tracking-wide mb-6">
              O que muda quando você entra
            </h2>
            <ul className="space-y-4">
              {muda.map((m, i) => (
                <li key={i} className="border-l-2 border-gold/20 pl-4 text-muted-foreground leading-relaxed text-sm">
                  {m}
                </li>
              ))}
            </ul>
            <p className="font-display italic text-foreground/85 mt-8 text-center">
              A Casa não entrega tudo de uma vez. <span className="text-gold">Ela abre portas.</span>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
