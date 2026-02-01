import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOfertas, Oferta } from '@/hooks/useOfertas';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ExternalLink, Loader2 } from 'lucide-react';

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
  const { ofertas, isLoading } = useOfertas();

  const handleSelectOferta = (oferta: Oferta) => {
    const link = oferta.link_botao;
    
    // Check if it's an external link
    if (link.startsWith('http://') || link.startsWith('https://')) {
      // For paid plans, require auth first
      if (!oferta.gratuito && !isAuthenticated) {
        navigate('/auth', { state: { from: '/planos', selectedPlan: oferta.id } });
        return;
      }
      window.open(link, '_blank');
      return;
    }

    // Internal navigation
    if (oferta.gratuito) {
      // Free plan - navigate directly or require auth
      if (!isAuthenticated && link !== '/planos') {
        navigate('/auth', { state: { from: link } });
      } else {
        navigate(link);
      }
      return;
    }

    // Paid plans - require auth first
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : ofertas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma oferta disponível no momento.
              </div>
            ) : (
              <div className={cn(
                "grid gap-6 max-w-5xl mx-auto",
                ofertas.length === 1 && "md:grid-cols-1 max-w-md",
                ofertas.length === 2 && "md:grid-cols-2 max-w-3xl",
                ofertas.length >= 3 && "md:grid-cols-3"
              )}>
                {ofertas.map((oferta, index) => (
                  <motion.div
                    key={oferta.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "relative h-full flex flex-col overflow-hidden transition-all duration-300",
                        "bg-card/50 backdrop-blur-sm border-border/40",
                        "hover:border-gold/30 hover:bg-card/70",
                        oferta.destaque && "border-gold/40 bg-card/60 ring-1 ring-gold/20"
                      )}
                    >
                      {oferta.destaque && (
                        <>
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                        </>
                      )}
                      
                      {oferta.badge && (
                        <Badge className="absolute top-4 right-4 bg-gold/20 text-gold border-gold/30 text-xs">
                          {oferta.badge}
                        </Badge>
                      )}
                      
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Header */}
                        <div className="text-center mb-6">
                          <span className="text-2xl text-gold/70 block mb-3">
                            {oferta.simbolo}
                          </span>
                          <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                            {oferta.nome}
                          </h3>
                          {oferta.subtitulo && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {oferta.subtitulo}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        {!oferta.gratuito && oferta.preco && (
                          <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {oferta.preco}
                            </p>
                          </div>
                        )}

                        {/* Includes */}
                        <div className="flex-1 mb-6">
                          <ul className="space-y-2.5">
                            {oferta.inclusoes.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA */}
                        <Button
                          variant={oferta.destaque ? "gold" : "outline"}
                          size="lg"
                          className={cn(
                            "w-full py-5 text-sm font-medium",
                            !oferta.destaque && "border-gold/30 hover:bg-gold/10 hover:border-gold/50"
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
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
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
