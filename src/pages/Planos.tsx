import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Loader2, Sparkles, Crown, Star, Clock, Infinity, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  nome: string;
  descricao: string | null;
  preco_mensal: number;
  preco_unico: number | null;
  tipo_cobranca: string;
  duracao_meses: number | null;
  portal_resultante: string;
  max_clientes: number;
  features: string[];
  destaque: boolean;
  ordem: number;
  url_checkout: string | null;
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

    // Check subscription status first
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, portal, access_expires_at')
      .eq('id', user.id)
      .single();

    if (profile?.subscription_status === 'active') {
      setCurrentPlan('assinatura');
    } else if (profile?.access_expires_at) {
      // Check if has Fundadora or Mentoria based on expiration
      const expiresAt = new Date(profile.access_expires_at);
      const now = new Date();
      const monthsUntilExpiration = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
      
      if (monthsUntilExpiration > 12) {
        setCurrentPlan('mentoria');
      } else if (monthsUntilExpiration > 0) {
        setCurrentPlan('fundadora');
      } else {
        setCurrentPlan('visitante');
      }
    } else {
      setCurrentPlan('visitante');
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/planos', selectedPlan: plan.id } });
      return;
    }

    if (plan.id === currentPlan || plan.id === 'visitante') {
      return;
    }

    // Se tiver URL de checkout, abrir em nova aba (Rockty)
    if (plan.url_checkout) {
      window.open(plan.url_checkout, '_blank');
      return;
    }

    // Fallback para página de assinatura interna
    navigate('/assinatura', { state: { upgradeTo: plan.id } });
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'visitante':
        return <Star className="w-6 h-6" />;
      case 'fundadora':
        return <Sparkles className="w-6 h-6" />;
      case 'mentoria':
        return <Crown className="w-6 h-6" />;
      case 'assinatura':
        return <Clock className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getButtonText = (plan: Plan) => {
    if (plan.id === currentPlan) {
      return 'Seu Plano Atual';
    }
    if (plan.id === 'visitante') {
      return 'Começar gratuitamente';
    }
    return plan.url_checkout ? 'Adquirir' : 'Assinar';
  };

  const formatPrice = (plan: Plan) => {
    if (plan.tipo_cobranca === 'gratuito') {
      return { value: '0', suffix: '' };
    }
    if (plan.tipo_cobranca === 'unico' && plan.preco_unico) {
      return { value: plan.preco_unico.toLocaleString('pt-BR'), suffix: ' único' };
    }
    if (plan.tipo_cobranca === 'mensal' && plan.preco_mensal) {
      return { value: plan.preco_mensal.toFixed(2).replace('.', ','), suffix: '/mês' };
    }
    return { value: '0', suffix: '' };
  };

  const getDurationText = (plan: Plan) => {
    if (plan.tipo_cobranca === 'gratuito') {
      return 'Sempre gratuito';
    }
    if (plan.duracao_meses) {
      return `Acesso por ${plan.duracao_meses} meses`;
    }
    if (plan.tipo_cobranca === 'mensal') {
      return 'Renovação mensal';
    }
    return null;
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isHighlighted = plan.destaque;
            const price = formatPrice(plan);
            const durationText = getDurationText(plan);

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col transition-all duration-300 hover:shadow-lg',
                  isHighlighted && 'border-gold ring-2 ring-gold/50 scale-105',
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
                  <CardTitle className="text-lg">{plan.nome}</CardTitle>
                  <CardDescription className="text-sm">{plan.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-3xl font-bold">
                        {price.value}
                      </span>
                      {price.suffix && (
                        <span className="text-sm text-muted-foreground">{price.suffix}</span>
                      )}
                    </div>
                    {durationText && (
                      <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        {durationText}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {plan.max_clientes === -1 ? (
                        <span className="flex items-center justify-center gap-1">
                          <Infinity className="w-3 h-3" /> Clientes ilimitados
                        </span>
                      ) : (
                        `Até ${plan.max_clientes} clientes`
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2">
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
                    disabled={isCurrent || plan.id === 'visitante'}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {getButtonText(plan)}
                    {plan.url_checkout && !isCurrent && plan.id !== 'visitante' && (
                      <ExternalLink className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Nota importante sobre continuidade */}
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-muted/50 rounded-lg border">
          <p className="text-center text-sm text-muted-foreground">
            <strong className="text-foreground">Importante:</strong> O acesso ao app nos planos 
            <span className="text-gold font-medium"> Fundadora </span> e 
            <span className="text-gold font-medium"> Mentoria </span> 
            é válido pelo período informado. Após esse prazo, a continuidade ocorre via 
            <span className="font-medium"> assinatura mensal de R$49,90</span>.
          </p>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Dúvidas? Entre em contato pelo nosso suporte.</p>
        </div>
      </div>
    </AppLayout>
  );
}
