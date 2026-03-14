import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOfertas, Oferta } from '@/hooks/useOfertas';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import planosBanner from '@/assets/planos-banner.png';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Planos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { ofertas, isLoading } = useOfertas();

  const handleSelectOferta = (oferta: Oferta) => {
    const link = oferta.link_botao;

    if (link.startsWith('http://') || link.startsWith('https://')) {
      if (!oferta.gratuito && !isAuthenticated) {
        navigate('/auth', { state: { from: '/planos', selectedPlan: oferta.id } });
        return;
      }
      window.open(link, '_blank');
      return;
    }

    if (oferta.gratuito) {
      if (!isAuthenticated && link !== '/planos') {
        navigate('/auth', { state: { from: link } });
      } else {
        navigate(link);
      }
      return;
    }

    if (!isAuthenticated) {
      navigate('/auth', { state: { from: link, selectedPlan: oferta.id } });
      return;
    }

    navigate(link);
  };

  const isExternalLink = (link: string) =>
    link.startsWith('http://') || link.startsWith('https://');

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="relative overflow-hidden">
            <img
              src={planosBanner}
              alt="Planos & Travessias"
              className="w-full h-auto max-h-[28rem] object-contain"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Breathing orb — ONLY in hero */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-mystic/5 blur-3xl animate-breathe pointer-events-none" />

          <div className="container mx-auto px-6 -mt-4 relative z-10 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide mb-4">
                Planos da Casa Orácula
              </h1>
              <p className="text-gold/60 font-display italic text-lg">
                Infraestrutura para a prática. Ética para a condução.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/20" />
                <Sparkles className="w-3 h-3 text-gold/25" />
                <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/20" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : ofertas.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground/60">
                Nenhuma oferta disponível no momento.
              </div>
            ) : (
              <div className={cn(
                "grid gap-10 max-w-5xl mx-auto",
                ofertas.length === 1 && "md:grid-cols-1 max-w-md",
                ofertas.length === 2 && "md:grid-cols-2 max-w-3xl",
                ofertas.length >= 3 && "md:grid-cols-3"
              )}>
                {ofertas.map((oferta, index) => (
                  <motion.div
                    key={oferta.id}
                    {...fadeInUp}
                    transition={{ duration: 0.8, delay: index * 0.12 }}
                  >
                    <Card
                      className={cn(
                        "relative h-full flex flex-col overflow-hidden transition-all duration-500 group",
                        "bg-card/40 backdrop-blur-sm border-border/15",
                        "hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-10px_hsl(var(--gold)/0.08)]",
                        oferta.destaque && "border-gold/20 bg-card/50 ring-1 ring-gold/10"
                      )}
                    >
                      {oferta.destaque && (
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                      )}

                      {oferta.badge && (
                        <Badge className="absolute top-4 right-4 bg-mystic/15 text-mystic-light border-mystic/15 text-xs">
                          {oferta.badge}
                        </Badge>
                      )}

                      <CardContent className="p-9 flex flex-col h-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                          {oferta.simbolo && (
                            <span className="text-3xl text-gold/40 block mb-4">
                              {oferta.simbolo}
                            </span>
                          )}
                          <h3 className="font-display text-xl font-semibold text-foreground mb-2 tracking-wide">
                            {oferta.nome}
                          </h3>
                          {oferta.subtitulo && (
                            <p className="text-sm text-muted-foreground/60 leading-relaxed">
                              {oferta.subtitulo}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        {!oferta.gratuito && oferta.preco && (
                          <div className="mb-8 p-5 rounded-xl bg-muted/10 border border-border/10 text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {oferta.preco}
                            </p>
                          </div>
                        )}

                        {/* Includes */}
                        <div className="flex-1 mb-8">
                          <ul className="space-y-3.5">
                            {oferta.inclusoes.map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-foreground/60">
                                <Check className="w-4 h-4 text-gold/50 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA */}
                        <Button
                          size="lg"
                          className={cn(
                            "w-full py-6 text-sm font-medium transition-all duration-300",
                            oferta.destaque
                              ? "bg-gradient-to-r from-gold to-mystic text-primary-foreground border border-gold/20 hover:scale-105 shadow-[0_0_25px_-6px_hsl(var(--gold)/0.2)]"
                              : "bg-transparent border border-gold/15 text-foreground hover:bg-gold/5 hover:border-gold/25"
                          )}
                          onClick={() => handleSelectOferta(oferta)}
                        >
                          {oferta.texto_botao}
                          {isExternalLink(oferta.link_botao) && (
                            <ExternalLink className="w-3.5 h-3.5 ml-2" />
                          )}
                        </Button>
                      </CardContent>

                      {oferta.destaque && (
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Nota ética */}
        <footer className="py-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/15" />
            <span className="text-gold/20 text-xs">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/15" />
          </div>
          <p className="text-xs text-muted-foreground/40 max-w-md mx-auto px-6 leading-relaxed">
            O plano permite o uso do sistema. A condução simbólica depende do nível de formação.
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}
