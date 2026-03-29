import { motion } from 'framer-motion';

export function PlanosExplicacao() {
  return (
    <section className="py-16 md:py-24 border-t border-border/10">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-6">
            Sua mente é um sistema.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Ela tem uma arquitetura interna — distritos, padrões, forças e sombras que operam
            mesmo quando você não vê. Conhecer esse sistema não é luxo: é a base de qualquer
            transformação real.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A <span className="text-gold font-medium">CidaDELA Interior</span> é o mapa que
            organiza esse sistema. E o Clube é a chave que abre esse mapa para você — com
            leituras guiadas, conteúdos recorrentes e uma jornada de aprofundamento contínuo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
