import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import { Big5InterpretacaoCard } from '@/components/big5/Big5InterpretacaoCard';
import { Big5SintesePerfil } from '@/components/big5/Big5SintesePerfil';
import { GuardiaLeituraChat } from '@/components/big5/GuardiaLeituraChat';
import { GuardiaManualProfissional } from '@/components/big5/GuardiaManualProfissional';
import { useBig5Funcional, Dimensao } from '@/hooks/useBig5Funcional';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Loader2, 
  RotateCcw,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Home,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';

type Screen = 'intro' | 'questionario' | 'resultado';

const ESCALA = [
  { valor: 1, label: 'Discordo totalmente' },
  { valor: 2, label: 'Discordo' },
  { valor: 3, label: 'Neutro' },
  { valor: 4, label: 'Concordo' },
  { valor: 5, label: 'Concordo totalmente' },
];

export default function Big5Funcional() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProfessional } = useProfessionalStatus();
  const { 
    dimensoes, 
    perguntas, 
    isLoading, 
    calcularResultado, 
    salvarResultado 
  } = useBig5Funcional();

  const [screen, setScreen] = useState<Screen>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<ReturnType<typeof calcularResultado> | null>(null);
  const [showJardimModal, setShowJardimModal] = useState(false);

  const perguntaAtual = perguntas[currentIndex];
  const totalPerguntas = perguntas.length;
  const progresso = totalPerguntas > 0 ? ((currentIndex + 1) / totalPerguntas) * 100 : 0;

  const handleResposta = (valor: number) => {
    if (!perguntaAtual) return;
    
    setRespostas(prev => ({
      ...prev,
      [perguntaAtual.id]: valor,
    }));

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < totalPerguntas - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finalizarQuestionario();
      }
    }, 300);
  };

  const finalizarQuestionario = () => {
    const calc = calcularResultado(respostas);
    setResultado(calc);
    
    // Save if user is logged in
    if (user) {
      salvarResultado.mutate(respostas);
    }
    
    setScreen('resultado');
    
    // Show Jardim modal after a short delay to let user see results
    setTimeout(() => {
      if (user) {
        setShowJardimModal(true);
      }
    }, 1500);
  };

  const reiniciar = () => {
    setScreen('intro');
    setCurrentIndex(0);
    setRespostas({});
    setResultado(null);
  };

  // Radar chart data
  const radarData = useMemo(() => {
    if (!resultado) return [];
    return dimensoes.map(dim => ({
      dimensao: dim.nome.split(' ')[0], // Short name
      fullName: dim.nome,
      valor: resultado.medias[dim.chave] || 0,
      fill: dim.cor,
    }));
  }, [resultado, dimensoes]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/ferramentas" className="hover:text-foreground transition-colors">
            Ferramentas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Big Five Funcional</span>
        </nav>

        <AnimatePresence mode="wait">
          {/* INTRO SCREEN */}
          {screen === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-display">
                    Big Five — Leitura Funcional
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Modelo OCEAN • 30 perguntas • ~5 minutos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Warning */}
                  <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
                    <p>
                      Este questionário descreve <strong>tendências de funcionamento</strong>, 
                      não define personalidade nem substitui avaliação psicológica.
                    </p>
                  </div>

                  {/* Scale explanation */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Escala de resposta:</h4>
                    <div className="flex flex-wrap gap-2">
                      {ESCALA.map(item => (
                        <Badge key={item.valor} variant="outline" className="text-xs">
                          {item.valor} — {item.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions preview */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Dimensões avaliadas:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {dimensoes.map(dim => (
                        <div 
                          key={dim.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div 
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: dim.cor }}
                          />
                          <span className="truncate">{dim.nome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setScreen('questionario')} 
                    className="w-full"
                    size="lg"
                  >
                    Iniciar Questionário
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Guardiã da Leitura - Intro */}
              <div className="mt-6">
                <GuardiaLeituraChat 
                  contextPage="funcional"
                  welcomeMessage="Olá! Antes de começar, posso explicar o que esta leitura revela — e o que ela não pretende revelar. Pergunte se quiser."
                />
              </div>
            </motion.div>
          )}

          {/* QUESTIONNAIRE SCREEN */}
          {screen === 'questionario' && perguntaAtual && (
            <motion.div
              key={`pergunta-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Pergunta {currentIndex + 1} de {totalPerguntas}</span>
                  <span>{Math.round(progresso)}%</span>
                </div>
                <Progress value={progresso} className="h-2" />
              </div>

              {/* Dimension badge */}
              {perguntaAtual.dimensao && (
                <Badge 
                  variant="outline"
                  className="text-sm"
                  style={{ 
                    borderColor: perguntaAtual.dimensao.cor,
                    color: perguntaAtual.dimensao.cor,
                  }}
                >
                  {perguntaAtual.dimensao.nome}
                </Badge>
              )}

              {/* Question */}
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-lg font-medium leading-relaxed text-center">
                    {perguntaAtual.texto_pergunta}
                  </p>
                </CardContent>
              </Card>

              {/* Response options */}
              <div className="grid gap-2">
                {ESCALA.map(item => {
                  const isSelected = respostas[perguntaAtual.id] === item.valor;
                  return (
                    <Button
                      key={item.valor}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start text-left h-auto py-3 px-4",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => handleResposta(item.valor)}
                    >
                      <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium mr-3 shrink-0">
                        {item.valor}
                      </span>
                      <span className="text-sm">{item.label}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                {currentIndex === totalPerguntas - 1 && Object.keys(respostas).length === totalPerguntas && (
                  <Button
                    onClick={finalizarQuestionario}
                    className="flex-1"
                  >
                    Finalizar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* RESULT SCREEN */}
          {screen === 'resultado' && resultado && (
            <motion.div
              key="resultado"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-display">
                    Seu Perfil Funcional
                  </CardTitle>
                  <CardDescription>
                    Visualização das 5 dimensões OCEAN
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Radar Chart */}
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="dimensao" 
                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 5]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />
                        <Radar
                          name="Perfil"
                          dataKey="valor"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* High & Low dimensions */}
              <div className="grid sm:grid-cols-2 gap-4">
                {resultado.dimensaoAlta && (
                  <Card style={{ borderColor: resultado.dimensaoAlta.cor }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" style={{ color: resultado.dimensaoAlta.cor }} />
                        <CardTitle className="text-base">Dimensão mais expressiva</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="font-medium mb-1"
                        style={{ color: resultado.dimensaoAlta.cor }}
                      >
                        {resultado.dimensaoAlta.nome}
                      </div>
                      <Badge variant="outline" className="mb-2">
                        Média: {resultado.dimensaoAlta.media.toFixed(1)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {resultado.dimensaoAlta.descricao}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {resultado.dimensaoBaixa && (
                  <Card style={{ borderColor: resultado.dimensaoBaixa.cor }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5" style={{ color: resultado.dimensaoBaixa.cor }} />
                        <CardTitle className="text-base">Dimensão menos expressiva</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="font-medium mb-1"
                        style={{ color: resultado.dimensaoBaixa.cor }}
                      >
                        {resultado.dimensaoBaixa.nome}
                      </div>
                      <Badge variant="outline" className="mb-2">
                        Média: {resultado.dimensaoBaixa.media.toFixed(1)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {resultado.dimensaoBaixa.descricao}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* LEITURA DE FUNCIONAMENTO ATUAL */}
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-display">
                        Leitura de Funcionamento Atual
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Este resultado descreve tendências de funcionamento, não identidade fixa.
                        Ele não define quem você é — indica como você tende a agir hoje.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dimensoes.map(dim => {
                    const media = resultado.medias[dim.chave] || 0;
                    return (
                      <Big5InterpretacaoCard
                        key={dim.id}
                        nome={dim.nome}
                        nomeIngles={dim.nome_ingles}
                        cor={dim.cor}
                        media={media}
                        interpretacaoAlto={dim.interpretacao_alto}
                        interpretacaoBaixo={dim.interpretacao_baixo}
                        pontoAtencaoAlto={dim.ponto_atencao_alto}
                        pontoAtencaoBaixo={dim.ponto_atencao_baixo}
                      />
                    );
                  })}
                </CardContent>
              </Card>

              {/* SÍNTESE DO PERFIL */}
              <Big5SintesePerfil
                dimensaoAlta={resultado.dimensaoAlta ? {
                  nome: resultado.dimensaoAlta.nome,
                  media: resultado.dimensaoAlta.media,
                } : null}
                dimensaoBaixa={resultado.dimensaoBaixa ? {
                  nome: resultado.dimensaoBaixa.nome,
                  media: resultado.dimensaoBaixa.media,
                } : null}
              />

              {/* All dimensions table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo por Dimensão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dimensoes.map(dim => {
                      const media = resultado.medias[dim.chave] || 0;
                      const percentage = (media / 5) * 100;
                      return (
                        <div key={dim.id} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: dim.cor }}
                              />
                              <span>{dim.nome}</span>
                            </div>
                            <span className="font-medium">{media.toFixed(1)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: dim.cor,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/ferramentas')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  variant="outline"
                  onClick={reiniciar}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refazer
                </Button>
              </div>

              <EthicalNotice toolName="Big Five — Leitura Funcional" />

              {/* Guardiã da Leitura - Resultado */}
              <GuardiaLeituraChat 
                contextPage="funcional_resultado"
                welcomeMessage="Você completou a Leitura Funcional. Posso explicar o que significa esse mapa, ou esclarecer a diferença para a Leitura Oracular."
                defaultOpen
              />

              {/* Manual para Facilitadoras (apenas profissionais) */}
              {isProfessional && <GuardiaManualProfissional />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jardim da Psique Modal */}
        {resultado && (
          <SalvarJardimModal
            open={showJardimModal}
            onOpenChange={setShowJardimModal}
            ferramenta_nome="Big Five — Leitura Funcional"
            ferramenta_chave="big5_funcional"
            conteudo={{
              respostas,
              medias: resultado.medias,
            }}
            resultado_simbolico={{
              dimensao_alta: resultado.dimensaoAlta ? {
                nome: resultado.dimensaoAlta.nome,
                media: resultado.dimensaoAlta.media,
                descricao: resultado.dimensaoAlta.descricao,
              } : null,
              dimensao_baixa: resultado.dimensaoBaixa ? {
                nome: resultado.dimensaoBaixa.nome,
                media: resultado.dimensaoBaixa.media,
                descricao: resultado.dimensaoBaixa.descricao,
              } : null,
            }}
            tipo_registro="ferramenta"
          />
        )}
      </div>
    </AppLayout>
  );
}
