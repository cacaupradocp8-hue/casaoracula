import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GpsSuggestionCard } from '@/components/casa-maquinas/GpsSuggestionCard';
import type { GpsSuggestion } from '@/lib/gps-cidadela';
import { SessionInterventionSuggestions } from '@/components/casa-maquinas/SessionInterventionSuggestions';
import { MentoraIAPanel } from '@/components/casa-maquinas/MentoraIAPanel';
import { OracleSessionWidget } from '@/components/cidadela-oracle/OracleSessionWidget';
import { useCidadelaOracle, type CidadelaCard } from '@/hooks/useCidadelaOracle';
import { useSessionMode, type SessionMode } from '@/hooks/useSessionMode';
import { SessionModeSelector } from '@/components/casa-maquinas/SessionModeSelector';
import { SessionModeIndicator } from '@/components/casa-maquinas/SessionModeIndicator';
import { useCidadelaMap } from '@/hooks/useCidadelaMap';
import { useUserVoz } from '@/hooks/useUserVoz';
import { VozAtivaIndicator, VozClinicalSuggestions, sortToolsByVoz } from '@/components/casa-maquinas/VozAtivaIndicator';
import { EnviarOrientacaoDialog } from '@/components/casa-maquinas/EnviarOrientacaoDialog';
import { useOrientacoesTerapeuta } from '@/hooks/useOrientacoes';

const CHECKIN_STATES = [
  { value: 'contraida', label: 'Contraída', color: '#EF4444' },
  { value: 'instavel', label: 'Instável', color: '#F59E0B' },
  { value: 'presente', label: 'Presente', color: '#556B57' },
];

export default function ModoSessaoPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionMode = useSessionMode();
  const { updateFromSession } = useCidadelaMap();
  const { voz_ativa, setVozAtiva } = useUserVoz();

  // Initialize mode from URL param or show selector
  const initialMode = searchParams.get('modo') as SessionMode | null;
  const [modeSelectorOpen, setModeSelectorOpen] = useState(!initialMode);

  useEffect(() => {
    if (initialMode && !sessionMode.mode) {
      sessionMode.selectMode(initialMode);
    }
  }, [initialMode]);

  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState(searchParams.get('clienteId') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('districtId') || '');
  const [selectedTool, setSelectedTool] = useState('');
  const [checkinState, setCheckinState] = useState('');
  const [checkinNotes, setCheckinNotes] = useState('');
  const [insight, setInsight] = useState('');
  const [task, setTask] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gpsSuggestion, setGpsSuggestion] = useState<GpsSuggestion | null>(null);
  const [usedInterventionIds, setUsedInterventionIds] = useState<string[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [usedToolRoutes, setUsedToolRoutes] = useState<string[]>([]);
  const [orientacaoDialogOpen, setOrientacaoDialogOpen] = useState(false);
  const { recordUsage } = useCidadelaOracle();
  const orientacoes = useOrientacoesTerapeuta(selectedClient);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // In Orácula mode, auto-fetch initial suggestion after check-in
  useEffect(() => {
    if (sessionMode.mode === 'oracula' && step === 2 && !sessionMode.nextStep) {
      sessionMode.fetchInitialSuggestion();
    }
  }, [sessionMode.mode, step]);

  const loadData = async () => {
    const [cRes, dRes, tRes] = await Promise.all([
      supabase.from('clientes').select('id, nome').eq('terapeuta_id', user!.id).order('nome'),
      supabase.from('districts').select('*').order('numero'),
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
    ]);
    setClients(cRes.data || []);
    setDistricts(dRes.data || []);
    setTools(tRes.data || []);
    setLoading(false);
  };

  const filteredTools = sortToolsByVoz(
    selectedDistrict ? tools.filter(t => t.district_id === selectedDistrict) : tools,
    voz_ativa
  );

  const handleFollowNextStep = (rota: string) => {
    setUsedToolRoutes(prev => [...prev, rota]);
    // Fetch the next step after this one
    sessionMode.fetchNextStep(rota);
    navigate(rota);
  };

  const handleSave = async () => {
    if (!selectedClient) {
      toast.error('Selecione uma cliente');
      return;
    }
    setSaving(true);

    const { error } = await supabase.from('sessions').insert({
      client_id: selectedClient,
      user_id: user!.id,
      district_id: selectedDistrict || null,
      tool_id: selectedTool || null,
      cidadela_card_id: selectedCardId || null,
      checkin_state: checkinState || null,
      checkin_notes: checkinNotes || null,
      gps_suggestion_json: gpsSuggestion ? JSON.parse(JSON.stringify(gpsSuggestion)) : null,
      used_intervention_ids: usedInterventionIds.length > 0 ? usedInterventionIds : [],
      insight: insight || null,
      task: task || null,
      notes: notes || null,
      voz_utilizada: voz_ativa || null,
    } as any);

    if (error) {
      toast.error('Erro ao salvar sessão');
      setSaving(false);
      return;
    }

    // Auto-update CidaDELA map in Orácula mode
    if (sessionMode.mode === 'oracula' && selectedClient) {
      const toolName = tools.find(t => t.id === selectedTool)?.nome;
      const districtName = districts.find(d => d.id === selectedDistrict)?.nome;
      await updateFromSession(selectedClient, {
        distrito: districtName || undefined,
        ferramenta: toolName || undefined,
        insight: insight || undefined,
      });
    }

    // Update journey district state
    if (selectedDistrict) {
      const { data: journeys } = await supabase
        .from('journeys').select('id').eq('client_id', selectedClient).limit(1);
      if (journeys && journeys.length > 0) {
        const journeyId = journeys[0].id;
        const { data: existing } = await supabase
          .from('journey_districts').select('id, sessions_count')
          .eq('journey_id', journeyId).eq('district_id', selectedDistrict).limit(1);
        if (existing && existing.length > 0) {
          await supabase.from('journey_districts').update({
            state: 'ativo', sessions_count: (existing[0].sessions_count || 0) + 1,
            last_session_at: new Date().toISOString(),
          }).eq('id', existing[0].id);
        } else {
          await supabase.from('journey_districts').insert({
            journey_id: journeyId, district_id: selectedDistrict,
            state: 'ativo', sessions_count: 1, last_session_at: new Date().toISOString(),
          });
        }
        await supabase.from('journeys').update({
          current_district_id: selectedDistrict, updated_at: new Date().toISOString(),
        }).eq('id', journeyId);
      }
    }

    if (selectedCardId && selectedClient) {
      await recordUsage(selectedClient, selectedCardId);
    }

    toast.success('Sessão registrada');
    navigate(`/casa-das-maquinas/clientes/${selectedClient}`);
  };

  const handleModeSelect = (mode: SessionMode) => {
    sessionMode.selectMode(mode);
    setModeSelectorOpen(false);
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Modo Sessão">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </CasaMaquinasLayout>
    );
  }

  const steps = [
    { num: 1, label: 'Check-in' },
    { num: 2, label: 'Distrito & Ferramenta' },
    { num: 3, label: 'Execução' },
    { num: 4, label: 'Registro Final' },
  ];

  return (
    <CasaMaquinasLayout title="Modo Sessão" subtitle="Conduza uma sessão passo a passo">
      {/* Mode Selector Dialog */}
      <SessionModeSelector
        open={modeSelectorOpen}
        onSelect={handleModeSelect}
        onClose={() => { if (!sessionMode.mode) navigate(-1); setModeSelectorOpen(false); }}
      />

      {/* Mode Indicator */}
      {sessionMode.mode && (
        <div className="mb-4">
          <SessionModeIndicator
            mode={sessionMode.mode}
            onToggle={sessionMode.toggleMode}
            nextStep={sessionMode.nextStep}
            loadingNext={sessionMode.loadingNext}
            onFollowNextStep={handleFollowNextStep}
            onRequestSuggestion={sessionMode.fetchInitialSuggestion}
            compact={step < 3}
          />
        </div>
      )}

      {/* Voz Ativa Indicator */}
      {voz_ativa && (
        <div className="mb-6">
          <VozAtivaIndicator
            vozId={voz_ativa}
            onClear={() => setVozAtiva('')}
          />
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => step > s.num && setStep(s.num)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-primary text-primary-foreground'
                  : step > s.num
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
            </button>
            <span className="text-[10px] text-muted-foreground hidden sm:block">{s.label}</span>
            {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto">
        {/* Step 1: Check-in */}
        {step === 1 && (
          <Card className="border-border/30 bg-card/60">
            <CardHeader><CardTitle className="text-sm text-foreground/80">Check-in Rápido</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Cliente</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="bg-background/60 border-border/30">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Estado de presença</label>
                <div className="flex gap-2">
                  {CHECKIN_STATES.map(s => (
                    <Button
                      key={s.value}
                      variant={checkinState === s.value ? 'default' : 'outline'}
                      size="sm"
                      className={checkinState === s.value
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'border-border/30 text-muted-foreground'}
                      onClick={() => setCheckinState(s.value)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Observações do check-in</label>
                <Textarea value={checkinNotes} onChange={e => setCheckinNotes(e.target.value)} className="bg-background/60 border-border/30" placeholder="Campo livre..." />
              </div>
              <Button onClick={() => setStep(2)} disabled={!selectedClient} className="w-full bg-primary hover:bg-primary/80 text-primary-foreground">
                Avançar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: District & Tool */}
        {step === 2 && (
          <>
            {selectedClient && (
              <GpsSuggestionCard
                clientId={selectedClient}
                checkin={checkinState}
                vozAtiva={voz_ativa}
                onApply={(s) => {
                  setGpsSuggestion(s);
                  const matchDist = districts.find(d => d.nome === s.distrito_sugerido);
                  if (matchDist) setSelectedDistrict(matchDist.id);
                  const matchTool = tools.find(t => t.nome === s.ferramenta_recomendada);
                  if (matchTool) setSelectedTool(matchTool.id);
                  toast.success('Sugestão aplicada');
                }}
              />
            )}

            {/* Orácula mode: show next step suggestion prominently */}
            {sessionMode.mode === 'oracula' && sessionMode.nextStep && (
              <div className="mb-4">
                <SessionModeIndicator
                  mode={sessionMode.mode}
                  onToggle={sessionMode.toggleMode}
                  nextStep={sessionMode.nextStep}
                  loadingNext={sessionMode.loadingNext}
                  onFollowNextStep={handleFollowNextStep}
                  compact={false}
                />
              </div>
            )}

            <Card className="border-border/30 bg-card/60">
              <CardHeader><CardTitle className="text-sm text-foreground/80">Distrito & Ferramenta</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <OracleSessionWidget
                  clientId={selectedClient}
                  districtId={selectedDistrict}
                  checkinState={checkinState}
                  onUseCard={(card: CidadelaCard) => {
                    setSelectedCardId(card.id);
                    if (card.district_id) setSelectedDistrict(card.district_id);
                    toast.success(`Carta "${card.name}" selecionada`);
                  }}
                />
                {selectedCardId && (
                  <p className="text-[10px] text-primary/60 text-center">✦ Carta vinculada à sessão</p>
                )}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Distrito</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="bg-background/60 border-border/30">
                      <SelectValue placeholder="Escolha o distrito..." />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.numero}. {d.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Ferramenta</label>
                  <Select value={selectedTool} onValueChange={setSelectedTool}>
                    <SelectTrigger className="bg-background/60 border-border/30">
                      <SelectValue placeholder="Escolha a ferramenta..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTools.map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {/* Voz clinical suggestions in step 2 */}
                <VozClinicalSuggestions vozId={voz_ativa} />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border/30 text-muted-foreground">Voltar</Button>
                  <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">Avançar</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Execution */}
        {step === 3 && (
          <Card className="border-border/30 bg-card/60">
            <CardHeader><CardTitle className="text-sm text-foreground/80">Execução</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Orácula mode: show next step */}
              {sessionMode.mode === 'oracula' && (
                <SessionModeIndicator
                  mode={sessionMode.mode}
                  onToggle={sessionMode.toggleMode}
                  nextStep={sessionMode.nextStep}
                  loadingNext={sessionMode.loadingNext}
                  onFollowNextStep={handleFollowNextStep}
                />
              )}

              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {selectedTool ? 'Execute a ferramenta selecionada com a cliente.' : 'Nenhuma ferramenta selecionada — conduza a sessão livremente.'}
                </p>
                {selectedTool && (() => {
                  const tool = tools.find(t => t.id === selectedTool);
                  return tool ? (
                    <Button
                      variant="outline"
                      className="mt-4 border-primary/20 text-primary"
                      onClick={() => {
                        setUsedToolRoutes(prev => [...prev, tool.rota || '']);
                        if (sessionMode.mode === 'oracula' && tool.rota) {
                          sessionMode.fetchNextStep(tool.rota);
                        }
                        navigate(tool.rota);
                      }}
                    >
                      Abrir {tool.nome}
                    </Button>
                  ) : null;
                })()}
              </div>

              {/* Voz clinical suggestions in execution step */}
              <VozClinicalSuggestions vozId={voz_ativa} />

              <SessionInterventionSuggestions
                sessionDistrictId={selectedDistrict || undefined}
                checkinState={checkinState}
                onUse={(id) => {
                  if (!usedInterventionIds.includes(id)) {
                    setUsedInterventionIds(prev => [...prev, id]);
                  }
                }}
              />
              {usedInterventionIds.length > 0 && (
                <p className="text-[10px] text-primary/40 text-center">{usedInterventionIds.length} intervenção(ões) selecionada(s)</p>
              )}
              {/* Mentora IA */}
              {selectedClient && (
                <div className="pt-2 border-t border-border/20">
                  <MentoraIAPanel
                    clienteId={selectedClient}
                    clienteNome={clients.find(c => c.id === selectedClient)?.nome || 'Cliente'}
                    dadosCidadela={{
                      distrito_ativo: districts.find(d => d.id === selectedDistrict)?.nome,
                    }}
                    vozTerapeuta={voz_ativa || undefined}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-border/30 text-muted-foreground">Voltar</Button>
                <Button onClick={() => setStep(4)} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">Avançar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Final Register */}
        {step === 4 && (
          <Card className="border-border/30 bg-card/60">
            <CardHeader><CardTitle className="text-sm text-foreground/80">Registro Final</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {sessionMode.mode === 'oracula' && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                  <p className="font-semibold text-primary text-[10px] uppercase mb-1">Modo Orácula</p>
                  Ao salvar, o mapa da CidaDELA será atualizado automaticamente com os dados desta sessão.
                  {usedToolRoutes.length > 0 && (
                    <p className="mt-1 text-primary/60">{usedToolRoutes.length} ferramenta(s) utilizada(s) no fluxo.</p>
                  )}
                </div>
              )}
              {/* Voz used in this session */}
              {voz_ativa && (
                <VozAtivaIndicator vozId={voz_ativa} compact />
              )}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Insight principal</label>
                <Textarea value={insight} onChange={e => setInsight(e.target.value)} className="bg-background/60 border-border/30" placeholder="O que emergiu nesta sessão?" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Tarefa simbólica</label>
                <Textarea value={task} onChange={e => setTask(e.target.value)} className="bg-background/60 border-border/30" placeholder="O que a cliente leva para casa?" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Notas</label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="bg-background/60 border-border/30" placeholder="Anotações privadas..." />
              </div>
              
              {/* Jardim da Heroína - Send orientation */}
              {selectedClient && (
                <div className="p-3 rounded-lg bg-emerald-950/15 border border-emerald-500/15 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500/50 font-medium">
                    🌿 Jardim da Heroína
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Envie uma orientação para a cliente continuar no Jardim entre sessões.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 gap-1.5"
                    onClick={() => setOrientacaoDialogOpen(true)}
                  >
                    <Leaf className="w-3 h-3" />
                    Enviar Orientação ao Jardim
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1 border-border/30 text-muted-foreground">Voltar</Button>
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Sessão'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CasaMaquinasLayout>
  );
}
