import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Circle, Loader2, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCopy } from '@/hooks/useCopy';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

// --- Ferramentas types & helpers (moved from VisitorSalaContent) ---

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  icone: string | null;
  rota: string;
  ordem: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wrench: LucideIcons.Wrench,
  brain: LucideIcons.Brain,
  compass: LucideIcons.Compass,
  helpCircle: LucideIcons.HelpCircle,
  book: LucideIcons.Book,
  bookOpen: LucideIcons.BookOpen,
  star: LucideIcons.Star,
  heart: LucideIcons.Heart,
  sparkles: LucideIcons.Sparkles,
  lightbulb: LucideIcons.Lightbulb,
  target: LucideIcons.Target,
  users: LucideIcons.Users,
  messageCircle: LucideIcons.MessageCircle,
  messageCircleQuestion: LucideIcons.MessageCircleQuestion,
  pencil: LucideIcons.Pencil,
  clipboardList: LucideIcons.ClipboardList,
  map: LucideIcons.Map,
  eye: LucideIcons.Eye,
};

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = iconMap[name] || LucideIcons.Wrench;
  return <IconComponent className={className} />;
};

const colorPalette = [
  { bg: 'from-purple-500/10', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/50', iconBg: 'bg-purple-500/20', iconHover: 'group-hover:bg-purple-500/30', text: 'text-purple-400', btnBorder: 'border-purple-500/30', btnHover: 'hover:bg-purple-500/10' },
  { bg: 'from-blue-500/10', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/50', iconBg: 'bg-blue-500/20', iconHover: 'group-hover:bg-blue-500/30', text: 'text-blue-400', btnBorder: 'border-blue-500/30', btnHover: 'hover:bg-blue-500/10' },
  { bg: 'from-emerald-500/10', border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/50', iconBg: 'bg-emerald-500/20', iconHover: 'group-hover:bg-emerald-500/30', text: 'text-emerald-400', btnBorder: 'border-emerald-500/30', btnHover: 'hover:bg-emerald-500/10' },
  { bg: 'from-amber-500/10', border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-500/50', iconBg: 'bg-amber-500/20', iconHover: 'group-hover:bg-amber-500/30', text: 'text-amber-400', btnBorder: 'border-amber-500/30', btnHover: 'hover:bg-amber-500/10' },
];

// --- Steps fixos ---

interface StepStatus {
  quiz: 'pendente' | 'andamento' | 'concluido';
  big5: 'pendente' | 'andamento' | 'concluido';
  travessia: 'pendente' | 'andamento' | 'concluido';
  aula: 'pendente' | 'andamento' | 'concluido';
  clube: 'pendente' | 'andamento' | 'concluido';
}

const STEPS = [
  {
    key: 'quiz' as const,
    num: 1,
    title: 'Descubra seu Eixo',
    description: 'Responda ao Quiz da Voz e comece a se escutar.',
    route: '/salas/big5',
  },
  {
    key: 'big5' as const,
    num: 2,
    title: 'Entenda sua Estrutura',
    description: 'Mapeie seus cinco territórios com o Big5 Simbólico.',
    route: '/ferramenta/big5-simbolico',
  },
  {
    key: 'travessia' as const,
    num: 3,
    title: 'Viva a Travessia',
    description: 'Sete dias de prática guiada para habitar a Casa.',
    route: '/travessias',
  },
  {
    key: 'aula' as const,
    num: 4,
    title: 'Aula: Habitar a Casa',
    description: 'Uma aula sobre o que significa estar aqui.',
    route: '/cursos',
  },
  {
    key: 'clube' as const,
    num: 5,
    title: 'Convite para o Clube',
    description: 'Conheça o Clube de Leitura Simbólica e continue.',
    route: '/clube-livro',
  },
];

export default function ExperienciaGratuita() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();

  const [status, setStatus] = useState<StepStatus>({
    quiz: 'pendente',
    big5: 'pendente',
    travessia: 'pendente',
    aula: 'pendente',
    clube: 'pendente',
  });
  const [loading, setLoading] = useState(true);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [ferramentasLoading, setFerramentasLoading] = useState(true);

  // Load step progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const { data: quizData } = await supabase
          .from('big5_registros')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        const { data: big5Data } = await supabase
          .from('big5_symbolic_registros')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        setStatus({
          quiz: quizData && quizData.length > 0 ? 'concluido' : 'pendente',
          big5: big5Data && big5Data.length > 0 ? 'concluido' : 'pendente',
          travessia: 'pendente',
          aula: 'pendente',
          clube: 'pendente',
        });
      } catch (e) {
        console.error('Error loading progress:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user]);

  // Load ferramentas from database
  useEffect(() => {
    const fetchFerramentas = async () => {
      try {
        const { data: sala } = await supabase
          .from('salas')
          .select('id')
          .eq('nivel_minimo', 'NIVEL_0')
          .eq('ativa', true)
          .maybeSingle();

        if (sala) {
          const { data: ferramentasData } = await supabase
            .from('sala_ferramentas')
            .select('id, ferramenta_nome, ferramenta_descricao, icone, rota, ordem')
            .eq('sala_id', sala.id)
            .eq('ativa', true)
            .order('ordem');

          setFerramentas(ferramentasData || []);
        }
      } catch (error) {
        console.error('Error fetching ferramentas:', error);
      } finally {
        setFerramentasLoading(false);
      }
    };
    fetchFerramentas();
  }, []);

  const getStatusIcon = (s: string) => {
    if (s === 'concluido') return <Check className="w-5 h-5 text-emerald-400" />;
    if (s === 'andamento') return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    return <Circle className="w-5 h-5 text-muted-foreground/30" />;
  };

  const getStatusLabel = (s: string) => {
    if (s === 'concluido') return 'Concluído';
    if (s === 'andamento') return 'Em andamento';
    return 'Não iniciado';
  };

  const getActionLabel = (s: string) => {
    if (s === 'concluido') return 'Revisitar';
    if (s === 'andamento') return 'Continuar';
    return 'Começar';
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Experiência Gratuita
          </h1>
          <p className="text-muted-foreground">
            Siga o caminho abaixo, uma etapa por vez.
          </p>
        </motion.div>

        {/* Ferramentas da Sala (vindas do banco) */}
        {ferramentasLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        ) : ferramentas.length > 0 && (
          <div className="space-y-4 mb-10">
            {ferramentas.map((ferramenta, index) => {
              const colors = colorPalette[index % colorPalette.length];
              const stepLabel = index === 0 ? 'Primeiro Passo' : index === 1 ? 'Segundo Passo' : `Passo ${index + 1}`;
              
              return (
                <motion.div
                  key={ferramenta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card 
                    className={`bg-gradient-to-br ${colors.bg} via-card to-card ${colors.border} ${colors.hoverBorder} transition-colors cursor-pointer group`}
                    onClick={() => navigate(ferramenta.rota)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0 ${colors.iconHover} transition-colors`}>
                          <DynamicIcon name={ferramenta.icone || 'wrench'} className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div className="flex-1">
                          <span className={`text-xs font-medium ${colors.text} uppercase tracking-wider`}>
                            {stepLabel}
                          </span>
                          <h3 className="font-display text-lg text-foreground mt-1 mb-2">
                            {ferramenta.ferramenta_nome}
                          </h3>
                          {ferramenta.ferramenta_descricao && (
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {ferramenta.ferramenta_descricao}
                            </p>
                          )}
                          <Button
                            variant="outline"
                            className={`gap-2 ${colors.btnBorder} ${colors.text} ${colors.btnHover}`}
                          >
                            Acessar
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Convite Travessia Zero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ferramentas.length * 0.1, duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-gold/5 via-card to-card border-gold/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gold uppercase tracking-wider">
                        Travessia Zero
                      </span>
                      <h3 className="font-display text-lg text-foreground mt-1 mb-2">
                        {getCopyByKey('travessia_zero_titulo', 'Onde estou antes de tentar mudar?')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {getCopyByKey('travessia_zero_descricao',
                          'Uma jornada de 7 dias para mapear seu ponto de partida. Sem fórmulas. Sem promessas. Apenas clareza sobre onde você está agora.'
                        )}
                      </p>
                      <Button
                        variant="gold"
                        onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
                        className="gap-2"
                      >
                        Iniciar Travessia 00
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Etapas da Jornada */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-primary/10" />
            <div className="space-y-4">
              {STEPS.map((step, idx) => {
                const stepStatus = status[step.key];
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (ferramentas.length * 0.1) + 0.2 + (idx * 0.1) }}
                  >
                    <Card className={cn(
                      'border-primary/10 transition-all duration-300',
                      stepStatus === 'concluido' && 'border-emerald-500/20 bg-emerald-500/5',
                    )}>
                      <CardContent className="p-5 md:p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative z-10 flex flex-col items-center gap-1">
                            <div className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center text-lg font-display font-bold border-2',
                              stepStatus === 'concluido'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-card border-primary/15 text-muted-foreground',
                            )}>
                              {step.num}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display text-lg font-semibold text-foreground">
                                {step.title}
                              </h3>
                              {getStatusIcon(stepStatus)}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                              {step.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <Button
                                variant={stepStatus === 'concluido' ? 'outline' : 'gold'}
                                size="sm"
                                onClick={() => navigate(step.route)}
                                className="gap-2"
                              >
                                {getActionLabel(stepStatus)}
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                              <span className="text-xs text-muted-foreground/60">
                                {getStatusLabel(stepStatus)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
