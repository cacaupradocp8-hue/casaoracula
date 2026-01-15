import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CreditCard, 
  Loader2, 
  ArrowLeft,
  Mail,
  Calendar,
  FileText,
  ExternalLink,
  Info
} from 'lucide-react';

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  external_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
}

export default function Billing() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setSubscription(data);
    setLoading(false);
  };

  const handleOpenPortal = async () => {
    // Quando integrado com Stripe, isso chamará a edge function stripe-portal
    setPortalLoading(true);
    
    // Por enquanto, apenas mostra alerta
    setTimeout(() => {
      setPortalLoading(false);
      alert('Portal de cobrança será integrado com Stripe em breve.');
    }, 1000);
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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/assinatura">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>

        <SectionHeader
          title="Gerenciar Cobrança"
          subtitle="Atualize suas informações de pagamento e veja seu histórico"
          icon={<CreditCard className="w-5 h-5" />}
        />

        <Alert className="mt-6 mb-8 border-blue-500/50 bg-blue-500/10">
          <Info className="w-4 h-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            Para gerenciar sua assinatura, alterar forma de pagamento ou cancelar, entre em contato conosco.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Informações da Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Detalhes da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Plano</p>
                      <p className="font-medium capitalize">{subscription.plan_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{subscription.status}</p>
                    </div>
                    {subscription.current_period_end && (
                      <div>
                        <p className="text-sm text-muted-foreground">Próxima Cobrança</p>
                        <p className="font-medium">
                          {format(new Date(subscription.current_period_end), "d/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Membro desde</p>
                      <p className="font-medium">
                        {format(new Date(subscription.created_at), "d/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  {subscription.external_subscription_id && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={handleOpenPortal}
                        disabled={portalLoading}
                        className="w-full"
                      >
                        {portalLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ExternalLink className="w-4 h-4 mr-2" />
                        )}
                        Abrir Portal de Pagamento
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não possui uma assinatura ativa.
                  </p>
                  <Button asChild>
                    <Link to="/planos">Ver Planos</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Precisa de Ajuda?
              </CardTitle>
              <CardDescription>
                Entre em contato com nosso suporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Para questões relacionadas a cobrança, cancelamentos ou alterações de plano:
              </p>
              <Button variant="outline" asChild className="w-full">
                <a href="mailto:suporte@casaoracula.com.br">
                  <Mail className="w-4 h-4 mr-2" />
                  suporte@casaoracula.com.br
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
