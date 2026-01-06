import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
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
}

interface UserResponse {
  resultado_id: string;
  pontuacao_total: number;
  resultado?: Resultado;
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

  // Show previous result if exists and not retaking
  if (previousResponse && !showResult && Object.keys(answers).length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="glass">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <CardTitle className="text-2xl text-gold">
                {previousResponse.resultado?.titulo_simbolico || "Seu Resultado Anterior"}
              </CardTitle>
              <CardDescription>Você já completou este quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed">
                  {previousResponse.resultado?.texto_interpretativo}
                </p>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleRestart}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refazer Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Show result
  if (showResult && finalResult) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="glass">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-gold">
                {finalResult.titulo_simbolico}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg">
                  {finalResult.texto_interpretativo}
                </p>
              </div>

              {saving && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando resultado...</span>
                </div>
              )}

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
            </CardContent>
          </Card>
        </div>
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
