import { motion } from 'framer-motion';

export function NarroterapiaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gold/60 text-sm tracking-widest uppercase mb-12"
        >
          Narroterapia (com rigor)
        </motion.p>

        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-foreground/90 text-lg leading-relaxed"
          >
            Na ORÁCULA, a Narroterapia não é contação de histórias.
            <br />
            É estrutura clínica-narrativa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3 py-4"
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              Narrativas organizam identidade.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Contos operam como dispositivos simbólicos precisos.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A escuta reconhece arquétipos, rupturas e ciclos.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A intervenção respeita tempo, limite e ética.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 p-6 border-l-2 border-gold/30 bg-gold/5"
          >
            <p className="text-foreground/90 italic">
              O conto não cura.
            </p>
            <p className="text-foreground/90 italic">
              Ele abre um campo —
            </p>
            <p className="text-foreground/90 italic">
              e o campo exige estrutura.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
