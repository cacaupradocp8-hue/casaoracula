import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, BookOpen, Moon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import mandalaHome from '@/assets/mandala-home.jpg';

/**
 * VisitorHomePage — Home imersiva para visitante/gratuito
 * Mesma qualidade visual da home de formação, adaptada ao contexto de entrada.
 */
export function VisitorHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const welcomeName = user?.name?.split(' ')[0] || 'Visitante';

  const quickLinks = [
    {
      title: 'Comece por Aqui',
      description: 'Um caminho. Sem ruído. Só direção.',
      action: 'Assistir e Começar',
      icon: Play,
      route: '/comece-aqui',
    },
    {
      title: 'Experiência Gratuita',
      description: 'Descubra seu eixo. Entenda sua estrutura.',
      action: 'Iniciar Experiência',
      icon: Sparkles,
      route: '/experiencia-gratuita',
    },
    {
      title: 'Habitar o Clube',
      description: 'Leitura vira competência. Portal vira prática.',
      action: 'Conhecer o Clube',
      icon: BookOpen,
      route: '/clube-livro',
    },
  ];

  const FRASES_VISITANTE = [
    "Você não entrou para consumir conteúdo — entrou para atravessar.",
    "A jornada não se apressou para você chegar.",
    "O primeiro passo é decidir olhar para dentro.",
    "Antes de compreender, é preciso estar presente."
  ];

  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const fraseAtual = FRASES_VISITANTE[weekNumber % FRASES_VISITANTE.length];

  return (
    <AppLayout>
      <div className="relative">
        {/* ═══ HERO SECTION — imersivo como o da formação ═══ */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Mandala de fundo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="w-[450px] h-[450px] md:w-[600px] md:h-[600px]"
            >
              <img src={mandalaHome} alt="" className="w-full h-full object-contain animate-ritual-breathe" />
            </motion.div>
          </div>

          {/* Halo central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

          {/* Conteúdo do hero */}
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            {/* Ícone ritualístico */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <div className="relative w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Moon className="w-7 h-7 text-gold" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border border-gold/20"
                />
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-3 leading-tight"
            >
              Bem-vinda, <span className="text-gold-gradient">{welcomeName}</span>
            </motion.h1>

            {/* Frase oracular */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-foreground/60 italic leading-relaxed text-lg md:text-xl font-display max-w-md mx-auto mb-10"
            >
              "{fraseAtual}"
            </motion.blockquote>

            {/* CTA principal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button
                variant="gold"
                size="xl"
                onClick={() => navigate('/experiencia-gratuita')}
                className="gap-2 px-8 py-6 text-lg shadow-gold"
              >
                Iniciar sua Travessia
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══ MANIFESTO ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative px-4 py-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-2xl bg-card/40 backdrop-blur-xl border border-gold/10 p-8 md:p-10 text-center">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-gold/10 via-transparent to-transparent pointer-events-none" />
              <div className="relative">
                <Sparkles className="w-5 h-5 text-gold/50 mx-auto mb-4" />
                <h2 className="font-display text-xl md:text-2xl text-foreground font-semibold mb-4">
                  "A Casa ORÁCULA não é um curso."
                </h2>
                <p className="text-foreground/60 leading-relaxed text-sm md:text-base max-w-lg mx-auto">
                  É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.
                  Aqui, a técnica não substitui a escuta. O símbolo não é ornamento — é linguagem.
                  E o portal não é metáfora — é prática.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══ QUICK NAVIGATION — 3 cards ═══ */}
        <section className="relative px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="space-y-4"
            >
              {quickLinks.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.route}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
                  >
                    <Card className="glass border-border/30 hover:border-gold/25 transition-all duration-300 cursor-pointer group" onClick={() => navigate(card.route)}>
                      <CardContent className="p-6 md:p-8">
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 group-hover:border-gold/30 transition-all">
                            <Icon className="w-6 h-6 text-gold/70 group-hover:text-gold transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                              {card.title}
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {card.description}
                            </p>
                            <Button
                              variant="gold"
                              size="sm"
                              className="gap-2"
                              tabIndex={-1}
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
            </motion.div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>
    </AppLayout>
  );
}
