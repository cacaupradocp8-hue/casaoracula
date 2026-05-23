import React, { useState, useCallback, useEffect } from 'react';
import { useTrainingSubmissions } from '@/hooks/useTrainingData';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Target, 
  ArrowLeft, 
  AlertCircle, 
  FileText, 
  Search, 
  BarChart3, 
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCcw,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { BackButton } from '@/components/navigation/BackButton';
import { useTrainingProgress } from '@/hooks/useTrainingData';
import { cn } from '@/lib/utils';

export default function FormulacaoGuiadaPage() {
  const navigate = useNavigate();
  const { 
    progress, 
    loading: progressLoading, 
    error: progressError, 
    markStarted, 
    markCompleted 
  } = useTrainingProgress("formulacao-guiada");

  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
    submitExercise,
    archiveSubmission
  } = useTrainingSubmissions("formulacao-guiada");

  const [formState, setFormState] = useState({
    situacaoFicticia: '',
    sinaisSimbolicos: '',
    hipotesesTreino: '',
    cautelasPedagogicas: '',
    direcaoSimbolica: '',
    praticaIntegracao: '',
    evolucaoEsperada: '',
    sintesePedagogica: ''
  });

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveFormulation = async () => {
    if (!formState.sintesePedagogica.trim()) return;

    try {
      await submitExercise({
        module_key: "formulacao-guiada",
        exercise_key: "formulacao-pedagogica-7-camadas",
        exercise_type: "formulation_practice",
        case_key: "formulacao-guiada",
        prompt_text: "Treino de formulação em 7 camadas (Ambiente Pedagógico)",
        response_text: formState.sintesePedagogica,
        response_metadata: {
          ...formState
        }
      });
      
      // Limpa o formulário após sucesso
      setFormState({
        situacaoFicticia: '',
        sinaisSimbolicos: '',
        hipotesesTreino: '',
        cautelasPedagogicas: '',
        direcaoSimbolica: '',
        praticaIntegracao: '',
        evolucaoEsperada: '',
        sintesePedagogica: ''
      });

      // Se for a primeira submissão, marca como concluído o percurso visual? 
      // Ou deixamos a aluna marcar manualmente como está agora.
      // A instrução não pede para automatizar a conclusão do progresso.
    } catch (err) {
      console.error("Erro ao salvar formulação:", err);
    }
  };

  useEffect(() => {
    if (!progressLoading && !progress) {
      markStarted();
    }
  }, [progressLoading, progress, markStarted]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pattern-geometric overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <PageBreadcrumb
          items={[
            { label: 'Casa das Máquinas', href: '/casa-das-maquinas' },
            { label: 'Sala de Treinamento', href: '/sala-de-treinamento' },
            { label: 'Formulação Guiada' },
          ]}
        />
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <BackButton />
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide text-foreground leading-tight">
                Formulação <span className="text-primary italic">Guiada</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Aprenda a organizar uma leitura em camadas antes de escolher uma direção ou intervenção.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
            {progressLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs uppercase tracking-widest font-bold">Sincronizando...</span>
              </div>
            ) : progressError ? (
              <div className="text-xs text-destructive bg-destructive/5 px-4 py-2 rounded-xl border border-destructive/20">
                Erro ao salvar progresso
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  progress?.status === 'completed' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-primary animate-pulse"
                )} />
                <span className="text-xs uppercase tracking-widest font-bold text-primary">
                  {progress?.status === 'completed' ? 'Treino Concluído' : 
                   progress?.status === 'in_progress' ? 'Em Andamento' : 'Treino Iniciado'}
                </span>
              </div>
            )}
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-4 py-2 font-bold uppercase tracking-widest">
              Laboratório de Raciocínio
            </Badge>
          </div>
        </header>

        {/* Card de Progresso Pedagógico */}
        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3 text-primary">
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-2xl font-display italic">Progresso em Formulação Guiada</h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Este progresso pertence apenas à sua jornada pedagógica na Sala de Treinamento. A formulação aqui é exercício de estudo, não prontuário, não atendimento real e não é enviada ao Atlas ou à IA.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
              {progress?.status !== 'completed' && !progressLoading && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/10 text-[10px] uppercase font-bold tracking-widest"
                  onClick={() => markCompleted()}
                >
                  <CheckCircle2 className="w-3 h-3 mr-2" />
                  Marcar percurso como concluído
                </Button>
              )}
              <p className="text-[10px] text-muted-foreground/60 italic text-center sm:text-right max-w-[200px]">
                Ações de estudo não geram registros clínicos profissionais.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco ético obrigatório */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-amber-500 font-display">Treino Ético e Pedagógico</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Este espaço é exclusivo para treino pedagógico com casos fictícios. Não use dados de clientes reais. Nada preenchido aqui é processado por IA, enviado ao Atlas Orácula ou usado como prontuário. A formulação guiada é um exercício de estudo e permanece isolada na Sala de Treinamento.
            </p>
          </div>
        </div>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-2xl font-display italic">O que é formular</h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-4xl">
            Formular é organizar sinais, contexto, hipóteses, cautelas e direções possíveis sem reduzir a pessoa a um rótulo. Uma boa formulação permanece aberta, supervisionável e ajustável ao ritmo e resposta de quem atendemos.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <BarChart3 className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">As 7 camadas de formulação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LayerCard 
              num={1}
              title="Queixa e contexto"
              description="O que aparece? Em que situação? Há quanto tempo? O que intensifica ou suaviza?"
              icon={MessageCircle}
            />
            <LayerCard 
              num={2}
              title="Sinais observáveis"
              description="Que sinais podem ser observados no campo sem interpretar cedo demais?"
              icon={Search}
            />
            <LayerCard 
              num={3}
              title="Hipóteses provisórias"
              description="Que leituras são possíveis? O que aponta a favor e contra cada hipótese?"
              icon={Sparkles}
            />
            <LayerCard 
              num={4}
              title="Cautelas éticas"
              description="Há algo que peça mais contexto, supervisão, estabilização ou encaminhamento?"
              icon={AlertCircle}
            />
            <LayerCard 
              num={5}
              title="Direção de trabalho"
              description="O caso pede estabilizar, regular, investigar crenças ou fortalecer recursos?"
              icon={Compass}
            />
            <LayerCard 
              num={6}
              title="Intervenção possível"
              description="Qual seria o menor próximo passo responsável e coerente com a direção?"
              icon={Target}
            />
            <LayerCard 
              num={7}
              title="Evolução e revisão"
              description="Como observar a resposta, ajustar a direção e rever periodicamente a formulação?"
              icon={RefreshCcw}
            />
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
              <Zap className="w-8 h-8 text-primary/40" />
              <p className="text-xs text-primary/60 font-bold uppercase tracking-widest">Maestria em Treino</p>
            </div>
          </div>
        </section>

        <section className="space-y-8" id="exercicio-pratico">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Ficha de Exercício Pedagógico</h2>
          </div>
          <Card className="bg-card/40 border-border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 sm:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Situação fictícia de estudo</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="Descreva uma situação fictícia ou exercício de estudo. Não inclua nomes reais, clientes, diagnósticos ou dados sensíveis."
                    value={formState.situacaoFicticia}
                    onChange={(e) => handleInputChange('situacaoFicticia', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Sinais Simbólicos Observados</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="O que foi mapeado no cenário de treino?"
                    value={formState.sinaisSimbolicos}
                    onChange={(e) => handleInputChange('sinaisSimbolicos', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Hipóteses de Treino</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="Possíveis leituras e possibilidades pedagógicas..."
                    value={formState.hipotesesTreino}
                    onChange={(e) => handleInputChange('hipotesesTreino', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Cautelas Pedagógicas</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="Pontos de atenção ética no exercício..."
                    value={formState.cautelasPedagogicas}
                    onChange={(e) => handleInputChange('cautelasPedagogicas', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Direção Simbólica Possível</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="Próximo passo de estudo proposto..."
                    value={formState.direcaoSimbolica}
                    onChange={(e) => handleInputChange('direcaoSimbolica', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Prática de integração sugerida</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="Como integrar o aprendizado deste exercício?"
                    value={formState.praticaIntegracao}
                    onChange={(e) => handleInputChange('praticaIntegracao', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Evolução esperada no exercício (Opcional)</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="Sinais de resposta narrativa esperados..."
                    value={formState.evolucaoEsperada}
                    onChange={(e) => handleInputChange('evolucaoEsperada', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Síntese pedagógica da formulação (Obrigatório)</label>
                  <textarea 
                    className="w-full bg-transparent border-b border-border/50 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px] py-2 resize-none"
                    placeholder="Resuma o raciocínio central deste treino..."
                    value={formState.sintesePedagogica}
                    onChange={(e) => handleInputChange('sintesePedagogica', e.target.value)}
                  />
                </div>
              </div>

              {submissionsError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-xs">
                  {submissionsError}
                </div>
              )}

              <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-border/10">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/80 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Compromisso Ético Pedagógico
                  </span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed max-w-md">
                    Este espaço é apenas para treino pedagógico. Não escreva nomes reais, dados de clientes, diagnósticos ou informações sensíveis. Estas respostas não são prontuário, não representam atendimento real e não são enviadas ao Atlas Orácula nem processadas por IA.
                  </p>
                </div>
                <Button 
                  className="rounded-full px-8 py-6 h-auto text-xs uppercase tracking-widest font-bold shadow-lg shadow-primary/20"
                  disabled={submissionsLoading || !formState.sintesePedagogica.trim()}
                  onClick={handleSaveFormulation}
                >
                  {submissionsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar formulação pedagógica'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Histórico de Submissões */}
        <section className="space-y-8 pt-8">
          <div className="flex items-center justify-between border-b border-border/10 pb-4">
            <div className="flex items-center gap-3 text-primary">
              <RefreshCcw className="w-5 h-5" />
              <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Minhas formulações salvas</h2>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-tighter opacity-60">
              {submissions.length} registros
            </Badge>
          </div>

          {submissionsLoading && submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
              <Loader2 className="w-8 h-8 animate-spin opacity-20" />
              <p className="text-xs uppercase tracking-widest font-bold opacity-40">Carregando histórico...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-card/20 border border-dashed border-border rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center px-6">
              <FileText className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground text-sm italic">
                Suas formulações pedagógicas aparecerão aqui quando forem salvas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {submissions.map((submission) => {
                const metadata = submission.response_metadata as any;
                return (
                  <Card key={submission.id} className="bg-card/40 border-border rounded-3xl overflow-hidden group hover:border-primary/20 transition-all">
                    <CardContent className="p-6 sm:p-8 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary/60">
                            {new Date(submission.submitted_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </h4>
                          <p className="text-sm text-foreground font-medium line-clamp-1">
                            {metadata?.situacaoFicticia || "Sem descrição da situação"}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-destructive transition-colors rounded-full"
                          onClick={() => archiveSubmission(submission.id)}
                        >
                          Arquivar
                        </Button>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-sm text-muted-foreground italic line-clamp-2">
                          {submission.response_text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <Target className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Perguntas-guia para o olhar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Estou confundindo hipótese com certeza?",
              "Estou reduzindo a pessoa a uma ferramenta ou tipo?",
              "Que contexto ainda falta para esta leitura?",
              "Que hipótese alternativa precisa ser considerada?",
              "Existe algo que peça supervisão ou pausa?",
              "Qual é o menor próximo passo responsável?"
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-card/30 border border-border rounded-2xl group hover:border-primary/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <span className="text-[10px] font-bold text-primary/40">?</span>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{q}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BarChart3 className="w-6 h-6" />
            <h3 className="text-xl font-display italic">Treinar para pensar com o Atlas</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            A Formulação Guiada treina a mesma lógica que o Atlas organiza na Casa das Máquinas. Aqui, a profissional aprende a pensar em camadas antes de aplicar esse raciocínio em casos reais. Tudo acontece em ambiente fictício e pedagógico.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento')}>
            Voltar para Sala de Treinamento
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/casos-simulados')}>
            Praticar com Casos Fictícios
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/clinica-dos-contos')}>
            Treinar com Literatura
          </Button>
        </div>

        <section className="mt-12 pt-12 border-t border-border/10 max-w-3xl mx-auto space-y-8">
          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 sm:p-10 space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Do treino à prática profissional</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-display text-foreground italic">Pronto para aplicar na prática real?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Na Formulação Guiada, você treina o raciocínio com exercícios pedagógicos e fictícios que permanecem isolados na Sala de Treinamento. No Atlas Orácula profissional, esse mesmo raciocínio é aplicado com responsabilidade clínica, mas este exercício não envia dados ao Atlas e não cria registro profissional.
              </p>
              <p className="text-xs text-muted-foreground/60 italic max-w-xl mx-auto">
                Este espaço não gera prontuário, diagnóstico ou relatório clínico e nada preenchido aqui é processado por IA.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                className="rounded-full px-10 py-7 h-auto font-bold uppercase tracking-widest text-sm shadow-gold group" 
                onClick={() => navigate('/casa-das-maquinas/atlas')}
              >
                Aplicar raciocínio no Atlas
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function LayerCard({ num, title, description, icon: Icon }: { num: number, title: string, description: string, icon: any }) {
  return (
    <div className="group bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 space-y-4 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10 group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary" />
        </div>
        <span className="text-[10px] font-bold text-primary/20 group-hover:text-primary/40 transition-colors">CAMADA {num}</span>
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed font-body">
          {description}
        </p>
      </div>
    </div>
  );
}
