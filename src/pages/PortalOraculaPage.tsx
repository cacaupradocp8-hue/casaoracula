import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { FormationMapTrigger } from '@/components/formation-map';
import { cn } from '@/lib/utils';

interface FormacaoPortal {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  portal_minimo: string;
  publicado: boolean;
  desbloqueado: boolean;
  progresso: number;
}

export default function PortalOraculaPage() {
  const [portais, setPortais] = useState<FormacaoPortal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortais();
  }, [user]);

  const fetchPortais = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: travessias, error } = await supabase
        .from('conteudo_travessias')
        .select('*')
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      if (error) throw error;

      const portaisData: FormacaoPortal[] = (travessias || []).map((t, index) => ({
        id: t.id,
        titulo: t.titulo,
        descricao: t.descricao || '',
        ordem: t.ordem,
        portal_minimo: t.portal_minimo,
        publicado: t.publicado,
        desbloqueado: index === 0,
        progresso: index === 0 ? 35 : 0,
      }));

      setPortais(portaisData);
    } catch (error) {
      console.error('Erro ao carregar portais:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os portais da formação.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-gold/60">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Hero header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
            <GraduationCap className="w-6 h-6 text-gold" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-foreground tracking-wide font-light">
            Formação Orácula
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Jornada iniciática profunda — cada portal é uma travessia que prepara 
            para a próxima. Não há atalhos.
          </p>

          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        <div className="space-y-8">
          {/* Conexão com Casa das Tecelãs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-gold/15 bg-gradient-to-r from-gold/5 via-card to-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <p className="text-sm text-foreground/80">
                      A <span className="text-gold font-medium">Casa das Tecelãs</span> permanece 
                      ativa durante toda sua jornada de formação.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/casa')} className="border-gold/20 text-gold hover:bg-gold/10">
                    Visitar Casa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grid de Portais */}
          <div className="grid gap-5">
            {portais.map((portal, index) => (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card 
                  className={cn(
                    'relative overflow-hidden transition-all duration-500',
                    portal.desbloqueado 
                      ? 'border-gold/20 hover:border-gold/40 hover:shadow-[0_8px_40px_-12px_hsl(var(--gold)/0.15)]' 
                      : 'border-border/30 opacity-60'
                  )}
                >
                  {/* Subtle gradient accent for unlocked */}
                  {portal.desbloqueado && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Portal number */}
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-display text-lg',
                          portal.desbloqueado 
                            ? 'bg-gradient-to-br from-gold/20 to-gold/5 text-gold border border-gold/20'
                            : 'bg-muted/50 text-muted-foreground border border-border/30'
                        )}>
                          {portal.desbloqueado ? (
                            portal.progresso === 100 ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <span>{portal.ordem}</span>
                            )
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-display tracking-wide">
                            {portal.titulo}
                          </CardTitle>
                          <CardDescription className="mt-1.5 leading-relaxed">
                            {portal.descricao}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={portal.desbloqueado ? 'default' : 'secondary'}
                        className={cn(
                          'shrink-0',
                          portal.desbloqueado && portal.progresso < 100 && 'bg-gold/20 text-gold border-gold/30 hover:bg-gold/30'
                        )}
                      >
                        {portal.desbloqueado 
                          ? portal.progresso === 100 ? 'Concluído' : 'Em andamento'
                          : 'Bloqueado'
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {portal.desbloqueado && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2.5">
                            <span className="text-muted-foreground text-xs tracking-wide uppercase">Progresso</span>
                            <span className="text-gold font-mono text-sm">{portal.progresso}%</span>
                          </div>
                          <div className="relative h-2 rounded-full bg-muted/50 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${portal.progresso}%` }}
                              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/80 to-gold/50"
                            />
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full border-gold/20 text-foreground hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all duration-300"
                          onClick={() => navigate(`/portal/${portal.id}`)}
                        >
                          Continuar Jornada
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}

            {portais.length === 0 && (
              <Card className="border-border/20">
                <CardContent className="py-16 text-center">
                  <BookOpen className="w-10 h-10 mx-auto text-gold/30 mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Os portais de formação estão sendo preparados.
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    Você será notificada quando estiverem disponíveis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Princípios da Formação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-border/20 overflow-hidden relative">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
              
              <CardHeader>
                <CardTitle className="text-base font-display tracking-wide flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400/80" />
                  Princípios da Formação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: 'Formação Profunda', desc: 'Portais de treinamento avançado para domínio das ferramentas oraculares.' },
                    { title: 'Progressão Estruturada', desc: 'Cada portal prepara para o próximo. Não há atalhos.' },
                    { title: 'Certificação Futura', desc: 'A conclusão da formação é pré-requisito para certificação.' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2 relative pl-4 border-l border-border/30">
                      <p className="font-display text-sm text-foreground tracking-wide">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <FormationMapTrigger />
    </AppLayout>
  );
}
