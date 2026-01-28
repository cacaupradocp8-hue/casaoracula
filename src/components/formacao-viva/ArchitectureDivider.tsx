import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type DividerType = "porta" | "labirinto" | "torre";

interface ArchitectureDividerProps {
  type?: DividerType;
  symbol?: string;
  className?: string;
}

export function ArchitectureDivider({ type = "porta", symbol, className }: ArchitectureDividerProps) {
  const symbols: Record<DividerType, string> = {
    porta: "🜂",
    labirinto: "🌑",
    torre: "🜁"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={cn("flex items-center justify-center py-20 md:py-32", className)}
    >
      <div className="flex items-center gap-8">
        <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-gold/20" />
        <span className="text-gold/40 text-2xl select-none">
          {symbol || symbols[type]}
        </span>
        <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-gold/20" />
      </div>
    </motion.div>
  );
}
