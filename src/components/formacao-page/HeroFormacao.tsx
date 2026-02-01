import { motion } from "framer-motion";
import heroImage from "@/assets/formacao/hero-oracula.png";

export function HeroFormacao() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span className="text-gold/70 text-sm md:text-base tracking-[0.3em] uppercase font-body mb-6 block">
            🌑
          </span>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 tracking-tight">
            CASA <span className="text-gold">ORÁCULA</span>
          </h1>
          
          <p className="font-display text-xl md:text-2xl lg:text-3xl text-foreground/80 italic mb-12">
            Formação Iniciática em Terapia Arquetípica
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <p className="font-body text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            Isto não é um curso.
          </p>
          <p className="font-body text-muted-foreground text-base md:text-lg leading-relaxed">
            É um território de formação simbólica, ética e estruturada<br />
            para mulheres que não podem mais improvisar profundidade.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
