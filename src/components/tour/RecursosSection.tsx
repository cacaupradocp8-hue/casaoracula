import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Bot, 
  Users, 
  Video, 
  Sparkles, 
  Heart,
  Library,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TourSection {
  titulo: string;
  subtitulo?: string | null;
  descricao?: string | null;
}

interface RecursosSectionProps {
  section?: TourSection;
}

const recursos = [
  {
    icon: Library,
    title: 'Biblioteca das Travessias',
    description: 'Acervo de conteúdos profundos sobre simbolismo, psique e cura.',
  },
  {
    icon: Bot,
    title: 'Agentes de IA',
    description: 'Assistentes simbólicos treinados para apoiar sua jornada.',
  },
  {
    icon: Users,
    title: 'Sala de Sessão',
    description: 'Espaço profissional para conduzir atendimentos clínicos.',
  },
  {
    icon: Video,
    title: 'Mentoria ao Vivo',
    description: 'Encontros com mentoras para supervisão e aprofundamento.',
  },
  {
    icon: MessageCircle,
    title: 'Círculo da Casa',
    description: 'Comunidade de profissionais para troca e sustentação.',
  },
  {
    icon: Heart,
    title: 'Cursos & Formações',
    description: 'Trilhas completas de formação simbólica e clínica.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

export function RecursosSection({ section }: RecursosSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
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
            <Sparkles className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            {section?.titulo || 'Recursos Exclusivos'}
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

        {/* Recursos Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {recursos.map((recurso, index) => {
            const Icon = recurso.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full group hover:border-gold/30 transition-colors">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {recurso.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {recurso.description}
                      </p>
                    </div>
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
