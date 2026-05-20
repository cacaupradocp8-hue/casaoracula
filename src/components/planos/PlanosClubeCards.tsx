import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Oferta } from '@/hooks/useOfertas';

interface Props {
  ofertas: Oferta[];
  onSelect: (oferta: Oferta) => void;
}

const isExternal = (link: string) =>
  link.startsWith('http://') || link.startsWith('https://');

export function PlanosClubeCards({ ofertas, onSelect }: Props) {
  return (
    <div id="secao-planos">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
          Escolha sua forma de habitar as Rotas
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comece mês a mês ou escolha uma travessia anual com continuidade.
        </p>
      </motion.div>

      <div
        className={cn(
          'grid gap-8 max-w-6xl mx-auto items-stretch',
          ofertas.length === 1 && 'md:grid-cols-1 max-w-md',
          ofertas.length === 2 && 'md:grid-cols-2 max-w-4xl',
          ofertas.length >= 3 && 'md:grid-cols-3'
        )}
      >
        {ofertas.map((oferta, index) => (
          <motion.div
            key={oferta.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            className="flex"
          >
            <Card
              className={cn(
                'relative flex flex-col w-full overflow-hidden transition-all duration-500',
                'bg-card/30 backdrop-blur-md border-border/10',
                'hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_hsl(var(--gold)/0.15)]',
                oferta.destaque && 'border-gold/30 bg-card/60 ring-1 ring-gold/20 scale-105 z-10'
              )}
            >
              {oferta.destaque && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
              )}

              {oferta.badge && (
                <Badge className="absolute top-6 right-6 bg-gold/10 text-gold border-gold/20 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                  {oferta.badge}
                </Badge>
              )}

              <CardContent className="p-10 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3 tracking-wide">
                    {oferta.nome}
                  </h3>
                  {oferta.subtitulo && (
                    <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                      {oferta.subtitulo}
                    </p>
                  )}
                </div>

                {!oferta.gratuito && oferta.preco && (
                  <div className="mb-10 pb-8 border-b border-border/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">{oferta.preco}</span>
                    </div>
                  </div>
                )}

                <div className="flex-1 mb-10">
                  <ul className="space-y-4">
                    {oferta.inclusoes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-snug">
                        <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  size="lg"
                  className={cn(
                    'w-full py-7 text-base font-semibold transition-all duration-300 rounded-xl',
                    oferta.destaque
                      ? 'bg-gold hover:bg-gold-light text-primary-foreground shadow-lg shadow-gold/20'
                      : 'bg-transparent border-2 border-gold/20 text-foreground hover:bg-gold/5 hover:border-gold/40'
                  )}
                  onClick={() => onSelect(oferta)}
                >
                  {oferta.texto_botao}
                  {isExternal(oferta.link_botao) && (
                    <ExternalLink className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
