import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Loader2, Sparkles, Crown, Star, Infinity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  nome: string;
  descricao: string | null;
  preco_mensal: number;
  portal_resultante: string;
  max_clientes: number;
  features: string[];
  destaque: boolean;
  ordem: number;
}

export default function Planos() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchCurrentPlan();
    }
  }, [user]);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('ativo', true)
      .order('ordem');

    if (!error && data) {
      setPlans(data.map(p => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : JSON.parse(p.features as any || '[]')
      })));
    }
    setLoading(false);
  };

  const fetchCurrentPlan = async () => {
    if (!user) return;

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (sub) {
      setCurrentPlan(sub.plan_id);
    } else {
      setCurrentPlan('visitante');
    }
  };

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/planos', selectedPlan: planId } });
      return;
    }

    if (planId === currentPlan || planId === 'visitante') {
      return;
    }

    // Redirecionar para checkout (quando integrado com Stripe)
    navigate('/assinatura', { state: { upgradeTo: planId } });
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'visitante':
        return <Star className="w-6 h-6" />;
      case 'pre_iniciada':
        return <Sparkles className="w-6 h-6" />;
      case 'iniciada':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getButtonText = (planId: string) => {
    if (planId === currentPlan) {
      return 'Seu Plano Atual';
    }
    if (planId === 'visitante') {
      return 'Gratuito';
    }
    if (currentPlan && planId !== 'visitante') {
      const currentIdx = plans.findIndex(p => p.id === currentPlan);
      const targetIdx = plans.findIndex(p => p.id === planId);
      if (targetIdx > currentIdx) {
        return 'Fazer Upgrade';
      }
    }
    return 'Assinar';
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

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Planos da Casa ORÁCULA"
          subtitle="Escolha o nível de acesso que melhor se adapta à sua jornada"
          icon={<Crown className="w-5 h-5" />}
          className="text-center"
        />

        <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isHighlighted = plan.destaque;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col transition-all duration-300 hover:shadow-lg',
                  isHighlighted && 'border-gold ring-2 ring-gold/50',
                  isCurrent && 'border-primary'
                )}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gold text-black font-semibold px-4">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="secondary" className="px-3">
                      Atual
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
                    isHighlighted ? 'bg-gold/20 text-gold' : 'bg-muted text-muted-foreground'
                  )}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-xl">{plan.nome}</CardTitle>
                  <CardDescription>{plan.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-4xl font-bold">
                        {plan.preco_mensal.toFixed(0)}
                      </span>
                      {plan.preco_mensal > 0 && (
                        <span className="text-sm text-muted-foreground">/mês</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {plan.max_clientes === -1 ? (
                        <span className="flex items-center justify-center gap-1">
                          <Infinity className="w-4 h-4" /> Clientes ilimitados
                        </span>
                      ) : (
                        `Até ${plan.max_clientes} clientes`
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={cn(
                      'w-full',
                      isHighlighted && !isCurrent && 'bg-gold text-black hover:bg-gold/90'
                    )}
                    variant={isCurrent ? 'outline' : 'default'}
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {getButtonText(plan.id)}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Dúvidas? Entre em contato pelo nosso suporte.</p>
        </div>
      </div>
    </AppLayout>
  );
}
