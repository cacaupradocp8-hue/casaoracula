import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  GraduationCap, 
  Compass, 
  CheckCircle2, 
  XCircle,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActiveMatricula {
  id: string;
  curso_id: string;
  data_inicio: string;
  data_fim: string | null;
  nome_curso?: string;
  tipo: 'mentoria' | 'formacao' | 'curso';
}

interface SubscriptionInfo {
  active: boolean;
  status: string | null;
  expiresAt: string | null;
}

export default function Jornada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matriculas, setMatriculas] = useState<ActiveMatricula[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({ active: false, status: null, expiresAt: null });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch active matriculas
        const { data: matriculasData } = await supabase
          .from('matriculas')
          .select('id, curso_id, data_inicio, data_fim')
          .eq('user_id', user.id)
          .eq('ativa', true);

        if (matriculasData) {
          const processed: ActiveMatricula[] = matriculasData.map(m => {
            let tipo: 'mentoria' | 'formacao' | 'curso' = 'curso';
            let nome = m.curso_id;
            
            if (m.curso_id.includes('mentoria')) {
              tipo = 'mentoria';
              nome = 'Mentoria Oracular';
            } else if (m.curso_id.includes('formacao')) {
              tipo = 'formacao';
              nome = 'Formação ORÁCULA';
            }
            
            return {
              ...m,
              tipo,
              nome_curso: nome
            };
          });
          setMatriculas(processed);
        }

        // Fetch subscription status from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, access_expires_at')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setSubscription({
            active: profile.subscription_status === 'active' || profile.subscription_status === 'trialing',
            status: profile.subscription_status,
            expiresAt: profile.access_expires_at
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const activeMentoria = matriculas.find(m => m.tipo === 'mentoria');
  const activeFormacao = matriculas.find(m => m.tipo === 'formacao');
  const otherCursos = matriculas.filter(m => m.tipo === 'curso');

  const hasAnyActive = activeMentoria || activeFormacao || subscription.active;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-gold font-display text-xl">Carregando seu caminho...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
            <User className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-foreground mb-2">
            Meu Caminho
          </h1>
          <p className="text-muted-foreground">
            Seu organizador pessoal na Casa ORÁCULA
          </p>
        </motion.div>

        {/* Empty State */}
        {!hasAnyActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 text-center py-12">
              <CardContent>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
                  <Compass className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-display text-foreground mb-3">
                  Sua jornada ainda não começou
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Você ainda não possui matrículas ou assinaturas ativas. 
                  Explore a Casa ORÁCULA para conhecer as possibilidades.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                  >
                    Conhecer a Casa
                  </Button>
                  <Button 
                    onClick={() => navigate('/salas')}
                    className="bg-gold hover:bg-gold/90 text-gold-foreground"
                  >
                    Explorar Formação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Active Content */}
        {hasAnyActive && (
          <div className="space-y-6">
            {/* Subscription Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`border-l-4 ${subscription.active ? 'border-l-emerald-500 bg-emerald-500/5' : 'border-l-border bg-card/50'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      {subscription.active ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                      Assinatura
                    </CardTitle>
                    <Badge variant={subscription.active ? 'default' : 'secondary'}>
                      {subscription.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {subscription.active ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Status: <span className="text-foreground capitalize">{subscription.status}</span>
                        </p>
                        {subscription.expiresAt && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            Válido até: {format(new Date(subscription.expiresAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate('/assinatura')}
                      >
                        Gerenciar
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Você não possui uma assinatura ativa no momento.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Mentoria */}
            {activeMentoria && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-purple-500 bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-pointer"
                      onClick={() => navigate('/mentoria-oracular')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <Compass className="w-5 h-5 text-purple-500" />
                        Mentoria Oracular
                      </CardTitle>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        Ativa
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Início: {format(new Date(activeMentoria.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        {activeMentoria.data_fim && (
                          <p className="text-sm text-muted-foreground">
                            Término: {format(new Date(activeMentoria.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Acessar <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Active Formação */}
            {activeFormacao && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-l-4 border-l-gold bg-gold/5 hover:bg-gold/10 transition-colors cursor-pointer"
                      onClick={() => navigate('/salas')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gold" />
                        Formação ORÁCULA
                      </CardTitle>
                      <Badge className="bg-gold/20 text-gold border-gold/30">
                        Ativa
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Início: {format(new Date(activeFormacao.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        {activeFormacao.data_fim && (
                          <p className="text-sm text-muted-foreground">
                            Término: {format(new Date(activeFormacao.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Continuar <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Other Active Courses */}
            {otherCursos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Separator className="my-6" />
                <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  Outros Cursos Ativos
                </h3>
                <div className="space-y-3">
                  {otherCursos.map((curso, index) => (
                    <Card key={curso.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors cursor-pointer">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{curso.nome_curso || curso.curso_id}</p>
                            <p className="text-sm text-muted-foreground">
                              Desde {format(new Date(curso.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Separator className="my-6" />
              <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                Acesso Rápido
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => navigate('/ferramentas')}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs">Ferramentas</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => navigate('/minhas-clientes')}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Clientes</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => navigate('/biblioteca')}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xs">Biblioteca</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => navigate('/salas')}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-xs">Formação</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
