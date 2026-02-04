// ============================================
// JARDIM DA HEROÍNA - INTEGRATION TAB (NEW)
// ============================================
// Temporary integration space for the client between sessions
// Therapist-controlled, never standalone

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Leaf,
  Sparkles,
  Lock,
  AlertTriangle,
  Play,
  Check,
  Loader2,
  Calendar,
  Eye,
  X,
  ChevronRight,
} from 'lucide-react';
import { useJardimHeroinaNovo } from '@/hooks/useJardimHeroinaNovo';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { 
  JardimGestoTipo, 
  GestoSustentacao,
  AtualizarJardimHeroina 
} from '@/types/jardim-heroina-novo';
import { GESTO_TIPO_LABELS, GESTO_TIPO_ICONS, SUSTENTACAO_LABELS } from '@/types/jardim-heroina-novo';

interface JardimHeroinaIntegracaoTabProps {
  caseId: string;
  clientId: string;
  clientName?: string;
}

// Section wrapper component
function JardimSection({ 
  title, 
  icon, 
  children, 
  locked = false 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <Card className={cn(
      "transition-all",
      locked && "opacity-60 pointer-events-none"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {locked && <Lock className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function JardimHeroinaIntegracaoTab({ 
  caseId, 
  clientId, 
  clientName 
}: JardimHeroinaIntegracaoTabProps) {
  const {
    jardim,
    loading,
    saving,
    fetchJardim,
    ativarJardim,
    atualizarJardim,
    fecharJardim,
  } = useJardimHeroinaNovo({ caseId, clientId });

  const [activeSection, setActiveSection] = useState(1);

  // Load on mount
  useEffect(() => {
    fetchJardim();
  }, [fetchJardim]);

  // Handle field changes with debounce pattern
  const handleFieldChange = async (field: keyof AtualizarJardimHeroina, value: any) => {
    if (!jardim) return;
    await atualizarJardim({ [field]: value });
  };

  // Render empty state - Jardim not activated
  if (!loading && (!jardim || jardim.status === 'inactive')) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed border-emerald-500/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Leaf className="w-16 h-16 text-emerald-500/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Jardim da Heroína</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              O Jardim é um espaço temporário de integração entre sessões. 
              Aqui a cliente poderá sustentar um gesto simbólico acordado em sessão.
            </p>
            
            <Alert className="max-w-md mb-6 border-amber-500/30 bg-amber-950/20">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <AlertDescription className="text-sm text-amber-200/80">
                O Jardim não é terapia autônoma. É um suporte para integração 
                do que foi trabalhado em sessão.
              </AlertDescription>
            </Alert>

            <Button
              onClick={ativarJardim}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Ativar Jardim para {clientName || 'esta cliente'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render closed state
  if (jardim?.status === 'closed') {
    return (
      <div className="space-y-6">
        <Card className="border-muted">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Jardim Fechado
              </CardTitle>
              <Badge variant="outline">
                Fechado em {jardim.fechado_em ? format(new Date(jardim.fechado_em), "dd/MM/yyyy", { locale: ptBR }) : '—'}
              </Badge>
            </div>
            <CardDescription>
              Este Jardim foi encerrado. O conteúdo está preservado para referência.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary of closed Jardim */}
            {jardim.gesto_descricao && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Gesto definido:</p>
                <p className="font-medium">{jardim.gesto_descricao}</p>
                {jardim.observacao_sustentou && (
                  <Badge className="mt-2" variant="outline">
                    {SUSTENTACAO_LABELS[jardim.observacao_sustentou as GestoSustentacao]}
                  </Badge>
                )}
              </div>
            )}

            {jardim.fechamento_levo && (
              <div className="bg-emerald-950/30 rounded-lg p-4 border border-emerald-500/20">
                <p className="text-sm text-emerald-400/70 mb-1">O que leva para a próxima sessão:</p>
                <p className="text-emerald-100">{jardim.fechamento_levo}</p>
              </div>
            )}

            <Separator />

            <Button
              onClick={ativarJardim}
              disabled={saving}
              variant="outline"
              className="w-full gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Abrir Novo Jardim
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Active Jardim - Main interface
  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-emerald-500" />
          <div>
            <h2 className="text-lg font-semibold">Jardim da Heroína</h2>
            <p className="text-sm text-muted-foreground">
              Espaço de integração para {clientName || 'a cliente'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Ativo
          </Badge>
          {jardim?.ativado_em && (
            <span className="text-xs text-muted-foreground">
              desde {format(new Date(jardim.ativado_em), "dd/MM", { locale: ptBR })}
            </span>
          )}
        </div>
      </div>

      {/* Ethical warning - Fixed */}
      <Alert className="border-amber-500/30 bg-amber-950/20">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <AlertDescription className="text-sm text-amber-200/80">
          Este espaço é para integrar, não para aprofundar. O que precisa de cuidado maior pertence à sessão.
        </AlertDescription>
      </Alert>

      {/* Section Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { n: 1, label: 'Chegada' },
          { n: 2, label: 'Integração' },
          { n: 3, label: 'Gesto' },
          { n: 4, label: 'Observação' },
          { n: 5, label: 'Fechamento' },
        ].map(({ n, label }) => (
          <Button
            key={n}
            variant={activeSection === n ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(n)}
            className={cn(
              "gap-1 whitespace-nowrap",
              activeSection === n && "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            <span className="w-5 h-5 rounded-full bg-background/20 text-xs flex items-center justify-center">
              {n}
            </span>
            {label}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-6 pr-4">
          
          {/* Section 1: Chegada ao Jardim */}
          {activeSection === 1 && (
            <JardimSection 
              title="Chegada ao Jardim" 
              icon={<Leaf className="w-4 h-4 text-emerald-500" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    O que ficou mais vivo da sessão?
                  </Label>
                  <Textarea
                    placeholder="Uma frase, uma sensação, uma imagem simples."
                    value={jardim?.chegada_vivo || ''}
                    onChange={(e) => handleFieldChange('chegada_vivo', e.target.value.slice(0, 240))}
                    className="min-h-[100px] resize-none"
                    maxLength={240}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(jardim?.chegada_vivo?.length || 0)}/240
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Onde senti isso no corpo?
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['peito', 'ventre', 'garganta', 'ombros', 'pernas'].map((local) => (
                      <Button
                        key={local}
                        type="button"
                        variant={jardim?.chegada_corpo === local ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFieldChange('chegada_corpo', local)}
                        className={cn(
                          "text-xs capitalize",
                          jardim?.chegada_corpo === local && "bg-emerald-600 hover:bg-emerald-700"
                        )}
                      >
                        {local}
                      </Button>
                    ))}
                  </div>
                  <Input
                    placeholder="outro (texto curto)"
                    value={!['peito', 'ventre', 'garganta', 'ombros', 'pernas'].includes(jardim?.chegada_corpo || '') ? (jardim?.chegada_corpo || '') : ''}
                    onChange={(e) => handleFieldChange('chegada_corpo', e.target.value.slice(0, 100))}
                    maxLength={100}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(2)}
                    className="gap-1"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </JardimSection>
          )}

          {/* Section 2: Integração da Semana */}
          {activeSection === 2 && (
            <JardimSection 
              title="Integração da Semana" 
              icon={<Eye className="w-4 h-4 text-indigo-400" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    O que vou observar em mim até a próxima sessão?
                  </Label>
                  <Textarea
                    placeholder="Algo simples. Algo possível."
                    value={jardim?.integracao_observar || ''}
                    onChange={(e) => handleFieldChange('integracao_observar', e.target.value.slice(0, 300))}
                    className="min-h-[120px] resize-none"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(jardim?.integracao_observar?.length || 0)}/300
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(1)}
                  >
                    Voltar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(3)}
                    className="gap-1"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </JardimSection>
          )}

          {/* Section 3: Gesto Simbólico (CORE) */}
          {activeSection === 3 && (
            <JardimSection 
              title="Gesto de Integração" 
              icon={<Sparkles className="w-4 h-4 text-amber-400" />}
            >
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground italic">
                  Um gesto. Não mais que isso.
                </p>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Qual gesto sustenta o que emergiu?
                  </Label>
                  <Textarea
                    placeholder="Descreva o gesto acordado em sessão..."
                    value={jardim?.gesto_descricao || ''}
                    onChange={(e) => handleFieldChange('gesto_descricao', e.target.value.slice(0, 200))}
                    className="min-h-[80px] resize-none"
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Tipo de gesto</Label>
                  <Select
                    value={jardim?.gesto_tipo || ''}
                    onValueChange={(v) => handleFieldChange('gesto_tipo', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(GESTO_TIPO_LABELS) as JardimGestoTipo[]).map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          <span className="flex items-center gap-2">
                            <span>{GESTO_TIPO_ICONS[tipo]}</span>
                            {GESTO_TIPO_LABELS[tipo]}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Até quando este gesto será sustentado?
                    </Label>
                    <Input
                      type="date"
                      value={jardim?.gesto_prazo || ''}
                      onChange={(e) => handleFieldChange('gesto_prazo', e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Ou texto livre</Label>
                    <Input
                      placeholder="até próxima sessão"
                      value={jardim?.gesto_prazo_texto || ''}
                      onChange={(e) => handleFieldChange('gesto_prazo_texto', e.target.value.slice(0, 50))}
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(2)}
                  >
                    Voltar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(4)}
                    className="gap-1"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </JardimSection>
          )}

          {/* Section 4: Observação Simples */}
          {activeSection === 4 && (
            <JardimSection 
              title="Observação Simples" 
              icon={<Check className="w-4 h-4 text-emerald-400" />}
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Consegui sustentar o gesto?
                  </Label>
                  <RadioGroup
                    value={jardim?.observacao_sustentou || ''}
                    onValueChange={(v) => handleFieldChange('observacao_sustentou', v)}
                    className="space-y-2"
                  >
                    {(Object.keys(SUSTENTACAO_LABELS) as GestoSustentacao[]).map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={opt} />
                        <Label htmlFor={opt} className="font-normal">
                          {SUSTENTACAO_LABELS[opt]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    O que percebi? 
                    <span className="text-xs ml-1">(opcional)</span>
                  </Label>
                  <Textarea
                    placeholder="Sem certo ou errado."
                    value={jardim?.observacao_percebi || ''}
                    onChange={(e) => handleFieldChange('observacao_percebi', e.target.value.slice(0, 180))}
                    className="min-h-[80px] resize-none"
                    maxLength={180}
                  />
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(3)}
                  >
                    Voltar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(5)}
                    className="gap-1"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </JardimSection>
          )}

          {/* Section 5: Fechamento */}
          {activeSection === 5 && (
            <JardimSection 
              title="Fechamento do Jardim" 
              icon={<Lock className="w-4 h-4 text-rose-400" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    O que levo para a próxima sessão?
                  </Label>
                  <Textarea
                    placeholder=""
                    value={jardim?.fechamento_levo || ''}
                    onChange={(e) => handleFieldChange('fechamento_levo', e.target.value.slice(0, 200))}
                    className="min-h-[80px] resize-none"
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    O que posso deixar aqui?
                  </Label>
                  <Textarea
                    placeholder=""
                    value={jardim?.fechamento_deixo || ''}
                    onChange={(e) => handleFieldChange('fechamento_deixo', e.target.value.slice(0, 200))}
                    className="min-h-[80px] resize-none"
                    maxLength={200}
                  />
                </div>

                <div className="bg-muted/30 rounded-lg p-4 text-center border border-muted">
                  <p className="text-sm text-muted-foreground italic">
                    O Jardim se fecha.<br />
                    O gesto segue com você.
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveSection(4)}
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={fecharJardim}
                    disabled={saving}
                    variant="destructive"
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Fechar Jardim
                  </Button>
                </div>
              </div>
            </JardimSection>
          )}
        </div>
      </ScrollArea>

      {/* Save indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-background/95 border rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          <span className="text-sm">Salvando...</span>
        </div>
      )}
    </div>
  );
}
