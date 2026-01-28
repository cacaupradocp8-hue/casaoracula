import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ParaQuemEProps {
  paraQuem?: string[];
  naoParaQuem?: string[];
}

const defaultParaQuem = [
  "Terapeutas que trabalham com mulheres e sentem que falta profundidade simbólica em sua prática",
  "Psicólogas que desejam integrar o arquetípico e o narrativo ao trabalho clínico",
  "Mentoras que sustentam processos transformadores e querem linguagem e método",
  "Facilitadoras de círculos que buscam condução ética e estruturada",
  "Profissionais do cuidado que sentem-se prontas para uma formação séria"
];

const defaultNaoParaQuem = [
  "Quem busca consumo superficial ou coleção de certificados",
  "Quem não tem disponibilidade real para imersão formativa",
  "Quem espera receitas prontas sem reflexão pessoal",
  "Quem não trabalha ou não pretende trabalhar com mulheres"
];

export function ParaQuemE({ 
  paraQuem,
  naoParaQuem
}: ParaQuemEProps) {
  // Ensure we always have valid arrays
  const paraQuemList = Array.isArray(paraQuem) ? paraQuem : defaultParaQuem;
  const naoParaQuemList = Array.isArray(naoParaQuem) ? naoParaQuem : defaultNaoParaQuem;
  return (
    <section className="py-20 md:py-32 px-6 bg-card/30">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="font-display text-2xl md:text-3xl text-foreground text-center mb-16"
        >
          Clareza sobre para quem é
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Para quem é */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-sm uppercase tracking-widest text-gold mb-6 font-body">
              Para quem é
            </h3>
            <ul className="space-y-4">
              {paraQuemList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground/90 font-body text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Para quem não é */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 font-body">
              Para quem não é
            </h3>
            <ul className="space-y-4">
              {naoParaQuemList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground font-body text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
