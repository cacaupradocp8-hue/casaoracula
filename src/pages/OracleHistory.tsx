import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sparkles, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOracleBySlug, useOracleDraws } from '@/hooks/useOracles';
import { OracleCardDetail } from '@/components/oracle/OracleCardDetail';
import { OracleCard as OracleCardType, OracleDraw } from '@/types/oracle';
import { AmbientSoundToggle } from '@/components/oracle/AmbientSoundToggle';
import { motion } from 'framer-motion';
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
  const [selectedCard, setSelectedCard] = useState<(OracleCardType & Record<string, any>) | null>(null);

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

  const getSpreadName = (spreadId: string) => spreads.find(s => s.id === spreadId)?.name || 'Tiragem';
  const getCard = (cardId: string) => cards.find(c => c.id === cardId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border/10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`${basePath}/${oracle.slug}`)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm font-display text-foreground/70 tracking-wide">
          Suas Consultas
        </span>
        <AmbientSoundToggle />
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pt-4"
        >
          <p className="text-xs text-muted-foreground/40">{oracle.name}</p>
          <p className="text-xs text-muted-foreground/30 mt-1">{draws.length} {draws.length === 1 ? 'consulta' : 'consultas'}</p>
        </motion.div>

        {draws.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-10 h-10 text-muted-foreground/15 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground/40 mb-6">
              Nenhuma consulta ainda
            </p>
            <Button 
              onClick={() => navigate(`${basePath}/${oracle.slug}/tirar`)}
              style={{ backgroundColor: primaryColor }}
            >
              Fazer Consulta
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {draws.map((draw, index) => (
              <motion.div
                key={draw.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={cn(
                  'p-5 rounded-xl',
                  'bg-card/15 border border-border/10',
                  'hover:border-gold/10 transition-all duration-500'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-medium text-foreground">
                      {getSpreadName(draw.spread_id)}
                    </h3>
                    <p className="text-xs text-muted-foreground/40 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(draw.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground/30">
                    {draw.drawn_cards_json.length} cartas
                  </span>
                </div>

                {/* Card thumbnails */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                  {draw.drawn_cards_json.map((drawnCard, i) => {
                    const card = getCard(drawnCard.cardId) as (OracleCardType & Record<string, any>) | undefined;
                    return (
                      <button
                        key={i}
                        onClick={() => card && setSelectedCard(card)}
                        className="flex-shrink-0 group"
                      >
                        {card?.main_image_url ? (
                          <img 
                            src={card.main_image_url} 
                            alt={card?.title || ''}
                            className="w-14 aspect-[2/3] object-cover rounded-lg ring-1 ring-white/5 group-hover:ring-gold/20 transition-all duration-300"
                          />
                        ) : (
                          <div 
                            className="w-14 aspect-[2/3] rounded-lg flex items-center justify-center ring-1 ring-white/5"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}05)` }}
                          >
                            <Sparkles className="w-3 h-3 text-gold/20" />
                          </div>
                        )}
                        {card && (
                          <p className="text-[9px] text-muted-foreground/30 mt-1 truncate max-w-[56px]">
                            {card.title}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {draw.user_notes && (
                  <p className="text-xs text-muted-foreground/40 italic border-t border-border/5 pt-3 leading-relaxed">
                    "{draw.user_notes}"
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <OracleCardDetail
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        primaryColor={primaryColor}
      />
    </div>
  );
}
