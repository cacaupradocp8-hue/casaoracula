import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowLeft, ArrowRight, Check, RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { useBig5Oracular, Big5OracularFator, Big5OracularResult } from '@/hooks/useBig5Oracular';
import { useBig5PortaMapping } from '@/hooks/useBig5PortaMapping';
import { useRitualSymbolic } from '@/hooks/useRitualSymbolic';
import { RadialVisualization } from '@/components/visualization/RadialVisualization';
import { SymbolicElement, VisualizationConfig } from '@/components/visualization/types';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { ToolEthicalNote } from '@/components/shared/ToolEthicalNote';
import { SymbolicReadingScreen } from '@/components/big5/SymbolicReadingScreen';
import { RitualSymbolicScreen } from '@/components/big5/RitualSymbolicScreen';
import { DepthDecisionScreen } from '@/components/big5/DepthDecisionScreen';
import { useNavigate } from 'react-router-dom';

type Phase = 'intro' | 'questionnaire' | 'result' | 'symbolic_reading' | 'ritual' | 'decision';

export default function Big5Oracular() {
  const navigate = useNavigate();
  const {
    fatores,
    perguntas,
    loading,
    saving,
    calcularMedias,
    saveResult,
    getIntensidade,
  } = useBig5Oracular();

  const { saving: savingRitual, saveRitualCompletion, markNarroterapiaAccess, isCertified, registro } = useRitualSymbolic();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [reflexao, setReflexao] = useState('');
  const [resultado, setResultado] = useState<Big5OracularResult | null>(null);
  const [big5RegistroId, setBig5RegistroId] = useState<string | null>(null);

  // Mapping based on resultado
  const { mapping, ritual } = useBig5PortaMapping(
    resultado?.predominante?.chave,
    resultado?.fragilizado?.chave
  );

  // Todas as perguntas em ordem
  const allQuestions = fatores.flatMap(fator => 
    perguntas.filter(p => p.fator_id === fator.id).sort((a, b) => a.ordem - b.ordem)
  );

  const totalQuestions = allQuestions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentFator = currentQuestion ? fatores.find(f => f.id === currentQuestion.fator_id) : null;

  // Opções de resposta Likert
  const opcoes = [
    { value: 1, label: 'Nunca / Quase nunca' },
    { value: 2, label: 'Raramente' },
    { value: 3, label: 'Às vezes' },
    { value: 4, label: 'Frequentemente' },
    { value: 5, label: 'Quase sempre' },
  ];

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;
    
    setRespostas(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Auto-avançar após responder
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    const result = calcularMedias(respostas);
    setResultado(result);
    
    // Salvar automaticamente
    const savedResult = await saveResult(respostas, reflexao);
    if (savedResult) {
      setBig5RegistroId(savedResult.id);
    }
    
    setPhase('result');
  };

  const handleViewSymbolicReading = () => {
    setPhase('symbolic_reading');
  };

  const handleStartRitual = () => {
    setPhase('ritual');
  };

  const handleRitualComplete = async () => {
    // Save ritual completion
    await saveRitualCompletion(
      big5RegistroId,
      ritual?.id || null,
      mapping?.porta_associada || null
    );
    setPhase('decision');
  };

  const handleAccessNarroterapia = async () => {
    if (registro?.id) {
      await markNarroterapiaAccess(registro.id);
    }
  };

  const handleClose = () => {
    navigate('/jornada');
  };

  const handleReset = () => {
    setPhase('intro');
    setCurrentQuestionIndex(0);
    setRespostas({});
    setReflexao('');
    setResultado(null);
    setBig5RegistroId(null);
  };

  // Verificar se pode avançar
  const canComplete = Object.keys(respostas).length === totalQuestions;
  const hasCurrentAnswer = currentQuestion && respostas[currentQuestion.id];

  // Preparar dados para visualização radial
  const visualizationElements: SymbolicElement[] = resultado
    ? fatores.map(fator => ({
        id: fator.chave,
        label: fator.nome,
        description: fator.descricao_simbolica,
        color: fator.cor_primaria,
        intensity: getIntensidade(resultado.medias[fator.chave] || 0),
      }))
    : [];

  const visualizationConfig: VisualizationConfig = {
    type: 'radial',
    centerLabel: 'Você',
    showLabels: true,
    showDescriptions: true,
    glowEffect: true,
    animated: true,
    interactive: true,
    size: 'lg',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-2xl md:text-3xl text-gold mb-2">
            Mapa Simbólico de Funcionamento Psíquico
          </h1>
          <p className="text-muted-foreground">Big Five Oracular</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* FASE 1: Introdução */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="glass border-gold/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gold" />
                  </div>
                  <CardTitle className="font-display text-xl">Antes de Começar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-amber-200">
                          Este NÃO é um teste psicológico ou diagnóstico.
                        </p>
                        <p className="text-muted-foreground">
                          É uma leitura simbólica do seu momento atual. Não substitui 
                          avaliação profissional. O objetivo é oferecer uma linguagem 
                          para o que já se move em você.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Você responderá <strong className="text-foreground">30 perguntas</strong>, 
                      distribuídas em 5 territórios simbólicos.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {fatores.map(fator => (
                        <div 
                          key={fator.id}
                          className="flex items-center gap-2 p-2 rounded bg-card/50"
                        >
                          <span className="text-lg">{fator.simbolo}</span>
                          <span className="font-medium text-foreground">{fator.nome}</span>
                          <span className="text-xs text-muted-foreground">({fator.nome_ocean})</span>
                        </div>
                      ))}
                    </div>

                    <p>
                      Responda com sinceridade, pensando em como você tem se sentido 
                      <strong className="text-foreground"> nos últimos tempos</strong>.
                    </p>
                  </div>

                  <Button 
                    onClick={() => setPhase('questionnaire')} 
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Iniciar Leitura
                  </Button>
                </CardContent>
              </Card>

              <ToolEthicalNote />
            </motion.div>
          )}

          {/* FASE 2: Questionário */}
          {phase === 'questionnaire' && currentQuestion && currentFator && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Pergunta {currentQuestionIndex + 1} de {totalQuestions}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Fator atual */}
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-full w-fit mx-auto"
                style={{ backgroundColor: `${currentFator.cor_primaria}20` }}
              >
                <span className="text-lg">{currentFator.simbolo}</span>
                <span className="font-medium" style={{ color: currentFator.cor_primaria }}>
                  {currentFator.nome}
                </span>
              </div>

              {/* Pergunta */}
              <Card className="glass border-gold/20">
                <CardContent className="py-8 px-6">
                  <motion.p
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg text-center leading-relaxed mb-8"
                  >
                    "{currentQuestion.texto_pergunta}"
                  </motion.p>

                  {/* Opções */}
                  <div className="space-y-3">
                    {opcoes.map(opcao => (
                      <button
                        key={opcao.value}
                        onClick={() => handleAnswer(opcao.value)}
                        className={`w-full p-4 rounded-lg border transition-all text-left ${
                          respostas[currentQuestion.id] === opcao.value
                            ? 'border-gold bg-gold/10 text-foreground'
                            : 'border-border/50 hover:border-gold/50 hover:bg-gold/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            respostas[currentQuestion.id] === opcao.value
                              ? 'border-gold bg-gold'
                              : 'border-muted-foreground/30'
                          }`}>
                            {respostas[currentQuestion.id] === opcao.value && (
                              <Check className="w-4 h-4 text-background" />
                            )}
                          </div>
                          <span className="text-sm">{opcao.value} — {opcao.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navegação */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <Button
                    onClick={handleComplete}
                    disabled={!canComplete || saving}
                  >
                    {saving ? 'Salvando...' : 'Ver Resultado'}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!hasCurrentAnswer}
                  >
                    Próxima
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* FASE 3: Resultado */}
          {phase === 'result' && resultado && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Visualização Radial */}
              <Card className="glass border-gold/20">
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-xl">Seu Mapa Atual</CardTitle>
                  <CardDescription>
                    Este mapa reflete um momento — não uma identidade fixa
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <RadialVisualization
                    elements={visualizationElements}
                    config={visualizationConfig}
                  />
                </CardContent>
              </Card>

              {/* Fator Predominante */}
              {resultado.predominante && (
                <Card 
                  className="border-2"
                  style={{ borderColor: resultado.predominante.cor_primaria }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{resultado.predominante.simbolo}</span>
                      <div>
                        <Badge style={{ backgroundColor: resultado.predominante.cor_primaria }}>
                          Predominante
                        </Badge>
                        <CardTitle className="text-lg mt-1">
                          {resultado.predominante.nome}
                        </CardTitle>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Média: {resultado.medias[resultado.predominante.chave].toFixed(1)}/5
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {resultado.predominante.narrativa_elevada}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Fator Fragilizado */}
              {resultado.fragilizado && resultado.fragilizado.chave !== resultado.predominante?.chave && (
                <Card className="border border-amber-500/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{resultado.fragilizado.simbolo}</span>
                      <div>
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          Pede Atenção
                        </Badge>
                        <CardTitle className="text-lg mt-1">
                          {resultado.fragilizado.nome}
                        </CardTitle>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Média: {resultado.medias[resultado.fragilizado.chave].toFixed(1)}/5
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {resultado.fragilizado.narrativa_fragil}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Todos os fatores */}
              <Card className="glass border-gold/20">
                <CardHeader>
                  <CardTitle className="text-lg">Visão Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fatores
                    .sort((a, b) => (resultado.medias[b.chave] || 0) - (resultado.medias[a.chave] || 0))
                    .map(fator => (
                      <div key={fator.id} className="flex items-center gap-3">
                        <span className="text-lg">{fator.simbolo}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{fator.nome}</span>
                            <span className="text-muted-foreground">
                              {(resultado.medias[fator.chave] || 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${((resultado.medias[fator.chave] || 0) / 5) * 100}%`,
                                backgroundColor: fator.cor_primaria,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* CTA para próxima fase */}
              <Button
                onClick={handleViewSymbolicReading}
                className="w-full"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Ver Campo Simbólico
              </Button>

              <EthicalNotice toolName="Mapa Simbólico Big Five Oracular" />
            </motion.div>
          )}

          {/* FASE 4: Leitura Simbólica */}
          {phase === 'symbolic_reading' && resultado && (
            <SymbolicReadingScreen
              key="symbolic_reading"
              predominante={resultado.predominante}
              fragilizado={resultado.fragilizado}
              mapping={mapping}
              onContinue={handleStartRitual}
            />
          )}

          {/* FASE 5: Ritual Simbólico */}
          {phase === 'ritual' && (
            <RitualSymbolicScreen
              key="ritual"
              ritual={ritual}
              portaAssociada={mapping?.porta_associada || null}
              onComplete={handleRitualComplete}
              saving={savingRitual}
            />
          )}

          {/* FASE 6: Decisão de Profundidade */}
          {phase === 'decision' && (
            <DepthDecisionScreen
              key="decision"
              portaAssociada={mapping?.porta_associada || null}
              isCertified={isCertified}
              onClose={handleClose}
              onAccessNarroterapia={handleAccessNarroterapia}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
