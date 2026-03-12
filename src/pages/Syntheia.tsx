import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  Download, 
  RotateCcw,
  Wrench,
  Package,
  Drama,
  Shield,
  ArrowRight,
  Zap,
  Target,
  Lightbulb,
  MessageSquare,
  ClipboardList,
  Home,
  ChevronRight
} from 'lucide-react';
import syntheiaHero from '@/assets/syntheia-hero.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Agentes unificados (seletor principal)
const AGENTES = [
  {
    id: 'analista',
    name: 'Analista',
    description: 'Análise de casos clínicos e identificação de padrões.',
    icon: '🔍',
    intelligenceDefault: 'ferramenteira',
  },
  {
    id: 'curador',
    name: 'Curador',
    description: 'Sugestão de práticas terapêuticas personalizadas.',
    icon: '🌿',
    intelligenceDefault: 'archetypos',
  },
  {
    id: 'simbolico',
    name: 'Simbólico',
    description: 'Tradução de linguagem simbólica e arquetípica.',
    icon: '🎭',
    intelligenceDefault: 'aracne_arcano',
  },
];

// Três inteligências internas da SYNTHEIA
const INTELLIGENCES = [
  {
    id: 'ferramenteira',
    name: 'A Ferramenteira',
    icon: '🜂',
    iconComponent: Wrench,
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    question: '"O que faço na sessão?"',
    description: 'Transforma temas emocionais em prática aplicável.',
    delivers: ['Roteiro de sessão', 'Rituais práticos', 'Perguntas terapêuticas', 'Checklists de condução'],
  },
  {
    id: 'archetypos',
    name: 'Archétypos',
    icon: '🧱',
    iconComponent: Package,
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    question: '"Isso vira produto ou método?"',
    description: 'Transforma saber terapêutico em estrutura vendável.',
    delivers: ['Estrutura de produto', 'Módulos e jornadas', 'Promessa clara', 'Próximo passo estratégico'],
  },
  {
    id: 'aracne_arcano',
    name: 'Aracne & Arcano',
    icon: '🎭',
    iconComponent: Drama,
    color: 'from-indigo-500/20 to-blue-500/20',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    question: '"Como nomeio o invisível?"',
    description: 'Traduz processos psíquicos em linguagem simbólica.',
    delivers: ['Metáforas terapêuticas', 'Arquétipos luz/sombra', 'Exercícios simbólicos', 'Frases-âncora'],
  },
];

// Opções do formulário guiado
const TIPO_OPTIONS = [
  { value: 'sessao', label: 'Sessão Individual', intelligence: 'ferramenteira' },
  { value: 'grupo', label: 'Experiência em Grupo', intelligence: 'ferramenteira' },
  { value: 'ritual', label: 'Ritual', intelligence: 'ferramenteira' },
  { value: 'produto', label: 'Produto/Programa', intelligence: 'archetypos' },
  { value: 'aula', label: 'Aula/Conteúdo', intelligence: 'archetypos' },
  { value: 'simbolico', label: 'Trabalho Simbólico', intelligence: 'aracne_arcano' },
];

const PUBLICO_OPTIONS = [
  { value: 'individual', label: 'Mulher individual' },
  { value: 'grupo', label: 'Grupo de mulheres' },
  { value: 'casais', label: 'Casais' },
  { value: 'misto', label: 'Grupo misto' },
];

const MOMENTO_OPTIONS = [
  { value: 'inicio', label: 'Início da jornada' },
  { value: 'crise', label: 'Crise/Transição' },
  { value: 'integracao', label: 'Integração' },
  { value: 'fechamento', label: 'Fechamento' },
];

const TEMPO_OPTIONS = [
  { value: '30min', label: '30 minutos' },
  { value: '50min', label: '50 minutos' },
  { value: '90min', label: '90 minutos' },
  { value: 'jornada', label: 'Jornada contínua' },
];

// Tipos
interface Message {
  role: 'user' | 'assistant';
  content: string;
  intelligence?: string;
  structured?: {
    chave_simbolica?: string;
    intencao_terapeutica?: string;
    estrutura_pratica?: string;
    suporte_linguagem?: string;
    fechamento_integracao?: string;
  };
}

type InputMode = 'livre' | 'guiado';

export default function Syntheia() {
  // Mode and free input state
  const [mode, setMode] = useState<InputMode>('livre');
  const [input, setInput] = useState('');
  
  // Guided form state
  const [guidedTipo, setGuidedTipo] = useState('sessao');
  const [guidedPublico, setGuidedPublico] = useState('individual');
  const [guidedMomento, setGuidedMomento] = useState('inicio');
  const [guidedTempo, setGuidedTempo] = useState('50min');
  const [guidedTema, setGuidedTema] = useState('');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIntelligence, setActiveIntelligence] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Detectar qual inteligência ativar baseado no input (modo livre)
  const detectIntelligence = (text: string): string => {
    const lower = text.toLowerCase();
    
    // Ferramenteira: sessão, prática, ritual, condução
    if (lower.includes('sessão') || lower.includes('sessao') || 
        lower.includes('atendimento') || lower.includes('conduzir') ||
        lower.includes('ritual') || lower.includes('prática') ||
        lower.includes('pratica') || lower.includes('fazer com') ||
        lower.includes('perguntas')) {
      return 'ferramenteira';
    }
    
    // Archétypos: produto, vender, método, curso, programa
    if (lower.includes('produto') || lower.includes('vender') ||
        lower.includes('método') || lower.includes('metodo') ||
        lower.includes('curso') || lower.includes('programa') ||
        lower.includes('oferta') || lower.includes('jornada') ||
        lower.includes('módulo') || lower.includes('modulo')) {
      return 'archetypos';
    }
    
    // Aracne & Arcano: metáfora, arquétipo, símbolo, nomear
    if (lower.includes('metáfora') || lower.includes('metafora') ||
        lower.includes('arquétipo') || lower.includes('arquetipo') ||
        lower.includes('símbolo') || lower.includes('simbolo') ||
        lower.includes('nomear') || lower.includes('linguagem') ||
        lower.includes('sombra') || lower.includes('luz')) {
      return 'aracne_arcano';
    }
    
    // Default: Ferramenteira (mais comum)
    return 'ferramenteira';
  };

  // Get intelligence from guided form tipo
  const getGuidedIntelligence = (): string => {
    const tipoOption = TIPO_OPTIONS.find(t => t.value === guidedTipo);
    return tipoOption?.intelligence || 'ferramenteira';
  };

  const handleSend = async () => {
    if (mode === 'livre') {
      if (!input.trim() || isLoading) return;
      await sendRequest(input.trim(), detectIntelligence(input));
      setInput('');
    } else {
      if (!guidedTema.trim() || isLoading) return;
      await sendGuidedRequest();
    }
  };

  const sendRequest = async (userMessage: string, intelligenceHint: string) => {
    setIsLoading(true);
    setActiveIntelligence(intelligenceHint);
    
    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      const { data, error } = await supabase.functions.invoke('syntheia-generate', {
        body: {
          tipo: 'sessao',
          publico: 'individual',
          momento: 'inicio',
          tempo: '50min',
          tema: userMessage,
          intelligence_hint: intelligenceHint
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const intelligenceData = INTELLIGENCES.find(i => i.id === (data.nucleo_ativado || intelligenceHint));
      
      // Construir resposta estruturada
      const structuredResponse: Message = {
        role: 'assistant',
        content: buildNaturalResponse(data, intelligenceData?.name || 'SYNTHEIA'),
        intelligence: data.nucleo_ativado || intelligenceHint,
        structured: {
          chave_simbolica: data.chave_simbolica,
          intencao_terapeutica: data.intencao_terapeutica,
          estrutura_pratica: data.estrutura_pratica,
          suporte_linguagem: data.suporte_linguagem,
          fechamento_integracao: data.fechamento_integracao,
        }
      };
      
      setMessages(prev => [...prev, structuredResponse]);
      setActiveIntelligence(data.nucleo_ativado || intelligenceHint);
      
    } catch (err) {
      console.error('Erro SYNTHEIA:', err);
      toast({
        title: 'Erro ao processar',
        description: err instanceof Error ? err.message : 'Tente novamente',
        variant: 'destructive'
      });
      setActiveIntelligence(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendGuidedRequest = async () => {
    const intelligenceHint = getGuidedIntelligence();
    const tipoLabel = TIPO_OPTIONS.find(t => t.value === guidedTipo)?.label || guidedTipo;
    const publicoLabel = PUBLICO_OPTIONS.find(p => p.value === guidedPublico)?.label || guidedPublico;
    const momentoLabel = MOMENTO_OPTIONS.find(m => m.value === guidedMomento)?.label || guidedMomento;
    const tempoLabel = TEMPO_OPTIONS.find(t => t.value === guidedTempo)?.label || guidedTempo;
    
    // Criar mensagem formatada para exibição
    const userDisplayMessage = `📋 **Solicitação Guiada**\n• **Tipo:** ${tipoLabel}\n• **Público:** ${publicoLabel}\n• **Momento:** ${momentoLabel}\n• **Tempo:** ${tempoLabel}\n• **Tema:** ${guidedTema}`;
    
    setIsLoading(true);
    setActiveIntelligence(intelligenceHint);
    
    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, { role: 'user', content: userDisplayMessage }]);
    
    try {
      const { data, error } = await supabase.functions.invoke('syntheia-generate', {
        body: {
          tipo: guidedTipo,
          publico: guidedPublico,
          momento: guidedMomento,
          tempo: guidedTempo,
          tema: guidedTema,
          intelligence_hint: intelligenceHint
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const intelligenceData = INTELLIGENCES.find(i => i.id === (data.nucleo_ativado || intelligenceHint));
      
      // Construir resposta estruturada
      const structuredResponse: Message = {
        role: 'assistant',
        content: buildNaturalResponse(data, intelligenceData?.name || 'SYNTHEIA'),
        intelligence: data.nucleo_ativado || intelligenceHint,
        structured: {
          chave_simbolica: data.chave_simbolica,
          intencao_terapeutica: data.intencao_terapeutica,
          estrutura_pratica: data.estrutura_pratica,
          suporte_linguagem: data.suporte_linguagem,
          fechamento_integracao: data.fechamento_integracao,
        }
      };
      
      setMessages(prev => [...prev, structuredResponse]);
      setActiveIntelligence(data.nucleo_ativado || intelligenceHint);
      setGuidedTema(''); // Limpar tema após envio
      
    } catch (err) {
      console.error('Erro SYNTHEIA:', err);
      toast({
        title: 'Erro ao processar',
        description: err instanceof Error ? err.message : 'Tente novamente',
        variant: 'destructive'
      });
      setActiveIntelligence(null);
    } finally {
      setIsLoading(false);
    }
  };

  const buildNaturalResponse = (data: any, intelligenceName: string): string => {
    let response = '';
    
    if (data.chave_simbolica) {
      response += `**✨ Chave Simbólica**\n${data.chave_simbolica}\n\n`;
    }
    if (data.intencao_terapeutica) {
      response += `**🎯 Intenção**\n${data.intencao_terapeutica}\n\n`;
    }
    if (data.estrutura_pratica) {
      response += `**📋 Estrutura**\n${data.estrutura_pratica}\n\n`;
    }
    if (data.suporte_linguagem) {
      response += `**💬 Linguagem**\n${data.suporte_linguagem}\n\n`;
    }
    if (data.fechamento_integracao) {
      response += `**🌙 Fechamento**\n${data.fechamento_integracao}`;
    }
    
    return response || 'Não foi possível gerar uma resposta estruturada.';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setActiveIntelligence(null);
    setInput('');
    setGuidedTema('');
  };

  const handleExport = () => {
    const lastAssistant = messages.filter(m => m.role === 'assistant').pop();
    if (!lastAssistant) return;
    
    const content = `# SYNTHEIA - Saída Estruturada

${lastAssistant.content}

---
*Gerado por SYNTHEIA - Casa Orácula*
`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syntheia-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exportado!', description: 'Arquivo .md baixado.' });
  };

  const getIntelligenceBadge = (id: string) => {
    const intel = INTELLIGENCES.find(i => i.id === id);
    if (!intel) return null;
    return (
      <Badge className={cn('gap-1 text-xs', intel.bgColor, intel.textColor, 'border', intel.borderColor)}>
        <span>{intel.icon}</span>
        {intel.name}
      </Badge>
    );
  };

  // Get active intelligence for guided mode preview
  const guidedIntelligence = INTELLIGENCES.find(i => i.id === getGuidedIntelligence());

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-background/95">
        <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/ferramentas" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              Ferramentas
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">SYNTHEIA</span>
          </nav>
          
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gold/30 shadow-xl shadow-gold/10">
                <img 
                  src={syntheiaHero} 
                  alt="SYNTHEIA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-background border border-gold/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-gold mb-3">SYNTHEIA</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              A inteligência que transforma intenção em estrutura.
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto">
              Você fala. Ela organiza. Você conduz.
            </p>
          </div>

          {/* Flow Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
              <Lightbulb className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">CLAREZA</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">ESTRUTURA</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">APLICAÇÃO</span>
            </div>
          </div>

          {/* Três Inteligências */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {INTELLIGENCES.map((intel) => {
              const Icon = intel.iconComponent;
              const isActive = activeIntelligence === intel.id || (mode === 'guiado' && getGuidedIntelligence() === intel.id);
              return (
                <Card 
                  key={intel.id}
                  className={cn(
                    'glass transition-all duration-300 cursor-default',
                    isActive && `ring-2 ring-offset-2 ring-offset-background ${intel.borderColor.replace('border-', 'ring-')}`
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br', intel.color)}>
                        <span className="text-xl">{intel.icon}</span>
                      </div>
                      <div>
                        <CardTitle className={cn('text-base', intel.textColor)}>{intel.name}</CardTitle>
                        <p className="text-xs text-muted-foreground italic">{intel.question}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">{intel.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {intel.delivers.slice(0, 2).map((item, i) => (
                        <Badge key={i} variant="outline" className="text-xs opacity-70">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Chat Interface */}
          <Card className="glass border-gold/10">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <div>
                    <CardTitle className="text-lg">Converse com SYNTHEIA</CardTitle>
                    <CardDescription>
                      {mode === 'livre' 
                        ? 'Descreva sua necessidade. Ela decide qual inteligência ativar.'
                        : 'Preencha o formulário para uma resposta mais precisa.'}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Mode Toggle */}
                  <div className="flex items-center rounded-lg bg-secondary/50 p-1">
                    <button
                      onClick={() => setMode('livre')}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                        mode === 'livre' 
                          ? 'bg-gold text-background' 
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Livre
                    </button>
                    <button
                      onClick={() => setMode('guiado')}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                        mode === 'guiado' 
                          ? 'bg-gold text-background' 
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      Guiado
                    </button>
                  </div>
                  
                  {messages.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                        <Download className="w-3 h-3" />
                        <span className="hidden sm:inline">Exportar</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                        <RotateCcw className="w-3 h-3" />
                        <span className="hidden sm:inline">Limpar</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages Area */}
              <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-lg font-medium mb-2">O que você precisa organizar?</p>
                    <p className="text-sm max-w-md">
                      Terapeutas têm muito conhecimento. SYNTHEIA transforma esse saber em ação estruturada.
                    </p>
                    {mode === 'livre' && (
                      <div className="flex flex-wrap justify-center gap-2 mt-6">
                        <Badge variant="outline" className="text-xs cursor-pointer hover:bg-secondary/80" onClick={() => setInput('Preciso estruturar uma sessão sobre limites')}>
                          "Estruturar sessão sobre limites"
                        </Badge>
                        <Badge variant="outline" className="text-xs cursor-pointer hover:bg-secondary/80" onClick={() => setInput('Quero criar um produto de entrada sobre autoconhecimento')}>
                          "Criar produto sobre autoconhecimento"
                        </Badge>
                        <Badge variant="outline" className="text-xs cursor-pointer hover:bg-secondary/80" onClick={() => setInput('Preciso de uma metáfora para trabalhar abandono')}>
                          "Metáfora para trabalhar abandono"
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[85%] rounded-xl px-4 py-3',
                          msg.role === 'user' 
                            ? 'bg-gold/20 text-foreground' 
                            : 'bg-secondary/80 text-foreground'
                        )}>
                          {msg.role === 'assistant' && msg.intelligence && (
                            <div className="mb-2">
                              {getIntelligenceBadge(msg.intelligence)}
                            </div>
                          )}
                          <div className="text-sm whitespace-pre-wrap prose prose-sm prose-invert max-w-none">
                            {msg.content.split('\n').map((line, li) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return <p key={li} className="font-semibold text-gold mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
                              }
                              if (line.startsWith('• **')) {
                                return <p key={li} className="mb-0.5 text-sm">{line}</p>;
                              }
                              return <p key={li} className="mb-1">{line}</p>;
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-secondary/80 rounded-xl px-4 py-3 flex items-center gap-2">
                          {activeIntelligence && getIntelligenceBadge(activeIntelligence)}
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Processando...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-border/50 p-4">
                {mode === 'livre' ? (
                  /* Modo Livre - Textarea simples */
                  <div className="flex gap-2">
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Descreva o que você precisa estruturar, criar ou nomear..."
                      className="min-h-[60px] max-h-[120px] resize-none bg-secondary/30"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSend} 
                      disabled={!input.trim() || isLoading}
                      className="self-end bg-gold hover:bg-gold/90 text-background"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                ) : (
                  /* Modo Guiado - Formulário */
                  <div className="space-y-4">
                    {/* Intelligence Preview */}
                    {guidedIntelligence && (
                      <div className={cn(
                        'flex items-center gap-2 p-2 rounded-lg border',
                        guidedIntelligence.bgColor,
                        guidedIntelligence.borderColor
                      )}>
                        <span className="text-lg">{guidedIntelligence.icon}</span>
                        <span className={cn('text-sm font-medium', guidedIntelligence.textColor)}>
                          {guidedIntelligence.name}
                        </span>
                        <span className="text-xs text-muted-foreground">será ativada</span>
                      </div>
                    )}
                    
                    {/* Form Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Tipo</Label>
                        <Select value={guidedTipo} onValueChange={setGuidedTipo} disabled={isLoading}>
                          <SelectTrigger className="bg-secondary/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIPO_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Público</Label>
                        <Select value={guidedPublico} onValueChange={setGuidedPublico} disabled={isLoading}>
                          <SelectTrigger className="bg-secondary/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PUBLICO_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Momento</Label>
                        <Select value={guidedMomento} onValueChange={setGuidedMomento} disabled={isLoading}>
                          <SelectTrigger className="bg-secondary/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MOMENTO_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Tempo</Label>
                        <Select value={guidedTempo} onValueChange={setGuidedTempo} disabled={isLoading}>
                          <SelectTrigger className="bg-secondary/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEMPO_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Tema + Submit */}
                    <div className="flex gap-2">
                      <Textarea
                        value={guidedTema}
                        onChange={(e) => setGuidedTema(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Descreva o tema central da sua necessidade..."
                        className="min-h-[60px] max-h-[100px] resize-none bg-secondary/30"
                        disabled={isLoading}
                      />
                      <Button 
                        onClick={handleSend} 
                        disabled={!guidedTema.trim() || isLoading}
                        className="self-end bg-gold hover:bg-gold/90 text-background gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span className="hidden sm:inline">Gerar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ethical Boundaries */}
          <Card className="mt-6 glass border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-200">O que SYNTHEIA NÃO faz</p>
                  <p className="text-xs text-muted-foreground">
                    Não diagnostica • Não decide conduta clínica • Não atende cliente final • Não substitui formação
                  </p>
                  <p className="text-xs text-amber-200/70 mt-2">
                    SYNTHEIA organiza o campo da terapeuta. Ela apoia a profissional, não rouba o lugar dela.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
