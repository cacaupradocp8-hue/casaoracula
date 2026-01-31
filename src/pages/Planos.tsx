import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanosSettings } from '@/hooks/usePlanosSettings';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ExternalLink } from 'lucide-react';

interface PlanData {
  id: string;
  symbol: string;
  name: string;
  forWho: string;
  whatOpens: string;
  includes: string[];
  cta: string;
  featured?: boolean;
}

const PLANS: PlanData[] = [
  {
    id: 'visitante',
    symbol: '🜁',
    name: 'Visitante',
    forWho: 'Para quem está chegando e quer conhecer a Casa',
    whatOpens: 'Acesso à Travessia Zero — uma introdução simbólica ao método',
    includes: [
      'Travessia Zero completa',
      'Introdução ao Labirinto das Portas',
      'Acesso ao Tour da Casa',
      'Entrada no Círculo (fórum)',
    ],
    cta: 'Começar Gratuitamente',
  },
  {
    id: 'formacao',
    symbol: '🜄',
    name: 'Formação',
    forWho: 'Para quem quer se formar no método e aplicar com clientes',
    whatOpens: 'Acesso às Travessias de Formação e ferramentas clínicas',
    includes: [
      'Todas as Travessias de Formação',
      'Ferramentas do Método (Big5, Eneagrama, Jornada)',
      'Sala de Sessão com clientes',
      'Biblioteca de Casos Clínicos',
      'Supervisão no Círculo',
      'Acesso por 12 meses',
    ],
    cta: 'Iniciar Formação',
    featured: true,
  },
  {
    id: 'oracula',
    symbol: '🜃',
    name: 'Orácula',
    forWho: 'Para quem deseja a formação integral + mentorias + certificação',
    whatOpens: 'Acesso completo à Casa, incluindo mentorias ao vivo e selo Orácula',
    includes: [
      'Tudo da Formação',
      'Mentorias ao vivo (2x/mês)',
      'Supervisão clínica individual',
      'Certificação como Orácula',
      'Selo de terapeuta certificada',
      'Acesso vitalício ao conteúdo',
    ],
    cta: 'Atravessar como Orácula',
  },
];

// Subtle divider component
const RitualDivider = () => (
  <div className="flex items-center justify-center py-8 sm:py-10">
    <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    <span className="mx-3 text-gold/40 text-sm">✦</span>
    <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
  </div>
);

export default function Planos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings, isLoading } = usePlanosSettings();

  const handleSelectPlan = (plan: PlanData) => {
    if (plan.id === 'visitante') {
      // Free plan - navigate to visitor room
      if (!isAuthenticated) {
        navigate('/auth', { state: { from: '/sala-da-visitante' } });
      } else {
        navigate('/sala-da-visitante');
      }
      return;
    }

    // Paid plans - require auth first, then open checkout
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/planos', selectedPlan: plan.id } });
      return;
    }

    // Open external checkout
    const checkoutUrl = plan.id === 'formacao' 
      ? settings.rocktyCheckoutFormacaoUrl 
      : settings.rocktyCheckoutOraculaUrl;
    
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    } else {
      // Fallback - go to post-purchase page to show pending
      navigate('/pos-compra');
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent opacity-50" />
          
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="text-gold/60 text-2xl mb-4 block">🜂</span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-wide mb-4">
                Planos & Travessias
              </h1>
              <p className="text-muted-foreground">
                Escolha o caminho que ressoa com o seu momento
              </p>
            </motion.div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-6">
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {PLANS.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      "relative h-full flex flex-col overflow-hidden transition-all duration-300",
                      "bg-card/50 backdrop-blur-sm border-border/40",
                      "hover:border-gold/30 hover:bg-card/70",
                      plan.featured && "border-gold/40 bg-card/60 ring-1 ring-gold/20"
                    )}
                  >
                    {plan.featured && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                        <Badge className="absolute top-4 right-4 bg-gold/20 text-gold border-gold/30 text-xs">
                          Recomendado
                        </Badge>
                      </>
                    )}
                    
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <span className="text-2xl text-gold/70 block mb-3">
                          {plan.symbol}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {plan.forWho}
                        </p>
                      </div>

                      {/* What Opens */}
                      <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-sm text-foreground/90 font-medium text-center">
                          {plan.whatOpens}
                        </p>
                      </div>

                      {/* Includes */}
                      <div className="flex-1 mb-6">
                        <ul className="space-y-2.5">
                          {plan.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                              <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <Button
                        variant={plan.featured ? "gold" : "outline"}
                        size="lg"
                        className={cn(
                          "w-full py-5 text-sm font-medium",
                          !plan.featured && "border-gold/30 hover:bg-gold/10 hover:border-gold/50"
                        )}
                        onClick={() => handleSelectPlan(plan)}
                        disabled={isLoading && plan.id !== 'visitante'}
                      >
                        {plan.cta}
                        {plan.id !== 'visitante' && (
                          <ExternalLink className="w-3.5 h-3.5 ml-2" />
                        )}
                      </Button>
                    </CardContent>

                    {plan.featured && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <RitualDivider />

        {/* Closing Note */}
        <section className="py-10 sm:py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto text-center space-y-4"
            >
              <p className="text-foreground/90">
                Não há pressa. A Casa continua aqui.
              </p>
              <p className="text-muted-foreground text-sm">
                Escolha quando o corpo estiver de acordo.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="py-8 border-t border-border/20">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs text-muted-foreground/60">
              🔒 A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
