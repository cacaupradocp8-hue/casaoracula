import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourSection {
  titulo: string;
  subtitulo?: string | null;
  descricao?: string | null;
}

interface CTASectionProps {
  section?: TourSection;
}

export function CTASection({ section }: CTASectionProps) {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-background to-background" />
      
      {/* Animated elements */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-gold/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-12 h-12 text-gold" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            {section?.titulo || 'Pronta para entrar?'}
          </h2>

          {section?.subtitulo && (
            <p className="text-xl text-gold font-medium mb-4">
              {section.subtitulo}
            </p>
          )}

          {section?.descricao && (
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {section.descricao}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/planos')}
              className="bg-gold hover:bg-gold/90 text-background font-semibold px-8"
            >
              Conhecer Planos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-gold/30 hover:bg-gold/10"
            >
              Criar Conta Gratuita
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
