import { motion } from "framer-motion";
import silencioImage from "@/assets/formacao/oracula-silencio.png";

export function NarroterapiaSection() {
  const aprende = [
    "escuta narrativa profunda",
    "uso terapêutico de contos e mitos",
    "construção de ritos narrativos",
    "leitura simbólica sem sugestão",
    "condução sem interpretação invasiva"
  ];

  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-15">
        <img 
          src={silencioImage} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
            🜁
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            O Portal da <span className="text-gold">Narroterapia Oracular</span>
          </h2>
          
          <p className="font-display text-xl text-foreground/70 italic">
            A Narroterapia Oracular não é contar histórias.<br />
            É ler a psique através delas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <p className="font-body text-foreground/60 text-center mb-6">
            Neste Portal você aprende:
          </p>
          
          <ul className="space-y-3 max-w-md mx-auto">
            {aprende.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 font-body text-foreground/70"
              >
                <span className="text-gold/60 text-xs">◆</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="h-px w-24 bg-gold/20 mx-auto mb-8" />
          
          <p className="font-body text-foreground/60 text-base mb-4">
            Aqui, a história deixa de ser recurso bonito<br />
            e se torna <span className="text-gold/80">instrumento clínico simbólico</span>.
          </p>
          
          <p className="font-display text-foreground/50 italic">
            Este Portal é o divisor de águas<br />
            entre quem inspira<br />
            e quem sustenta transformação.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
