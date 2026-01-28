import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FechamentoRitualProps {
  frase?: string;
  cta?: string;
  onCtaClick?: () => void;
}

export function FechamentoRitual({ 
  frase = "Se você chegou até aqui, algo em você reconhece o que está sendo oferecido.",
  cta = "Iniciar minha travessia",
  onCtaClick
}: FechamentoRitualProps) {
  const scrollToPlanos = () => {
    document.getElementById("investimento")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-24 md:py-40 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2 }}
          className="font-display text-xl md:text-2xl text-foreground/80 italic leading-relaxed mb-12"
        >
          {frase}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button 
            variant="gold" 
            size="lg"
            onClick={onCtaClick || scrollToPlanos}
            className="px-10"
          >
            {cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
