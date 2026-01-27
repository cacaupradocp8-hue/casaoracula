import { motion } from 'framer-motion';
import { Compass, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface TourSection {
  titulo: string;
  subtitulo?: string | null;
  descricao?: string | null;
}

interface Ferramenta {
  id: string;
  nome: string;
  descricao?: string | null;
  icone?: string | null;
  ordem: number;
}

interface FerramentasSectionProps {
  section?: TourSection;
  ferramentas: Ferramenta[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  },
};

export function FerramentasSection({ section, ferramentas }: FerramentasSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            {section?.titulo || 'Ferramentas Simbólicas'}
          </h2>
          {section?.subtitulo && (
            <p className="text-lg text-gold font-medium">
              {section.subtitulo}
            </p>
          )}
          {section?.descricao && (
            <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
              {section.descricao}
            </p>
          )}
        </motion.div>

        {/* Ferramentas Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {ferramentas.map((ferramenta) => (
            <motion.div key={ferramenta.id} variants={itemVariants}>
              <Card className="group h-full transition-all duration-300 hover:shadow-md hover:border-gold/30 cursor-default">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    {ferramenta.icone || '✨'}
                  </div>
                  <h3 className="font-medium text-foreground text-sm mb-1">
                    {ferramenta.nome}
                  </h3>
                  {ferramenta.descricao && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ferramenta.descricao}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Exclusivo</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA to Vitrine */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link 
            to="/ferramentas-vitrine"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors font-medium"
          >
            Ver todas as ferramentas
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            Explore a vitrine completa de recursos disponíveis na formação
          </p>
        </motion.div>
      </div>
    </section>
  );
}
