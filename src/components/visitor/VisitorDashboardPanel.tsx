import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Loader2,
  Gift,
  Compass,
  GraduationCap,
  Crown,
  BookOpen,
  Users,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { useDegustacao } from '@/hooks/useDegustacao';
import { cn } from '@/lib/utils';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState as useReactState } from 'react';

// Landing context ID for visitor home
const VISITOR_LANDING_ID = 'visitor-home';

// Locked features for visitors
const LOCKED_FEATURES = [
  {
    id: 'mentoria',
    title: 'Sala da Mentoria',
    description: 'Ferramentas simbólicas e acompanhamento',
    icon: Compass,
  },
  {
    id: 'formacao',
    title: 'Sala de Treinamento',
    description: 'Formação profissional completa',
    icon: GraduationCap,
  },
  {
    id: 'biblioteca',
    title: 'Biblioteca',
    description: 'Materiais e textos de estudo',
    icon: BookOpen,
  },
  {
    id: 'agentes',
    title: 'Agentes IA',
    description: 'Assistentes simbólicos inteligentes',
    icon: Bot,
  },
  {
    id: 'sessao',
    title: 'Sala de Sessão',
    description: 'Atendimento profissional',
    icon: Users,
  },
  {
    id: 'oracula',
    title: 'Círculo da Orácula',
    description: 'Comunidade de formadas',
    icon: Crown,
  },
];

// Free features for visitors
const FREE_FEATURES = [
  {
    id: 'tour',
    title: 'Tour pela Casa',
    description: 'Conheça todos os cômodos e ferramentas',
    route: '/tour',
  },
  {
    id: 'sala-visitante',
    title: 'Sala da Visitante',
    description: 'Quiz oracular e ferramentas de entrada',
    route: '/salas/be626211-4608-4232-b678-8c3edfac2798',
  },
  {
    id: 'cursos',
    title: 'Prévia de Cursos',
    description: 'Explore o catálogo disponível',
    route: '/cursos',
  },
  {
    id: 'planos',
    title: 'Caminhos Orácula',
    description: 'Conheça as opções de formação',
    route: '/planos',
  },
];

export function VisitorDashboardPanel() {
  const navigate = useNavigate();
  const { myRequest, isLoading, isSubmitting, hasDegustacaoActive, requestDegustacao, refetch } = useDegustacao();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [hadDegustacaoExpired, setHadDegustacaoExpired] = useReactState(false);

  // Check if user had an expired degustação
  useEffect(() => {
    if (myRequest?.status === 'expirado') {
      setHadDegustacaoExpired(true);
    }
  }, [myRequest]);

  const handleRequestDegustacao = async () => {
    const success = await requestDegustacao(motivo);
    if (success) {
      setShowRequestModal(false);
      setMotivo('');
    }
  };

  const hasPendingRequest = myRequest?.status === 'pendente';

  return (
    <div className="space-y-6">
      {/* Expired Degustação Banner */}
      {hadDegustacaoExpired && !hasDegustacaoActive && !hasPendingRequest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-amber-400">Sua degustação foi encerrada</h3>
                <p className="text-sm text-amber-400/70">
                  Seu período de 24h terminou. Conheça nossos planos para continuar acessando a Casa.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/planos')}
              className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              Conhecer planos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Active Degustação Banner */}
      {hasDegustacaoActive && myRequest?.expira_em && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-emerald-400">Degustação ativa!</h3>
              <p className="text-sm text-emerald-400/70">
                Seu acesso expira em{' '}
                {new Date(myRequest.expira_em).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Free Features Section */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Disponível para você
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {FREE_FEATURES.map((feature) => (
            <Card
              key={feature.id}
              className="cursor-pointer hover:border-gold/50 transition-all bg-card/50"
              onClick={() => navigate(feature.route)}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Locked Features Section */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          Requer acesso
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {LOCKED_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30"
              >
                <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-muted-foreground truncate">
                      {feature.title}
                    </h4>
                    <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Degustação Request Card */}
      {!hasDegustacaoActive && (
        <Card className="border-gold/20 bg-gradient-to-br from-gold/5 via-card to-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold" />
              Experimente a Casa por 24 horas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Solicite um acesso de degustação para explorar todas as ferramentas da Casa ORÁCULA 
              por 24 horas. Uma administradora irá avaliar seu pedido.
            </p>

            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Verificando...</span>
              </div>
            ) : hasPendingRequest ? (
              <div className="flex items-center gap-2 text-gold">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Pedido enviado. Aguardando aprovação...</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setShowRequestModal(true)}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Solicitar degustação
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/planos')}
                  className="gap-2"
                >
                  Conhecer planos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold" />
              Solicitar Degustação
            </DialogTitle>
            <DialogDescription>
              Ao solicitar a degustação, você terá acesso a todas as ferramentas da Casa por 24 horas 
              após a aprovação de uma administradora.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                O que te trouxe até aqui? (opcional)
              </label>
              <Textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Conte um pouco sobre seu interesse na Casa ORÁCULA..."
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Isso ajuda as administradoras a conhecerem você.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="gold"
              onClick={handleRequestDegustacao}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Enviar pedido
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modular Blocks for Visitor Landing */}
      <ModularPageRenderer
        contextType="landing"
        contextId={VISITOR_LANDING_ID}
        fallback={null}
        blockSpacing="lg"
      />
    </div>
  );
}
