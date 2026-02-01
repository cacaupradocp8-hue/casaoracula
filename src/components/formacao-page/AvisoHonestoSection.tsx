import { motion } from "framer-motion";

export function AvisoHonestoSection() {
  const naoParaVoce = [
    "técnicas rápidas",
    "certificações vazias",
    "espiritualidade performática",
    "ou mais um método para 'aplicar em clientes'"
  ];

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
            ✦ Um aviso honesto antes de entrar
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <p className="font-body text-foreground/70 text-lg text-center mb-8">
            Se você procura:
          </p>
          
          <ul className="space-y-3 max-w-md mx-auto">
            {naoParaVoce.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 text-foreground/50 font-body"
              >
                <span className="text-gold/40">—</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <p className="font-display text-2xl md:text-3xl text-gold/80 italic mb-8">
            Esta casa não é para você.
          </p>
          
          <div className="h-px w-24 bg-gold/20 mx-auto mb-8" />
          
          <p className="font-body text-foreground/80 text-lg leading-relaxed mb-6">
            A ORÁCULA forma mulheres que sustentam processos humanos<br className="hidden md:block" />
            com leitura simbólica, responsabilidade psíquica e método.
          </p>
          
          <p className="font-body text-foreground/60 text-base italic">
            Aqui, ninguém "canaliza" sem estrutura.<br />
            Ninguém conduz sem atravessar.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
