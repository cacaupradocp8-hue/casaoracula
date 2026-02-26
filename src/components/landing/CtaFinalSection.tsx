import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function CtaFinalSection() {
  return (
    <section className="relative py-28 md:py-36 px-6 overflow-hidden bg-white/[0.01]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground leading-relaxed">
            A Casa se revela
            <br />
            <span className="text-gold-gradient font-semibold">passo a passo.</span>
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Se você chegou até aqui, a escuta já começou.
          </p>

          <div className="pt-4">
            <Link to="/auth">
              <Button variant="gold" size="xl" className="text-lg px-12 py-7 shadow-gold">
                Entrar na Casa ORÁCULA
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
