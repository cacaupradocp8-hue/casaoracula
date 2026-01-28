import { motion } from "framer-motion";

interface SilencioVisualProps {
  texto?: string;
}

export function SilencioVisual({ texto = "Algumas travessias começam no silêncio." }: SilencioVisualProps) {
  return (
    <section className="min-h-[50vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="text-center"
      >
        <p className="font-display text-xl md:text-2xl text-muted-foreground/70 italic tracking-wide">
          {texto}
        </p>
      </motion.div>
    </section>
  );
}
