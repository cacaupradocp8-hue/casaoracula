// ============================================
// CARTAS DA JORNADA — O Labirinto da Heroína Interna®
// ============================================
// Fluxo: Seleção → Texto Oracular → Exercício → Registro → PDF

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Sparkles, Loader2, Download, 
  Leaf, CheckCircle, PenLine, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import { AppLayout } from '@/components/layout/AppLayout';
import html2canvas from 'html2canvas';

// Card images - imported as ES6 modules
import chamadoImg from '@/assets/oracle/heroina-01-chamado.jpg';
import descidaImg from '@/assets/oracle/heroina-02-descida.jpg';
import fragmentacaoImg from '@/assets/oracle/heroina-03-fragmentacao.jpg';
import morteImg from '@/assets/oracle/heroina-04-morte.jpg';
import travessiaImg from '@/assets/oracle/heroina-05-travessia.jpg';
import reintegracaoImg from '@/assets/oracle/heroina-06-reintegracao.jpg';
import retornoImg from '@/assets/oracle/heroina-07-retorno.jpg';

// Map card order to images
const CARD_IMAGES: Record<number, string> = {
  1: chamadoImg,
  2: descidaImg,
  3: fragmentacaoImg,
  4: morteImg,
  5: travessiaImg,
  6: reintegracaoImg,
  7: retornoImg,
};

type FlowStep = 'selection' | 'oracular' | 'exercise' | 'registro' | 'complete';

interface JornadaCard {
  id: string;
  title: string;
  subtitle: string | null;
  short_message: string | null;
  deep_reading: string | null;
  ritual_text: string | null;
  ordem: number;
  main_image_url: string | null;
}

export default function CartasJornadaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);
  
  const [cards, setCards] = useState<JornadaCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<FlowStep>('selection');
  const [selectedCard, setSelectedCard] = useState<JornadaCard | null>(null);
  
  // Form data
  const [exerciseResponse, setExerciseResponse] = useState('');
  const [bodyPerception, setBodyPerception] = useState('');
  const [emotionNote, setEmotionNote] = useState('');
  
  // Modal states
  const [showJardimModal, setShowJardimModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Fetch cards from the Labirinto Heroína oracle
  useEffect(() => {
    async function fetchCards() {
      setIsLoading(true);
      try {
        // First get the oracle deck ID
        const { data: deck, error: deckError } = await supabase
          .from('oracle_decks')
          .select('id')
          .eq('slug', 'labirinto-heroina')
          .single();

        if (deckError || !deck) {
          console.error('Oracle deck not found');
          setIsLoading(false);
          return;
        }

        // Fetch all cards for this oracle
        const { data: cardsData, error: cardsError } = await (supabase.from('oracle_cards') as any)
          .select('id, title, subtitle, short_message, deep_reading, ritual_text, ordem, main_image_url')
          .eq('oracle_id', deck.id)
          .eq('status', 'published')
          .order('ordem');

        if (cardsError) throw cardsError;
        setCards(cardsData || []);
      } catch (err) {
        console.error('Error fetching cards:', err);
        toast({ title: 'Erro ao carregar cartas', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCards();
  }, [toast]);

  const handleCardSelect = (card: JornadaCard) => {
    setSelectedCard(card);
    setStep('oracular');
  };

  const handleAdvanceToExercise = () => {
    setStep('exercise');
  };

  const handleAdvanceToRegistro = () => {
    if (!exerciseResponse.trim()) {
      toast({ title: 'Preencha o exercício antes de continuar', variant: 'destructive' });
      return;
    }
    setStep('registro');
  };

  const handleFinalizeTravessia = () => {
    setStep('complete');
    setShowJardimModal(true);
  };

  const handleGeneratePdf = async () => {
    if (!pdfRef.current) return;
    
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: '#0A0A0F',
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `travessia-${selectedCard?.title.toLowerCase().replace(/\s+/g, '-') || 'carta'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({ title: 'PDF gerado com sucesso!' });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({ title: 'Erro ao gerar PDF', variant: 'destructive' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleReset = () => {
    setSelectedCard(null);
    setExerciseResponse('');
    setBodyPerception('');
    setEmotionNote('');
    setStep('selection');
  };

  const getCardImage = (card: JornadaCard) => {
    return CARD_IMAGES[card.ordem] || card.main_image_url;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Sparkles className="w-8 h-8 animate-breathe text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/ferramentas-metodo')}
            className="gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="font-display text-2xl md:text-3xl text-gold mb-2">
              Cartas da Jornada
            </h1>
            <p className="text-muted-foreground text-sm">
              O Labirinto da Heroína Interna® — As 7 Portas da Travessia
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        {selectedCard && step !== 'selection' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['oracular', 'exercise', 'registro', 'complete'].map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  ['oracular', 'exercise', 'registro', 'complete'].indexOf(step) >= i
                    ? 'bg-gold'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Card Selection */}
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <p className="text-foreground/80">
                  Qual porta pede para ser atravessada hoje?
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCardSelect(card)}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border/30 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
                  >
                    <img
                      src={getCardImage(card)}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                      <p className="text-xs text-gold/80 mb-1">{card.subtitle}</p>
                      <p className="text-sm font-display text-white">{card.title}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Oracular Text */}
          {step === 'oracular' && selectedCard && (
            <motion.div
              key="oracular"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="border-gold/20 bg-card/50">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <img
                        src={getCardImage(selectedCard)}
                        alt={selectedCard.title}
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm text-gold/80">{selectedCard.subtitle}</p>
                        <h2 className="font-display text-2xl text-foreground">{selectedCard.title}</h2>
                      </div>
                      
                      {selectedCard.short_message && (
                        <div className="bg-muted/30 rounded-lg p-4 border-l-2 border-gold">
                          <p className="text-foreground/90 italic leading-relaxed">
                            "{selectedCard.short_message}"
                          </p>
                        </div>
                      )}
                      
                      {selectedCard.deep_reading && (
                        <div className="text-muted-foreground text-sm leading-relaxed">
                          {selectedCard.deep_reading}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleAdvanceToExercise}
                      className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
                    >
                      Avançar para o Exercício
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Exercise */}
          {step === 'exercise' && selectedCard && (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="border-gold/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gold">
                    <PenLine className="w-5 h-5" />
                    Exercício: {selectedCard.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedCard.ritual_text && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {selectedCard.ritual_text}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="response" className="text-foreground">
                      Sua resposta ao exercício
                    </Label>
                    <Textarea
                      id="response"
                      value={exerciseResponse}
                      onChange={(e) => setExerciseResponse(e.target.value)}
                      placeholder="Escreva livremente aqui..."
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setStep('oracular')}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={handleAdvanceToRegistro}
                      className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
                    >
                      Registrar minha Ação
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: Registro da Travessia */}
          {step === 'registro' && selectedCard && (
            <motion.div
              key="registro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="border-gold/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gold">
                    <Eye className="w-5 h-5" />
                    Registro da Travessia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">O que foi escrito:</p>
                    <p className="text-sm text-foreground/80">{exerciseResponse}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="body" className="text-foreground">
                      Percepção corporal ou emocional
                    </Label>
                    <Textarea
                      id="body"
                      value={bodyPerception}
                      onChange={(e) => setBodyPerception(e.target.value)}
                      placeholder="O que você sente no corpo? Qual emoção está presente?"
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emotion" className="text-foreground">
                      Emoção predominante <span className="text-muted-foreground">(opcional)</span>
                    </Label>
                    <Input
                      id="emotion"
                      value={emotionNote}
                      onChange={(e) => setEmotionNote(e.target.value)}
                      placeholder="Ex: clareza, inquietação, coragem..."
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setStep('exercise')}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={handleFinalizeTravessia}
                      className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
                    >
                      Finalizar Travessia
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 5: Complete */}
          {step === 'complete' && selectedCard && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* PDF Content */}
              <div ref={pdfRef} className="bg-background rounded-xl p-6 md:p-8 space-y-6">
                <div className="text-center border-b border-border/30 pb-6">
                  <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
                  <h2 className="font-display text-xl text-gold">Registro de Travessia Simbólica</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Casa Orácula — O Labirinto da Heroína Interna®
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <img
                    src={getCardImage(selectedCard)}
                    alt={selectedCard.title}
                    className="w-24 aspect-[3/4] object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-xs text-gold/80">{selectedCard.subtitle}</p>
                    <h3 className="font-display text-lg text-foreground">{selectedCard.title}</h3>
                    {selectedCard.short_message && (
                      <p className="text-sm text-muted-foreground italic mt-2">
                        "{selectedCard.short_message}"
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Exercício Realizado:</p>
                    <p className="text-sm text-foreground/90 bg-muted/30 rounded-lg p-3">
                      {exerciseResponse}
                    </p>
                  </div>
                  
                  {bodyPerception && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Percepção:</p>
                      <p className="text-sm text-foreground/90 bg-muted/30 rounded-lg p-3">
                        {bodyPerception}
                      </p>
                    </div>
                  )}
                  
                  {emotionNote && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Emoção:</p>
                      <span className="text-sm text-gold">{emotionNote}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/30">
                  <p>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <p className="mt-1">Casa Orácula — Registro de Travessia Simbólica</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleGeneratePdf}
                  disabled={isGeneratingPdf}
                  variant="outline"
                  className="gap-2 border-gold/30 text-gold hover:bg-gold/10"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Baixar PDF Ritual
                </Button>
                
                <Button
                  onClick={() => setShowJardimModal(true)}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Leaf className="w-4 h-4" />
                  Salvar no Jardim
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="gap-2"
                >
                  Nova Travessia
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jardim Modal */}
        {selectedCard && (
          <SalvarJardimModal
            open={showJardimModal}
            onOpenChange={setShowJardimModal}
            ferramenta_nome={`Carta da Jornada: ${selectedCard.title}`}
            ferramenta_chave="cartas_jornada"
            conteudo={{
              card_id: selectedCard.id,
              card_title: selectedCard.title,
              card_subtitle: selectedCard.subtitle,
              exercise_response: exerciseResponse,
              body_perception: bodyPerception,
              emotion_note: emotionNote,
            }}
            resultado_simbolico={{
              porta: selectedCard.title,
              mensagem: selectedCard.short_message,
            }}
            tipo_registro="ferramenta"
            onSaved={() => {
              toast({ title: 'Travessia salva no Jardim da Psique!' });
            }}
            onSkipped={() => {
              toast({ title: 'Travessia finalizada' });
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
