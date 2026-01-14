import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Loader2, 
  Sparkles, 
  Download, 
  RotateCcw, 
  Users, 
  Flame, 
  Package, 
  GraduationCap,
  Ear,
  Compass,
  Layers,
  Shield,
  Send,
  MessageCircle,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Tipos de criação
type TipoCriacao = 'sessao' | 'grupo' | 'ritual' | 'produto' | 'aula';

// Etapas do fluxo de preparação
type PrepStep = 'entry' | 'context' | 'output';

// Zona ativa do Templo
type TempleZone = 'escuta' | 'preparo' | 'integracao';

// Opções de seleção para o Preparo
const TIPO_OPTIONS: { value: TipoCriacao; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'sessao', label: 'Sessão Individual', description: 'Atendimento 1:1 com cliente', icon: <Users className="w-6 h-6" /> },
  { value: 'grupo', label: 'Experiência em Grupo', description: 'Vivência coletiva facilitada', icon: <Users className="w-6 h-6" /> },
  { value: 'ritual', label: 'Ritual', description: 'Cerimônia ou prática simbólica', icon: <Flame className="w-6 h-6" /> },
  { value: 'produto', label: 'Produto / Programa', description: 'Curso, jornada ou oferta', icon: <Package className="w-6 h-6" /> },
  { value: 'aula', label: 'Aula / Conteúdo Terapêutico', description: 'Material didático ou formativo', icon: <GraduationCap className="w-6 h-6" /> },
];

const PUBLICOS = [
  { value: 'individual', label: 'Mulher individual' },
  { value: 'grupo_mulheres', label: 'Grupo de mulheres' },
  { value: 'profissionais', label: 'Público profissional' },
];

const MOMENTOS = [
  { value: 'inicio', label: 'Início' },
  { value: 'crise', label: 'Crise / Transição' },
  { value: 'integracao', label: 'Integração' },
  { value: 'fechamento', label: 'Fechamento' },
];

const TEMPOS = [
  { value: '30min', label: '30 minutos' },
  { value: '50min', label: '50 minutos' },
  { value: '90min', label: '90 minutos' },
  { value: 'jornada', label: 'Jornada contínua' },
];

// Mapeamento de núcleos para labels
const NUCLEO_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  ferramenteira: { label: 'Ferramenteira', icon: '🜂', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  archetypos: { label: 'Archétypos', icon: '🧱', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  aracne_arcano: { label: 'Aracne & Arcano', icon: '🎭', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
};

// Zonas do Templo
const TEMPLE_ZONES = [
  { 
    id: 'escuta' as TempleZone, 
    label: 'Espaço de Escuta', 
    icon: Ear, 
    description: 'Você não precisa de clareza para chegar aqui.',
    longDescription: 'Um espaço de acolhimento para quando os pensamentos ainda não têm forma. Aqui, você pode depositar o que sente antes de organizar.'
  },
  { 
    id: 'preparo' as TempleZone, 
    label: 'Espaço de Preparo', 
    icon: Compass, 
    description: 'Forme perguntas melhores antes de entrar.',
    longDescription: 'Antes de sessões, ferramentas ou leituras, este espaço ajuda a refinar sua intenção e estruturar o que você quer criar.'
  },
  { 
    id: 'integracao' as TempleZone, 
    label: 'Espaço de Integração', 
    icon: Layers, 
    description: 'Conecte padrões, espelhe narrativas.',
    longDescription: 'Após experiências, reflexões ou leituras, este espaço ajuda a costurar significados e ver o mapa maior.'
  },
];

export default function Syntheia() {
  const [activeZone, setActiveZone] = useState<TempleZone>('escuta');
  
  // Estado do Espaço de Escuta
  const [escutaInput, setEscutaInput] = useState('');
  const [escutaMensagens, setEscutaMensagens] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [escutaSending, setEscutaSending] = useState(false);
  
  // Estado do Espaço de Preparo
  const [prepStep, setPrepStep] = useState<PrepStep>('entry');
  const [tipoCriacao, setTipoCriacao] = useState<TipoCriacao | null>(null);
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [momentoJornada, setMomentoJornada] = useState('');
  const [tempoDisponivel, setTempoDisponivel] = useState('');
  const [temaCentral, setTemaCentral] = useState('');
  const [chaveSimbólica, setChaveSimbólica] = useState('');
  const [intencaoTerapeutica, setIntencaoTerapeutica] = useState('');
  const [estruturaPratica, setEstruturaPratica] = useState('');
  const [suporteLinguagem, setSuporteLinguagem] = useState('');
  const [fechamentoIntegracao, setFechamentoIntegracao] = useState('');
  const [nucleoAtivado, setNucleoAtivado] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado do Espaço de Integração
  const [integracaoInput, setIntegracaoInput] = useState('');
  const [integracaoMensagens, setIntegracaoMensagens] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [integracaoSending, setIntegracaoSending] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // ========== HANDLERS DO ESPAÇO DE ESCUTA ==========
  const handleEscutaSend = async () => {
    if (!escutaInput.trim() || escutaSending) return;
    
    const userMessage = escutaInput.trim();
    setEscutaInput('');
    setEscutaSending(true);
    
    setEscutaMensagens(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Mock response para V1 - depois conectar com Edge Function
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const responses = [
      "Estou aqui. Não há pressa para encontrar palavras certas.",
      "Isso que você traz carrega peso. Podemos deixar repousar aqui por um momento.",
      "Compreendo. Às vezes o sentir vem antes do nomear.",
      "O que você acabou de dizer... há algo aí que pede mais espaço?",
      "Obrigada por compartilhar isso. O que mais está presente agora?",
    ];
    
    const assistantResponse = responses[Math.floor(Math.random() * responses.length)];
    setEscutaMensagens(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    setEscutaSending(false);
  };

  // ========== HANDLERS DO ESPAÇO DE PREPARO ==========
  const handleSelectTipo = (tipo: TipoCriacao) => {
    setTipoCriacao(tipo);
    setPrepStep('context');
  };

  const canGenerate = publicoAlvo && momentoJornada && tempoDisponivel && temaCentral.trim();

  const handleGenerate = async () => {
    if (!canGenerate || !tipoCriacao) return;
    
    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('syntheia-generate', {
        body: {
          tipo: tipoCriacao,
          publico: publicoAlvo,
          momento: momentoJornada,
          tempo: tempoDisponivel,
          tema: temaCentral
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro ao chamar a função');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setChaveSimbólica(data.chave_simbolica || '');
      setIntencaoTerapeutica(data.intencao_terapeutica || '');
      setEstruturaPratica(data.estrutura_pratica || '');
      setSuporteLinguagem(data.suporte_linguagem || '');
      setFechamentoIntegracao(data.fechamento_integracao || '');
      setNucleoAtivado(data.nucleo_ativado || null);
      setPrepStep('output');
    } catch (err) {
      console.error('Erro na geração:', err);
      toast({
        title: 'Erro ao gerar',
        description: err instanceof Error ? err.message : 'Erro desconhecido ao gerar conteúdo',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !tipoCriacao) return;
    setSaving(true);

    const { error } = await supabase.from('syntheia_creations').insert({
      user_id: user.id,
      tipo: tipoCriacao,
      titulo: `${TIPO_OPTIONS.find(t => t.value === tipoCriacao)?.label} - ${temaCentral}`,
      tema_principal: temaCentral,
      publico_alvo: publicoAlvo,
      momento_jornada: momentoJornada,
      tempo_disponivel: tempoDisponivel,
      chave_simbolica: chaveSimbólica,
      intencao_terapeutica: intencaoTerapeutica,
      estrutura_pratica: estruturaPratica,
      suporte_linguagem: suporteLinguagem,
      fechamento_integracao: fechamentoIntegracao,
    });

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Salvo na Biblioteca!', description: 'Sua criação foi registrada.' });
    }
    setSaving(false);
  };

  const handleExport = () => {
    const tipoLabel = TIPO_OPTIONS.find(t => t.value === tipoCriacao)?.label || tipoCriacao;
    const content = `# SYNTHEIA - ${tipoLabel}
## ${temaCentral}

**Público:** ${PUBLICOS.find(p => p.value === publicoAlvo)?.label}
**Momento:** ${MOMENTOS.find(m => m.value === momentoJornada)?.label}
**Tempo:** ${TEMPOS.find(t => t.value === tempoDisponivel)?.label}

---

## ✨ Chave Simbólica
${chaveSimbólica}

## 🎯 Intenção Terapêutica
${intencaoTerapeutica}

## 📋 Estrutura Prática
${estruturaPratica}

## 💬 Suporte de Linguagem
${suporteLinguagem}

## 🌙 Fechamento & Integração
${fechamentoIntegracao}

---
*Gerado por SYNTHEIA - Casa Orácula*
`.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syntheia-${tipoCriacao}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Exportado!', description: 'Arquivo .md baixado com sucesso.' });
  };

  const handlePrepReset = () => {
    setPrepStep('entry');
    setTipoCriacao(null);
    setPublicoAlvo('');
    setMomentoJornada('');
    setTempoDisponivel('');
    setTemaCentral('');
    setChaveSimbólica('');
    setIntencaoTerapeutica('');
    setEstruturaPratica('');
    setSuporteLinguagem('');
    setFechamentoIntegracao('');
    setNucleoAtivado(null);
  };

  // ========== HANDLERS DO ESPAÇO DE INTEGRAÇÃO ==========
  const handleIntegracaoSend = async () => {
    if (!integracaoInput.trim() || integracaoSending) return;
    
    const userMessage = integracaoInput.trim();
    setIntegracaoInput('');
    setIntegracaoSending(true);
    
    setIntegracaoMensagens(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Mock response para V1
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const responses = [
      "Vejo um padrão aqui: essa experiência parece ecoar algo que você já trabalhou antes. O que conecta esses pontos?",
      "Se traduzíssemos isso para a linguagem dos arquétipos, que figura estaria presente?",
      "Há uma linha entre o que você viveu e o que deseja criar. Como você descreveria essa passagem?",
      "O que você acabou de compartilhar tem camadas. Qual delas pede mais atenção agora?",
      "Isso que você traz pode ser um fio condutor. Para onde ele leva quando você segue?",
    ];
    
    const assistantResponse = responses[Math.floor(Math.random() * responses.length)];
    setIntegracaoMensagens(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    setIntegracaoSending(false);
  };

  // ========== COMPONENTE DO HEADER DO TEMPLO ==========
  const TempleHeader = () => (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-purple-500/20 mb-4">
        <Sparkles className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-3xl md:text-4xl font-display text-gold mb-2">SYNTHEIA</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Inteligência simbólica multidimensional para clareza profissional
      </p>
      
      {/* Integração Multidimensional - Gold Core */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Badge variant="outline" className="text-xs bg-gold/5 border-gold/20 text-gold">Big Five</Badge>
        <Badge variant="outline" className="text-xs bg-purple-500/5 border-purple-500/20 text-purple-400">Eneagrama</Badge>
        <Badge variant="outline" className="text-xs bg-emerald-500/5 border-emerald-500/20 text-emerald-400">Chakras</Badge>
        <Badge variant="outline" className="text-xs bg-blue-500/5 border-blue-500/20 text-blue-400">Hawkins</Badge>
        <Badge variant="outline" className="text-xs bg-rose-500/5 border-rose-500/20 text-rose-400">Narrativas</Badge>
      </div>
    </div>
  );

  // ========== COMPONENTE DE LIMITES ÉTICOS ==========
  const EthicalBoundaries = () => (
    <Card className="glass border-amber-500/20 bg-amber-500/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-amber-200">Limites Éticos</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Syntheia <strong>não diagnostica</strong> e não substitui avaliação clínica</li>
              <li>• Syntheia <strong>não interpreta clientes</strong> — ela apoia <em>você</em>, profissional</li>
              <li>• Syntheia <strong>não conduz sessões</strong> — ela prepara e integra</li>
              <li>• Todo conteúdo gerado é <strong>sugestão de condução</strong>, não prescrição</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ========== RENDER ==========
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
        <TempleHeader />
        
        {/* Navegação entre zonas */}
        <Tabs value={activeZone} onValueChange={(v) => setActiveZone(v as TempleZone)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {TEMPLE_ZONES.map(zone => (
              <TabsTrigger 
                key={zone.id} 
                value={zone.id}
                className="flex items-center gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
              >
                <zone.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{zone.label.split(' ')[2] || zone.label.split(' ')[1]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ========== ESPAÇO DE ESCUTA ========== */}
          <TabsContent value="escuta" className="space-y-4">
            <Card className="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Ear className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Espaço de Escuta</CardTitle>
                    <CardDescription>{TEMPLE_ZONES[0].longDescription}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[300px] rounded-lg border border-border/50 bg-background/50 p-4">
                  {escutaMensagens.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                      <MessageCircle className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm italic">"Você não precisa de clareza para chegar aqui."</p>
                      <p className="text-xs mt-2">Comece depositando o que sente.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {escutaMensagens.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-lg px-4 py-2 ${
                            msg.role === 'user' 
                              ? 'bg-gold/20 text-foreground' 
                              : 'bg-secondary/80 text-foreground'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {escutaSending && (
                        <div className="flex justify-start">
                          <div className="bg-secondary/80 rounded-lg px-4 py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
                
                <div className="flex gap-2">
                  <Textarea
                    value={escutaInput}
                    onChange={(e) => setEscutaInput(e.target.value)}
                    placeholder="O que está presente agora?"
                    className="min-h-[44px] max-h-24 resize-none"
                    disabled={escutaSending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEscutaSend();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleEscutaSend} 
                    disabled={escutaSending || !escutaInput.trim()}
                    variant="gold"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <EthicalBoundaries />
          </TabsContent>

          {/* ========== ESPAÇO DE PREPARO ========== */}
          <TabsContent value="preparo" className="space-y-4">
            <Card className="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <Compass className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Espaço de Preparo</CardTitle>
                      <CardDescription>{TEMPLE_ZONES[1].longDescription}</CardDescription>
                    </div>
                  </div>
                  {prepStep !== 'entry' && (
                    <Button variant="ghost" size="sm" onClick={handlePrepReset}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Recomeçar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className={`w-3 h-3 rounded-full ${prepStep === 'entry' ? 'bg-gold' : 'bg-gold/30'}`} />
                  <div className={`w-12 h-0.5 ${prepStep !== 'entry' ? 'bg-gold' : 'bg-muted'}`} />
                  <div className={`w-3 h-3 rounded-full ${prepStep === 'context' ? 'bg-gold' : prepStep === 'output' ? 'bg-gold/30' : 'bg-muted'}`} />
                  <div className={`w-12 h-0.5 ${prepStep === 'output' ? 'bg-gold' : 'bg-muted'}`} />
                  <div className={`w-3 h-3 rounded-full ${prepStep === 'output' ? 'bg-gold' : 'bg-muted'}`} />
                </div>

                {/* STEP 1: Entry */}
                {prepStep === 'entry' && (
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-semibold text-foreground mb-1">O que você está criando?</h2>
                      <p className="text-sm text-muted-foreground">Escolha o tipo de experiência que deseja estruturar</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {TIPO_OPTIONS.map((tipo) => (
                        <Card
                          key={tipo.value}
                          className="cursor-pointer transition-all hover:border-gold hover:shadow-md hover:bg-gold/5"
                          onClick={() => handleSelectTipo(tipo.value)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                              {tipo.icon}
                            </div>
                            <h3 className="font-medium text-foreground text-sm mb-1">{tipo.label}</h3>
                            <p className="text-xs text-muted-foreground">{tipo.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Context Form */}
                {prepStep === 'context' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setPrepStep('entry')}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Voltar
                      </Button>
                      <Badge variant="secondary">
                        {TIPO_OPTIONS.find(t => t.value === tipoCriacao)?.label}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="publico">Público-alvo *</Label>
                          <Select value={publicoAlvo} onValueChange={setPublicoAlvo}>
                            <SelectTrigger id="publico">
                              <SelectValue placeholder="Selecione o público" />
                            </SelectTrigger>
                            <SelectContent>
                              {PUBLICOS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="momento">Momento da jornada *</Label>
                          <Select value={momentoJornada} onValueChange={setMomentoJornada}>
                            <SelectTrigger id="momento">
                              <SelectValue placeholder="Selecione o momento" />
                            </SelectTrigger>
                            <SelectContent>
                              {MOMENTOS.map((m) => (
                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tempo">Tempo disponível *</Label>
                          <Select value={tempoDisponivel} onValueChange={setTempoDisponivel}>
                            <SelectTrigger id="tempo">
                              <SelectValue placeholder="Selecione o tempo" />
                            </SelectTrigger>
                            <SelectContent>
                              {TEMPOS.map((t) => (
                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tema">Tema central *</Label>
                        <Input
                          id="tema"
                          value={temaCentral}
                          onChange={(e) => setTemaCentral(e.target.value)}
                          placeholder="Ex: Luto e transição, Autoestima, Reconstrução de vínculos..."
                        />
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleGenerate}
                        disabled={!canGenerate || generating}
                        variant="gold"
                      >
                        {generating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Gerando estrutura...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Gerar Estrutura
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Output */}
                {prepStep === 'output' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setPrepStep('context')}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Ajustar
                      </Button>
                      <div className="flex gap-2 flex-wrap">
                        {nucleoAtivado && NUCLEO_LABELS[nucleoAtivado] && (
                          <Badge className={`${NUCLEO_LABELS[nucleoAtivado].color} border`}>
                            {NUCLEO_LABELS[nucleoAtivado].icon} {NUCLEO_LABELS[nucleoAtivado].label}
                          </Badge>
                        )}
                        <Badge variant="outline">{temaCentral}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>✨</span> Chave Simbólica
                        </Label>
                        <Textarea
                          value={chaveSimbólica}
                          onChange={(e) => setChaveSimbólica(e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>🎯</span> Intenção Terapêutica
                        </Label>
                        <Textarea
                          value={intencaoTerapeutica}
                          onChange={(e) => setIntencaoTerapeutica(e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>📋</span> Estrutura Prática
                        </Label>
                        <Textarea
                          value={estruturaPratica}
                          onChange={(e) => setEstruturaPratica(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>💬</span> Suporte de Linguagem
                        </Label>
                        <Textarea
                          value={suporteLinguagem}
                          onChange={(e) => setSuporteLinguagem(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span>🌙</span> Fechamento & Integração
                        </Label>
                        <Textarea
                          value={fechamentoIntegracao}
                          onChange={(e) => setFechamentoIntegracao(e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button onClick={handleSave} disabled={saving} variant="gold" className="flex-1">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                        Salvar
                      </Button>
                      <Button onClick={handleExport} variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <EthicalBoundaries />
          </TabsContent>

          {/* ========== ESPAÇO DE INTEGRAÇÃO ========== */}
          <TabsContent value="integracao" className="space-y-4">
            <Card className="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Espaço de Integração</CardTitle>
                    <CardDescription>{TEMPLE_ZONES[2].longDescription}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dicas de uso */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                  <Lightbulb className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Use este espaço após sessões, leituras ou experiências para conectar padrões e espelhar narrativas. 
                    Syntheia traduz entre sistemas: Big Five ↔ Arquétipos ↔ Chakras ↔ Narrativas.
                  </p>
                </div>
                
                <ScrollArea className="h-[300px] rounded-lg border border-border/50 bg-background/50 p-4">
                  {integracaoMensagens.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                      <Layers className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm italic">"O que você viveu quer se conectar a quê?"</p>
                      <p className="text-xs mt-2">Compartilhe uma experiência, leitura ou insight.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {integracaoMensagens.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-lg px-4 py-2 ${
                            msg.role === 'user' 
                              ? 'bg-gold/20 text-foreground' 
                              : 'bg-secondary/80 text-foreground'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {integracaoSending && (
                        <div className="flex justify-start">
                          <div className="bg-secondary/80 rounded-lg px-4 py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
                
                <div className="flex gap-2">
                  <Textarea
                    value={integracaoInput}
                    onChange={(e) => setIntegracaoInput(e.target.value)}
                    placeholder="O que você quer integrar ou conectar?"
                    className="min-h-[44px] max-h-24 resize-none"
                    disabled={integracaoSending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleIntegracaoSend();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleIntegracaoSend} 
                    disabled={integracaoSending || !integracaoInput.trim()}
                    variant="gold"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <EthicalBoundaries />
          </TabsContent>
        </Tabs>
        
        <EthicalNotice toolName="Syntheia" className="mt-6" />
      </div>
    </AppLayout>
  );
}
