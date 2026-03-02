import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, BookOpen } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * VisitorHomePage — Home para visitante/gratuito
 * 
 * 3 cards grandes, 1 mensagem, nada mais.
 */
export function VisitorHomePage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Comece por Aqui',
      description: 'Um caminho. Sem ruído. Só direção.',
      action: 'Assistir e Começar',
      icon: Play,
      route: '/comece-aqui',
      delay: 0.3,
    },
    {
      title: 'Experiência Gratuita',
      description: 'Descubra seu eixo. Entenda sua estrutura. Viva a travessia.',
      action: 'Iniciar Experiência',
      icon: Sparkles,
      route: '/experiencia-gratuita',
      delay: 0.45,
    },
    {
      title: 'Habitar o Clube',
      description: 'Leitura vira competência. Portal vira prática.',
      action: 'Conhecer o Clube',
      icon: BookOpen,
      route: '/clube-livro',
      delay: 0.6,
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto">
        {/* Mensagem fixa */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Bem-vinda à Casa.
          </h1>
          <p className="text-muted-foreground text-lg">
            Comece pelo caminho abaixo.
          </p>
        </motion.div>

        {/* 3 Cards grandes */}
        <div className="w-full space-y-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.route}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay, duration: 0.5 }}
              >
                <Card className="glass border-primary/10 hover:border-primary/25 transition-all duration-300">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                          {card.title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {card.description}
                        </p>
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => navigate(card.route)}
                          className="gap-2"
                        >
                          {card.action}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
