import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Loader2, Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobilePageShell } from '@/components/shared/MobilePageShell';
import { useOracles } from '@/hooks/useOracles';
import { OracleDeck } from '@/types/oracle';
import { cn } from '@/lib/utils';

export default function Oraculos() {
  const navigate = useNavigate();
  const { oracles, isLoading, hasAccess } = useOracles();

  const publishedOracles = oracles.filter(o => o.status === 'published' || hasAccess(o));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Sparkles className="w-8 h-8 animate-breathe text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MobilePageShell
        badge="Oráculos"
        title="Oráculos"
        subtitle="Portas para a sabedoria interior"
        collapsibles={[
          {
            title: "O que são os Oráculos?",
            children: "Instrumentos de escuta oracular que acessam a linguagem do inconsciente através de cartas, imagens e práticas de leitura simbólica.",
          },
          {
            title: "Como usar",
            children: "Escolha um oráculo, prepare sua intenção e realize uma tiragem. Cada consulta é registrada no seu histórico.",
          },
        ]}
      >
        <section className="pb-16">
          {publishedOracles.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                Os oráculos estão sendo preparados
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {publishedOracles.map((oracle, index) => (
                <OracleCard 
                  key={oracle.id} 
                  oracle={oracle} 
                  hasAccess={hasAccess(oracle)} 
                  onNavigate={() => navigate(`/oraculos/${oracle.slug}`)}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </MobilePageShell>
    </AppLayout>
  );
}

interface OracleCardProps {
  oracle: OracleDeck;
  hasAccess: boolean;
  onNavigate: () => void;
  index: number;
}

function OracleCard({ oracle, hasAccess, onNavigate, index }: OracleCardProps) {
  const navigate = useNavigate();
  const primaryColor = oracle.theme_json?.primaryColor || 'hsl(var(--gold))';
  const backgroundColor = oracle.theme_json?.backgroundColor || 'hsl(var(--midnight))';

  return (
    <div 
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-card/30 hover:bg-card/50 transition-all duration-700',
        'animate-fade-in cursor-pointer'
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
      onClick={hasAccess ? onNavigate : undefined}
    >
      {/* Cover Image - Large prominence */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {oracle.cover_image_url ? (
          <img 
            src={oracle.cover_image_url} 
            alt={oracle.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}20 100%)` 
            }}
          >
            <Sparkles className="w-16 h-16 text-primary/30 animate-breathe" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent',
            'opacity-80 group-hover:opacity-70 transition-opacity duration-500'
          )} 
        />
        
        {/* Locked Overlay */}
        {!hasAccess && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-6">
              <Lock className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {oracle.lock_message_title}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content - Minimal */}
      <div className="relative p-6 -mt-16 z-10">
        <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-1">
          {oracle.name}
        </h3>
        
        {oracle.subtitle && (
          <p className="text-sm text-muted-foreground mb-4">
            {oracle.subtitle}
          </p>
        )}

        {hasAccess ? (
          <Button 
            variant="ghost"
            className="p-0 h-auto text-sm group/btn hover:bg-transparent"
            style={{ color: primaryColor }}
          >
            <span className="relative">
              Consultar
              <span 
                className="absolute -bottom-0.5 left-0 w-0 h-px group-hover/btn:w-full transition-all duration-300"
                style={{ backgroundColor: primaryColor }}
              />
            </span>
          </Button>
        ) : (
          <Button 
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(oracle.upgrade_cta_route);
            }}
            className="p-0 h-auto text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            {oracle.upgrade_cta_text}
          </Button>
        )}
      </div>
    </div>
  );
}
