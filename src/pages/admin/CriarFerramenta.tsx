import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wrench, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Sparkles,
  Target,
  Layers,
  Users,
  Link as LinkIcon,
  Flag,
  Save
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Types
interface Sala {
  id: string;
  nome_exibicao: string;
}

interface FerramentaDraft {
  // 1. Identity
  ferramenta_nome: string;
  ferramenta_descricao: string;
  categoria_badge: 'padrao' | 'autoral' | 'metodo_oracula';
  
  // 2. Clinical Function
  texto_quando_usar: string;
  texto_o_que_sustenta: string;
  texto_como_atravessar: string;
  
  // 3. Interactive Block
  bloco_interativo_tipo: string[];
  
  // 4. Usage Mode
  modo_uso: string[];
  
  // 5. Linking
  sala_id: string | null;
  portal_minimo: string;
  
  // 6. Closure
  tipo_fechamento: string;
}

const STEPS = [
  { id: 'identity', label: 'Identidade', icon: Sparkles, description: 'Nome e classificação' },
  { id: 'function', label: 'Função Clínica', icon: Target, description: 'Quando e para quê' },
  { id: 'interaction', label: 'Bloco Interativo', icon: Layers, description: 'Tipo de interação' },
  { id: 'usage', label: 'Modo de Uso', icon: Users, description: 'Contextos de aplicação' },
  { id: 'linking', label: 'Vinculação', icon: LinkIcon, description: 'Sala e acesso' },
  { id: 'closure', label: 'Fechamento', icon: Flag, description: 'Registro e integração' },
];

const CATEGORIA_BADGE_OPTIONS = [
  { value: 'padrao', label: 'Padrão', description: 'Ferramenta baseada em métodos psicológicos tradicionais' },
  { value: 'autoral', label: 'Autoral', description: 'Ferramenta criada especificamente para a Casa Orácula' },
  { value: 'metodo_oracula', label: 'Método Orácula', description: 'Ferramenta central do Método Orácula' },
];

const BLOCO_INTERATIVO_OPTIONS = [
  { value: 'escrita', label: 'Campo de Escrita', description: 'Área de texto para reflexão livre' },
  { value: 'pergunta_guiada', label: 'Pergunta Guiada', description: 'Perguntas estruturadas para reflexão' },
  { value: 'checklist', label: 'Checklist Simbólico', description: 'Lista de itens para marcar/verificar' },
  { value: 'diario', label: 'Diário de Bordo', description: 'Registro contínuo de experiências' },
  { value: 'escolha_narrativa', label: 'Escolha Narrativa', description: 'Opções com caminhos simbólicos' },
];

const MODO_USO_OPTIONS = [
  { value: 'pessoal', label: 'Uso Pessoal', description: 'Para autoaplicação individual' },
  { value: 'sessao', label: 'Uso em Sessão', description: 'Durante atendimento terapêutico' },
  { value: 'grupo', label: 'Uso em Grupo', description: 'Em dinâmicas coletivas' },
  { value: 'entre_sessoes', label: 'Entre Sessões', description: 'Para prática entre encontros' },
];

const TIPO_FECHAMENTO_OPTIONS = [
  { value: 'registro', label: 'Registro', description: 'Ferramenta termina com salvamento de dados' },
  { value: 'integracao', label: 'Integração', description: 'Ferramenta oferece síntese final' },
  { value: 'pausa_simbolica', label: 'Pausa Simbólica', description: 'Ferramenta convida à contemplação' },
];

const PORTAL_OPTIONS = [
  { value: 'visitante', label: 'Visitante' },
  { value: 'mentorada', label: 'Mentorada' },
  { value: 'aluna_formacao', label: 'Aluna Formação' },
  { value: 'assinante', label: 'Assinante' },
  { value: 'oracula', label: 'Orácula' },
  { value: 'admin', label: 'Admin' },
];

const initialDraft: FerramentaDraft = {
  ferramenta_nome: '',
  ferramenta_descricao: '',
  categoria_badge: 'padrao',
  texto_quando_usar: '',
  texto_o_que_sustenta: '',
  texto_como_atravessar: '',
  bloco_interativo_tipo: [],
  modo_uso: [],
  sala_id: null,
  portal_minimo: 'visitante',
  tipo_fechamento: '',
};

export default function CriarFerramenta() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<FerramentaDraft>(initialDraft);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    const { data } = await supabase
      .from('salas')
      .select('id, nome_exibicao')
      .eq('ativa', true)
      .order('ordem');
    if (data) setSalas(data);
  };

  const updateDraft = (updates: Partial<FerramentaDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
    setValidationErrors([]);
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 0: // Identity
        if (!draft.ferramenta_nome.trim()) errors.push('Nome da ferramenta é obrigatório');
        if (!draft.ferramenta_descricao.trim()) errors.push('Subtítulo simbólico é obrigatório');
        break;
      case 1: // Clinical Function
        if (!draft.texto_quando_usar.trim()) errors.push('Campo "Quando esta ferramenta é chamada?" é obrigatório');
        if (!draft.texto_o_que_sustenta.trim()) errors.push('Campo "O que esta ferramenta sustenta?" é obrigatório');
        break;
      case 2: // Interactive Block
        if (draft.bloco_interativo_tipo.length === 0) errors.push('Selecione ao menos um tipo de bloco interativo');
        break;
      case 3: // Usage Mode
        if (draft.modo_uso.length === 0) errors.push('Selecione ao menos um modo de uso');
        break;
      case 4: // Linking
        if (!draft.sala_id) errors.push('Selecione uma Sala');
        if (!draft.portal_minimo) errors.push('Selecione o nível de acesso');
        break;
      case 5: // Closure
        if (!draft.tipo_fechamento) errors.push('Selecione o tipo de fechamento');
        break;
    }
    
    return errors;
  };

  const canProceed = () => {
    const errors = validateStep(currentStep);
    return errors.length === 0;
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setValidationErrors([]);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = async (publish: boolean = false) => {
    // Final validation
    let allErrors: string[] = [];
    for (let i = 0; i <= STEPS.length - 1; i++) {
      allErrors = [...allErrors, ...validateStep(i)];
    }
    
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      toast({
        title: 'Campos obrigatórios pendentes',
        description: 'Revise todos os passos antes de salvar.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    const slug = generateSlug(draft.ferramenta_nome);
    const chave = `ferramenta_${Date.now()}`;
    
    const insertData = {
      ferramenta_nome: draft.ferramenta_nome,
      ferramenta_descricao: draft.ferramenta_descricao,
      ferramenta_chave: chave,
      slug: slug,
      rota: `/ferramentas/${slug}`,
      categoria_badge: draft.categoria_badge,
      texto_quando_usar: draft.texto_quando_usar,
      texto_o_que_sustenta: draft.texto_o_que_sustenta,
      texto_como_atravessar: draft.texto_como_atravessar,
      modo_uso: draft.modo_uso,
      tipo_fechamento: draft.tipo_fechamento,
      bloco_interativo_requerido: true,
      sala_id: draft.sala_id,
      portal_minimo: draft.portal_minimo as 'visitante' | 'mentorada' | 'aluna_formacao' | 'assinante' | 'oracula' | 'admin',
      has_blocks: true,
      ativa: publish,
      status_criacao: publish ? 'publicado' : 'pronto',
      ordem: 999,
    };
    
    const { error } = await supabase.from('sala_ferramentas').insert(insertData);

    setLoading(false);

    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: publish ? 'Ferramenta publicada!' : 'Ferramenta salva como rascunho',
        description: publish 
          ? 'A ferramenta está disponível para as usuárias.'
          : 'Acesse o Admin > Ferramentas para editar ou publicar.',
      });
      navigate('/admin');
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SectionHeader
            title="Criar Nova Ferramenta"
            subtitle="Siga o fluxo padronizado para garantir qualidade e coerência"
            icon={<Wrench className="w-5 h-5" />}
          />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between overflow-x-auto pb-2">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={cn(
                    "flex flex-col items-center gap-1 min-w-[80px] transition-colors",
                    isActive && "text-gold",
                    isComplete && "text-emerald-400 cursor-pointer",
                    !isActive && !isComplete && "text-muted-foreground opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    isActive && "border-gold bg-gold/10",
                    isComplete && "border-emerald-400 bg-emerald-400/10",
                    !isActive && !isComplete && "border-muted-foreground/30"
                  )}>
                    {isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = STEPS[currentStep].icon;
                return <StepIcon className="w-5 h-5 text-gold" />;
              })()}
              {STEPS[currentStep].label}
            </CardTitle>
            <CardDescription>{STEPS[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Identity */}
            {currentStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Ferramenta *</Label>
                  <Input
                    id="nome"
                    value={draft.ferramenta_nome}
                    onChange={(e) => updateDraft({ ferramenta_nome: e.target.value })}
                    placeholder="Ex: Mapa dos Cinco Territórios"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitulo">Subtítulo Simbólico *</Label>
                  <Input
                    id="subtitulo"
                    value={draft.ferramenta_descricao}
                    onChange={(e) => updateDraft({ ferramenta_descricao: e.target.value })}
                    placeholder="Ex: Navegue pelos territórios da sua psique"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Classificação *</Label>
                  <div className="grid gap-3">
                    {CATEGORIA_BADGE_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => updateDraft({ categoria_badge: opt.value as FerramentaDraft['categoria_badge'] })}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors",
                          draft.categoria_badge === opt.value
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant={draft.categoria_badge === opt.value ? 'default' : 'outline'}>
                            {opt.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 1: Clinical Function */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="quando">Quando esta ferramenta é chamada? *</Label>
                  <Textarea
                    id="quando"
                    value={draft.texto_quando_usar}
                    onChange={(e) => updateDraft({ texto_quando_usar: e.target.value })}
                    placeholder="Descreva os momentos e contextos em que esta ferramenta é indicada..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sustenta">O que esta ferramenta sustenta (não resolve)? *</Label>
                  <Textarea
                    id="sustenta"
                    value={draft.texto_o_que_sustenta}
                    onChange={(e) => updateDraft({ texto_o_que_sustenta: e.target.value })}
                    placeholder="Descreva o que a ferramenta oferece como suporte, sem prometer soluções..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="atravessar">Como atravessar (orientação de uso)</Label>
                  <Textarea
                    id="atravessar"
                    value={draft.texto_como_atravessar}
                    onChange={(e) => updateDraft({ texto_como_atravessar: e.target.value })}
                    placeholder="Orientações práticas para usar esta ferramenta..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Step 2: Interactive Block */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selecione ao menos um tipo de bloco interativo. Ferramentas sem interação não podem ser publicadas.
                </p>
                
                <div className="grid gap-3">
                  {BLOCO_INTERATIVO_OPTIONS.map((opt) => {
                    const isSelected = draft.bloco_interativo_tipo.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          const newValue = isSelected
                            ? draft.bloco_interativo_tipo.filter(v => v !== opt.value)
                            : [...draft.bloco_interativo_tipo, opt.value];
                          updateDraft({ bloco_interativo_tipo: newValue });
                        }}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors flex items-start gap-3",
                          isSelected
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/50"
                        )}
                      >
                        <Checkbox checked={isSelected} />
                        <div>
                          <div className="font-medium">{opt.label}</div>
                          <p className="text-sm text-muted-foreground">{opt.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Usage Mode */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selecione os contextos em que esta ferramenta pode ser utilizada.
                </p>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {MODO_USO_OPTIONS.map((opt) => {
                    const isSelected = draft.modo_uso.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          const newValue = isSelected
                            ? draft.modo_uso.filter(v => v !== opt.value)
                            : [...draft.modo_uso, opt.value];
                          updateDraft({ modo_uso: newValue });
                        }}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors flex items-start gap-3",
                          isSelected
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/50"
                        )}
                      >
                        <Checkbox checked={isSelected} />
                        <div>
                          <div className="font-medium">{opt.label}</div>
                          <p className="text-sm text-muted-foreground">{opt.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Linking */}
            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Sala *</Label>
                  <Select
                    value={draft.sala_id || ''}
                    onValueChange={(value) => updateDraft({ sala_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {salas.map((sala) => (
                        <SelectItem key={sala.id} value={sala.id}>
                          {sala.nome_exibicao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Nível de Acesso Mínimo *</Label>
                  <Select
                    value={draft.portal_minimo}
                    onValueChange={(value) => updateDraft({ portal_minimo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {PORTAL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 5: Closure */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Como a ferramenta finaliza a experiência da usuária?
                </p>
                
                <div className="grid gap-3">
                  {TIPO_FECHAMENTO_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => updateDraft({ tipo_fechamento: opt.value })}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-colors",
                        draft.tipo_fechamento === opt.value
                          ? "border-gold bg-gold/10"
                          : "border-border hover:border-gold/50"
                      )}
                    >
                      <div className="font-medium">{opt.label}</div>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex gap-2">
            {currentStep === STEPS.length - 1 ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={loading}
                  className="bg-gold hover:bg-gold/90"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Publicar Ferramenta
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
