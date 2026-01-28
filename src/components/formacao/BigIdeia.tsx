import { motion } from "framer-motion";

interface BigIdeiaProps {
  fraseCentral?: string;
  explicacao?: string;
}

export function BigIdeia({ 
  fraseCentral = "O que cansa não é a profundidade. É sustentá-la sem território.",
  explicacao = "Quando há estrutura, a sensibilidade deixa de ser peso e vira instrumento. O que parecia excesso vira precisão. O que parecia fragilidade vira alcance."
}: BigIdeiaProps) {
  return (
    <section className="py-24 md:py-40 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-gold leading-tight mb-8">
            "{fraseCentral}"
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed font-body max-w-2xl mx-auto"
        >
          {explicacao}
        </motion.p>
      </div>
    </section>
  );
}
