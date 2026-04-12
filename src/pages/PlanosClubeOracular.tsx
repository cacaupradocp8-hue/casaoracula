import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { useAppSettings } from '@/hooks/useAppSettings';
import { canAccessFeature } from '@/types/portal';
import { motion } from 'framer-motion';
import { Check, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import heroPlanos from '@/assets/planos/hero-planos.png';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function HeroParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 4,
      opacity: Math.random() * 0.4 + 0.1,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

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
      price: 'R$ 37,90',
      period: '/mês',
      destaque: false,
      benefits: [
        'CidaDELA Interior completa',
        'Clube de Leitura Oracular',
        'Laboratório 80/20',
        'Jardim da Psique & Jardim do Ofício',
        'Cancele quando quiser',
      ],
      cta: 'Entrar no Clube',
      url: CHECKOUT_MENSAL_URL !== '#' ? CHECKOUT_MENSAL_URL : 'https://pay.rockty.com/pjo9ceihykihwx1gixhspq?off=karv9y4bewbdjcwbmvtwq',
    },
    {
      name: 'Anual',
      price: 'R$ 379,00',
      period: '/ano',
      destaque: true,
      badge: 'Mais escolhido',
      benefits: [
        'Tudo do plano mensal',
        'Economia de 2 meses',
        'Acesso garantido por 12 meses',
        'Laboratório 80/20',
        'Jardim da Psique & Jardim do Ofício',
      ],
      cta: 'Entrar no Clube',
      url: CHECKOUT_ANUAL_URL !== '#' ? CHECKOUT_ANUAL_URL : 'https://pay.rockty.com/pjo9ceihykihwx1gixhspq?off=mayikrzz0kc58ijeqs9a',
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero with image & effects */}
        <section className="relative w-full h-[50vh] min-h-[340px] max-h-[480px] overflow-hidden -mt-16 md:-mt-20">
          <img
            src={heroPlanos}
            alt="Clube de Leitura Simbólica"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          
          <HeroParticles />

          <div className="relative z-20 flex flex-col items-center justify-end h-full pb-10 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/40" />
                <Sparkles className="w-4 h-4 text-gold/50" />
                <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/40" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-wide drop-shadow-lg">
                Clube de Leitura Oracular
              </h1>
              <p className="text-muted-foreground/80 text-sm max-w-sm mx-auto">
                Escolha o plano que faz sentido para sua jornada.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 1 — Abertura */}
        <section className="py-16 md:py-24 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-5 leading-snug">
                Você já escuta suas clientes.<br />
                <span className="text-gold">Mas ainda não consegue ver tudo.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Existe uma diferença entre escutar e perceber o que está por trás da fala.<br />
                O Clube de Leitura Oracular foi criado para desenvolver essa capacidade.
              </p>
              <Button
                variant="gold"
                size="lg"
                className="px-10"
                onClick={() => {
                  const el = document.getElementById('planos-clube');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Entrar no Clube
              </Button>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 2 — Problema */}
        <section className="py-14 md:py-20 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Você sente padrões, mas não consegue organizar.<br />
                Percebe movimentos, mas não sabe como aprofundar.
              </p>
              <p className="text-foreground/70 mt-6 italic">
                E acaba voltando para o que já conhece.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 3 — O que é o Clube */}
        <section className="py-16 md:py-24 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-3">
                O Clube não é um clube de leitura
              </h2>
              <div className="w-10 h-px bg-gold/20 mx-auto" />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-5 text-center">
              <p className="text-muted-foreground leading-relaxed">
                Você não entra aqui para consumir livros.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Você entra para aprender a:
              </p>
              <ul className="space-y-3 max-w-md mx-auto text-left">
                {[
                  'ler narrativas como campo psíquico',
                  'reconhecer estruturas simbólicas',
                  'desenvolver escuta clínica real',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground/70 italic mt-4">
                Cada livro é um campo de treino.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 4 — Como funciona */}
        <section className="py-14 md:py-20 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Todo mês você atravessa um Portal da psique.<br />
                Com um livro aplicado e uma estrutura de leitura simbólica.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {[
                  'Ciclo mensal guiado',
                  'Exercícios de percepção',
                  'Aplicação simbólica',
                  'Desenvolvimento progressivo',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 border-l-2 border-gold/15 pl-4">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 5 — O que você desenvolve */}
        <section className="py-14 md:py-20 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <motion.div {...fadeUp} className="mb-8">
              <h2 className="font-display text-xl md:text-2xl text-foreground tracking-wide mb-3">
                O que você desenvolve
              </h2>
              <div className="w-10 h-px bg-gold/20 mx-auto" />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <ul className="space-y-3 max-w-xs mx-auto text-left">
                {[
                  'Escuta simbólica',
                  'Percepção de padrões',
                  'Leitura narrativa',
                  'Clareza interna',
                  'Base para condução',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 6 — Importante */}
        <section className="py-14 md:py-20 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">
                Aqui você não está sendo treinada para conduzir.
              </p>
              <p className="font-display text-xl md:text-2xl text-gold italic">
                Você está sendo preparada para ver.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 7 & 8 — Para quem é / Não é */}
        <section className="py-14 md:py-20 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="grid md:grid-cols-2 gap-10">
              <motion.div {...fadeUp}>
                <h3 className="font-display text-lg text-foreground mb-5 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gold/60" /> Para quem é
                </h3>
                <ul className="space-y-3">
                  {['Terapeutas iniciantes', 'Facilitadoras', 'Mulheres em formação'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                <h3 className="font-display text-lg text-foreground mb-5 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-muted-foreground/40" /> Para quem não é
                </h3>
                <ul className="space-y-3">
                  {['Quem quer técnica pronta', 'Quem busca respostas rápidas', 'Quem não sustenta processo'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/60">
                      <span className="mt-0.5 flex-shrink-0">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 9 — Investimento */}
        {isAssinante ? (
          <section id="planos-clube" className="pb-20 px-6">
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
          <section id="planos-clube" className="pb-20 px-6">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-3">
                Investimento
              </h2>
              <div className="w-10 h-px bg-gold/20 mx-auto" />
            </motion.div>
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

        {/* SEÇÃO 10 — Transição */}
        <section className="py-14 md:py-20 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O Clube é a base da Casa Orácula.
              </p>
              <p className="text-foreground/70">
                Depois, você pode avançar para a Formação<br />
                quando estiver pronta para conduzir.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 11 — CTA Final */}
        <section className="py-16 md:py-24 border-t border-border/10">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-3">
                Se você quer parar de apenas escutar<br />
                e começar a ver o que está acontecendo,
              </p>
              <p className="font-display text-xl text-gold italic mb-8">
                o Clube está aberto.
              </p>
              <Button
                variant="gold"
                size="lg"
                className="px-10"
                onClick={() => {
                  const el = document.getElementById('planos-clube');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Entrar no Clube de Leitura Oracular
              </Button>
            </motion.div>
          </div>
        </section>

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
