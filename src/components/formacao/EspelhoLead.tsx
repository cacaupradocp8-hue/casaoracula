import { motion } from "framer-motion";

interface EspelhoLeadProps {
  frases?: string[];
}

export function EspelhoLead({ 
  frases = [
    "Você sustenta muito — sozinha demais.",
    "Você sente fundo — mas sem território.",
    "Você escuta o que ninguém escuta — e paga por isso.",
    "Você não erra. Falta contorno."
  ]
}: EspelhoLeadProps) {
  return (
    <section className="py-20 md:py-32 px-6 bg-card/30">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8 md:space-y-10">
          {frases.map((frase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
              <p className="pl-6 font-display text-lg md:text-xl text-foreground/90 italic leading-relaxed">
                {frase}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
