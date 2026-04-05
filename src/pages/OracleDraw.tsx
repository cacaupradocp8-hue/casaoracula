import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Sparkles, Loader2, ArrowLeft, RotateCcw, Save, ChevronDown, ChevronUp, Leaf, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOracleBySlug, useOracleDraws } from '@/hooks/useOracles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OracleCard as OracleCardType, OracleSpread, DrawnCard } from '@/types/oracle';
import { OracleCard } from '@/components/oracle/OracleCard';
import { OracleCardDetail } from '@/components/oracle/OracleCardDetail';
import { MeditationPause } from '@/components/oracle/MeditationPause';
import { AmbientSoundToggle } from '@/components/oracle/AmbientSoundToggle';
import { ReadingSynthesisPanel } from '@/components/oracle/ReadingSynthesisPanel';
import { SaveReadingModal } from '@/components/oracle/SaveReadingModal';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type DrawStep = 'select-spread' | 'meditation' | 'drawing' | 'reveal' | 'closing';

function useOracleBasePath() {
  return '/oraculos';
}

export default function OracleDraw() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const basePath = useOracleBasePath();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { oracle, cards, spreads, isLoading, hasAccess } = useOracleBySlug(oracleSlug || '');
  const { saveDraw } = useOracleDraws();

  const [step, setStep] = useState<DrawStep>('select-spread');
  const [selectedSpread, setSelectedSpread] = useState<OracleSpread | null>(null);
  const [drawnCards, setDrawnCards] = useState<OracleCardType[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [showCardText, setShowCardText] = useState(false);
  const [selectedDetailCard, setSelectedDetailCard] = useState<(OracleCardType & Record<string, any>) | null>(null);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
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
    setShowCardText(false);
    setStep('drawing');
  }, [selectedSpread, cards]);

  const handleMeditationComplete = () => drawCards();

  const revealCard = useCallback((index: number) => {
    if (!revealedIndices.includes(index)) {
      setRevealedIndices(prev => [...prev, index]);
    }
  }, [revealedIndices]);

  // Check if all cards revealed
  useEffect(() => {
    if (step === 'drawing' && drawnCards.length > 0 && revealedIndices.length === drawnCards.length) {
      const timer = setTimeout(() => {
        setShowCardText(true);
        setTimeout(() => setStep('reveal'), 1200);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, drawnCards.length, revealedIndices.length]);

  // Auto-reveal for "all_at_once"
  useEffect(() => {
    if (step === 'drawing' && selectedSpread && drawnCards.length > 0) {
      if (selectedSpread.rules_json?.revealMode === 'all_at_once') {
        setTimeout(() => {
          setRevealedIndices(drawnCards.map((_, i) => i));
        }, 500);
      }
    }
  }, [step, selectedSpread, drawnCards]);

  // Save draw
  const handleSaveDraw = async (saveData: { name: string; notes: string }) => {
    if (!oracle || !selectedSpread || !user) return;
    
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
      user_notes: saveData.notes || null,
      is_professional_session: false,
      client_id: null,
    });

    toast({ title: 'Leitura salva com sucesso' });
    
    setSavedDrawData({
      cards: drawnCards,
      spread: selectedSpread,
      notes: saveData.notes,
    });
    setShowJardimModal(true);
  };

  const resetDraw = () => {
    setDrawnCards([]);
    setRevealedIndices([]);
    setShowCardText(false);
    setSelectedDetailCard(null);
    setShowSynthesis(false);
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
    navigate(basePath);
    return null;
  }

  const primaryColor = oracle.theme_json?.primaryColor || 'hsl(var(--gold))';
  const cardBackImage = oracle.theme_json?.cardBackImage || null;
  const openingText = oracle.voice_settings_json?.openingText;
  const closingText = oracle.voice_settings_json?.closingText;
  const publishedSpreads = spreads.filter(s => s.status === 'published');

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gold/[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`${basePath}/${oracle.slug}`)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-xs text-muted-foreground/50 font-display tracking-wide">
          {oracle.name}
        </span>
        <AmbientSoundToggle />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* Select Spread */}
          {step === 'select-spread' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-sm"
            >
              <h2 className="text-2xl font-display text-center text-foreground mb-2 tracking-wide">
                Escolha uma tiragem
              </h2>
              <p className="text-xs text-center text-muted-foreground/40 mb-8">
                Cada tiragem revela camadas diferentes
              </p>
              
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
                      'bg-card/20 hover:bg-card/40 transition-all duration-500',
                      'border border-border/10 hover:border-gold/15',
                      'group'
                    )}
                  >
                    <h3 className="font-display font-medium text-foreground group-hover:text-gold transition-colors duration-500">
                      {spread.name}
                    </h3>
                    {spread.description && (
                      <p className="text-sm text-muted-foreground/50 mt-1 leading-relaxed">{spread.description}</p>
                    )}
                    <p className="text-xs mt-3 text-gold/40">
                      {spread.number_of_cards} {spread.number_of_cards === 1 ? 'carta' : 'cartas'}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Meditation */}
          {step === 'meditation' && selectedSpread && (
            <motion.div
              key="meditation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MeditationPause
                duration={4}
                message={selectedSpread.opening_text || openingText || 'Respire fundo...'}
                onComplete={handleMeditationComplete}
                primaryColor={primaryColor}
              />
            </motion.div>
          )}

          {/* Drawing */}
          {step === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {drawnCards.map((card, index) => {
                  const isRevealed = revealedIndices.includes(index);
                  const position = selectedSpread?.positions_json?.[index];
                  
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col items-center"
                    >
                      {/* Position label above */}
                      {position && (
                        <div className={cn(
                          'text-center mb-3 transition-opacity duration-700',
                          isRevealed ? 'opacity-100' : 'opacity-40'
                        )}>
                          <p className="text-xs font-display text-gold/50">{position.name}</p>
                          {position.meaning && (
                            <p className="text-[10px] text-muted-foreground/30 mt-0.5 max-w-[120px]">
                              {position.meaning}
                            </p>
                          )}
                        </div>
                      )}

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

                      {/* Card title after reveal */}
                      <AnimatePresence>
                        {showCardText && isRevealed && (
                          <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-sm font-display text-foreground/80 mt-3 text-center"
                          >
                            {card.title}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {revealedIndices.length < drawnCards.length && (
                <motion.p
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-center text-xs text-muted-foreground/40 mt-10"
                >
                  Toque nas cartas para revelar
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Reveal (Full Reading) */}
          {step === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-lg space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display text-foreground tracking-wide">
                  Sua Leitura
                </h2>
                <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent mt-4" />
              </div>

              {drawnCards.map((card, index) => {
                const position = selectedSpread?.positions_json?.[index];
                const c = card as OracleCardType & Record<string, any>;
                
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    className={cn(
                      'p-5 rounded-xl',
                      'bg-card/15 border border-border/10',
                      'hover:border-gold/10 transition-all duration-500',
                      'cursor-pointer group'
                    )}
                    onClick={() => setSelectedDetailCard(c)}
                  >
                    <div className="flex gap-4">
                      {/* Card Image */}
                      <div className="w-20 flex-shrink-0">
                        {card.main_image_url ? (
                          <img 
                            src={card.main_image_url} 
                            alt={card.title}
                            className="w-full aspect-[2/3] object-cover rounded-lg ring-1 ring-white/5 group-hover:ring-gold/20 transition-all duration-500"
                          />
                        ) : (
                          <div 
                            className="w-full aspect-[2/3] rounded-lg flex items-center justify-center ring-1 ring-white/5"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}
                          >
                            <Sparkles className="w-6 h-6 text-gold/20" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {position && (
                          <p className="text-xs font-medium text-gold/50 mb-1 tracking-wider uppercase">
                            {position.name}
                          </p>
                        )}
                        <h3 className="text-lg font-display font-medium text-foreground group-hover:text-gold transition-colors duration-500">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="text-xs text-muted-foreground/50 mt-0.5">{card.subtitle}</p>
                        )}
                        {card.short_message && (
                          <p className="text-sm text-foreground/60 mt-3 italic leading-relaxed">
                            "{card.short_message}"
                          </p>
                        )}
                        <p className="text-xs text-gold/30 mt-3">
                          Toque para leitura completa →
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-border/20 text-muted-foreground"
                  onClick={resetDraw}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nova
                </Button>

                {drawnCards.length > 1 && (
                  <Button
                    variant="outline"
                    className="border-border/20 text-muted-foreground"
                    onClick={() => setShowSynthesis(true)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Síntese
                  </Button>
                )}

                <Button 
                  className="flex-1"
                  onClick={() => setShowSaveModal(true)}
                  style={{ backgroundColor: primaryColor }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </motion.div>
          )}

          {/* Closing */}
          {step === 'closing' && (
            <motion.div
              key="closing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-8 text-gold/40" />
              </motion.div>
              
              <h2 className="text-2xl font-display text-foreground mb-4 tracking-wide">
                Consulta Concluída
              </h2>
              
              {(selectedSpread?.closing_text || closingText) && (
                <p className="text-sm text-muted-foreground/60 italic mb-8 leading-relaxed">
                  "{selectedSpread?.closing_text || closingText}"
                </p>
              )}
              
              <div className="flex flex-col gap-3">
                <Button onClick={resetDraw} style={{ backgroundColor: primaryColor }}>
                  Nova Consulta
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => navigate(`${basePath}/${oracle.slug}/historico`)}
                  className="text-muted-foreground/50"
                >
                  Ver Histórico
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Card Detail */}
      <OracleCardDetail
        card={selectedDetailCard}
        isOpen={!!selectedDetailCard}
        onClose={() => setSelectedDetailCard(null)}
        positionName={selectedDetailCard ? selectedSpread?.positions_json?.[drawnCards.findIndex(c => c.id === selectedDetailCard.id)]?.name : undefined}
        primaryColor={primaryColor}
      />

      {/* Synthesis Panel */}
      <ReadingSynthesisPanel
        isOpen={showSynthesis}
        onClose={() => setShowSynthesis(false)}
        cards={drawnCards as (OracleCardType & Record<string, any>)[]}
        primaryColor={primaryColor}
      />

      {/* Save Modal */}
      <SaveReadingModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveDraw}
        defaultName={selectedSpread?.name || 'Consulta'}
        primaryColor={primaryColor}
      />

      {/* Jardim Modal */}
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
