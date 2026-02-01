import { motion } from "framer-motion";
import atmosfera1 from "@/assets/formacao/atmosfera-ritual-01.png";

export function ComoFuncionaSection() {
  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background subtle */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={atmosfera1} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
            🜃
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Como a formação funciona
          </h2>
          <p className="font-body text-foreground/50 text-sm mt-2">(na prática)</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-body text-foreground/70 text-center mb-16 max-w-2xl mx-auto"
        >
          A ORÁCULA é organizada em dois movimentos complementares:
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Travessias */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <span className="text-3xl mb-4 block">🔮</span>
            <h3 className="font-display text-2xl md:text-3xl text-gold mb-4">
              TRAVESSIAS
            </h3>
            <p className="font-display text-lg text-foreground/70 italic mb-6">
              O mergulho na sua própria psique.<br />
              Onde você vive o método em si.
            </p>
            
            <p className="font-body text-foreground/60 text-sm mb-4">Aqui você:</p>
            <ul className="space-y-2 font-body text-foreground/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                atravessa a Jornada da Heroína
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                constrói seu Mapa Pessoal
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                identifica seu mito pessoal
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                reconhece limites, defesas e potências
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                integra sombra, linguagem e presença
              </li>
            </ul>
            
            <p className="font-body text-foreground/50 text-xs italic mt-6">
              Cada travessia deixa marcas reais.<br />
              Nada é simbólico "só no discurso".
            </p>
          </motion.div>

          {/* Portais */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center md:text-left"
          >
            <span className="text-3xl mb-4 block">🗝️</span>
            <h3 className="font-display text-2xl md:text-3xl text-gold mb-4">
              PORTAIS
            </h3>
            <p className="font-display text-lg text-foreground/70 italic mb-6">
              O lugar do aprendizado estruturado.
            </p>
            
            <p className="font-body text-foreground/60 text-sm mb-4">Em cada Portal você encontra:</p>
            <ul className="space-y-2 font-body text-foreground/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                aulas conceituais
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                fundamentos científicos e simbólicos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                leitura didática do método
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                registros orientados
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                exercícios de compreensão e aplicação
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                pesquisa e refinamento de linguagem
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold/50 mt-1">—</span>
                enraizamento ético da prática
              </li>
            </ul>
            
            <p className="font-body text-foreground/50 text-xs italic mt-6">
              Aqui você entende como conduzir outras mulheres<br />
              sem invadir, confundir ou criar dependência.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
