import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CreditCard, 
  Loader2, 
  Crown, 
  ArrowUpRight, 
  Users, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Infinity
} from 'lucide-react';

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
}

interface Plan {
  id: string;
  nome: string;
  preco_mensal: number;
  max_clientes: number;
  features: string[];
}

interface ClientCount {
  total: number;
  limit: number;
}

export default function Assinatura() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [clientCount, setClientCount] = useState<ClientCount>({ total: 0, limit: 2 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Buscar assinatura ativa
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'past_due', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subData) {
      setSubscription(subData);

      // Buscar detalhes do plano
      const { data: planData } = await supabase
        .from('plans')
        .select('*')
        .eq('id', subData.plan_id)
        .single();

      if (planData) {
        setPlan({
          ...planData,
          features: Array.isArray(planData.features) 
            ? planData.features 
            : JSON.parse(planData.features as any || '[]')
        });
      }
    } else {
      // Buscar plano visitante como fallback
      const { data: freePlan } = await supabase
        .from('plans')
        .select('*')
        .eq('id', 'visitante')
        .single();

      if (freePlan) {
        setPlan({
          ...freePlan,
          features: Array.isArray(freePlan.features) 
            ? freePlan.features 
            : JSON.parse(freePlan.features as any || '[]')
        });
      }
    }

    // Contar clientes
    const { count } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('terapeuta_id', user.id);

    // Buscar limite
    const { data: limitData } = await supabase
      .from('plan_limits')
      .select('max_clientes')
      .eq('portal', user.portal)
      .single();

    setClientCount({
      total: count || 0,
      limit: limitData?.max_clientes ?? 2
    });

    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        );
      case 'trialing':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            <Clock className="w-3 h-3 mr-1" />
            Trial
          </Badge>
        );
      case 'past_due':
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pagamento Pendente
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  const hasActiveSubscription = subscription && ['active', 'trialing'].includes(subscription.status);
  const isPastDue = subscription?.status === 'past_due';

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SectionHeader
          title="Minha Assinatura"
          subtitle="Gerencie seu plano e informações de cobrança"
          icon={<CreditCard className="w-5 h-5" />}
        />

        {isPastDue && (
          <Alert className="mt-6 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              Seu pagamento está pendente. Atualize suas informações de pagamento para manter o acesso.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Plano Atual */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-gold" />
                  Plano Atual
                </CardTitle>
                {subscription && getStatusBadge(subscription.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold">{plan?.nome || 'Visitante'}</p>
                <p className="text-muted-foreground">
                  R$ {plan?.preco_mensal?.toFixed(2) || '0,00'} / mês
                </p>
              </div>

              {subscription?.current_period_end && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Próxima cobrança: {format(new Date(subscription.current_period_end), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t space-y-2">
                <Button asChild className="w-full">
                  <Link to="/planos">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Ver Todos os Planos
                  </Link>
                </Button>
                {hasActiveSubscription && (
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/billing">
                      Gerenciar Cobrança
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Uso de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                Uso de Clientes
              </CardTitle>
              <CardDescription>
                Acompanhe seu limite de clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{clientCount.total}</span>
                <span className="text-muted-foreground">
                  / {clientCount.limit === -1 ? (
                    <span className="inline-flex items-center gap-1">
                      <Infinity className="w-4 h-4" /> Ilimitado
                    </span>
                  ) : (
                    clientCount.limit
                  )}
                </span>
              </div>

              {clientCount.limit !== -1 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gold rounded-full h-2 transition-all"
                    style={{ 
                      width: `${Math.min((clientCount.total / clientCount.limit) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}

              {clientCount.limit !== -1 && clientCount.total >= clientCount.limit && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <AlertDescription className="text-amber-200">
                    Você atingiu o limite de clientes. Faça upgrade para adicionar mais.
                  </AlertDescription>
                </Alert>
              )}

              <Button variant="outline" asChild className="w-full">
                <Link to="/minhas-clientes">
                  Ver Minhas Clientes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recursos do Plano */}
        {plan && plan.features.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recursos Incluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
