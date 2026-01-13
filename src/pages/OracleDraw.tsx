import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, ArrowLeft, RotateCcw, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useOracleBySlug, useOracleDraws } from '@/hooks/useOracles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OracleCard, OracleSpread, DrawnCard } from '@/types/oracle';
import { cn } from '@/lib/utils';

type DrawStep = 'select-spread' | 'preparation' | 'drawing' | 'reveal' | 'closing';

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
  const [drawnCards, setDrawnCards] = useState<OracleCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [userNotes, setUserNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

  // Pre-select spread from URL
  useEffect(() => {
    const spreadId = searchParams.get('spread');
    if (spreadId && spreads.length > 0) {
      const spread = spreads.find(s => s.id === spreadId);
      if (spread && spread.status === 'published') {
        setSelectedSpread(spread);
        setStep('preparation');
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
    setStep('drawing');
  }, [selectedSpread, cards]);

  // Reveal next card
  const revealNextCard = useCallback(() => {
    if (!selectedSpread) return;
    
    const pacing = oracle?.voice_settings_json?.revealPacing || 2;
    
    if (currentRevealIndex < drawnCards.length) {
      setRevealedIndices(prev => [...prev, currentRevealIndex]);
      setCurrentRevealIndex(prev => prev + 1);
    }
    
    if (currentRevealIndex >= drawnCards.length - 1) {
      setTimeout(() => setStep('reveal'), pacing * 1000);
    }
  }, [currentRevealIndex, drawnCards.length, selectedSpread, oracle]);

  // Auto-reveal cards one by one
  useEffect(() => {
    if (step !== 'drawing' || !selectedSpread) return;
    
    const rules = selectedSpread.rules_json;
    if (rules.revealMode === 'all_at_once') {
      setRevealedIndices(drawnCards.map((_, i) => i));
      setTimeout(() => setStep('reveal'), 1500);
      return;
    }

    // One by one reveal
    const timer = setTimeout(revealNextCard, (oracle?.voice_settings_json?.revealPacing || 2) * 1000);
    return () => clearTimeout(timer);
  }, [step, currentRevealIndex, revealNextCard, selectedSpread, drawnCards, oracle]);

  // Save draw
  const handleSaveDraw = async () => {
    if (!oracle || !selectedSpread || !user) return;
    
    setIsSaving(true);
    try {
      const drawnCardsJson: DrawnCard[] = drawnCards.map((card, index) => ({
        cardId: card.id,
        positionName: selectedSpread.positions_json[index]?.name || `Posição ${index + 1}`,
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

      toast({ title: 'Tiragem salva!', description: 'Você pode acessá-la no histórico.' });
      setStep('closing');
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
    setStep('preparation');
  };

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

  const primaryColor = oracle.theme_json?.primaryColor || '#D4AF37';
  const backgroundColor = oracle.theme_json?.backgroundColor || '#0F0D1A';
  const fontFamily = oracle.theme_json?.fontFamily || 'serif';
  const cardBackImage = oracle.theme_json?.cardBackImage || null;
  const openingText = oracle.voice_settings_json?.openingText || null;
  const closingText = oracle.voice_settings_json?.closingText || null;
  const revealPacing = oracle.voice_settings_json?.revealPacing || 2;
  const publishedSpreads = spreads.filter(s => s.status === 'published');

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor,
        fontFamily
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
          {oracle.name}
        </h1>
        
        <div className="w-20" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Step: Select Spread */}
        {step === 'select-spread' && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-serif font-bold text-center text-foreground mb-6">
              Escolha uma Tiragem
            </h2>
            
            <div className="space-y-3">
              {publishedSpreads.map((spread) => (
                <Card 
                  key={spread.id}
                  className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedSpread(spread);
                    setStep('preparation');
                  }}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground">{spread.name}</h3>
                    {spread.description && (
                      <p className="text-sm text-muted-foreground mt-1">{spread.description}</p>
                    )}
                    <p className="text-xs text-primary mt-2">
                      {spread.number_of_cards} {spread.number_of_cards === 1 ? 'carta' : 'cartas'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step: Preparation */}
        {step === 'preparation' && selectedSpread && (
          <div className="w-full max-w-md text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
            
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              {selectedSpread.name}
            </h2>
            
            {selectedSpread.opening_text ? (
              <p className="text-muted-foreground mb-8 italic">
                "{selectedSpread.opening_text}"
              </p>
            ) : openingText ? (
              <p className="text-muted-foreground mb-8 italic">
                "{openingText}"
              </p>
            ) : (
              <p className="text-muted-foreground mb-8">
                Respire fundo, concentre-se na sua pergunta e deixe as cartas guiarem você.
              </p>
            )}
            
            <Button 
              size="lg"
              onClick={drawCards}
              style={{ backgroundColor: primaryColor }}
            >
              Iniciar Tiragem
            </Button>
          </div>
        )}

        {/* Step: Drawing (Card Reveal Animation) */}
        {step === 'drawing' && (
          <div className="w-full max-w-2xl">
            <div className="flex flex-wrap justify-center gap-4">
              {drawnCards.map((card, index) => {
                const isRevealed = revealedIndices.includes(index);
                const position = selectedSpread?.positions_json[index];
                
                return (
                  <div 
                    key={card.id}
                    className={cn(
                      "relative transition-all duration-700 transform",
                      isRevealed ? "scale-100 opacity-100" : "scale-95 opacity-50"
                    )}
                    style={{ perspective: '1000px' }}
                  >
                    <div 
                      className={cn(
                        "w-32 md:w-40 aspect-[2/3] rounded-lg overflow-hidden transition-transform duration-700 transform-gpu",
                        isRevealed ? "rotate-y-0" : "rotate-y-180"
                      )}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Card Face */}
                      <div className="absolute inset-0 backface-hidden">
                        {card.main_image_url ? (
                          <img 
                            src={card.main_image_url} 
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: primaryColor + '20' }}
                          >
                            <Sparkles className="w-8 h-8 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      {/* Card Back */}
                      <div 
                        className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center"
                        style={{ 
                          backgroundColor: primaryColor + '40',
                          backgroundImage: cardBackImage ? `url(${cardBackImage})` : undefined,
                          backgroundSize: 'cover'
                        }}
                      >
                        <Sparkles className="w-8 h-8 text-primary/50" />
                      </div>
                    </div>
                    
                    {/* Position Label */}
                    {position && isRevealed && (
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        {position.name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step: Reveal (Full Reading) */}
        {step === 'reveal' && (
          <div className="w-full max-w-2xl space-y-6">
            <h2 className="text-2xl font-serif font-bold text-center text-foreground mb-8">
              Sua Tiragem
            </h2>
            
            {drawnCards.map((card, index) => {
              const position = selectedSpread?.positions_json[index];
              const isExpanded = expandedCardIndex === index;
              
              return (
                <Card 
                  key={card.id}
                  className="bg-card/30 border-border/30 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      {/* Card Image */}
                      <div className="w-24 md:w-32 flex-shrink-0">
                        {card.main_image_url ? (
                          <img 
                            src={card.main_image_url} 
                            alt={card.title}
                            className="w-full aspect-[2/3] object-cover rounded-lg"
                          />
                        ) : (
                          <div 
                            className="w-full aspect-[2/3] rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: primaryColor + '20' }}
                          >
                            <Sparkles className="w-8 h-8 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      {/* Card Content */}
                      <div className="flex-1 min-w-0">
                        {position && (
                          <p className="text-xs text-primary font-medium mb-1">
                            {position.name}
                          </p>
                        )}
                        
                        <h3 className="text-lg font-serif font-bold text-foreground">
                          {card.title}
                        </h3>
                        
                        {card.subtitle && (
                          <p className="text-sm text-muted-foreground">
                            {card.subtitle}
                          </p>
                        )}
                        
                        {card.short_message && (
                          <p className="text-sm text-foreground mt-3">
                            {card.short_message}
                          </p>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 -ml-2"
                          onClick={() => setExpandedCardIndex(isExpanded ? null : index)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Ver menos
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              Leitura completa
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 space-y-4 border-t border-border/20 mt-2">
                        {card.deep_reading && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">
                              Leitura Profunda
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {card.deep_reading}
                            </p>
                          </div>
                        )}
                        
                        {card.polarity_light_text && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">
                              ✨ Aspecto Luz
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {card.polarity_light_text}
                            </p>
                          </div>
                        )}
                        
                        {card.polarity_shadow_text && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">
                              🌑 Aspecto Sombra
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {card.polarity_shadow_text}
                            </p>
                          </div>
                        )}
                        
                        {card.reflection_questions_json && card.reflection_questions_json.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">
                              Perguntas para Reflexão
                            </h4>
                            <ul className="space-y-1">
                              {card.reflection_questions_json.map((q, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {card.ritual_text && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">
                              🕯️ Prática Sugerida
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
                placeholder="Adicione suas anotações sobre esta tiragem..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="bg-card/30 border-border/30 min-h-[100px]"
              />
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={resetDraw}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nova Tiragem
                </Button>
                
                <Button 
                  className="flex-1"
                  onClick={handleSaveDraw}
                  disabled={isSaving}
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar Tiragem
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Closing */}
        {step === 'closing' && (
          <div className="w-full max-w-md text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
            
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Tiragem Concluída
            </h2>
            
            {selectedSpread?.closing_text ? (
              <p className="text-muted-foreground mb-8 italic">
                "{selectedSpread.closing_text}"
              </p>
            ) : closingText ? (
              <p className="text-muted-foreground mb-8 italic">
                "{closingText}"
              </p>
            ) : (
              <p className="text-muted-foreground mb-8">
                Que as mensagens recebidas iluminem seu caminho.
              </p>
            )}
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={resetDraw}
                style={{ backgroundColor: primaryColor }}
              >
                Fazer Nova Tiragem
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate(`/oraculos/${oracle.slug}/historico`)}
              >
                Ver Histórico
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => navigate(`/oraculos/${oracle.slug}`)}
              >
                Voltar ao Oráculo
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
