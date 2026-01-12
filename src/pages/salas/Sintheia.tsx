import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Save, Loader2, Sparkles, Copy, Download, RotateCcw, BookOpen, Users, Flame, Package, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
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

// Etapas do fluxo
type Step = 'entry' | 'context' | 'output';

// Opções de seleção
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

export default function Sintheia() {
  const [step, setStep] = useState<Step>('entry');
  const [tipoCriacao, setTipoCriacao] = useState<TipoCriacao | null>(null);
  
  // Contexto (Step 2)
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [momentoJornada, setMomentoJornada] = useState('');
  const [tempoDisponivel, setTempoDisponivel] = useState('');
  const [temaCentral, setTemaCentral] = useState('');
  
  // Saída estruturada (Step 3)
  const [chaveSimbólica, setChaveSimbólica] = useState('');
  const [intencaoTerapeutica, setIntencaoTerapeutica] = useState('');
  const [estruturaPratica, setEstruturaPratica] = useState('');
  const [suporteLinguagem, setSuporteLinguagem] = useState('');
  const [fechamentoIntegracao, setFechamentoIntegracao] = useState('');
  const [nucleoAtivado, setNucleoAtivado] = useState<string | null>(null);
  
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handlers
  const handleSelectTipo = (tipo: TipoCriacao) => {
    setTipoCriacao(tipo);
    setStep('context');
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
      setStep('output');
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

  const handleDuplicate = () => {
    // Reset output fields but keep context
    setChaveSimbólica('');
    setIntencaoTerapeutica('');
    setEstruturaPratica('');
    setSuporteLinguagem('');
    setFechamentoIntegracao('');
    setStep('context');
    toast({ title: 'Pronto para editar', description: 'Ajuste o contexto e gere uma nova versão.' });
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
*Gerado por SYNTHEIA - Casa Oraculá*
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

  const handleReset = () => {
    setStep('entry');
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

  const handleContinuation = () => {
    // Mantém o contexto, limpa output para criar continuação
    setChaveSimbólica('');
    setIntencaoTerapeutica('');
    setEstruturaPratica('');
    setSuporteLinguagem('');
    setFechamentoIntegracao('');
    setTemaCentral(temaCentral + ' (continuação)');
    setStep('context');
    toast({ title: 'Criar continuação', description: 'Ajuste o tema para a próxima etapa.' });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        <div className="mb-6">
          <Link to="/ferramentas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Voltar às Ferramentas
          </Link>
        </div>

        <SectionHeader
          title="SYNTHEIA"
          subtitle="Orquestradora de Criações Terapêuticas"
          icon={<Sparkles className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full ${step === 'entry' ? 'bg-primary' : 'bg-primary/30'}`} />
          <div className={`w-12 h-0.5 ${step !== 'entry' ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 'context' ? 'bg-primary' : step === 'output' ? 'bg-primary/30' : 'bg-muted'}`} />
          <div className={`w-12 h-0.5 ${step === 'output' ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 'output' ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        {/* STEP 1: Entry Screen */}
        {step === 'entry' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">O que você está criando agora?</h2>
              <p className="text-muted-foreground">Escolha o tipo de experiência que deseja estruturar</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TIPO_OPTIONS.map((tipo) => (
                <Card
                  key={tipo.value}
                  className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                  onClick={() => handleSelectTipo(tipo.value)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {tipo.icon}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{tipo.label}</h3>
                    <p className="text-sm text-muted-foreground">{tipo.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <EthicalNotice toolName="SYNTHEIA" className="mt-8" />
          </div>
        )}

        {/* STEP 2: Context Form */}
        {step === 'context' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={() => setStep('entry')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Badge variant="secondary">
                {TIPO_OPTIONS.find(t => t.value === tipoCriacao)?.label}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contexto da Criação</CardTitle>
                <CardDescription>Preencha os campos obrigatórios para gerar a estrutura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3: Structured Output */}
        {step === 'output' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={() => setStep('context')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ajustar Contexto
              </Button>
              <div className="flex gap-2 flex-wrap">
                {nucleoAtivado && NUCLEO_LABELS[nucleoAtivado] && (
                  <Badge className={`${NUCLEO_LABELS[nucleoAtivado].color} border`}>
                    {NUCLEO_LABELS[nucleoAtivado].icon} {NUCLEO_LABELS[nucleoAtivado].label}
                  </Badge>
                )}
                <Badge variant="secondary">
                  {TIPO_OPTIONS.find(t => t.value === tipoCriacao)?.label}
                </Badge>
                <Badge variant="outline">{temaCentral}</Badge>
              </div>
            </div>

            {/* Structured Output Cards */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>✨</span> Chave Simbólica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={chaveSimbólica}
                    onChange={(e) => setChaveSimbólica(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>🎯</span> Intenção Terapêutica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={intencaoTerapeutica}
                    onChange={(e) => setIntencaoTerapeutica(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>📋</span> Estrutura Prática
                  </CardTitle>
                  <CardDescription>Etapas com cronometragem</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={estruturaPratica}
                    onChange={(e) => setEstruturaPratica(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>💬</span> Suporte de Linguagem
                  </CardTitle>
                  <CardDescription>Perguntas e frases de condução</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={suporteLinguagem}
                    onChange={(e) => setSuporteLinguagem(e.target.value)}
                    className="min-h-[150px] font-mono text-sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>🌙</span> Fechamento & Integração
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={fechamentoIntegracao}
                    onChange={(e) => setFechamentoIntegracao(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookOpen className="w-4 h-4 mr-2" />}
                    Salvar na Biblioteca
                  </Button>
                  <Button variant="outline" onClick={handleDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar & Editar
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" onClick={handleContinuation}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Criar Continuação
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Nova Criação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
