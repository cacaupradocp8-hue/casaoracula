import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function PlanosFormacao() {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-36 border-t border-border/10 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-card/40 backdrop-blur-md border border-gold/15 p-12 md:p-20 rounded-[2rem] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/5 border border-gold/10 text-gold text-xs uppercase tracking-[0.2em] font-medium mb-10">
              <Sparkles className="w-3.5 h-3.5" />
              Próximo nível
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-8">
              As Rotas te ajudam a atravessar.<br />
              <span className="text-gold italic">A Formação te prepara para conduzir.</span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
              Se o seu chamado é acompanhar outras mulheres em jornadas de transformação com método, ética e profundidade, a Formação Orácula é o próximo passo.
            </p>

            <Button
              size="lg"
              onClick={() => navigate('/formacao-metodo')}
              className="bg-gold hover:bg-gold-light text-primary-foreground font-bold px-12 py-8 text-lg rounded-full shadow-xl shadow-gold/20 hover:scale-105 transition-all"
            >
              Conhecer a Formação
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
