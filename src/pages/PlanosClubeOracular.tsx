import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { useAppSettings } from '@/hooks/useAppSettings';
import { canAccessFeature } from '@/types/portal';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function PlanosClubeOracular() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionStatus, accessExpiresAt } = useAccessExpiration();
  const { getSetting } = useAppSettings();

  const CHECKOUT_MENSAL_URL = getSetting('planos_clube_checkout_mensal_url', '#');
  const CHECKOUT_ANUAL_URL = getSetting('planos_clube_checkout_anual_url', '#');
  const PORTAL_ATUAL_ROUTE = getSetting('planos_clube_portal_atual_route', '/clube-livro');
  const ASSINATURA_ROUTE = getSetting('planos_clube_assinatura_route', '/minha-conta');

  const isAssinante = user && canAccessFeature(user.portal, 'assinante');

  const planos = [
    {
      name: 'Mensal',
      price: 'R$ 59,97',
      period: '/mês',
      destaque: false,
      benefits: [
        'Acesso completo ao Clube de Leitura',
        'Portal Atual + Portais anteriores',
        'Laboratório 80/20',
        'Jardim da Psique & Jardim do Ofício',
        'Cancele quando quiser',
      ],
      cta: 'Assinar Mensal',
      url: CHECKOUT_MENSAL_URL,
    },
    {
      name: 'Anual',
      price: 'R$ 599,97',
      period: '/ano',
      destaque: true,
      badge: '2 meses grátis',
      benefits: [
        'Tudo do plano mensal',
        'Economia de 2 meses',
        'Acesso garantido por 12 meses',
        'Laboratório 80/20',
        'Jardim da Psique & Jardim do Ofício',
      ],
      cta: 'Assinar Anual',
      url: CHECKOUT_ANUAL_URL,
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="pt-16 pb-8 px-6 text-center">
          <motion.div {...fadeUp} className="max-w-lg mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/30" />
              <Sparkles className="w-4 h-4 text-gold/40" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/30" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-wide">
              Clube de Leitura Oracular
            </h1>
            <p className="text-muted-foreground/70 text-sm max-w-sm mx-auto">
              Escolha o plano que faz sentido para sua jornada.
            </p>
          </motion.div>
        </section>

        {/* Assinante — status card */}
        {isAssinante ? (
          <section className="pb-20 px-6">
            <motion.div {...fadeUp} className="max-w-sm mx-auto">
              <Card className="bg-card/60 border-gold/20">
                <CardContent className="p-8 text-center space-y-5">
                  <p className="text-gold/60 text-2xl">✦</p>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Você já é assinante
                  </h2>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Status: <span className="text-foreground font-medium">{subscriptionStatus === 'active' ? 'Ativo' : subscriptionStatus || '—'}</span></p>
                    {accessExpiresAt && (
                      <p>Renovação: <span className="text-foreground font-medium">{accessExpiresAt.toLocaleDateString('pt-BR')}</span></p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button variant="gold" size="lg" onClick={() => navigate(PORTAL_ATUAL_ROUTE)}>
                      Ir para o Portal Atual
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(ASSINATURA_ROUTE)}
                    >
                      Gerenciar assinatura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        ) : (
          /* Planos grid */
          <section className="pb-20 px-6">
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
              {planos.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      'relative h-full flex flex-col bg-card/40 border-border/20 transition-all duration-300',
                      plan.destaque && 'border-gold/30 ring-1 ring-gold/10'
                    )}
                  >
                    {plan.destaque && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    )}

                    {plan.badge && (
                      <Badge className="absolute top-4 right-4 bg-gold/15 text-gold border-gold/20 text-[11px]">
                        {plan.badge}
                      </Badge>
                    )}

                    <CardContent className="p-8 flex flex-col h-full">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                        {plan.name}
                      </h3>

                      <div className="mb-6">
                        <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-sm text-muted-foreground/70">{plan.period}</span>
                      </div>

                      <ul className="space-y-3 flex-1 mb-8">
                        {plan.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/70">
                            <Check className="w-4 h-4 text-gold/60 mt-0.5 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        size="lg"
                        className={cn(
                          'w-full py-6 text-sm font-medium transition-all',
                          plan.destaque
                            ? 'bg-gradient-to-r from-gold to-gold-dark text-primary-foreground shadow-gold hover:shadow-glow'
                            : 'bg-transparent border border-gold/20 text-foreground hover:bg-gold/5 hover:border-gold/30'
                        )}
                        onClick={() => window.open(plan.url, '_blank')}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>

                    {plan.destaque && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground/40 text-center mt-8 max-w-sm mx-auto">
              Cancele quando quiser. Sem fidelidade. Sem excesso.
            </p>
          </section>
        )}

        {/* Nota ética */}
        <footer className="py-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/15" />
            <span className="text-gold/20 text-xs">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/15" />
          </div>
          <p className="text-xs text-muted-foreground/40 max-w-xs mx-auto leading-relaxed">
            O plano dá acesso ao sistema. A travessia depende de você.
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}
