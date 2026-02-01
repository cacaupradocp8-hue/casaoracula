import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import claudiaImage from "@/assets/formacao/claudia-presenca.png";

export function ParaQuemSection() {
  const paraQuemE = [
    "Terapeutas",
    "Psicólogas",
    "Mentoras do feminino",
    "Facilitadoras de grupos",
    "Mulheres que já estudaram muito mas sentem que falta estrutura simbólica e autoridade interna"
  ];

  const paraQuemNaoE = [
    "Para quem quer atalhos",
    "Para quem copia métodos",
    "Para quem confunde espiritualidade com ausência de limite",
    "Para quem não quer ser atravessada"
  ];

  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background subtle */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 hidden lg:block">
        <img 
          src={claudiaImage} 
          alt="" 
          className="w-full h-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Para quem é */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
              🜁
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-8">
              Para quem é a <span className="text-gold">ORÁCULA</span>
            </h3>
            
            <ul className="space-y-4">
              {paraQuemE.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  className="flex items-start gap-3 font-body text-foreground/70"
                >
                  <Check className="w-4 h-4 text-gold/70 mt-1 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Para quem não é */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-foreground/30 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
              🜄
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-foreground/60 mb-8">
              Para quem <span className="text-foreground/40">não é</span>
            </h3>
            
            <ul className="space-y-4">
              {paraQuemNaoE.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                  className="flex items-start gap-3 font-body text-foreground/40"
                >
                  <X className="w-4 h-4 text-foreground/30 mt-1 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
