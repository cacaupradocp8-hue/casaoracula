import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Target, 
  ArrowLeft, 
  AlertCircle, 
  FileText, 
  Search, 
  BarChart3, 
  Compass,
  GraduationCap,
  Sparkles,
  ChevronRight,
  MessageCircle,
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

export default function CasosSimuladosPage() {
  const navigate = useNavigate();
  const { 
    progress, 
    loading: progressLoading, 
    error: progressError, 
    markStarted, 
    markCompleted 
  } = useTrainingProgress("casos-simulados");

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
            { label: 'Casos Simulados' },
          ]}
        />
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <BackButton />
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide text-foreground leading-tight">
                Casos <span className="text-primary italic">Simulados</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Um espaço seguro para treinar formulação, perguntas, cautelas e próximos passos com personagens fictícias.
              </p>
            </div>
        </div>

        {/* Card de Progresso Pedagógico */}
        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3 text-primary">
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-2xl font-display italic">Progresso da Jornada</h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Este progresso pertence apenas à sua jornada pedagógica na Sala de Treinamento. Ele não é prontuário, não representa atendimento real e não é enviado ao Atlas Orácula profissional.
              </p>
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
                <>
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
                  
                  {progress?.status !== 'completed' && (
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
                </>
              )}
            </div>
          </div>
        </section>
          
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-4 py-2 font-bold uppercase tracking-widest self-start md:self-auto">
            Laboratório de Formulação
          </Badge>
        </header>

        {/* Bloco ético obrigatório */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-amber-500 font-display">Treino Ético e Fictício</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Este espaço é pedagógico. Não usa clientes reais, não gera diagnóstico, não substitui supervisão e não deve ser usado como prontuário ou decisão profissional automática. Serve para treinar perguntas, prudência e formulação.
            </p>
          </div>
        </div>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-2xl font-display italic">O que são Casos Simulados</h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-4xl">
            Casos Simulados são exercícios pedagógicos com personagens fictícias. Eles ajudam a treinar raciocínio, escuta, formulação e escolha de próximos passos sem usar dados de clientes reais.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <Compass className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Como treinar um caso</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { step: 1, title: 'Contexto fictício' },
              { step: 2, title: 'Identificar sinais' },
              { step: 3, title: 'Hipóteses provisórias' },
              { step: 4, title: 'Observar cautelas' },
              { step: 5, title: 'Definir direção' },
              { step: 6, title: 'Escolher intervenção' },
              { step: 7, title: 'Refletir evolução' },
            ].map((item) => (
              <div key={item.step} className="bg-card/30 border border-border rounded-2xl p-4 text-center space-y-2 group hover:border-primary/30 transition-colors">
                <span className="text-[10px] font-bold text-primary/40 group-hover:text-primary transition-colors">PASSO {item.step}</span>
                <p className="text-xs font-medium leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <Target className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Casos demonstrativos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SimulatedCaseCard 
              name="Caso Lia"
              theme="limites e sobrecarga"
              description="Dificuldade de dizer não e sensação de invasão no campo pessoal."
            />
            <SimulatedCaseCard 
              name="Caso Joana"
              theme="procrastinação e autocobrança"
              description="Paralisia por medo de errar e altos padrões internos de exigência."
            />
            <SimulatedCaseCard 
              name="Caso Helena"
              theme="identidade e insegurança"
              description="Sentimento de inadequação em uma nova fase de vida e carreira."
            />
            <SimulatedCaseCard 
              name="Caso Rosa"
              theme="repetição e culpa"
              description="Padrões relacionais repetitivos e forte necessidade de pertencimento."
            />
          </div>
        </section>

        <section className="space-y-8 pt-8">
          <div className="flex flex-col gap-2 border-b border-border/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-display text-primary italic">Escuta Ativa e Casos de Obras</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Antes de formular, aprenda a escutar o campo simbólico de uma narrativa.
            </p>
          </div>

          <div className="grid grid-cols-1 max-w-2xl mx-auto">
            <div 
              onClick={() => navigate('/clube/treinamento')}
              className="group bg-card/40 backdrop-blur-sm border border-border rounded-[2rem] p-8 space-y-6 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                  <MessageCircle className="w-7 h-7 text-primary/60 group-hover:text-primary" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest px-3 py-1 border-primary/20 text-primary/60">
                  Rota existente
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-display text-foreground group-hover:text-primary transition-colors">Câmara do Sussurro</h4>
                <p className="text-sm text-muted-foreground leading-relaxed font-body">
                  Treine a sua escuta imersiva com casos inspirados nas obras e narrativas simbólicas da Casa. 
                  A Câmara do Sussurro ajuda a perceber atmosfera, sinais, imagens e tensões antes de organizar uma formulação.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors">
                  Entrar na Câmara do Sussurro
                </span>
                <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:border-primary/30 transition-all">
                  <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary" />
                </div>
              </div>

              <div className="pt-4 border-t border-border/10">
                <p className="text-[10px] text-muted-foreground/40 italic">
                  Acesso conforme as permissões da Casa.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 max-w-2xl mx-auto">
            <p className="text-xs text-muted-foreground leading-relaxed text-center italic">
              Os casos da Câmara do Sussurro são parte de um percurso pedagógico e simbólico. 
              Eles não representam atendimento real, não geram diagnóstico e devem ser usados como treino de escuta, percepção e formulação.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Ficha de Simulação (Modelo)</h2>
          </div>
          <Card className="bg-card/40 border-border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 sm:p-12 space-y-8 opacity-60">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Nome Fictício</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">Selecionar caso...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Tema Central</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">Tema identificado...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Sinais Observados</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">Liste os sinais...</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Hipóteses Provisórias</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Levante possibilidades...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Cautelas</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">O que exige cuidado?</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Direção Possível</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Para onde seguir?</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Intervenção</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Escolha da prática...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Próximo Passo</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Ação de treino...</div>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/60 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Ficha de Simulação Mock — Não persistente
                </span>
                <Button variant="outline" className="rounded-full px-6 text-xs uppercase tracking-widest font-bold" disabled>
                  Iniciar Simulação
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BarChart3 className="w-6 h-6" />
            <h3 className="text-xl font-display italic">Treinar o ciclo do Atlas</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            Cada caso simulado percorre o mesmo ciclo do Atlas Orácula: entender, levantar hipóteses, observar cautelas, definir direção, escolher intervenção e acompanhar evolução. Aqui, tudo acontece em ambiente fictício e pedagógico.
          </p>
        </section>

        {progress?.status !== 'completed' && !progressLoading && (
          <div className="flex justify-center pt-8 border-t border-border/10">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-primary text-[10px] uppercase font-bold tracking-widest gap-2"
              onClick={() => markCompleted()}
            >
              <CheckCircle2 className="w-3 h-3" />
              Marcar percurso como concluído
            </Button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento')}>
            Voltar para Sala de Treinamento
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/formulacao-guiada')}>
            Continuar percurso: Formulação
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/clinica-dos-contos')}>
            Treinar com Literatura
          </Button>
          <Button className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/casa-das-maquinas/atlas')}>
            Ver Atlas Orácula
          </Button>
        </div>
      </div>
    </div>
  );
}

function SimulatedCaseCard({ name, theme, description }: { name: string, theme: string, description: string }) {
  return (
    <div className="group bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 space-y-4 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10 group-hover:bg-primary/10 transition-colors" />
      <div className="space-y-2">
        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-primary/60 px-3 py-0.5">
          Caso Fictício
        </Badge>
        <h4 className="text-xl font-display text-foreground group-hover:text-primary transition-colors">{name}</h4>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40">Tema:</p>
        <p className="text-xs text-foreground font-medium">{theme}</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed font-body line-clamp-2">
        {description}
      </p>
      <div className="pt-2">
        <Button variant="ghost" size="sm" className="p-0 h-auto text-[10px] uppercase font-bold tracking-widest text-primary/60 hover:text-primary transition-colors hover:bg-transparent" disabled>
          Praticar com {name} <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
