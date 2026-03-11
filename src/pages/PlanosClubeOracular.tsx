import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { useAppSettings } from '@/hooks/useAppSettings';
import { canAccessFeature } from '@/types/portal';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function PlanosClubeOracular() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionStatus, accessExpiresAt } = useAccessExpiration();
  const { getSetting } = useAppSettings();
  const planosRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const VSL_URL = getSetting('planos_clube_vsl_url', '');
  const CHECKOUT_MENSAL_URL = getSetting('planos_clube_checkout_mensal_url', '#');
  const CHECKOUT_ANUAL_URL = getSetting('planos_clube_checkout_anual_url', '#');
  const PORTAL_ATUAL_ROUTE = getSetting('planos_clube_portal_atual_route', '/clube-livro');
  const ASSINATURA_ROUTE = getSetting('planos_clube_assinatura_route', '/minha-conta');
  const PRECO_MENSAL = getSetting('planos_clube_preco_mensal', 'R$ 67/mês');
  const PRECO_ANUAL = getSetting('planos_clube_preco_anual', 'R$ 497/ano');

  const isAssinante = user && canAccessFeature(user.portal, 'assinante');

  // Sticky CTA visibility on scroll
  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPlanos = () =>
    planosRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handlePrimaryCta = () => {
    if (isAssinante) {
      navigate(PORTAL_ATUAL_ROUTE);
    } else {
      scrollToPlanos();
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-black relative">
        {/* ─── HERO + VSL ─────────────────────────────── */}
        <section className="py-12 sm:py-20 text-center px-6">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto space-y-6">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Círculo de Leitura Oracular
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Leitura vira competência. Portal vira prática.
            </p>

            {/* VSL Embed */}
            <div className="max-w-xl mx-auto rounded-lg overflow-hidden border border-border/30 bg-card/30">
              <AspectRatio ratio={16 / 9}>
                {VSL_URL ? (
                  VSL_URL.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
                    <video src={VSL_URL} controls className="w-full h-full object-cover" playsInline />
                  ) : (
                    <iframe
                      src={VSL_URL}
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      title="VSL Círculo de Leitura"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-card/50">
                    <button
                      className="flex items-center gap-2 text-gold/80 hover:text-gold transition-colors"
                      onClick={() => {}}
                    >
                      <Play className="w-10 h-10 fill-current" />
                      <span className="font-display text-lg">Assistir</span>
                    </button>
                  </div>
                )}
              </AspectRatio>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button variant="gold" size="lg" onClick={handlePrimaryCta}>
                {isAssinante ? 'Ir para Portal Atual' : 'Assinar e Entrar'}
              </Button>
              {!isAssinante && (
                <Button variant="outline" size="lg" className="border-gold/30 hover:bg-gold/10" onClick={scrollToPlanos}>
                  Ver como funciona
                </Button>
              )}
            </div>

            {!isAssinante && (
              <p className="text-xs text-muted-foreground/60 pt-1">
                Cancele quando quiser. Sem excesso. Sem ruído.
              </p>
            )}
          </motion.div>
        </section>

        {/* ─── ASSINANTE: BLOCO DE STATUS ─────────────── */}
        {isAssinante && (
          <section className="py-10 px-6">
            <motion.div {...fadeUp} className="max-w-md mx-auto text-center space-y-5">
              <Card className="bg-card/50 border-gold/20">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Você já é assinante ✦</h2>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Plano ativo: <span className="text-foreground font-medium">{subscriptionStatus === 'active' ? 'Ativo' : subscriptionStatus || '—'}</span></p>
                    {accessExpiresAt && (
                      <p>Próxima renovação: <span className="text-foreground font-medium">{accessExpiresAt.toLocaleDateString('pt-BR')}</span></p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button variant="gold" size="lg" onClick={() => navigate(PORTAL_ATUAL_ROUTE)}>
                      Ir para o Portal Atual
                    </Button>
                    <Button variant="outline" size="sm" className="border-gold/30 hover:bg-gold/10" onClick={() => navigate(ASSINATURA_ROUTE)}>
                      Gerenciar Assinatura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        )}

        {/* ─── O QUE É ────────────────────────────────── */}
        <section className="py-12 px-6">
          <motion.div {...fadeUp} className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
              Não é um clube do livro.
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              É um mapa de travessia formativa. Você lê menos, integra mais e aplica com consciência — em si e no outro.
            </p>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {['Leitura vira habilidade.', 'Símbolo vira prática.', 'Conteúdo vira estrutura clínica.'].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* ─── COMO FUNCIONA ──────────────────────────── */}
        <section className="py-12 px-6 border-y border-border/20">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
              Como funciona dentro da Casa Orácula
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-1">
              {[
                { label: 'Calendário', desc: 'escolha a travessia' },
                { label: 'Livro', desc: 'entra no campo simbólico' },
                { label: 'Tour', desc: 'entende o lugar da obra na jornada' },
                { label: 'Portais', desc: 'atravessa em etapas' },
                { label: 'Lab 80/20', desc: 'destila e aplica' },
                { label: 'Jardins', desc: 'registra e sustenta' },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-1 sm:gap-2">
                  <div className="px-3 py-2 rounded-lg bg-card border border-border/40 text-center">
                    <span className="text-xs sm:text-sm font-medium text-foreground/90 block">{s.label}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{s.desc}</span>
                  </div>
                  {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gold/50 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── O QUE VOCÊ RECEBE ──────────────────────── */}
        <section className="py-12 px-6">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
              O que você recebe como assinante
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Portal Atual', desc: 'Áudios, aula, prática e integração — com foco no que você faz agora.' },
                { title: 'Biblioteca de Portais', desc: 'Portais anteriores organizados por jornada. Sem bagunça. Sem lista infinita.' },
                { title: 'Laboratório 80/20', desc: 'Extrai o essencial e transforma em sessão, aula, círculo ou palestra.' },
                { title: 'Jardim da Psique & Jardim da Heroína', desc: 'Um para você. Um para sua prática. Sem mistura. Com ética.' },
              ].map((item) => (
                <Card key={item.title} className="bg-card/50 border-border/30 hover:border-gold/20 transition-colors">
                  <CardContent className="p-5 space-y-2">
                    <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── PLANOS (somente não assinantes) ─────── */}
        {!isAssinante && (
          <section ref={planosRef} className="py-16 px-6">
            <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-8">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
                Escolha seu plano
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                   {
                    name: 'Plano Mensal',
                    price: 'R$ 59,97/mês',
                    destaque: false,
                    benefits: ['Acesso ao Clube de Leitura Oracular', 'Reflexões semanais', 'Carta simbólica da semana', 'Comunidade da Casa Orácula'],
                    cta: 'Assinar Mensal',
                    url: CHECKOUT_MENSAL_URL,
                  },
                  {
                    name: 'Plano Anual',
                    price: 'R$ 599,97/ano',
                    destaque: true,
                    badge: 'Melhor valor',
                    benefits: ['Acesso ao Clube de Leitura Oracular', 'Reflexões semanais', 'Carta simbólica da semana', 'Comunidade da Casa Orácula'],
                    cta: 'Assinar Anual',
                    url: CHECKOUT_ANUAL_URL,
                  },
                ].map((plan) => (
                  <Card
                    key={plan.name}
                    className={cn(
                      'relative flex flex-col bg-card/50 border-border/30 transition-all',
                      plan.destaque && 'border-gold/40 ring-1 ring-gold/20'
                    )}
                  >
                    {plan.destaque && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                    )}
                    {plan.badge && (
                      <Badge className="absolute top-4 right-4 bg-gold/20 text-gold border-gold/30 text-xs">
                        {plan.badge}
                      </Badge>
                    )}
                    <CardContent className="p-6 flex flex-col flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                      <p className="text-2xl font-bold text-foreground mb-5">{plan.price}</p>
                      <ul className="space-y-2 flex-1 mb-6">
                        {plan.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                            <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={plan.destaque ? 'gold' : 'outline'}
                        size="lg"
                        className={cn('w-full', !plan.destaque && 'border-gold/30 hover:bg-gold/10')}
                        onClick={() => window.open(plan.url, '_blank')}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                    {plan.destaque && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                    )}
                  </Card>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/60 text-center pt-2">
                Você entra quando quiser. O método organiza o caminho.
              </p>
            </motion.div>
          </section>
        )}

        {/* ─── PARA QUEM É / NÃO É ──────────────────── */}
        <section className="py-12 px-6 border-t border-border/20">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold text-foreground">Este círculo é para você se…</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                {['Você quer profundidade sem confusão.', 'Você quer aplicar leitura em prática profissional.', 'Você quer sustentar processos sem depender de conteúdo.', 'Você quer método, não inspiração passageira.'].map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold text-foreground">Não é para você se…</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Você quer só resumos rápidos.', 'Você quer consumir mais do que integrar.', 'Você busca validação por citação.', 'Você quer atalhos sem travessia.'].map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* ─── FAQ ────────────────────────────────────── */}
        <section className="py-12 px-6">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
              Perguntas frequentes
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { q: 'Posso entrar em qualquer momento?', a: 'Sim. A assinatura é contínua e o Portal Atual sempre te mostra por onde começar.' },
                { q: 'Preciso ler o livro inteiro?', a: 'Não. Você atravessa por Portais e integra pelo 80/20. Leia menos, integre mais.' },
                ...(isAssinante
                  ? [{ q: 'Posso cancelar?', a: 'Sim. Você controla sua assinatura.' }]
                  : [
                      { q: 'Isso serve para minha prática profissional?', a: 'Sim. Cada Portal tem tradução para aula, sessão, círculo e palestra.' },
                      { q: 'Como funciona o Laboratório 80/20?', a: 'Ele organiza essência, raiz psíquica e aplicação — e envia seus insights para os Jardins.' },
                      { q: 'O que são os Jardins?', a: 'Jardim da Psique (seu processo) e Jardim da Heroína (sua prática).' },
                      { q: 'Posso cancelar?', a: 'Sim. Você controla sua assinatura.' },
                    ]),
              ].map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border/30 rounded-lg px-4 bg-card/30">
                  <AccordionTrigger className="text-sm font-medium text-foreground/90 hover:no-underline py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        {/* ─── CTA FINAL ─────────────────────────────── */}
        <section className="py-16 px-6 text-center">
          <motion.div {...fadeUp} className="max-w-lg mx-auto space-y-5">
            <p className="font-display text-lg sm:text-xl text-foreground font-medium">
              Menos opções. Mais direção. Você entra para atravessar.
            </p>
            <Button variant="gold" size="lg" onClick={handlePrimaryCta}>
              {isAssinante ? 'Ir para Portal Atual' : 'Assinar e Entrar'}
            </Button>
          </motion.div>
        </section>

        <footer className="py-6 text-center">
          <p className="text-xs text-muted-foreground/50 px-6">
            Leitura vira competência. Portal vira prática.
          </p>
        </footer>

        {/* ─── STICKY CTA ────────────────────────────── */}
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-border/20 py-3 px-6 text-center transition-transform duration-300',
            showSticky ? 'translate-y-0' : 'translate-y-full'
          )}
        >
          <Button variant="gold" size="lg" onClick={handlePrimaryCta}>
            {isAssinante ? 'Ir para Portal Atual' : 'Assinar e Entrar'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
