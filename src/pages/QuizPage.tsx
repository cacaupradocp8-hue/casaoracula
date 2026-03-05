import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, ArrowRight, Sparkles, RefreshCw, ExternalLink, Bug } from "lucide-react";
import { toast } from "sonner";
import { ModularPageRenderer } from "@/components/modular/ModularPageRenderer";
import { ContentPageLayout } from "@/components/shared/ContentPageLayout";
import { QuizResultView } from "@/components/quiz/QuizResultView";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { UnifiedAudioPlayer } from "@/components/audio/UnifiedAudioPlayer";
 import { SyntheiaChatModal } from "@/components/syntheia/SyntheiaChatModal";
 import { MessageCircle } from "lucide-react";
 import { useSyntheiaVoice } from "@/hooks/useSyntheiaVoice";

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  sala_id?: string;
  capa_url?: string | null;
}

interface Pergunta {
  id: string;
  texto: string;
  ordem: number;
}

interface Opcao {
  id: string;
  pergunta_id: string;
  texto: string;
  valor_pontuacao: number;
  categoria: string | null;
}

interface Resultado {
  id: string;
  titulo_simbolico: string;
  texto_interpretativo: string;
  pontuacao_minima: number | null;
  pontuacao_maxima: number | null;
  categoria: string | null;
  imagem_url: string | null;
  video_url: string | null;
  audio_url: string | null;
  cta_texto: string | null;
  cta_rota: string | null;
}

interface UserResponse {
  resultado_id: string;
  pontuacao_total: number;
  resultado?: Resultado;
  categoryCounts?: Record<string, number>;
}

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [opcoesByPergunta, setOpcoesByPergunta] = useState<Record<string, Opcao[]>>({});
  const [resultados, setResultados] = useState<Resultado[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Opcao>>({});
  const [showResult, setShowResult] = useState(false);
  const [finalResult, setFinalResult] = useState<Resultado | null>(null);
  const [saving, setSaving] = useState(false);
  const [previousResponse, setPreviousResponse] = useState<UserResponse | null>(null);
  const [showDebug, setShowDebug] = useState(false);
   const [showSyntheiaChat, setShowSyntheiaChat] = useState(false);

   // Fetch Syntheia voice for quiz result
   const { voice: syntheiaVoice } = useSyntheiaVoice({
     type: 'quiz',
     triggerId: finalResult?.id,
   });

  const isAdmin = user?.portal === 'admin';

  // Get the current result ID for block fetching
  const currentResultId = showResult ? finalResult?.id : previousResponse?.resultado?.id;

  // Hook for content blocks with realtime
  const { blocks, refetch: refetchBlocks } = useContentBlocks({
    contextType: 'quiz_result',
    contextId: currentResultId || '',
    enabled: !!currentResultId,
  });

  useEffect(() => {
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      // Fetch quiz
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .eq("ativo", true)
        .single();

      if (quizError || !quizData) {
        toast.error("Quiz não encontrado");
        navigate(-1);
        return;
      }

      setQuiz(quizData);

      // Fetch perguntas
      const { data: perguntasData } = await supabase
        .from("quiz_perguntas")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("ativo", true)
        .order("ordem");

      if (perguntasData) {
        setPerguntas(perguntasData);

        // Fetch all options for all questions
        const perguntaIds = perguntasData.map((p) => p.id);
        const { data: opcoesData } = await supabase
          .from("quiz_opcoes")
          .select("*")
          .in("pergunta_id", perguntaIds)
          .order("ordem");

        if (opcoesData) {
          const grouped: Record<string, Opcao[]> = {};
          opcoesData.forEach((opcao) => {
            if (!grouped[opcao.pergunta_id]) {
              grouped[opcao.pergunta_id] = [];
            }
            grouped[opcao.pergunta_id].push(opcao);
          });
          setOpcoesByPergunta(grouped);
        }
      }

      // Fetch resultados
      const { data: resultadosData } = await supabase
        .from("quiz_resultados")
        .select("*")
        .eq("quiz_id", quizId)
        .order("ordem");

      if (resultadosData) {
        setResultados(resultadosData);
      }

      // Check if user already completed this quiz
      if (user) {
        const { data: prevResponse } = await supabase
          .from("quiz_respostas_usuario")
          .select("*, resultado:quiz_resultados(*)")
          .eq("quiz_id", quizId)
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (prevResponse) {
          setPreviousResponse({
            resultado_id: prevResponse.resultado_id,
            pontuacao_total: prevResponse.pontuacao_total,
            resultado: prevResponse.resultado as Resultado,
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (opcao: Opcao) => {
    const perguntaId = perguntas[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [perguntaId]: opcao }));
  };

  const calculateResult = (): Resultado | null => {
    // Calculate total score
    let totalScore = 0;
    const categoryCounts: Record<string, number> = {};

    Object.values(answers).forEach((opcao) => {
      totalScore += opcao.valor_pontuacao;
      if (opcao.categoria) {
        categoryCounts[opcao.categoria] = (categoryCounts[opcao.categoria] || 0) + 1;
      }
    });

    // Find dominant category
    let dominantCategory: string | null = null;
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantCategory = cat;
      }
    });

    // Find matching result
    // First try by category
    if (dominantCategory) {
      const categoryResult = resultados.find((r) => r.categoria === dominantCategory);
      if (categoryResult) return categoryResult;
    }

    // Then try by score range
    const scoreResult = resultados.find(
      (r) =>
        r.pontuacao_minima !== null &&
        r.pontuacao_maxima !== null &&
        totalScore >= r.pontuacao_minima &&
        totalScore <= r.pontuacao_maxima
    );

    if (scoreResult) return scoreResult;

    // Fallback to first result
    return resultados[0] || null;
  };

  const handleSubmit = async () => {
    const result = calculateResult();
    if (!result) {
      toast.error("Nenhum resultado configurado");
      return;
    }

    setFinalResult(result);
    setShowResult(true);

    // Save to database
    if (user) {
      setSaving(true);
      try {
        let totalScore = 0;
        const categoryCounts: Record<string, number> = {};

        Object.values(answers).forEach((opcao) => {
          totalScore += opcao.valor_pontuacao;
          if (opcao.categoria) {
            categoryCounts[opcao.categoria] = (categoryCounts[opcao.categoria] || 0) + 1;
          }
        });

        let dominantCategory: string | null = null;
        let maxCount = 0;
        Object.entries(categoryCounts).forEach(([cat, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantCategory = cat;
          }
        });

        const { error } = await supabase.from("quiz_respostas_usuario").insert({
          user_id: user.id,
          quiz_id: quizId,
          resultado_id: result.id,
          respostas: Object.entries(answers).map(([perguntaId, opcao]) => ({
            pergunta_id: perguntaId,
            opcao_id: opcao.id,
            valor: opcao.valor_pontuacao,
            categoria: opcao.categoria,
          })),
          pontuacao_total: totalScore,
          categoria_resultado: dominantCategory,
        });

        if (error) {
          console.error(error);
          toast.error("Erro ao salvar resultado");
        } else {
          toast.success("Resultado salvo no seu perfil");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
    setFinalResult(null);
    setPreviousResponse(null);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!quiz || perguntas.length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="glass max-w-xl mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Quiz não disponível ou sem perguntas</p>
              <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Helper to convert video URLs to embed format (same as AulaPage)
  const getEmbedUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // YouTube - youtube.com/watch?v=ID
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // YouTube - youtu.be/ID
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo - vimeo.com/ID
    if (url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
    
    // Already embed URL or direct video
    return url;
  };

  // Direct Media Renderer (like AulaPage) - renders media from quiz_resultados fields
  // Now excludes image since it's rendered as a separate banner
  const DirectMediaContent = ({ result }: { result: Resultado }) => {
    const embedUrl = getEmbedUrl(result.video_url);
    
    const hasMedia = embedUrl || result.audio_url;
    if (!hasMedia) return null;
    
    return (
      <div className="space-y-8">
        {/* 1. VIDEO */}
        {embedUrl && (
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              <iframe
                src={embedUrl}
                title={result.titulo_simbolico}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </Card>
        )}

        {/* 2. AUDIO */}
        {result.audio_url && (
          <UnifiedAudioPlayer
            audioUrl={result.audio_url}
            title="🎧 Mensagem em Áudio"
            size="lg"
            className="mt-4"
          />
        )}
      </div>
    );
  };

  // Import statement for UnifiedAudioPlayer is handled at top

  // Image Banner Component - renders the result image as a full-width banner
  const ResultImageBanner = ({ result }: { result: Resultado }) => {
    if (!result.imagem_url) return null;
    
    return (
      <div className="rounded-xl overflow-hidden -mx-4 sm:mx-0 mb-8">
        <img 
          src={result.imagem_url} 
          alt={result.titulo_simbolico}
          className="w-full h-auto max-h-[400px] object-cover"
        />
      </div>
    );
  };

  // CTA Button Component (separate for clarity)
  const ResultCTA = ({ result }: { result: Resultado }) => {
    if (!result.cta_texto || !result.cta_rota) return null;
    
    return (
      <div className="flex justify-center pt-4">
        <Button 
          variant="gold" 
          size="lg"
          onClick={() => {
            if (result.cta_rota?.startsWith('http')) {
              window.open(result.cta_rota, '_blank');
            } else {
              navigate(result.cta_rota || '/');
            }
          }}
        >
          {result.cta_texto}
          {result.cta_rota?.startsWith('http') && (
            <ExternalLink className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>
    );
  };

  // Debug Panel Component (Admin Only)
  const DebugPanel = ({ resultId }: { resultId: string }) => {
    if (!isAdmin) return null;

    return (
      <>
        {/* Debug Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 z-50 bg-background/80 border shadow-lg"
          onClick={() => setShowDebug(!showDebug)}
        >
          <Bug className="w-4 h-4" />
        </Button>

        {/* Debug Panel */}
        {showDebug && (
          <div className="fixed bottom-16 right-4 z-50 bg-background/95 border rounded-lg p-4 shadow-xl text-xs w-72">
            <h4 className="font-semibold text-gold mb-2">🔧 Debug Info (Admin)</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong>Context ID:</strong>
                <br />
                <code className="text-[10px] bg-muted px-1 rounded break-all">{resultId}</code>
              </p>
              <p>
                <strong>Context Type:</strong> quiz_result
              </p>
              <p>
                <strong>Blocks Carregados:</strong> {blocks.length}
              </p>
              <p>
                <strong>Tipos:</strong>{' '}
                {blocks.length > 0 
                  ? blocks.map(b => b.blockType).join(', ')
                  : 'Nenhum'}
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => {
                refetchBlocks();
                toast.success('Blocos recarregados!');
              }}
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Recarregar Blocos
            </Button>
          </div>
        )}
      </>
    );
  };

  // Show previous result if exists and not retaking
  if (previousResponse && !showResult && Object.keys(answers).length === 0) {
    const prevResult = previousResponse.resultado;
    
    if (!prevResult) {
      return (
        <AppLayout>
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-muted-foreground">Resultado não encontrado</p>
          </div>
        </AppLayout>
      );
    }

    return (
      <AppLayout>
        <ContentPageLayout
          breadcrumbs={[
            { label: 'Salas', href: '/salas' },
            { label: quiz.titulo, href: quiz.sala_id ? `/salas/${quiz.sala_id}` : undefined },
            { label: 'Resultado' },
          ]}
          badge="Seu Arquétipo"
          badgeIcon={<Sparkles className="w-4 h-4 text-gold" />}
          title={prevResult.titulo_simbolico}
          subtitle={prevResult.categoria || undefined}
          maxWidth="4xl"
          showNavigation={false}
        >
          {/* 1. Imagem Banner - impacto visual imediato */}
          <ResultImageBanner result={prevResult} />

          {/* 2. Texto interpretativo (igual AulaPage) */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg whitespace-pre-line">
                  {prevResult.texto_interpretativo}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Mídia direta (video/audio) dos campos quiz_resultados */}
          <DirectMediaContent result={prevResult} />

          {/* 3. Blocos modulares EXTRAS do Admin */}
          <ModularPageRenderer
            contextType="quiz_result"
            contextId={prevResult.id}
            contextData={{
              arquetipo: prevResult.titulo_simbolico,
              categoria: prevResult.categoria,
            }}
            blockSpacing="lg"
            showLoading={false}
          />

          {/* 4. CTA principal (se existir) */}
          <ResultCTA result={prevResult} />

          {/* 5. Action buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button variant="gold" onClick={handleRestart}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refazer Quiz
            </Button>
          </div>
        </ContentPageLayout>

        <DebugPanel resultId={prevResult.id} />
      </AppLayout>
    );
  }

  // Show result
  if (showResult && finalResult) {
    return (
      <AppLayout>
        <ContentPageLayout
          breadcrumbs={[
            { label: 'Salas', href: '/dashboard' },
            { label: quiz.titulo, href: quiz.sala_id ? `/salas/${quiz.sala_id}` : undefined },
            { label: 'Resultado' },
          ]}
          badge="Seu Arquétipo"
          badgeIcon={<Sparkles className="w-4 h-4 text-gold" />}
          title={finalResult.titulo_simbolico}
          subtitle={finalResult.categoria || undefined}
          maxWidth="4xl"
          showNavigation={false}
        >
          {/* 1. Imagem Banner - impacto visual imediato */}
          <ResultImageBanner result={finalResult} />

          {/* 2. Texto interpretativo (igual AulaPage) */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg whitespace-pre-line">
                  {finalResult.texto_interpretativo}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Mídia direta (video/audio) dos campos quiz_resultados */}
          <DirectMediaContent result={finalResult} />

          {/* 3. Blocos modulares EXTRAS do Admin */}
          <ModularPageRenderer
            contextType="quiz_result"
            contextId={finalResult.id}
            contextData={{
              arquetipo: finalResult.titulo_simbolico,
              categoria: finalResult.categoria,
            }}
            blockSpacing="lg"
            showLoading={false}
          />

          {/* 4. CTA principal (se existir) */}
          <ResultCTA result={finalResult} />

          {saving && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando resultado...</span>
            </div>
          )}

         {/* 5. Syntheia Chat Button */}
         <div className="flex justify-center">
           <Button
             variant="gold"
             size="lg"
             onClick={() => setShowSyntheiaChat(true)}
             className="gap-2"
           >
             <MessageCircle className="w-5 h-5" />
             Explorar com Syntheia
           </Button>
         </div>
 
         {/* 6. Action buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button variant="gold" onClick={handleRestart}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refazer
            </Button>
          </div>
        </ContentPageLayout>

        <DebugPanel resultId={finalResult.id} />

       {/* Syntheia Chat Modal */}
       <SyntheiaChatModal
         open={showSyntheiaChat}
         onOpenChange={setShowSyntheiaChat}
          mode="arcane"
         context={{
           quizResultId: finalResult.id,
           arquetipo: finalResult.titulo_simbolico,
           categoria: finalResult.categoria || undefined,
           voiceId: syntheiaVoice?.id,
           voicePrompt: syntheiaVoice?.voice_prompt,
           quizTitulo: quiz.titulo,
           textoInterpretativo: finalResult.texto_interpretativo?.substring(0, 500),
         }}
         welcomeMessage={`Olá! Sou Syntheia. Vejo que você descobriu o arquétipo "${finalResult.titulo_simbolico}". Este é um território simbólico rico para explorarmos juntas. O que você gostaria de compreender mais profundamente sobre essa força que habita em você?`}
          title="Syntheia — Arcane"
       />
      </AppLayout>
    );
  }

  const currentPergunta = perguntas[currentIndex];
  const currentOpcoes = opcoesByPergunta[currentPergunta.id] || [];
  const selectedOpcao = answers[currentPergunta.id];
  const progress = ((currentIndex + 1) / perguntas.length) * 100;
  const isLastQuestion = currentIndex === perguntas.length - 1;
  const allAnswered = perguntas.every((p) => answers[p.id]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Capa do Quiz - Banner visual */}
        {quiz.capa_url && (
          <div className="mb-6 -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden">
            <img 
              src={quiz.capa_url} 
              alt={quiz.titulo}
              className="w-full h-48 sm:h-64 object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gold">{quiz.titulo}</h1>
          {quiz.descricao && <p className="text-muted-foreground mt-1">{quiz.descricao}</p>}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Pergunta {currentIndex + 1} de {perguntas.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentPergunta.texto}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentOpcoes.map((opcao) => (
              <button
                key={opcao.id}
                onClick={() => handleSelectAnswer(opcao)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedOpcao?.id === opcao.id
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border hover:border-gold/50 hover:bg-muted/50"
                }`}
              >
                {opcao.texto}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {isLastQuestion ? (
            <Button
              variant="gold"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Ver Resultado
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={!selectedOpcao}
            >
              Próxima
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
