import { motion } from "framer-motion";

interface OrigemProjetoProps {
  titulo?: string;
  paragrafos?: string[];
}

export function OrigemProjeto({ 
  titulo = "A origem desta Casa",
  paragrafos = [
    "A Casa Orácula não nasceu de uma inspiração súbita. Nasceu de anos de prática clínica com mulheres — e da percepção de que algo sempre faltava nas formações disponíveis.",
    "Faltava profundidade que não fosse abstrata. Faltava método que não fosse frio. Faltava ética que não fosse rigidez.",
    "Este projeto é uma tentativa séria de unir o simbólico à clínica, sem perder a alma de nenhum dos dois."
  ]
}: OrigemProjetoProps) {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="font-display text-2xl md:text-3xl text-foreground mb-10 text-center"
        >
          {titulo}
        </motion.h2>
        
        <div className="space-y-6">
          {paragrafos.map((paragrafo, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed font-body"
            >
              {paragrafo}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
