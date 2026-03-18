import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Sparkles, Loader2, ArrowLeft, RotateCcw, Save, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useOracleBySlug, useOracleDraws } from '@/hooks/useOracles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OracleCard as OracleCardType, OracleSpread, DrawnCard } from '@/types/oracle';
import { OracleCard } from '@/components/oracle/OracleCard';
import { MeditationPause } from '@/components/oracle/MeditationPause';
import { AmbientSoundToggle } from '@/components/oracle/AmbientSoundToggle';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import { cn } from '@/lib/utils';

type DrawStep = 'select-spread' | 'meditation' | 'drawing' | 'reveal' | 'closing';

export default function OracleDraw() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { oracle, cards, spreads, isLoading, hasAccess } = useOracleBySlug(oracleSlug || '');
  const { saveDraw } = useOracleDraws();

  const [step, setStep] = useState<DrawStep>('select-spread');
  const [selectedSpread, setSelectedSpread] = useState<OracleSpread | null>(null);
  const [drawnCards, setDrawnCards] = useState<OracleCardType[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [userNotes, setUserNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [showCardText, setShowCardText] = useState(false);
  const [showJardimModal, setShowJardimModal] = useState(false);
  const [savedDrawData, setSavedDrawData] = useState<{cards: OracleCardType[], spread: OracleSpread | null, notes: string} | null>(null);

  // Pre-select spread from URL
  useEffect(() => {
    const spreadId = searchParams.get('spread');
    if (spreadId && spreads.length > 0) {
      const spread = spreads.find(s => s.id === spreadId);
      if (spread && spread.status === 'published') {
        setSelectedSpread(spread);
        setStep('meditation');
      }
    }
  }, [searchParams, spreads]);

  // Draw cards
  const drawCards = useCallback(() => {
    if (!selectedSpread) return;
    
    const publishedCards = cards.filter(c => c.status === 'published');
    const shuffled = [...publishedCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, selectedSpread.number_of_cards);
    
    setDrawnCards(drawn);
    setRevealedIndices([]);
    setCurrentRevealIndex(0);
    setShowCardText(false);
    setStep('drawing');
  }, [selectedSpread, cards]);

  // Handle meditation complete
  const handleMeditationComplete = () => {
    drawCards();
  };

  // Reveal next card
  const revealCard = useCallback((index: number) => {
    if (!revealedIndices.includes(index)) {
      setRevealedIndices(prev => [...prev, index]);
    }
  }, [revealedIndices]);

  // Check if all cards are revealed
  useEffect(() => {
    if (step === 'drawing' && drawnCards.length > 0 && revealedIndices.length === drawnCards.length) {
      // Pause before showing text
      const timer = setTimeout(() => {
        setShowCardText(true);
        setTimeout(() => setStep('reveal'), 1000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, drawnCards.length, revealedIndices.length]);

  // Auto-reveal for "all_at_once" mode
  useEffect(() => {
    if (step === 'drawing' && selectedSpread && drawnCards.length > 0) {
      const rules = selectedSpread.rules_json;
      if (rules?.revealMode === 'all_at_once') {
        setTimeout(() => {
          setRevealedIndices(drawnCards.map((_, i) => i));
        }, 500);
      }
    }
  }, [step, selectedSpread, drawnCards]);

  // Save draw
  const handleSaveDraw = async () => {
    if (!oracle || !selectedSpread || !user) return;
    
    setIsSaving(true);
    try {
      const drawnCardsJson: DrawnCard[] = drawnCards.map((card, index) => ({
        cardId: card.id,
        positionName: selectedSpread.positions_json?.[index]?.name || `Posição ${index + 1}`,
        positionIndex: index,
      }));

      await saveDraw({
        oracle_id: oracle.id,
        spread_id: selectedSpread.id,
        user_id: user.id,
        drawn_cards_json: drawnCardsJson,
        user_notes: userNotes || null,
        is_professional_session: false,
        client_id: null,
      });

      toast({ title: 'Tiragem salva' });
      
      // Guardar dados para o Jardim e abrir modal
      setSavedDrawData({
        cards: drawnCards,
        spread: selectedSpread,
        notes: userNotes,
      });
      setShowJardimModal(true);
    } catch (error) {
      console.error('Error saving draw:', error);
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset draw
  const resetDraw = () => {
    setDrawnCards([]);
    setRevealedIndices([]);
    setCurrentRevealIndex(0);
    setUserNotes('');
    setExpandedCardIndex(null);
    setShowCardText(false);
    setStep('meditation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-8 h-8 animate-breathe text-primary" />
      </div>
    );
  }

  if (!oracle || !hasAccess()) {
    navigate('/oraculos');
    return null;
  }

  const primaryColor = oracle.theme_json?.primaryColor || 'hsl(var(--gold))';
  const backgroundColor = oracle.theme_json?.backgroundColor || 'hsl(var(--midnight))';
  const cardBackImage = oracle.theme_json?.cardBackImage || null;
  const openingText = oracle.voice_settings_json?.openingText;
  const closingText = oracle.voice_settings_json?.closingText;
  const publishedSpreads = spreads.filter(s => s.status === 'published');

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Minimal Header */}
      <header className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`/oraculos/${oracle.slug}`)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <span className="text-xs text-muted-foreground">
          {oracle.name}
        </span>
        
        <AmbientSoundToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Step: Select Spread */}
        {step === 'select-spread' && (
          <div className="w-full max-w-sm animate-fade-in">
            <h2 className="text-2xl font-display text-center text-foreground mb-8">
              Escolha uma tiragem
            </h2>
            
            <div className="space-y-3">
              {publishedSpreads.map((spread) => (
                <button
                  key={spread.id}
                  onClick={() => {
                    setSelectedSpread(spread);
                    setStep('meditation');
                  }}
                  className={cn(
                    'w-full p-5 rounded-xl text-left',
                    'bg-card/30 hover:bg-card/50 transition-all duration-300',
                    'border border-border/20 hover:border-border/40'
                  )}
                >
                  <h3 className="font-medium text-foreground">{spread.name}</h3>
                  {spread.description && (
                    <p className="text-sm text-muted-foreground/70 mt-1">{spread.description}</p>
                  )}
                  <p className="text-xs mt-2" style={{ color: primaryColor }}>
                    {spread.number_of_cards} {spread.number_of_cards === 1 ? 'carta' : 'cartas'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Meditation Pause */}
        {step === 'meditation' && selectedSpread && (
          <MeditationPause
            duration={4}
            message={selectedSpread.opening_text || openingText || 'Respire fundo...'}
            onComplete={handleMeditationComplete}
            primaryColor={primaryColor}
          />
        )}

        {/* Step: Drawing (Card Reveal) */}
        {step === 'drawing' && (
          <div className="w-full max-w-2xl animate-fade-in">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {drawnCards.map((card, index) => {
                const isRevealed = revealedIndices.includes(index);
                const position = selectedSpread?.positions_json?.[index];
                
                return (
                  <div 
                    key={card.id}
                    className={cn(
                      'flex flex-col items-center',
                      'animate-fade-in'
                    )}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <OracleCard
                      frontImage={card.main_image_url}
                      backImage={cardBackImage}
                      title={card.title}
                      isRevealed={isRevealed}
                      primaryColor={primaryColor}
                      size="lg"
                      onClick={() => revealCard(index)}
                      showGlow={isRevealed}
                    />
                    
                    {/* Position label */}
                    {position && (
                      <p 
                        className={cn(
                          'text-xs text-center text-muted-foreground mt-3',
                          'transition-opacity duration-500',
                          isRevealed ? 'opacity-100' : 'opacity-0'
                        )}
                      >
                        {position.name}
                      </p>
                    )}

                    {/* Card title hint */}
                    {showCardText && isRevealed && (
                      <p 
                        className="text-sm font-display text-foreground mt-1 animate-reveal-text text-center"
                      >
                        {card.title}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tap hint */}
            {revealedIndices.length < drawnCards.length && (
              <p className="text-center text-xs text-muted-foreground/50 mt-8 animate-breathe">
                Toque nas cartas para revelar
              </p>
            )}
          </div>
        )}

        {/* Step: Reveal (Full Reading) */}
        {step === 'reveal' && (
          <div className="w-full max-w-lg space-y-6 animate-fade-in">
            <h2 className="text-xl font-display text-center text-foreground mb-6">
              Sua Leitura
            </h2>
            
            {drawnCards.map((card, index) => {
              const position = selectedSpread?.positions_json?.[index];
              const isExpanded = expandedCardIndex === index;
              
              return (
                <Card 
                  key={card.id}
                  className="bg-card/20 border-border/20 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      {/* Card Image */}
                      <div className="w-20 flex-shrink-0">
                        {card.main_image_url ? (
                          <img 
                            src={card.main_image_url} 
                            alt={card.title}
                            className="w-full aspect-[2/3] object-cover rounded-lg"
                          />
                        ) : (
                          <div 
                            className="w-full aspect-[2/3] rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                          >
                            <Sparkles className="w-6 h-6" style={{ color: primaryColor }} />
                          </div>
                        )}
                      </div>
                      
                      {/* Card Content */}
                      <div className="flex-1 min-w-0">
                        {position && (
                          <p className="text-xs font-medium mb-1" style={{ color: primaryColor }}>
                            {position.name}
                          </p>
                        )}
                        
                        <h3 className="text-lg font-display font-medium text-foreground">
                          {card.title}
                        </h3>
                        
                        {card.subtitle && (
                          <p className="text-xs text-muted-foreground">
                            {card.subtitle}
                          </p>
                        )}
                        
                        {card.short_message && (
                          <p className="text-sm text-foreground/80 mt-3">
                            {card.short_message}
                          </p>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 -ml-2 text-xs text-muted-foreground"
                          onClick={() => setExpandedCardIndex(isExpanded ? null : index)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Menos
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              Mais
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 border-t border-border/10 pt-4">
                        {card.deep_reading && (
                          <div>
                            <h4 className="text-xs font-medium text-foreground/80 mb-1">
                              Leitura Profunda
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {card.deep_reading}
                            </p>
                          </div>
                        )}
                        
                        {card.polarity_light_text && (
                          <div>
                            <h4 className="text-xs font-medium text-foreground/80 mb-1">
                              ✨ Luz
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {card.polarity_light_text}
                            </p>
                          </div>
                        )}
                        
                        {card.polarity_shadow_text && (
                          <div>
                            <h4 className="text-xs font-medium text-foreground/80 mb-1">
                              🌑 Sombra
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {card.polarity_shadow_text}
                            </p>
                          </div>
                        )}
                        
                        {card.reflection_questions_json && card.reflection_questions_json.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-foreground/80 mb-2">
                              Reflexões
                            </h4>
                            <ul className="space-y-1">
                              {(card.reflection_questions_json as string[]).map((q, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {card.ritual_text && (
                          <div>
                            <h4 className="text-xs font-medium text-foreground/80 mb-1">
                              🕯️ Prática
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {card.ritual_text}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Notes & Save */}
            <div className="space-y-4 pt-4">
              <Textarea
                placeholder="Suas anotações..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="bg-card/20 border-border/20 min-h-[80px] text-sm"
              />
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-border/30"
                  onClick={resetDraw}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nova
                </Button>
                
                <Button 
                  className="flex-1"
                  onClick={handleSaveDraw}
                  disabled={isSaving}
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Closing */}
        {step === 'closing' && (
          <div className="w-full max-w-sm text-center animate-fade-in">
            <Sparkles className="w-12 h-12 mx-auto mb-8 animate-float-gentle" style={{ color: primaryColor }} />
            
            <h2 className="text-2xl font-display text-foreground mb-4">
              Consulta Concluída
            </h2>
            
            {(selectedSpread?.closing_text || closingText) && (
              <p className="text-sm text-muted-foreground/80 italic mb-8">
                "{selectedSpread?.closing_text || closingText}"
              </p>
            )}
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={resetDraw}
                style={{ backgroundColor: primaryColor }}
              >
                Nova Consulta
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => navigate(`/oraculos/${oracle.slug}/historico`)}
                className="text-muted-foreground"
              >
                Ver Histórico
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Modal Jardim da Psique */}
      {oracle && savedDrawData && (
        <SalvarJardimModal
          open={showJardimModal}
          onOpenChange={setShowJardimModal}
          ferramenta_nome={`Oráculo: ${oracle.name}`}
          ferramenta_chave="oraculo"
          tipo_registro="oraculo"
          conteudo={{
            oracle_id: oracle.id,
            oracle_nome: oracle.name,
            oracle_slug: oracle.slug,
            spread_nome: savedDrawData.spread?.name,
            cartas: savedDrawData.cards.map((c, i) => ({
              nome: c.title,
              posicao: savedDrawData.spread?.positions_json?.[i]?.name || `Posição ${i + 1}`,
              significado: c.short_message,
            })),
            notas: savedDrawData.notes,
          }}
          resultado_simbolico={{
            tiragem: savedDrawData.spread?.name,
            cartas_principais: savedDrawData.cards.map(c => c.title).join(', '),
          }}
          onSaved={() => {
            toast({ title: 'Salvo no Jardim da Psique!' });
            setStep('closing');
          }}
          onSkipped={() => setStep('closing')}
        />
      )}
    </div>
  );
}
