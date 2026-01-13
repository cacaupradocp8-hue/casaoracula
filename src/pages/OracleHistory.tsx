import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sparkles, Loader2, ArrowLeft, Calendar, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOracleBySlug, useOracleDraws } from '@/hooks/useOracles';

export default function OracleHistory() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const navigate = useNavigate();
  const { oracle, spreads, cards, isLoading: oracleLoading, hasAccess } = useOracleBySlug(oracleSlug || '');
  const { draws, isLoading: drawsLoading } = useOracleDraws(oracle?.id);

  const isLoading = oracleLoading || drawsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0D1A]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!oracle || !hasAccess()) {
    navigate('/oraculos');
    return null;
  }

  const theme = oracle.theme_json;

  const getSpreadName = (spreadId: string) => {
    return spreads.find(s => s.id === spreadId)?.name || 'Tiragem';
  };

  const getCardTitle = (cardId: string) => {
    return cards.find(c => c.id === cardId)?.title || 'Carta';
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.backgroundColor || '#0F0D1A',
        fontFamily: theme.fontFamily || 'serif'
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border/20">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/oraculos/${oracle.slug}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <h1 className="text-sm font-medium text-muted-foreground">
          Histórico
        </h1>
        
        <div className="w-20" />
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Suas Tiragens
          </h1>
          <p className="text-muted-foreground">
            {oracle.name}
          </p>
        </div>

        {draws.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma tiragem ainda
            </h3>
            <p className="text-muted-foreground mb-6">
              Faça sua primeira tiragem para começar seu histórico.
            </p>
            <Button 
              onClick={() => navigate(`/oraculos/${oracle.slug}/tirar`)}
              style={{ backgroundColor: theme.primaryColor }}
            >
              Fazer Tiragem
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {draws.map((draw) => (
              <Card 
                key={draw.id}
                className="bg-card/30 border-border/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {getSpreadName(draw.spread_id)}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(draw.created_at), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  {/* Cards drawn */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {draw.drawn_cards_json.map((drawnCard, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {getCardTitle(drawnCard.cardId)}
                      </span>
                    ))}
                  </div>

                  {/* Notes */}
                  {draw.user_notes && (
                    <p className="text-sm text-muted-foreground italic border-t border-border/20 pt-3 mt-3">
                      "{draw.user_notes}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
