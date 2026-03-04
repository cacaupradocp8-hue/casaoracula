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

const CHECKIN_STATES = [
  { value: 'contraida', label: 'Contraída', color: '#EF4444' },
  { value: 'instavel', label: 'Instável', color: '#F59E0B' },
  { value: 'presente', label: 'Presente', color: '#556B57' },
];

export default function ModoSessaoPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (user) loadData();
  }, [user]);

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

  const filteredTools = selectedDistrict
    ? tools.filter(t => t.district_id === selectedDistrict)
    : tools;

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
      checkin_state: checkinState || null,
      checkin_notes: checkinNotes || null,
      gps_suggestion_json: gpsSuggestion ? JSON.parse(JSON.stringify(gpsSuggestion)) : null,
      insight: insight || null,
      task: task || null,
      notes: notes || null,
    } as any);

    if (error) {
      toast.error('Erro ao salvar sessão');
      setSaving(false);
      return;
    }

    // Update journey district state
    if (selectedDistrict) {
      const { data: journeys } = await supabase
        .from('journeys')
        .select('id')
        .eq('client_id', selectedClient)
        .limit(1);

      if (journeys && journeys.length > 0) {
        const journeyId = journeys[0].id;
        // Upsert journey_district
        const { data: existing } = await supabase
          .from('journey_districts')
          .select('id, sessions_count')
          .eq('journey_id', journeyId)
          .eq('district_id', selectedDistrict)
          .limit(1);

        if (existing && existing.length > 0) {
          await supabase.from('journey_districts').update({
            state: 'ativo',
            sessions_count: (existing[0].sessions_count || 0) + 1,
            last_session_at: new Date().toISOString(),
          }).eq('id', existing[0].id);
        } else {
          await supabase.from('journey_districts').insert({
            journey_id: journeyId,
            district_id: selectedDistrict,
            state: 'ativo',
            sessions_count: 1,
            last_session_at: new Date().toISOString(),
          });
        }

        // Update journey current district
        await supabase.from('journeys').update({
          current_district_id: selectedDistrict,
          updated_at: new Date().toISOString(),
        }).eq('id', journeyId);
      }
    }

    toast.success('Sessão registrada');
    navigate(`/casa-das-maquinas/clientes/${selectedClient}`);
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Modo Sessão">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
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
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => step > s.num && setStep(s.num)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-[#C9A24A] text-[#0B1B2B]'
                  : step > s.num
                  ? 'bg-[#556B57] text-[#F5F1E8]'
                  : 'bg-[#F5F1E8]/10 text-[#F5F1E8]/30'
              }`}
            >
              {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
            </button>
            <span className="text-[10px] text-[#F5F1E8]/40 hidden sm:block">{s.label}</span>
            {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-[#F5F1E8]/20" />}
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto">
        {/* Step 1: Check-in */}
        {step === 1 && (
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-sm text-[#F5F1E8]/80">Check-in Rápido</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Cliente</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Estado de presença</label>
                <div className="flex gap-2">
                  {CHECKIN_STATES.map(s => (
                    <Button
                      key={s.value}
                      variant={checkinState === s.value ? 'default' : 'outline'}
                      size="sm"
                      className={checkinState === s.value
                        ? 'bg-[#C9A24A]/20 text-[#C9A24A] border-[#C9A24A]/40'
                        : 'border-[#C9A24A]/10 text-[#F5F1E8]/50'}
                      onClick={() => setCheckinState(s.value)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Observações do check-in</label>
                <Textarea value={checkinNotes} onChange={e => setCheckinNotes(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="Campo livre..." />
              </div>
              <Button onClick={() => setStep(2)} disabled={!selectedClient} className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
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
                onApply={(s) => {
                  setGpsSuggestion(s);
                  // Try to auto-select matching district/tool from lists
                  const matchDist = districts.find(d => d.nome === s.distrito_sugerido);
                  if (matchDist) setSelectedDistrict(matchDist.id);
                  const matchTool = tools.find(t => t.nome === s.ferramenta_recomendada);
                  if (matchTool) setSelectedTool(matchTool.id);
                  toast.success('Sugestão aplicada');
                }}
              />
            )}
            <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
              <CardHeader><CardTitle className="text-sm text-[#F5F1E8]/80">Distrito & Ferramenta</CardTitle></CardHeader>
              <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Distrito</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]">
                    <SelectValue placeholder="Escolha o distrito..." />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.numero}. {d.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Ferramenta</label>
                <Select value={selectedTool} onValueChange={setSelectedTool}>
                  <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]">
                    <SelectValue placeholder="Escolha a ferramenta..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTools.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-[#C9A24A]/10 text-[#F5F1E8]/60">Voltar</Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">Avançar</Button>
              </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Execution placeholder */}
        {step === 3 && (
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-sm text-[#F5F1E8]/80">Execução</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <p className="text-sm text-[#F5F1E8]/50">
                  {selectedTool ? 'Execute a ferramenta selecionada com a cliente.' : 'Nenhuma ferramenta selecionada — conduza a sessão livremente.'}
                </p>
                {selectedTool && (() => {
                  const tool = tools.find(t => t.id === selectedTool);
                  return tool ? (
                    <Button
                      variant="outline"
                      className="mt-4 border-[#C9A24A]/20 text-[#C9A24A]"
                      onClick={() => navigate(tool.rota)}
                    >
                      Abrir {tool.nome}
                    </Button>
                  ) : null;
                })()}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-[#C9A24A]/10 text-[#F5F1E8]/60">Voltar</Button>
                <Button onClick={() => setStep(4)} className="flex-1 bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">Avançar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Final Register */}
        {step === 4 && (
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-sm text-[#F5F1E8]/80">Registro Final</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Insight principal</label>
                <Textarea value={insight} onChange={e => setInsight(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="O que emergiu nesta sessão?" />
              </div>
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Tarefa simbólica</label>
                <Textarea value={task} onChange={e => setTask(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="O que a cliente leva para casa?" />
              </div>
              <div>
                <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Notas</label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="Anotações privadas..." />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1 border-[#C9A24A]/10 text-[#F5F1E8]/60">Voltar</Button>
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
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
