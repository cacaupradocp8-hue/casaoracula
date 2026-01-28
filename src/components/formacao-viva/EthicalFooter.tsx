import { motion } from "framer-motion";

export function EthicalFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-16 px-6 border-t border-border/20"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs md:text-sm text-muted-foreground/50 font-body leading-relaxed">
          🔒 A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </div>
    </motion.footer>
  );
}
