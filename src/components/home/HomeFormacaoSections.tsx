import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, FlaskConical, Users, ArrowRight, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  userId: string;
}

export function HomeFormacaoSections({ userId }: Props) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({ travessias: 0, rituals: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('v_formation_progress')
          .select('completed_travessias, completed_rituals')
          .eq('user_id', userId)
          .limit(1);

        if (data && data[0]) {
          const t = Number(data[0].completed_travessias) || 0;
          const r = Number(data[0].completed_rituals) || 0;
          const estimatedTotal = Math.max(t + r, 1);
          setProgress({ travessias: t, rituals: r, total: Math.min(Math.round((estimatedTotal / 20) * 100), 100) });
        }
      } catch (e) {
        console.error('Error loading formation progress:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
  };

  return (
    <section className="px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progresso do curso */}
        <motion.div {...fadeUp}>
          <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-display">
                <BookOpen className="h-5 w-5 text-primary" />
                Seu progresso na Formação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 animate-pulse bg-muted rounded" />
              ) : (
                <div className="space-y-3">
                  <Progress value={progress.total} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.travessias} travessias concluídas</span>
                    <span>{progress.total}% completo</span>
                  </div>
                  <Button
                    variant="gold"
                    size="sm"
                    className="mt-2 gap-2"
                    onClick={() => navigate('/oracula')}
                  >
                    <Play className="h-4 w-4" />
                    Continuar aula
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid de ações */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              className="border-border/30 bg-card/50 cursor-pointer group hover:border-primary/30 transition-all"
              onClick={() => navigate('/ferramentas')}
            >
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <FlaskConical className="h-6 w-6 text-primary/70 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground/80">Exercícios práticos</p>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  Acessar <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-border/30 bg-card/50 cursor-pointer group hover:border-primary/30 transition-all"
              onClick={() => navigate('/comunidade')}
            >
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <Users className="h-6 w-6 text-primary/70 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground/80">Discussões da formação</p>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  Participar <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-border/30 bg-card/50 cursor-pointer group hover:border-primary/30 transition-all"
              onClick={() => navigate('/sala-treinamento')}
            >
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <Compass className="h-6 w-6 text-primary/70 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground/80">Sala de Treinamento</p>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  Acessar <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
