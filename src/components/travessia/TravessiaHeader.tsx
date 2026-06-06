import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Map, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TravessiaHeaderProps {
  number: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  temas?: string[];
  Icon: LucideIcon;
  colors: {
    bg: string;
    border: string;
    icon: string;
    text: string;
  };
}

export function TravessiaHeader({
  number,
  title,
  subtitle,
  description,
  temas,
  Icon,
  colors,
}: TravessiaHeaderProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Truncar descrição para mobile
  const truncatedDescription = description && description.length > 100
    ? description.substring(0, 100) + '...'
    : description;

  const shouldCollapse = isMobile && description && description.length > 100;

  return (
    <div className={cn("rounded-2xl p-6 md:p-8 mb-8", colors.bg, "border", colors.border)}>
      <div className="flex items-start gap-4 md:gap-6">
        <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0", colors.icon)}>
          <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className="mb-2 md:mb-3">Travessia {number}</Badge>
          <h1 className={cn("font-display text-2xl md:text-3xl font-bold mb-1 md:mb-2", colors.text)}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-muted-foreground mb-3 md:mb-4">{subtitle}</p>
          )}
          
          {/* Descrição colapsável no mobile */}
          {description && (
            shouldCollapse ? (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                {!isOpen && (
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {truncatedDescription}
                  </p>
                )}
                <CollapsibleContent>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {description}
                  </p>
                </CollapsibleContent>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-auto py-1 px-2 text-muted-foreground hover:text-foreground"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Fechar
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Ler introdução completa
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            ) : (
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
                {description}
              </p>
            )
          )}
          
          {temas && temas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
              {temas.map((tema) => (
                <span
                  key={tema}
                  className="text-xs px-2 md:px-3 py-1 bg-secondary/50 rounded-full text-muted-foreground"
                >
                  {tema}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Banner para desvelar a CidadELA - Exclusivo Travessia 00 */}
      {number === 0 && (
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-midnight border border-gold/30 p-8 shadow-premium-glow group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(196,165,74,0.1),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-gold/60">
                <Map className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.3em] font-bold">Iniciação</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white italic">
                Pronta para desvelar sua <span className="text-gold">CidadELA</span>?
              </h3>
              <p className="text-white/60 text-sm max-w-md italic">
                A cartografia completa que organiza seus padrões internos e revela o mapa da sua travessia.
              </p>
            </div>
            
            <Button 
              variant="gold" 
              size="lg"
              className="rounded-full px-10 h-14 text-base font-bold shadow-glow group hover:scale-105 transition-all shrink-0"
              onClick={() => navigate('/clube/primeira-cartografia')}
            >
              Revelar meu Mapa
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
