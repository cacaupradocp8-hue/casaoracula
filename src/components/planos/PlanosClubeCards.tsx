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
    <div>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-3">
          Entre no Clube Oracular
        </h2>
        <p className="text-sm text-muted-foreground/60 max-w-lg mx-auto">
          Acesso contínuo à CidaDELA Interior, leituras guiadas e conteúdos que expandem sua percepção — mês a mês.
        </p>
      </motion.div>

      {/* Cards */}
      <div
        className={cn(
          'grid gap-10 max-w-5xl mx-auto',
          ofertas.length === 1 && 'md:grid-cols-1 max-w-md',
          ofertas.length === 2 && 'md:grid-cols-2 max-w-3xl',
          ofertas.length >= 3 && 'md:grid-cols-3'
        )}
      >
        {ofertas.map((oferta, index) => (
          <motion.div
            key={oferta.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.12 }}
          >
            <Card
              className={cn(
                'relative h-full flex flex-col overflow-hidden transition-all duration-500 group',
                'bg-card/40 backdrop-blur-sm border-border/15',
                'hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-10px_hsl(var(--gold)/0.08)]',
                oferta.destaque && 'border-gold/20 bg-card/50 ring-1 ring-gold/10'
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
                    <span className="text-3xl text-gold/40 block mb-4">{oferta.simbolo}</span>
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
                    <p className="text-lg font-semibold text-foreground">{oferta.preco}</p>
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
                    'w-full py-6 text-sm font-medium transition-all duration-300',
                    oferta.destaque
                      ? 'bg-gradient-to-r from-gold to-mystic text-primary-foreground border border-gold/20 hover:scale-105 shadow-[0_0_25px_-6px_hsl(var(--gold)/0.2)]'
                      : 'bg-transparent border border-gold/15 text-foreground hover:bg-gold/5 hover:border-gold/25'
                  )}
                  onClick={() => onSelect(oferta)}
                >
                  {oferta.texto_botao}
                  {isExternal(oferta.link_botao) && (
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
    </div>
  );
}
