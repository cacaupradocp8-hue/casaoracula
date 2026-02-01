import { motion } from "framer-motion";

interface FormacaoDividerProps {
  symbol?: string;
}

export function FormacaoDivider({ symbol = "✦" }: FormacaoDividerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center gap-6 py-16 md:py-24"
    >
      <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent to-gold/30" />
      <span className="text-gold/50 text-lg md:text-xl">{symbol}</span>
      <div className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent to-gold/30" />
    </motion.div>
  );
}
