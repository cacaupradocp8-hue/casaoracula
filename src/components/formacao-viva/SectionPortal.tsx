import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function SectionPortal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section 
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Deep dark background with subtle gradient */}
      <motion.div 
        style={{ opacity, scale }}
        className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,8%)] via-background to-background"
      />
      
      {/* Minimal vertical lines - Portas motif */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="flex gap-32">
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            className="w-px h-64 bg-gradient-to-b from-transparent via-gold/40 to-transparent origin-top"
          />
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
            className="w-px h-96 bg-gradient-to-b from-transparent via-gold/30 to-transparent origin-top"
          />
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, delay: 1.1, ease: "easeOut" }}
            className="w-px h-64 bg-gradient-to-b from-transparent via-gold/40 to-transparent origin-top"
          />
        </div>
      </div>

      {/* Portal content - minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="relative z-10 text-center px-6"
      >
        <span className="text-gold/40 text-3xl block mb-8">🜂</span>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground tracking-wider font-light">
          ORÁCULA
        </h1>
      </motion.div>

      {/* Subtle scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-gold/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
