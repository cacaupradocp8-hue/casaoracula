import { motion } from 'framer-motion';
import { BookOpen, Users, Map, Compass, Shield, Flame, Eye, Layers, Star, Sparkles, ArrowRight } from 'lucide-react';

const ecosystem = [
  {
    title: 'Casa das Máquinas',
    subtitle: 'SaaS Profissional Integrado',
    desc: 'Sua clínica simbólica completa: fichas, sessões, Mapa Vivo da CidaDELA, Labirinto das Portas, Atlas de Arquétipos — tudo conectado ao método.',
    icon: Compass,
    items: ['Fichas clínicas simbólicas', 'Mapa Vivo por cliente', 'GPS da Jornada Terapêutica', 'Recomendações automáticas de próximo passo'],
    gradient: 'from-primary/15 via-primary/5 to-transparent',
  },
  {
    title: 'Clube Oracular',
    subtitle: 'Leitura como Intervenção Psíquica Guiada',
    desc: 'Cada livro é um dispositivo simbólico. Cada ciclo ativa uma Porta Psíquica. A leitura não é consumo — é travessia aplicada à prática profissional.',
    icon: BookOpen,
    items: ['Aulas-Álbum por Porta Simbólica', 'Perguntas-Mãe para sessão', 'Cada obra vira ferramenta clínica', 'Ciclos integrados ao Mapa da CidaDELA'],
    gradient: 'from-accent/15 via-accent/5 to-transparent',
  },
  {
    title: 'Ferramentas Exclusivas',
    subtitle: 'Instrumentos de Leitura e Condução',
    desc: 'Ferramentas vivas que evoluem com cada sessão — não são formulários estáticos, mas mapas que respiram junto com a psique da cliente.',
    icon: Star,
    items: ['Labirinto das 39 Portas', 'Atlas de Arquétipos Femininos', 'Oráculo Simbólico', 'Protocolos de Condução Ética'],
    gradient: 'from-primary/10 via-accent/5 to-transparent',
  },
];

export function EcosystemShowcase() {
  return (
    <section className="relative py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050810] to-black" />
      
      {/* Multiple ambient orbs */}
      <motion.div
        className="absolute top-1/4 left-0 w-[500px] h-[400px] rounded-full bg-primary/[0.03] blur-[160px] pointer-events-none"
        animate={{ x: [-20, 20, -20], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-[400px] h-[350px] rounded-full bg-accent/[0.04] blur-[140px] pointer-events-none"
        animate={{ x: [20, -20, 20], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary/70 text-xs uppercase tracking-[0.5em] mb-6">O ecossistema completo</p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white mb-6">
            O que você <span className="text-gold-gradient">recebe</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Não é só um curso. É um sistema profissional completo para conduzir transformação com o Método Orácula.
          </p>
        </motion.div>

        <div className="space-y-8">
          {ecosystem.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="group"
            >
              <div className={`
                relative border border-white/[0.06] rounded-3xl p-8 md:p-12 
                overflow-hidden transition-all duration-700
                hover:border-primary/20 hover:shadow-[0_0_80px_-20px_hsl(var(--gold)/0.1)]
                bg-white/[0.01]
              `}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                <div className="relative z-10 grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <motion.div
                        className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <item.icon className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
                      </motion.div>
                      <div>
                        <h3 className="font-display text-xl md:text-2xl text-white">{item.title}</h3>
                        <p className="text-primary/80 text-xs uppercase tracking-widest">{item.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.items.map((feature, fi) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + fi * 0.08 }}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 hover:border-primary/15 transition-colors duration-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                        <span className="text-white/75 text-xs">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom pulsing statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-center relative"
        >
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full bg-primary/[0.04] blur-[80px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <p className="relative z-10 text-gold-gradient font-display text-xl md:text-2xl italic">
            Tudo integrado. Nada improvisado.<br />
            <span className="text-white/65 text-base not-italic mt-2 block">Cada ferramenta conversa com o método. Cada sessão alimenta o mapa.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
