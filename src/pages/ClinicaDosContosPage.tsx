import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  FileText, 
  Search, 
  Target, 
  BarChart3, 
  Compass,
  GraduationCap,
  CheckCircle2,
  Loader2,
  Send,
  Trash2,
  History,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { BackButton } from '@/components/navigation/BackButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useTrainingProgress, useTrainingSubmissions } from '@/hooks/useTrainingData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AVAILABLE_STORIES = [
  "Patinho Feio",
  "Barba Azul",
  "Vasalisa",
  "La Loba",
  "Mulher-Esqueleto",
  "A Bela e a Fera",
  "O Pequeno Polegar",
  "A Menina dos Fósforos",
  "Dona Holle",
  "Outro conto simbólico"
];

export default function ClinicaDosContosPage() {
  const navigate = useNavigate();
  const { 
    progress, 
    loading: progressLoading, 
    error: progressError, 
    markStarted, 
    markCompleted 
  } = useTrainingProgress("clinica-dos-contos");

  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
    submitExercise,
    archiveSubmission
  } = useTrainingSubmissions("clinica-dos-contos");

  // Form state
  const [formData, setFormData] = useState({
    conto: '',
    simboloCentral: '',
    reflexaoSimbolica: '',
    perguntaIntegracao: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Sincroniza o início do estudo apenas se ainda não foi iniciado
    if (!progressLoading && !progress) {
      markStarted();
    }
  }, [progressLoading, progress, markStarted]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.conto || !formData.simboloCentral || !formData.reflexaoSimbolica) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitExercise({
        module_key: "clinica-dos-contos",
        exercise_key: "reflexao-simbolica-conto",
        exercise_type: "guided_reflection",
        case_key: formData.conto.toLowerCase().replace(/\s+/g, '-'),
        prompt_text: "Reflexão simbólica sobre conto ou narrativa",
        response_text: formData.reflexaoSimbolica,
        response_metadata: {
          conto: formData.conto,
          simboloCentral: formData.simboloCentral,
          perguntaIntegracao: formData.perguntaIntegracao
        }
      });
      
      toast.success("Reflexão simbólica salva com sucesso!");
      setFormData({
        conto: '',
        simboloCentral: '',
        reflexaoSimbolica: '',
        perguntaIntegracao: ''
      });
    } catch (err) {
      console.error("Erro ao enviar submissão:", err);
      toast.error("Erro ao salvar sua reflexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveSubmission(id);
      toast.success("Reflexão arquivada.");
    } catch (err) {
      toast.error("Erro ao arquivar reflexão.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pattern-geometric overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <PageBreadcrumb
          items={[
            { label: 'Casa das Máquinas', href: '/casa-das-maquinas' },
            { label: 'Sala de Treinamento', href: '/sala-de-treinamento' },
            { label: 'Clínica dos Contos' },
          ]}
        />
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <BackButton />
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide text-foreground leading-tight">
                Clínica dos <span className="text-primary italic">Contos</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Um laboratório simbólico para treinar formulação, escuta e intervenção através de histórias, livros e casos-espelho.
              </p>
            </div>
          </div>
          
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-4 py-2 font-bold uppercase tracking-widest self-start md:self-auto">
            Laboratório Pedagógico
          </Badge>
        </header>

        {/* Bloco ético obrigatório */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-amber-500 font-display">Espaço de Treino e Ética</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Este espaço é pedagógico. Não usa clientes reais, não gera diagnóstico, não substitui supervisão e não deve ser usado como prontuário ou decisão profissional automática. Toda leitura simbólica deve permanecer aberta, contextual e provisória.
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
                      {progress?.status === 'completed' ? 'Estudo Concluído' : 
                       progress?.status === 'in_progress' ? 'Em Andamento' : 'Estudo Iniciado'}
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
                      Marcar como concluído
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-2xl font-display italic">O que é a Clínica dos Contos</h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-4xl">
            A Clínica dos Contos usa narrativas como espelhos simbólicos para treinar o olhar profissional. Cada história pode revelar temas como vergonha, limites, pertencimento, reconstrução, intuição, medo, autonomia e transformação.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <Compass className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Como uma obra vira treino</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { step: 1, title: 'Símbolo central' },
              { step: 2, title: 'Fenómeno psíquico' },
              { step: 3, title: 'Caso-espelho' },
              { step: 4, title: 'Perguntas de formulação' },
              { step: 5, title: 'Cautelas éticas' },
              { step: 6, title: 'Intervenção simbólica' },
              { step: 7, title: 'Prática de integração' },
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
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Casos-espelho demonstrativos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CaseMirrorCard 
              title="Patinho Feio"
              theme="vergonha, pertença e identidade"
              description="Treino de reconhecimento de feridas de exclusão e a busca pelo grupo de alma."
            />
            <CaseMirrorCard 
              title="Barba Azul"
              theme="limites, perigo simbólico e intuição"
              description="Treino de percepção de sinais sutis de predação e o despertar da vigilância interna."
            />
            <CaseMirrorCard 
              title="Vasalisa"
              theme="autonomia e amadurecimento"
              description="Treino de leitura sobre o processo de deixar a proteção materna para encontrar a própria força."
            />
            <CaseMirrorCard 
              title="La Loba"
              theme="reconstrução e vitalidade"
              description="Treino sobre o resgate de partes psíquicas fragmentadas e o retorno à essência."
            />
            <CaseMirrorCard 
              title="Mulher-Esqueleto"
              theme="intimidade, medo e vínculo"
              description="Treino sobre a capacidade de suportar os ciclos de vida-morte-vida nos relacionamentos."
            />
            <div className="bg-card/20 border border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
              <Sparkles className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground italic">Novos casos pedagógicos em estruturação...</p>
            </div>
          </div>
        </section>

        <section className="space-y-8" id="ficha-treino">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Ficha de Reflexão Simbólica</h2>
          </div>
          
          <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-primary/80">Conto ou narrativa estudada*</label>
                    <Select 
                      value={formData.conto} 
                      onValueChange={(val) => setFormData(prev => ({ ...prev, conto: val }))}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                        <SelectValue placeholder="Selecionar obra..." />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_STORIES.map(story => (
                          <SelectItem key={story} value={story}>{story}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-primary/80">Símbolo central percebido*</label>
                    <Input 
                      placeholder="Ex: A chave, a boneca, a pele..."
                      className="bg-background/50 border-border/50 rounded-xl"
                      value={formData.simboloCentral}
                      onChange={(e) => setFormData(prev => ({ ...prev, simboloCentral: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/80">Reflexão Simbólica*</label>
                  <Textarea 
                    placeholder="Escreva a sua leitura simbólica. Não inclua nomes reais, dados de clientes, diagnósticos ou informações sensíveis."
                    className="bg-background/50 border-border/50 rounded-2xl min-h-[160px] resize-none"
                    value={formData.reflexaoSimbolica}
                    onChange={(e) => setFormData(prev => ({ ...prev, reflexaoSimbolica: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/80">Pergunta de Integração (Opcional)</label>
                  <Textarea 
                    placeholder="Que pergunta este conto abre para a sua escuta, estudo ou prática simbólica?"
                    className="bg-background/50 border-border/50 rounded-2xl min-h-[100px] resize-none"
                    value={formData.perguntaIntegracao}
                    onChange={(e) => setFormData(prev => ({ ...prev, perguntaIntegracao: e.target.value }))}
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-2xl flex items-center gap-3 max-w-md">
                    <Info className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-[10px] leading-tight text-amber-500/80 font-medium">
                      Este espaço é pedagógico. Não use dados reais de clientes. Suas respostas não são prontuário e são salvas apenas para seu acompanhamento de treino.
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="rounded-full px-8 py-6 h-auto text-xs uppercase tracking-widest font-bold group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                    Salvar reflexão simbólica
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Histórico de Reflexões */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <History className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Minhas Reflexões Salvas</h2>
          </div>

          {submissionsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 opacity-50">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs uppercase tracking-widest font-bold">Carregando histórico...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-card/20 border border-dashed border-border rounded-3xl p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <p className="text-sm text-muted-foreground italic">Suas reflexões simbólicas aparecerão aqui quando forem salvas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {submissions.map((sub) => (
                <Card key={sub.id} className="bg-card/30 border-border/50 rounded-[1.5rem] overflow-hidden group hover:border-primary/20 transition-colors">
                  <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase tracking-widest">
                          {sub.response_metadata?.conto || 'Conto não identificado'}
                        </Badge>
                        <h4 className="text-lg font-display text-foreground italic">
                          {sub.response_metadata?.simboloCentral || 'Símbolo central'}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {new Date(sub.submitted_at).toLocaleDateString('pt-PT')}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full"
                          onClick={() => handleArchive(sub.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 italic">
                        "{sub.response_text}"
                      </p>
                      {sub.response_metadata?.perguntaIntegracao && (
                        <div className="pt-2 border-t border-border/5 space-y-1">
                          <p className="text-[10px] uppercase font-bold text-primary/40 tracking-widest">Pergunta aberta:</p>
                          <p className="text-xs text-muted-foreground">{sub.response_metadata.perguntaIntegracao}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-8 pt-8">
          <div className="flex flex-col gap-2 border-b border-border/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-display text-primary italic">Acervos e Bibliotecas</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Materiais de apoio para aprofundar o treino simbólico, literário e narrativo da Clínica dos Contos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SupportArchiveCard
              icon={BookOpen}
              title="Acervo Simbólico de Referência"
              description="Contos clássicos e narrativas de referência para estudo, reconhecimento de temas simbólicos e treino do olhar."
              cta="Explorar acervo"
              status="Estudo e referência"
              onClick={() => navigate('/narroterapia/biblioteca-contos')}
            />
            <SupportArchiveCard
              icon={Compass}
              title="Câmara de Narração Oracular"
              description="Os 12 contos oficiais da Narroterapia para uso orientado, com contexto ético e autorização adequada."
              cta="Acessar câmara"
              status="Requer certificação ativa"
              requiresAuth
              onClick={() => navigate('/narroterapia/clinica')}
            />
          </div>

          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5">
            <p className="text-xs text-muted-foreground leading-relaxed text-center italic">
              A Câmara de Narração pode exigir autorização, certificação ou aceite ético. 
              Caso o acesso não esteja disponível, siga pelo Acervo Simbólico de Referência ou pelo percurso principal da Clínica dos Contos.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
            <h3 className="text-xl font-display text-primary italic flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Como treina o raciocínio do Atlas
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              A Clínica dos Contos treina as mesmas etapas do Atlas: entender o caso, levantar hipóteses, observar sinais de cautela, definir direção, escolher intervenção e acompanhar evolução. A diferença é que aqui tudo acontece em ambiente fictício, literário e pedagógico.
            </p>
          </section>

          <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
            <h3 className="text-xl font-display text-primary italic flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Das Rotas da Casa para o treino
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              As Rotas da Casa podem alimentar esta clínica com obras, aulas, áudios e práticas. A leitura deixa de ser apenas conteúdo e passa a ser laboratório de formulação simbólica.
            </p>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento')}>
            Voltar para Sala de Treinamento
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/casos-simulados')}>
            Continuar percurso: Casos Simulados
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/mapa-casa')}>
             Ver Rotas da Casa
          </Button>
          <Button className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/casa-das-maquinas/atlas')}>
            Ver Atlas Orácula
          </Button>
        </div>
      </div>
    </div>
  );
}

function CaseMirrorCard({ title, theme, description }: { title: string, theme: string, description: string }) {
  return (
    <div className="group bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 space-y-4 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10 group-hover:bg-primary/10 transition-colors" />
      <div className="space-y-2">
        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-primary/60 px-3 py-0.5">
          Caso-Espelho
        </Badge>
        <h4 className="text-xl font-display text-foreground group-hover:text-primary transition-colors">{title}</h4>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40">Tema de treino:</p>
        <p className="text-xs text-foreground font-medium">{theme}</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed font-body">
        {description}
      </p>
      <div className="pt-2">
        <Button variant="ghost" size="sm" className="p-0 h-auto text-[10px] uppercase font-bold tracking-widest text-primary/60 hover:text-primary transition-colors hover:bg-transparent" disabled>
          Ver Detalhes <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function SupportArchiveCard({ icon: Icon, title, description, cta, status, requiresAuth, onClick }: { icon: any, title: string, description: string, cta: string, status: string, requiresAuth?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group bg-card/40 backdrop-blur-sm border border-border rounded-[2rem] p-8 space-y-6 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
          <Icon className="w-7 h-7 text-primary/60 group-hover:text-primary" />
        </div>
        <Badge variant="outline" className={cn(
          "text-[10px] uppercase tracking-widest px-3 py-1",
          requiresAuth ? "border-amber-500/20 text-amber-500/60" : "border-primary/20 text-primary/60"
        )}>
          {requiresAuth && <AlertCircle className="w-3 h-3 mr-1 inline" />}
          {status}
        </Badge>
      </div>

      <div className="space-y-3">
        <h4 className="text-xl font-display text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed font-body">
          {description}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-widest text-primary/60 group-hover:text-primary transition-colors">
          {cta}
        </span>
        <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:border-primary/30 transition-all">
          <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary" />
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
}
