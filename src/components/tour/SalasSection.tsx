import { motion } from 'framer-motion';
import { Lock, Unlock, DoorOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TourSection {
  titulo: string;
  subtitulo?: string | null;
  descricao?: string | null;
}

interface Sala {
  id: string;
  nome: string;
  descricao: string;
  icone?: string | null;
  nivel_minimo: string;
}

interface SalasSectionProps {
  section?: TourSection;
  salas: Sala[];
}

const getNivelLabel = (nivel: string) => {
  const labels: Record<string, { label: string; locked: boolean }> = {
    'NIVEL_0': { label: 'Acesso livre', locked: false },
    'NIVEL_1': { label: 'Mentorada+', locked: true },
    'NIVEL_2': { label: 'Assinante+', locked: true },
    'NIVEL_3': { label: 'Admin', locked: true },
  };
  return labels[nivel] || { label: 'Restrito', locked: true };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  },
};

export function SalasSection({ section, salas }: SalasSectionProps) {
  return (
    <section className="py-20 px-4 bg-muted/20">
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
            <DoorOpen className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            {section?.titulo || 'Os Cômodos da Casa'}
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

        {/* Salas Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {salas.map((sala) => {
            const { label, locked } = getNivelLabel(sala.nivel_minimo);
            
            return (
              <motion.div key={sala.id} variants={cardVariants}>
                <Card className={`h-full transition-all duration-300 hover:shadow-lg ${locked ? 'opacity-80' : 'border-gold/30'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${locked ? 'bg-muted' : 'bg-gold/20'}`}>
                          {sala.icone || '🏠'}
                        </div>
                        <CardTitle className="text-lg">{sala.nome}</CardTitle>
                      </div>
                      {locked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Unlock className="w-5 h-5 text-gold" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {sala.descricao}
                    </p>
                    <Badge variant={locked ? 'secondary' : 'default'} className={!locked ? 'bg-gold/20 text-gold border-gold/30' : ''}>
                      {label}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
