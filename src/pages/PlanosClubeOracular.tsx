import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

const CHECKOUT_MENSAL_URL = '#'; // placeholder — substituir por URL real
const CHECKOUT_ANUAL_URL = '#';

export default function PlanosClubeOracular() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const planosRef = useRef<HTMLDivElement>(null);

  const isAssinante = user && canAccessFeature(user.portal, 'assinante');

  const scrollToPlanos = () =>
    planosRef.current?.scrollIntoView({ behavior: 'smooth' });

  // ─── HERO ─────────────────────────────────────────────
  const Hero = () => (
    <section className="py-16 sm:py-24 text-center px-6">
      <motion.div {...fadeUp} className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
          Círculo de Leitura Oracular
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Leitura que se torna competência clínica. Um livro por vez, um portal por travessia.
        </p>

        {isAssinante ? (
          <Button variant="gold" size="lg" onClick={() => navigate('/clube-livro')}>
            Ir para o Portal Atual
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="gold" size="lg" onClick={scrollToPlanos}>
              Assinar agora
            </Button>
            <Button variant="outline" size="lg" className="border-gold/30 hover:bg-gold/10" onClick={scrollToPlanos}>
              Ver como funciona
              <ArrowDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {!isAssinante && (
          <p className="text-xs text-muted-foreground/60 pt-2">
            Cancele quando quiser. Sem fidelidade.
          </p>
        )}
      </motion.div>
    </section>
  );

  // ─── O QUE É ──────────────────────────────────────────
  const OQueE = () => (
    <section className="py-12 px-6">
      <motion.div {...fadeUp} className="max-w-xl mx-auto text-center space-y-6">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
          O que é o Círculo
        </h2>
        <ul className="space-y-3 text-left max-w-md mx-auto">
          {[
            'Você deixa de consumir livros — e começa a habitar a leitura.',
            'Cada portal transforma um eixo real da sua prática profissional.',
            'Leitura simbólica vira competência clínica aplicável.',
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );

  // ─── COMO FUNCIONA ────────────────────────────────────
  const ComoFunciona = () => {
    const steps = ['Calendário', 'Livro', 'Tour', 'Portais', 'Lab 80/20', 'Jardins'];
    return (
      <section className="py-12 px-6 border-y border-border/20">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
            Como funciona
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 sm:gap-2">
                <span className="px-3 py-1.5 rounded-full bg-card border border-border/40 text-xs sm:text-sm font-medium text-foreground/80">
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gold/50 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  };

  // ─── O QUE VOCÊ RECEBE ────────────────────────────────
  const OQueRecebe = () => {
    const items = [
      { title: 'Portal Atual', desc: 'Áudios, aula, prática guiada e jardim de escrita.' },
      { title: 'Biblioteca de Portais', desc: 'Acesso a todos os portais anteriores.' },
      { title: 'Comunidade', desc: 'Espaço de troca entre leitoras e facilitadoras.' },
      { title: 'Rituais & Checklists', desc: 'Ferramentas de integração para cada travessia.' },
    ];
    return (
      <section className="py-12 px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
            O que você recebe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
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
    );
  };

  // ─── PLANOS ───────────────────────────────────────────
  const Planos = () => {
    if (isAssinante) return null;

    const plans = [
      {
        name: 'Mensal',
        price: 'R$ 67/mês',
        destaque: false,
        benefits: [
          'Acesso ao Portal Atual',
          'Biblioteca de Portais',
          'Comunidade',
          'Cancele quando quiser',
        ],
        url: CHECKOUT_MENSAL_URL,
      },
      {
        name: 'Anual',
        price: 'R$ 497/ano',
        destaque: true,
        badge: 'Mais vantajoso',
        benefits: [
          'Tudo do plano mensal',
          'Economia de mais de 30%',
          'Acesso garantido a todos os portais do ciclo',
          'Prioridade em eventos ao vivo',
        ],
        url: CHECKOUT_ANUAL_URL,
      },
    ];

    return (
      <section ref={planosRef} className="py-16 px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
            Escolha seu plano
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {plans.map((plan) => (
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
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    Plano {plan.name}
                  </h3>
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
                    Assinar {plan.name}
                  </Button>
                </CardContent>
                {plan.destaque && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                )}
              </Card>
            ))}
          </div>
        </motion.div>
      </section>
    );
  };

  // ─── PARA QUEM É / NÃO É ─────────────────────────────
  const ParaQuem = () => (
    <section className="py-12 px-6 border-t border-border/20">
      <motion.div {...fadeUp} className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-display text-base font-semibold text-foreground">Para quem é</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            {[
              'Terapeutas que querem aprofundar a escuta simbólica.',
              'Psicólogas interessadas em leitura como ferramenta clínica.',
              'Mentoras do feminino que buscam repertório ético.',
              'Mulheres que lêem com intenção, não por consumo.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-base font-semibold text-foreground">Para quem não é</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              'Quem busca resumos rápidos de livros.',
              'Quem quer entretenimento literário sem prática.',
              'Quem não tem interesse em desenvolvimento profissional.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-muted-foreground/50 mt-0.5">✕</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );

  // ─── FAQ ──────────────────────────────────────────────
  const Faq = () => {
    const items = [
      { q: 'Preciso ler o livro inteiro?', a: 'Não. O Círculo trabalha com trechos simbólicos e traduções práticas — você não precisa terminar o livro para participar.' },
      { q: 'Tenho acesso aos portais anteriores?', a: 'Sim. Todos os portais já publicados ficam disponíveis na Biblioteca de Portais.' },
      { q: 'Posso cancelar a qualquer momento?', a: 'Sim. Sem fidelidade, sem multa. Você mantém acesso até o fim do período pago.' },
      { q: 'É para psicólogas ou terapeutas holísticas?', a: 'Para ambas. O Círculo trabalha com leitura simbólica aplicada — útil em qualquer abordagem terapêutica.' },
      { q: 'O que é o Laboratório 80/20?', a: 'É a ferramenta que transforma o livro em aplicação profissional: 80% prática, 20% teoria.' },
      { q: 'Posso participar sendo iniciante?', a: 'Sim. O Círculo é progressivo. Cada portal tem seu próprio ponto de entrada.' },
    ];
    return (
      <section className="py-12 px-6">
        <motion.div {...fadeUp} className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
            Perguntas frequentes
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {items.map((item, i) => (
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
    );
  };

  // ─── CTA FINAL ────────────────────────────────────────
  const CtaFinal = () => (
    <section className="py-16 px-6 text-center">
      <motion.div {...fadeUp} className="max-w-lg mx-auto space-y-5">
        <p className="font-display text-lg sm:text-xl text-foreground font-medium">
          A próxima travessia já começou. Sua cadeira está reservada.
        </p>
        {isAssinante ? (
          <Button variant="gold" size="lg" onClick={() => navigate('/clube-livro')}>
            Ir para o Portal Atual
          </Button>
        ) : (
          <Button variant="gold" size="lg" onClick={scrollToPlanos}>
            Assinar e Entrar no Portal Atual
          </Button>
        )}
      </motion.div>
    </section>
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-black">
        <Hero />
        <OQueE />
        <ComoFunciona />
        <OQueRecebe />
        <Planos />
        <ParaQuem />
        <Faq />
        <CtaFinal />
        <footer className="py-6 text-center">
          <p className="text-xs text-muted-foreground/50 px-6">
            O Círculo forma pela leitura. A condução simbólica depende do nível de formação.
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}
