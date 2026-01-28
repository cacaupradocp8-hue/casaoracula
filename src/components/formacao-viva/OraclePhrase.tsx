import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OraclePhraseProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function OraclePhrase({ children, className, delay = 0 }: OraclePhraseProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      className={cn(
        "font-display text-xl md:text-2xl lg:text-3xl text-foreground/90 italic tracking-wide leading-relaxed text-center",
        className
      )}
    >
      {children}
    </motion.p>
  );
}
