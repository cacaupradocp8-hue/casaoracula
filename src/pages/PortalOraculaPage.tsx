import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
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

/**
 * PortalOraculaPage — Portal Interno da Formação Orácula
 * 
 * Área restrita para alunas matriculadas.
 * Exibe portais de formação, progresso e recursos.
 * 
 * NOVO COMPONENTE - Sem herança de componentes anteriores.
 */

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
      // Busca portais/travessias da formação
      const { data: travessias, error } = await supabase
        .from('conteudo_travessias')
        .select('*')
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      if (error) throw error;

      // Transforma para formato de portais com progresso mock
      const portaisData: FormacaoPortal[] = (travessias || []).map((t, index) => ({
        id: t.id,
        titulo: t.titulo,
        descricao: t.descricao || '',
        ordem: t.ordem,
        portal_minimo: t.portal_minimo,
        publicado: t.publicado,
        desbloqueado: index === 0, // Primeiro portal desbloqueado
        progresso: index === 0 ? 35 : 0, // Progresso mock
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
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Formação Orácula"
          subtitle="Jornada iniciática profunda"
          icon={<GraduationCap className="w-5 h-5" />}
          className="mb-8"
        />

        <div className="space-y-8">
          {/* Conexão com Casa das Tecelãs */}
          <Card className="glass border-gold/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <p className="text-sm text-foreground/80">
                    A <span className="text-gold font-medium">Casa das Tecelãs</span> permanece 
                    ativa durante toda sua jornada de formação.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/casa')}>
                  Visitar Casa
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Portais */}
          <div className="grid gap-6">
            {portais.map((portal, index) => (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`glass transition-all ${
                    portal.desbloqueado 
                      ? 'border-gold/30 hover:border-gold/50' 
                      : 'border-border/50 opacity-75'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          portal.desbloqueado ? 'bg-gold/20' : 'bg-muted'
                        }`}>
                          {portal.desbloqueado ? (
                            portal.progresso === 100 ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Star className="w-5 h-5 text-gold" />
                            )
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Portal {portal.ordem}: {portal.titulo}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {portal.descricao}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <Badge variant={portal.desbloqueado ? 'default' : 'secondary'}>
                        {portal.desbloqueado 
                          ? portal.progresso === 100 ? 'Concluído' : 'Em andamento'
                          : 'Bloqueado'
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {portal.desbloqueado && (
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="text-gold">{portal.progresso}%</span>
                          </div>
                          <Progress value={portal.progresso} className="h-2" />
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/portais/${portal.id}`)}
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
              <Card className="glass">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Os portais de formação estão sendo preparados.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Você será notificada quando estiverem disponíveis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Princípios da Formação */}
          <Card className="glass border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Princípios da Formação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium text-foreground/90">Formação Profunda</p>
                  <p className="text-muted-foreground">
                    Portais de treinamento avançado para domínio das ferramentas oraculares.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground/90">Progressão Estruturada</p>
                  <p className="text-muted-foreground">
                    Cada portal prepara para o próximo. Não há atalhos.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground/90">Certificação Futura</p>
                  <p className="text-muted-foreground">
                    A conclusão da formação é pré-requisito para certificação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
