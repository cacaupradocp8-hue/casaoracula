import { motion } from 'framer-motion';
import { Compass, Map, Layers, FlaskConical } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const ferramentas = [
  { icon: Map, titulo: 'Mapa da CidaDELA', texto: 'Representação visual da psique — navegação terapêutica pelos territórios internos.' },
  { icon: Compass, titulo: 'Oráculo das Portas', texto: 'Leitura oracular das portas ativas com orientações para a travessia.' },
  { icon: FlaskConical, titulo: 'Jardim da Psique', texto: 'Espaço de cultivo simbólico e auto-observação diária.' },
  { icon: Layers, titulo: 'Atlas Arquetípico', texto: 'Cartografia dos arquétipos femininos e seus campos de atuação.' },
];

export function MetodoCasaMaquinas() {
  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-16 md:py-24">
      <p className="text-gold/50 text-xs uppercase tracking-[0.3em] text-center mb-4">Tecnologia simbólica</p>
      <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4 text-center tracking-wide">
        Casa das Máquinas
      </h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Ferramentas exclusivas integradas ao sistema — criadas para sustentar processos, não para improvisar.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {ferramentas.map((item, i) => (
          <motion.div
            key={item.titulo}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex gap-4 p-6 border border-border/50 rounded-lg bg-card/20 hover:border-gold/15 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-gold/70" />
            </div>
            <div>
              <h3 className="font-display text-foreground mb-1">{item.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.texto}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
