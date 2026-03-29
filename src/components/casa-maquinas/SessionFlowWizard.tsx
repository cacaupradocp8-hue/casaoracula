import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCidadelaMap } from '@/hooks/useCidadelaMap';
import { useSessionMode, type SessionMode } from '@/hooks/useSessionMode';
import { SessionModeSelector } from './SessionModeSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Compass, Feather, Sparkles, ArrowRight, ChevronRight, ChevronLeft,
  Loader2, Plus, X, CheckCircle, Map, Flower2, Save, LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentoraIAPanel } from './MentoraIAPanel';
import { toast } from 'sonner';

interface SessionFlowWizardProps {
  clienteId: string;
  clienteNome: string;
  open: boolean;
  onClose: () => void;
}

interface ToolSuggestion {
  id: string;
  ferramenta_nome: string;
  rota: string | null;
  categoria_metodo: string | null;
  icone: string | null;
  ferramenta_descricao: string | null;
}

interface SessionInsight {
  text: string;
  timestamp: string;
}

type WizardStep = 'mode' | 'field' | 'suggestion' | 'session' | 'summary';

export function SessionFlowWizard({ clienteId, clienteNome, open, onClose }: SessionFlowWizardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sessionMode = useSessionMode();
  const { updateFromSession } = useCidadelaMap();

  const [step, setStep] = useState<WizardStep>('mode');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Field identification
  const [fieldType, setFieldType] = useState<'porta' | 'sensacao' | 'palavra' | ''>('');
  const [fieldValue, setFieldValue] = useState('');
  const [quickFields, setQuickFields] = useState<string[]>([]);

  // Tools
  const [suggestedTool, setSuggestedTool] = useState<ToolSuggestion | null>(null);
  const [complementaryTool, setComplementaryTool] = useState<ToolSuggestion | null>(null);
  const [usedTools, setUsedTools] = useState<ToolSuggestion[]>([]);
  const [allTools, setAllTools] = useState<ToolSuggestion[]>([]);

  // Session
  const [insights, setInsights] = useState<SessionInsight[]>([]);
  const [newInsight, setNewInsight] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionStartTime] = useState(new Date());

  // Load quick fields (portas from DB)
  useEffect(() => {
    if (open) {
      loadQuickFields();
      loadAllTools();
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStep('mode');
      setFieldType('');
      setFieldValue('');
      setSuggestedTool(null);
      setComplementaryTool(null);
      setUsedTools([]);
      setInsights([]);
      setNewInsight('');
      setSessionNotes('');
      sessionMode.selectMode('oracula'); // reset
    }
  }, [open]);

  const loadQuickFields = async () => {
    const { data } = await supabase
      .from('labirinto_portas')
      .select('nome')
      .eq('ativa', true)
      .order('ordem')
      .limit(12);
    setQuickFields((data || []).map(p => p.nome));
  };

  const loadAllTools = async () => {
    const { data } = await supabase
      .from('sala_ferramentas')
      .select('id, ferramenta_nome, rota, categoria_metodo, icone, ferramenta_descricao')
      .eq('ativa', true)
      .order('ordem');
    setAllTools((data || []).map(t => ({
      id: t.id,
      ferramenta_nome: t.ferramenta_nome,
      rota: t.rota,
      categoria_metodo: t.categoria_metodo,
      icone: t.icone,
      ferramenta_descricao: t.ferramenta_descricao,
    })));
  };

  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    try {
      // Get first diagnostic tool as suggestion
      const { data: primary } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, rota, categoria_metodo, icone, ferramenta_descricao')
        .eq('ativa', true)
        .eq('categoria_metodo', 'diagnostico')
        .order('ordem')
        .limit(1)
        .maybeSingle();

      if (primary) {
        setSuggestedTool({
          id: primary.id,
          ferramenta_nome: primary.ferramenta_nome,
          rota: primary.rota,
          categoria_metodo: primary.categoria_metodo,
          icone: primary.icone,
          ferramenta_descricao: primary.ferramenta_descricao,
        });

        // Fetch complementary via proximo_passo
        if (primary.rota) {
          const { data: next } = await supabase
            .from('sala_ferramentas')
            .select('id, ferramenta_nome, rota, categoria_metodo, icone, ferramenta_descricao, proximo_passo')
            .eq('rota', primary.rota)
            .maybeSingle();

          if (next?.proximo_passo) {
            const { data: comp } = await supabase
              .from('sala_ferramentas')
              .select('id, ferramenta_nome, rota, categoria_metodo, icone, ferramenta_descricao')
              .eq('rota', next.proximo_passo)
              .eq('ativa', true)
              .maybeSingle();
            if (comp) setComplementaryTool({
              id: comp.id,
              ferramenta_nome: comp.ferramenta_nome,
              rota: comp.rota,
              categoria_metodo: comp.categoria_metodo,
              icone: comp.icone,
              ferramenta_descricao: comp.ferramenta_descricao,
            });
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleModeSelect = (mode: SessionMode) => {
    sessionMode.selectMode(mode);
    if (mode === 'oracula') {
      setStep('field');
    } else {
      setStep('session');
    }
  };

  const handleFieldSubmit = () => {
    fetchSuggestion();
    setStep('suggestion');
  };

  const handleQuickFieldSelect = (field: string) => {
    setFieldValue(field);
    setFieldType('porta');
  };

  const handleStartTool = (tool: ToolSuggestion) => {
    setUsedTools(prev => {
      if (prev.find(t => t.id === tool.id)) return prev;
      return [...prev, tool];
    });
    setStep('session');
  };

  const addInsight = () => {
    if (!newInsight.trim()) return;
    setInsights(prev => [...prev, { text: newInsight.trim(), timestamp: new Date().toISOString() }]);
    setNewInsight('');
  };

  const handleFinishSession = () => {
    setStep('summary');
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Save session record
      const { error } = await supabase.from('sessoes_casa_maquinas').insert({
        owner_id: user.id,
        cliente_id: clienteId,
        data_sessao: new Date().toISOString().split('T')[0],
        movimento_percebido: 'observacao',
        nota_breve: sessionNotes.trim() || null,
      });

      if (error) throw error;

      // Update CidaDELA map
      if (sessionMode.mode === 'oracula') {
        await updateFromSession(clienteId, {
          porta: fieldValue || undefined,
          ferramenta: usedTools.map(t => t.ferramenta_nome).join(', ') || undefined,
          insight: insights.map(i => i.text).join(' | ') || undefined,
        });
      }

      toast.success('Sessão salva com sucesso!');
      onClose();
    } catch {
      toast.error('Erro ao salvar sessão');
    } finally {
      setSaving(false);
    }
  };

  const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
        {/* Mode indicator bar */}
        {sessionMode.mode && step !== 'mode' && (
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 border border-border/20 mb-2">
            <div className="flex items-center gap-2">
              {sessionMode.mode === 'oracula' ? (
                <Compass className="w-4 h-4 text-primary" />
              ) : (
                <Feather className="w-4 h-4 text-accent-foreground" />
              )}
              <span className="text-xs font-medium text-foreground">
                {sessionMode.mode === 'oracula' ? 'Modo Orácula ativo' : 'Modo Livre ativo'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] h-6 text-muted-foreground hover:text-foreground"
              onClick={() => sessionMode.toggleMode()}
            >
              Alternar modo
            </Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ===== STEP: MODE SELECTION ===== */}
          {step === 'mode' && (
            <motion.div key="mode" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <DialogHeader>
                <DialogTitle className="text-center font-display">Iniciar Sessão</DialogTitle>
                <DialogDescription className="text-center text-sm">
                  {clienteNome} — Como deseja conduzir?
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                <button
                  onClick={() => handleModeSelect('oracula')}
                  className="p-5 rounded-xl border-2 border-border/30 hover:border-primary hover:bg-primary/5 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <Compass className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">Modo Orácula</h3>
                      <Badge variant="secondary" className="text-[9px]">Guiado</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sugestões automáticas de ferramentas, fluxo contínuo e atualização do mapa da CidaDELA.
                  </p>
                </button>
                <button
                  onClick={() => handleModeSelect('livre')}
                  className="p-5 rounded-xl border-2 border-border/30 hover:border-accent hover:bg-accent/5 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                      <Feather className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">Modo Livre</h3>
                      <Badge variant="outline" className="text-[9px]">Não guiado</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acesso livre, registro manual e sugestões opcionais.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP: FIELD IDENTIFICATION (Orácula) ===== */}
          {step === 'field' && (
            <motion.div key="field" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <DialogHeader>
                <DialogTitle className="text-center font-display text-base">Identificação do Campo</DialogTitle>
                <DialogDescription className="text-center text-sm">
                  O que traz a cliente hoje? Escolha ou descreva.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Quick selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Seleção Rápida — Portas</label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickFields.map(f => (
                      <Badge
                        key={f}
                        variant={fieldValue === f ? 'default' : 'outline'}
                        className={`cursor-pointer text-[10px] transition-all ${
                          fieldValue === f
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10 hover:border-primary/30'
                        }`}
                        onClick={() => handleQuickFieldSelect(f)}
                      >
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Manual input */}
                <div className="border-t border-border/20 pt-4">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Ou descreva manualmente</label>
                  <div className="flex gap-2 mb-2">
                    {(['porta', 'sensacao', 'palavra'] as const).map(t => (
                      <Button
                        key={t}
                        variant={fieldType === t ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs capitalize"
                        onClick={() => setFieldType(t)}
                      >
                        {t === 'sensacao' ? 'Sensação' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <Input
                    value={fieldValue}
                    onChange={e => setFieldValue(e.target.value)}
                    placeholder={
                      fieldType === 'porta' ? 'Ex: Porta do Abandono'
                        : fieldType === 'sensacao' ? 'Ex: aperto no peito, medo difuso'
                        : 'Ex: solidão, raiva, pertencimento'
                    }
                    className="bg-background/60 border-border/30"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setStep('mode')} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                  </Button>
                  <Button
                    onClick={handleFieldSubmit}
                    disabled={!fieldValue.trim()}
                    className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground"
                  >
                    Continuar <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== STEP: SUGGESTION (Orácula) ===== */}
          {step === 'suggestion' && (
            <motion.div key="suggestion" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <DialogHeader>
                <DialogTitle className="text-center font-display text-base">Sugestão Automática</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Field identified */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-[10px] uppercase tracking-wider text-primary/60 mb-1">Campo Identificado</p>
                  <p className="text-sm font-medium text-foreground">{fieldValue}</p>
                  {fieldType && <Badge variant="secondary" className="text-[9px] mt-1">{fieldType}</Badge>}
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Primary suggestion */}
                    {suggestedTool && (
                      <Card className="border-primary/30 bg-primary/5">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-[10px] uppercase tracking-wider text-primary/60">Próxima ferramenta sugerida</span>
                          </div>
                          <h4 className="font-display font-semibold text-foreground">{suggestedTool.ferramenta_nome}</h4>
                          {suggestedTool.ferramenta_descricao && (
                            <p className="text-xs text-muted-foreground mt-1">{suggestedTool.ferramenta_descricao}</p>
                          )}
                          {suggestedTool.categoria_metodo && (
                            <Badge variant="secondary" className="text-[9px] mt-2">{suggestedTool.categoria_metodo}</Badge>
                          )}
                          <Button
                            onClick={() => handleStartTool(suggestedTool)}
                            className="w-full mt-3 bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
                          >
                            <Sparkles className="w-4 h-4" /> Iniciar ferramenta
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Complementary */}
                    {complementaryTool && (
                      <Card className="border-border/30 bg-muted/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Ferramenta complementar</span>
                          </div>
                          <h4 className="font-display font-medium text-foreground text-sm">{complementaryTool.ferramenta_nome}</h4>
                          {complementaryTool.ferramenta_descricao && (
                            <p className="text-xs text-muted-foreground mt-1">{complementaryTool.ferramenta_descricao}</p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartTool(complementaryTool)}
                            className="mt-2 text-xs"
                          >
                            Usar esta
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('field')} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                  </Button>
                  <Button variant="ghost" onClick={() => setStep('session')} className="text-xs text-muted-foreground">
                    Pular sugestão
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== STEP: SESSION (during) ===== */}
          {step === 'session' && (
            <motion.div key="session" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <DialogHeader>
                <DialogTitle className="text-center font-display text-base">Sessão em Andamento</DialogTitle>
                <DialogDescription className="text-center text-xs">
                  {clienteNome} • {sessionDuration} min
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Used tools */}
                {usedTools.length > 0 && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Ferramentas utilizadas</label>
                    <div className="flex flex-wrap gap-1.5">
                      {usedTools.map(t => (
                        <Badge key={t.id} variant="secondary" className="text-[10px]">
                          {t.ferramenta_nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add tool */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Mudar / Adicionar ferramenta</label>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {allTools.filter(t => !usedTools.find(u => u.id === t.id)).slice(0, 20).map(t => (
                      <Badge
                        key={t.id}
                        variant="outline"
                        className="cursor-pointer text-[10px] hover:bg-primary/10 hover:border-primary/30 transition-all"
                        onClick={() => handleStartTool(t)}
                      >
                        <Plus className="w-2.5 h-2.5 mr-0.5" /> {t.ferramenta_nome}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Registrar Insight</label>
                  <div className="flex gap-2">
                    <Input
                      value={newInsight}
                      onChange={e => setNewInsight(e.target.value)}
                      placeholder="Algo que emergiu na sessão..."
                      className="bg-background/60 border-border/30 text-sm"
                      onKeyDown={e => { if (e.key === 'Enter') addInsight(); }}
                    />
                    <Button size="sm" variant="outline" onClick={addInsight} disabled={!newInsight.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {insights.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {insights.map((ins, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/30 text-xs">
                          <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="flex-1 text-foreground">{ins.text}</span>
                          <button onClick={() => setInsights(prev => prev.filter((_, j) => j !== i))}>
                            <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Notas da sessão</label>
                  <Textarea
                    value={sessionNotes}
                    onChange={e => setSessionNotes(e.target.value)}
                    placeholder="Observações livres..."
                    className="bg-background/60 border-border/30 min-h-[60px]"
                  />
                </div>

                <Button
                  onClick={handleFinishSession}
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Encerrar Sessão
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP: SUMMARY ===== */}
          {step === 'summary' && (
            <motion.div key="summary" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <DialogHeader>
                <DialogTitle className="text-center font-display text-base">Resumo da Sessão</DialogTitle>
                <DialogDescription className="text-center text-xs">
                  {clienteNome} • Duração: {sessionDuration} min
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Modo</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      {sessionMode.mode === 'oracula' ? <Compass className="w-3.5 h-3.5 text-primary" /> : <Feather className="w-3.5 h-3.5" />}
                      {sessionMode.mode === 'oracula' ? 'Orácula' : 'Livre'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Ferramentas</p>
                    <p className="text-sm font-medium text-foreground">{usedTools.length} usada{usedTools.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {fieldValue && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-[10px] uppercase tracking-wider text-primary/60 mb-1">Campo trabalhado</p>
                    <p className="text-sm text-foreground">{fieldValue}</p>
                  </div>
                )}

                {usedTools.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Ferramentas utilizadas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {usedTools.map(t => (
                        <Badge key={t.id} variant="secondary" className="text-[10px]">{t.ferramenta_nome}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {insights.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Insights registrados</p>
                    <div className="space-y-1">
                      {insights.map((ins, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{ins.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sessionNotes && (
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Notas</p>
                    <p className="text-xs text-foreground whitespace-pre-wrap">{sessionNotes}</p>
                  </div>
                )}

                {/* CidaDELA update notice */}
                {sessionMode.mode === 'oracula' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Map className="w-4 h-4 text-primary" />
                    <span className="text-xs text-foreground">O mapa da CidaDELA será atualizado automaticamente.</span>
                  </div>
                )}

                {/* Jardim suggestion */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <Flower2 className="w-4 h-4 text-accent-foreground" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Sugestão para a cliente</p>
                    <p className="text-[10px] text-muted-foreground">Encaminhar para o Jardim da Heroína para integração simbólica.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setStep('session')} className="flex-1 gap-1">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Salvando...' : 'Salvar Sessão'}
                  </Button>
                </div>
                <Button variant="ghost" onClick={onClose} className="w-full text-xs text-muted-foreground gap-1">
                  <LogOut className="w-3 h-3" /> Finalizar sem salvar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
