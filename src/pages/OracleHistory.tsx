import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sparkles, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOracleBySlug, useOracleDraws } from '@/hooks/useOracles';
import { AmbientSoundToggle } from '@/components/oracle/AmbientSoundToggle';
import { cn } from '@/lib/utils';

function useOracleBasePath() {
  const location = useLocation();
  return location.pathname.startsWith('/casa-das-maquinas') 
    ? '/casa-das-maquinas/oraculo' 
    : '/oraculos';
}

export default function OracleHistory() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const navigate = useNavigate();
  const basePath = useOracleBasePath();
  const { oracle, spreads, cards, isLoading: oracleLoading, hasAccess } = useOracleBySlug(oracleSlug || '');
  const { draws, isLoading: drawsLoading } = useOracleDraws(oracle?.id);

  const isLoading = oracleLoading || drawsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-8 h-8 animate-breathe text-primary" />
      </div>
    );
  }

  if (!oracle || !hasAccess()) {
    navigate(basePath);
    return null;
  }

  const primaryColor = oracle.theme_json?.primaryColor || 'hsl(var(--gold))';
  const backgroundColor = oracle.theme_json?.backgroundColor || 'hsl(var(--midnight))';

  const getSpreadName = (spreadId: string) => {
    return spreads.find(s => s.id === spreadId)?.name || 'Tiragem';
  };

  const getCard = (cardId: string) => {
    return cards.find(c => c.id === cardId);
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      <header className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`${basePath}/${oracle.slug}`)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <span className="text-xs text-muted-foreground">
          Histórico
        </span>
        
        <AmbientSoundToggle />
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full p-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-display text-foreground mb-1">
            Suas Consultas
          </h1>
          <p className="text-sm text-muted-foreground">
            {oracle.name}
          </p>
        </div>

        {draws.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-6">
              Nenhuma consulta ainda
            </p>
            <Button 
              onClick={() => navigate(`${basePath}/${oracle.slug}/tirar`)}
              style={{ backgroundColor: primaryColor }}
            >
              Fazer Consulta
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {draws.map((draw, index) => (
              <div 
                key={draw.id}
                className={cn(
                  'p-4 rounded-xl',
                  'bg-card/20 border border-border/10',
                  'animate-fade-in'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {getSpreadName(draw.spread_id)}
                    </h3>
                    <p className="text-xs text-muted-foreground/70 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(draw.created_at), "d MMM yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {draw.drawn_cards_json.map((drawnCard, i) => {
                    const card = getCard(drawnCard.cardId);
                    return (
                      <div key={i} className="flex-shrink-0">
                        {card?.main_image_url ? (
                          <img 
                            src={card.main_image_url} 
                            alt={card?.title || 'Card'}
                            className="w-12 h-18 object-cover rounded"
                            style={{ aspectRatio: '2/3' }}
                          />
                        ) : (
                          <div 
                            className="w-12 rounded flex items-center justify-center"
                            style={{ 
                              aspectRatio: '2/3',
                              backgroundColor: `${primaryColor}20` 
                            }}
                          >
                            <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {draw.user_notes && (
                  <p className="text-xs text-muted-foreground/70 italic border-t border-border/10 pt-3">
                    "{draw.user_notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
