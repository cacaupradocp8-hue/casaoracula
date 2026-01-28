import { motion } from "framer-motion";

export function SectionFechamento() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          className="text-center space-y-8"
        >
          <span className="text-gold/40 text-2xl block">🌑</span>
          
          <div className="space-y-4">
            <p className="font-display text-xl md:text-2xl text-foreground/90 leading-relaxed">
              Aqui, o valor
              <br />
              não está no acesso.
            </p>
            <p className="font-display text-xl md:text-2xl text-gold/80 leading-relaxed">
              Está na responsabilidade
              <br />
              de quem atravessa.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
