import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanosSettings } from '@/hooks/usePlanosSettings';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle2, Clock, AlertCircle, MessageCircle, Mail } from 'lucide-react';

type SubscriptionStatus = 'pending' | 'active' | 'failed';

// Helper to get user name safely
const getUserName = (user: ReturnType<typeof useAuth>['user']): string => {
  return user?.name || 'Iniciada';
};

export default function PosCompra() {
  const navigate = useNavigate();
  const { user, refreshUserPortal } = useAuth();
  const { settings } = usePlanosSettings();
  const [status, setStatus] = useState<SubscriptionStatus>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkSubscriptionStatus = async () => {
    if (!user?.id) return;
    
    try {
      // Check subscriptions table
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subscription) {
        if (subscription.status === 'active') {
          setStatus('active');
        } else if (subscription.status === 'canceled' || subscription.status === 'expired') {
          setStatus('failed');
        } else {
          setStatus('pending');
        }
      } else {
        // Also check profile portal level
        const portal = user.portal;
        if (portal && portal !== 'visitante') {
          setStatus('active');
        } else {
          setStatus('pending');
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus('pending');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user?.id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserPortal?.();
    await checkSubscriptionStatus();
    setIsRefreshing(false);
  };

  const getDestinationRoute = (): string => {
    const portal = user?.portal;
    switch (portal) {
      case 'admin':
        return '/admin';
      case 'oracula':
      case 'iniciada':
        return '/casa';
      case 'aluna_formacao':
      case 'assinante':
        return '/casa';
      case 'mentorada':
      case 'pre_iniciada':
        return '/sala-da-visitante';
      default:
        return '/sala-da-visitante';
    }
  };

  const getSalaName = (): string => {
    const portal = user?.portal;
    switch (portal) {
      case 'admin':
        return 'Painel Admin';
      case 'oracula':
        return 'Sala das Oráculas';
      case 'iniciada':
      case 'aluna_formacao':
      case 'assinante':
        return 'Casa ORÁCULA';
      default:
        return 'Sala da Visitante';
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="text-gold/60 text-3xl mb-6 block">🜂</span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4">
              Ritual de Recepção
            </h1>
            <p className="text-muted-foreground">
              Sua travessia está sendo preparada
            </p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-card/60 border-border/40 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                {/* Status Badge */}
                <div className="mb-8">
                  {status === 'active' && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-4 py-2">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Acesso Ativado
                    </Badge>
                  )}
                  {status === 'pending' && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm px-4 py-2">
                      <Clock className="w-4 h-4 mr-2" />
                      Ativação em andamento
                    </Badge>
                  )}
                  {status === 'failed' && (
                    <Badge variant="destructive" className="text-sm px-4 py-2">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Problema na ativação
                    </Badge>
                  )}
                </div>

                {/* Status Content */}
                {status === 'active' && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg text-foreground mb-2">
                        Bem-vinda à Casa, {getUserName(user)}.
                      </p>
                      <p className="text-muted-foreground">
                        Seu acesso está liberado. A travessia pode começar.
                      </p>
                    </div>
                    
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full py-6 text-base"
                      onClick={() => navigate('/dashboard-membro?boas-vindas=true')}
                    >
                      Entrar na Casa Orácula
                    </Button>
                  </div>
                )}

                {status === 'pending' && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg text-foreground mb-2">
                        Seu acesso está sendo ativado.
                      </p>
                      <p className="text-muted-foreground">
                        Este processo leva alguns instantes. Se já concluiu o pagamento, clique em atualizar.
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full py-6 text-base border-gold/30 hover:bg-gold/10"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      {isRefreshing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Atualizar Status
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground/70 italic">
                      Se o pagamento foi concluído e o acesso não aparecer em alguns minutos, 
                      entre em contato com o suporte.
                    </p>
                  </div>
                )}

                {status === 'failed' && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg text-foreground mb-2">
                        Houve um problema com sua ativação.
                      </p>
                      <p className="text-muted-foreground">
                        Não se preocupe. Entre em contato com nosso suporte que resolveremos juntas.
                      </p>
                    </div>
                    
                    <div className="grid gap-3">
                      {settings.supportWhatsappUrl && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full py-6 text-base border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => window.open(settings.supportWhatsappUrl, '_blank')}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Falar no WhatsApp
                        </Button>
                      )}
                      
                      {settings.supportEmail && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full py-6 text-base"
                          onClick={() => window.open(`mailto:${settings.supportEmail}`, '_blank')}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar Email
                        </Button>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="text-muted-foreground"
                    >
                      {isRefreshing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Tentar novamente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-sm text-muted-foreground/60 mt-8"
          >
            🔒 Sua compra está protegida. Pagamento processado com segurança.
          </motion.p>
        </div>
      </div>
    </AppLayout>
  );
}
