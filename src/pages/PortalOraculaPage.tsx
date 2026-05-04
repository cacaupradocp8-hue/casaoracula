import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, Lock, CheckCircle2, ArrowRight,
  Sparkles, BookOpen, Users, Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { FormationMapTrigger } from '@/components/formation-map';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

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
    if (!user) { setIsLoading(false); return; }
    try {
      const { data: travessias, error } = await supabase
        .from('conteudo_travessias')
        .select('*')
        .eq('publicado', true)
        .order('ordem', { ascending: true });
      if (error) throw error;

      const portaisData: FormacaoPortal[] = (travessias || []).map((t, index) => ({
        id: t.id, titulo: t.titulo, descricao: t.descricao || '',
        ordem: t.ordem, portal_minimo: t.portal_minimo,
        publicado: t.publicado, desbloqueado: index === 0,
        progresso: index === 0 ? 35 : 0,
      }));
      setPortais(portaisData);
    } catch (error) {
      console.error('Erro ao carregar portais:', error);
      toast({ title: 'Erro ao carregar dados', description: 'Não foi possível carregar os portais da formação.', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-gold/60">Carregando...</div>
      </ResponsiveContainer>
    </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ResponsiveContainer size="narrow" className="py-12 pb-24">
        {/* Hero — Grand header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 space-y-6 relative"
        >
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

          <div className="flex items-center justify-center gap-4 relative">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
              <GraduationCap className="w-7 h-7 text-gold" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-wide font-light">
            Formação Orácula
          </h1>
          <p className="text-foreground/60 text-base max-w-md mx-auto leading-relaxed font-body">
            Jornada iniciática profunda — cada portal é uma travessia que prepara 
            para a próxima. Não há atalhos.
          </p>

          <div className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        <div className="space-y-10">
          {/* Casa das Tecelãs link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="rounded-xl border border-gold/15 bg-gradient-to-r from-gold/5 via-card/80 to-card/80 backdrop-blur-sm p-5">
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
            </div>
          </motion.div>

          {/* Portal cards — dramatic timeline style */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-border/20 to-transparent hidden md:block" />

            <div className="space-y-6">
              {portais.map((portal, index) => (
                <motion.div
                  key={portal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="relative md:pl-16"
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    'hidden md:flex absolute left-3 top-8 w-7 h-7 rounded-full items-center justify-center z-10',
                    portal.desbloqueado 
                      ? 'bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 shadow-[0_0_20px_-4px_hsl(var(--gold)/0.3)]'
                      : 'bg-muted/50 border border-border/30'
                  )}>
                    {portal.desbloqueado ? (
                      portal.progresso === 100 
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        : <Star className="w-3 h-3 text-gold" />
                    ) : (
                      <Lock className="w-3 h-3 text-muted-foreground/50" />
                    )}
                  </div>

                  <Card className={cn(
                    'relative overflow-hidden transition-all duration-700 rounded-2xl',
                    portal.desbloqueado 
                      ? 'border-border/15 hover:border-gold/30 hover:shadow-[0_12px_50px_-16px_hsl(var(--gold)/0.2)] bg-card/80'
                      : 'border-border/10 opacity-50 bg-card/40'
                  )}>
                    {/* Top gold accent */}
                    {portal.desbloqueado && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    )}

                    <CardContent className="p-7 md:p-8">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              'font-display text-3xl font-light',
                              portal.desbloqueado ? 'text-gold/60' : 'text-muted-foreground/30'
                            )}>
                              {portal.ordem.toString().padStart(2, '0')}
                            </span>
                            <h2 className="font-display text-xl md:text-2xl text-foreground tracking-wide">
                              {portal.titulo}
                            </h2>
                          </div>
                          <p className="text-foreground/50 text-sm leading-relaxed max-w-lg font-body">
                            {portal.descricao}
                          </p>
                        </div>
                        
                        <Badge 
                          variant={portal.desbloqueado ? 'default' : 'secondary'}
                          className={cn(
                            'shrink-0 text-[10px] uppercase tracking-widest',
                            portal.desbloqueado && portal.progresso < 100 && 'bg-gold/15 text-gold border-gold/20 hover:bg-gold/25'
                          )}
                        >
                          {portal.desbloqueado 
                            ? portal.progresso === 100 ? 'Concluído' : 'Em andamento'
                            : 'Bloqueado'}
                        </Badge>
                      </div>

                      {portal.desbloqueado && (
                        <div className="space-y-5 pt-4 border-t border-border/10">
                          {/* Progress bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-3">
                              <span className="text-muted-foreground/60 uppercase tracking-widest">Progresso</span>
                              <span className="text-gold font-mono">{portal.progresso}%</span>
                            </div>
                            <div className="relative h-1.5 rounded-full bg-muted/30 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${portal.progresso}%` }}
                                transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold to-gold/40"
                              />
                              {/* Glow effect */}
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${portal.progresso}%` }}
                                transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold to-gold/40 blur-sm opacity-50"
                              />
                            </div>
                          </div>

                          <Button 
                            variant="outline" 
                            className="w-full border-gold/15 text-foreground hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all duration-500 rounded-xl"
                            onClick={() => navigate(`/portal/${portal.id}`)}
                          >
                            Continuar Jornada
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {portais.length === 0 && (
                <div className="text-center py-20 space-y-4">
                  <BookOpen className="w-10 h-10 mx-auto text-gold/20" />
                  <p className="text-muted-foreground text-sm">Os portais de formação estão sendo preparados.</p>
                  <p className="text-xs text-muted-foreground/40">Você será notificada quando estiverem disponíveis.</p>
                </div>
              )}
            </div>
          </div>

          {/* Princípios — elevated card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="rounded-2xl border border-border/10 bg-gradient-to-br from-card/80 via-card/60 to-secondary/30 overflow-hidden relative p-8 md:p-10">
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

              <div className="flex items-center gap-3 mb-8">
                <Users className="w-5 h-5 text-accent" />
                <h3 className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Princípios da Formação</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: 'Formação Profunda', desc: 'Portais de treinamento avançado para domínio das ferramentas oraculares.' },
                  { title: 'Progressão Estruturada', desc: 'Cada portal prepara para o próximo. Não há atalhos.' },
                  { title: 'Certificação Futura', desc: 'A conclusão da formação é pré-requisito para certificação.' },
                ].map((item, i) => (
                  <div key={i} className="space-y-3 relative">
                    <div className="w-8 h-px bg-gradient-to-r from-accent/40 to-transparent" />
                    <p className="font-display text-base text-foreground tracking-wide">{item.title}</p>
                    <p className="text-sm text-foreground/50 leading-relaxed font-body">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <FormationMapTrigger />
    </AppLayout>
  );
}
