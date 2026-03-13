import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Wrench, Calendar, ShieldCheck, Info, Brain, Key, MessageCircle, Save, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface District {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
}

interface Props {
  district: District | null;
  open: boolean;
  onClose: () => void;
  state: string;
  sessionCount: number;
  tools: { id: string; nome: string; rota: string; tipo: string }[];
  sessions: { id: string; created_at: string; checkin_state: string | null; insight?: string | null; tool_id?: string | null }[];
  clienteId: string;
  isManuallyIntegrated?: boolean;
  onStateChanged?: () => void;
}

const STATE_BADGES: Record<string, { label: string; cls: string }> = {
  inativo: { label: 'Não explorado', cls: 'border-[#F5F1E8]/10 text-[#F5F1E8]/30' },
  ativo: { label: 'Ativo', cls: 'border-[#C9A24A]/30 text-[#C9A24A]' },
  integrado: { label: 'Integrado', cls: 'border-[#556B57]/30 text-[#556B57]' },
};

type TargetState = 'ativo' | 'integrado';

export function DistrictPanel({ district, open, onClose, state, sessionCount, tools, sessions, clienteId, isManuallyIntegrated, onStateChanged }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [targetState, setTargetState] = useState<TargetState>('ativo');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  // Extra data loaded for enriched panel
  const [archetypes, setArchetypes] = useState<any[]>([]);
  const [gates, setGates] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  // Load extra data when panel opens
  useEffect(() => {
    if (open && district && clienteId) {
      loadExtraData();
    }
  }, [open, district?.id, clienteId]);

  const loadExtraData = async () => {
    if (!district || !clienteId) return;

    // Load archetypes activated in this district's sessions
    const sessionIds = sessions.map(s => s.id);
    if (sessionIds.length > 0) {
      const { data: archs } = await (supabase as any)
        .from('session_archetypes')
        .select('archetype_id, atlas_arquetipos_femininos!session_archetypes_archetype_id_fkey(nome, chave, cor_acento)')
        .eq('client_id', clienteId)
        .in('session_id', sessionIds);
      setArchetypes(archs || []);
    } else {
      setArchetypes([]);
    }

    // Load gates from cidadela map
    const { data: mapData } = await (supabase as any)
      .from('client_cidadela_map')
      .select('portas_cruzadas')
      .eq('client_id', clienteId)
      .maybeSingle();
    setGates((mapData as any)?.portas_cruzadas || []);

    // Load district notes from journey_districts
    const { data: journeys } = await (supabase as any)
      .from('journeys').select('id').eq('client_id', clienteId).limit(1);
    if (journeys?.length) {
      const { data: jd } = await (supabase as any)
        .from('journey_districts')
        .select('notes')
        .eq('journey_id', journeys[0].id)
        .eq('district_id', district.id)
        .maybeSingle();
      setNotes((jd as any)?.notes || '');
      setNotesLoaded(true);
    }
  };

  if (!district) return null;

  const badge = STATE_BADGES[state] || STATE_BADGES.inativo;
  const recentSessions = sessions.slice(-8).reverse();

  // Deduplicate archetypes
  const uniqueArchetypes = archetypes.reduce((acc: any[], curr: any) => {
    const arch = (curr as any).atlas_arquetipos_femininos;
    if (arch && !acc.find(a => a.chave === arch.chave)) {
      acc.push(arch);
    }
    return acc;
  }, []);

  const openChangeModal = (newState: TargetState) => {
    setTargetState(newState);
    setReason('');
    setChangeModalOpen(true);
  };

  const handleStateChange = async () => {
    if (!reason.trim()) {
      toast.error('Justificativa é obrigatória.');
      return;
    }
    setSaving(true);
    try {
      await (supabase as any).from('district_state_changes').insert({
        client_id: clienteId,
        district_id: district.id,
        changed_by_user_id: user?.id || '',
        from_state: state,
        to_state: targetState,
        reason: reason.trim(),
      });

      const { data: journeys } = await (supabase as any)
        .from('journeys').select('id').eq('client_id', clienteId).limit(1);

      if (journeys?.length) {
        await (supabase as any)
          .from('journey_districts')
          .update({ state: targetState })
          .eq('journey_id', journeys[0].id)
          .eq('district_id', district.id);
      }

      toast.success(`Distrito atualizado para ${targetState}.`);
      setChangeModalOpen(false);
      onStateChanged?.();
    } catch (err) {
      toast.error('Erro ao atualizar estado.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const { data: journeys } = await (supabase as any)
        .from('journeys').select('id').eq('client_id', clienteId).limit(1);
      if (journeys?.length) {
        await (supabase as any)
          .from('journey_districts')
          .update({ notes: notes || null })
          .eq('journey_id', journeys[0].id)
          .eq('district_id', district.id);
        toast.success('Anotações salvas.');
      }
    } catch {
      toast.error('Erro ao salvar anotações.');
    } finally {
      setSavingNotes(false);
    }
  };

  const stateActions = () => {
    const actions: { label: string; target: TargetState; show: boolean }[] = [
      { label: 'Ativar Distrito', target: 'ativo', show: state === 'inativo' },
      { label: 'Integrar Distrito', target: 'integrado', show: state === 'ativo' },
      { label: 'Reabrir (voltar para ATIVO)', target: 'ativo', show: state === 'integrado' },
    ];
    return actions.filter(a => a.show);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent
          side="right"
          className="bg-[#0B1B2B] border-l border-[#C9A24A]/15 w-full sm:max-w-lg p-0"
        >
          <ScrollArea className="h-full">
            <div className="p-5 space-y-5">
              {/* Header */}
              <SheetHeader className="pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A24A]/10 border border-[#C9A24A]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#C9A24A]" />
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="text-[#F5F1E8] text-lg">{district.nome}</SheetTitle>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className={`text-[9px] ${badge.cls}`}>{badge.label}</Badge>
                      <span className="text-[10px] text-[#F5F1E8]/30">Distrito {district.numero}</span>
                      {isManuallyIntegrated && state === 'integrado' && (
                        <span className="text-[9px] text-[#556B57] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Manual
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SheetHeader>

              {/* Section 1: Visão Geral */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2 font-semibold">
                  Visão Geral
                </h4>
                <p className="text-sm text-[#F5F1E8]/50 leading-relaxed">{district.descricao}</p>
              </div>

              <Separator className="bg-[#C9A24A]/10" />

              {/* Estado do Distrito */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2 font-semibold">
                  <Info className="w-3 h-3" /> Estado
                </h4>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className={badge.cls}>{badge.label}</Badge>
                  <span className="text-xs text-[#F5F1E8]/40">{sessionCount} sessão(ões)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stateActions().map((action, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="border-[#C9A24A]/15 text-[#F5F1E8]/60 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-8"
                      onClick={() => openChangeModal(action.target)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#C9A24A]/10" />

              {/* Section 2: Recursos Associados */}
              {/* Tools */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2 font-semibold">
                  <Wrench className="w-3 h-3" /> Ferramentas Relacionadas
                </h4>
                {tools.length === 0 ? (
                  <p className="text-xs text-[#F5F1E8]/25 py-1">Nenhuma ferramenta associada</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {tools.map(t => (
                      <Button
                        key={t.id}
                        variant="outline"
                        size="sm"
                        className="justify-start border-[#C9A24A]/10 text-[#F5F1E8]/60 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-9"
                        onClick={() => { onClose(); navigate(t.rota); }}
                      >
                        {t.nome}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Archetypes */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2 font-semibold">
                  <Brain className="w-3 h-3" /> Arquétipos Ativos
                </h4>
                {uniqueArchetypes.length === 0 ? (
                  <p className="text-xs text-[#F5F1E8]/25 py-1">Nenhum arquétipo emergente neste distrito</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueArchetypes.map((arch: any) => (
                      <Badge
                        key={arch.chave}
                        variant="outline"
                        className="text-[10px] py-0.5"
                        style={{ borderColor: `${arch.cor_acento || '#C9A24A'}40`, color: arch.cor_acento || '#C9A24A' }}
                      >
                        {arch.nome}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Gates */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2 font-semibold">
                  <Key className="w-3 h-3" /> Portas Relacionadas
                </h4>
                {gates.length === 0 ? (
                  <p className="text-xs text-[#F5F1E8]/25 py-1">Nenhuma porta registrada</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {gates.slice(0, 8).map((gate: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px] border-[#6366F1]/20 text-[#6366F1]/70 py-0.5">
                        {gate}
                      </Badge>
                    ))}
                    {gates.length > 8 && (
                      <span className="text-[9px] text-[#F5F1E8]/20">+{gates.length - 8} mais</span>
                    )}
                  </div>
                )}
              </div>

              <Separator className="bg-[#C9A24A]/10" />

              {/* Section 3: Histórico e Notas */}
              {/* Session history */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2 font-semibold">
                  <Calendar className="w-3 h-3" /> Histórico no Território ({sessionCount})
                </h4>
                {recentSessions.length === 0 ? (
                  <p className="text-xs text-[#F5F1E8]/25 py-2">Nenhuma sessão neste distrito</p>
                ) : (
                  <div className="space-y-2">
                    {recentSessions.map(s => (
                      <div key={s.id} className="py-2 px-3 rounded-lg bg-[#F5F1E8]/[0.03] border border-[#C9A24A]/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[#F5F1E8]/50">
                            {new Date(s.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          {s.checkin_state && (
                            <Badge variant="outline" className={`text-[8px] ${
                              s.checkin_state === 'presente' ? 'border-[#556B57]/30 text-[#556B57]'
                              : s.checkin_state === 'contraida' ? 'border-red-400/30 text-red-400'
                              : 'border-yellow-400/30 text-yellow-400'
                            }`}>
                              {s.checkin_state}
                            </Badge>
                          )}
                        </div>
                        {s.insight && (
                          <div className="flex items-start gap-1.5 mt-1">
                            <MessageCircle className="w-2.5 h-2.5 text-[#F5F1E8]/20 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-[#F5F1E8]/40 italic leading-relaxed line-clamp-2">{s.insight}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="bg-[#C9A24A]/10" />

              {/* Facilitator Notes */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2 font-semibold">
                  <Sparkles className="w-3 h-3" /> Notas da Facilitadora
                </h4>
                {notesLoaded && (
                  <>
                    <Textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Anotações sobre este território para esta cliente..."
                      className="bg-[#0B1B2B] border-[#C9A24A]/15 text-[#F5F1E8] placeholder:text-[#F5F1E8]/20 min-h-[80px] text-sm"
                    />
                    <Button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      variant="outline"
                      size="sm"
                      className="mt-2 border-[#C9A24A]/20 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
                    >
                      {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Salvar Notas
                    </Button>
                  </>
                )}
              </div>

              {/* CTA */}
              <Button
                className="w-full mt-3 bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] font-medium"
                onClick={() => {
                  onClose();
                  navigate(`/casa-das-maquinas/sessoes?clienteId=${clienteId}&districtId=${district.id}`);
                }}
              >
                Iniciar Sessão neste Distrito
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Justification Modal */}
      <Dialog open={changeModalOpen} onOpenChange={setChangeModalOpen}>
        <DialogContent className="bg-[#0B1B2B] border-[#C9A24A]/15 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F5F1E8]">Alterar Estado do Distrito</DialogTitle>
            <DialogDescription className="text-[#F5F1E8]/40">
              {district.nome}: {state} → {targetState}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-xs text-[#F5F1E8]/60">Justificativa (obrigatório)</label>
            <Textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Descreva o motivo da alteração..."
              className="bg-[#0B1B2B] border-[#C9A24A]/15 text-[#F5F1E8] placeholder:text-[#F5F1E8]/20 min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeModalOpen(false)} className="border-[#C9A24A]/15 text-[#F5F1E8]/60">
              Cancelar
            </Button>
            <Button
              onClick={handleStateChange}
              disabled={saving || !reason.trim()}
              className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]"
            >
              {saving ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
