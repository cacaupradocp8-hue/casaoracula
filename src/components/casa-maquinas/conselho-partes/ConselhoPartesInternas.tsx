import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { ConselhoState, INITIAL_STATE, ParteInterna, Dialogo, EMPTY_PARTE, CORES_PARTE } from './constants';
import { TelaAbertura } from './TelaAbertura';
import { TelaIdentificacao } from './TelaIdentificacao';
import { TelaCaracterizacao } from './TelaCaracterizacao';
import { TelaDialogo } from './TelaDialogo';
import { TelaSabedoria } from './TelaSabedoria';
import { TelaSintese } from './TelaSintese';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props { clienteId: string; }

const STEPS = ['abertura', 'identificacao', 'caracterizacao', 'dialogo', 'sabedoria', 'sintese'] as const;

export function ConselhoPartesInternas({ clienteId }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'list' | 'wizard'>('list');
  const [step, setStep] = useState(0);
  const [state, setState] = useState<ConselhoState>(INITIAL_STATE);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadHistory(); }, [clienteId]);

  const loadHistory = async () => {
    setLoading(true);
    const { data } = await (supabase.from('conselho_partes_internas' as any) as any)
      .select('*').eq('client_id', clienteId).order('created_at', { ascending: false });
    setHistory(data || []);
    setLoading(false);
  };

  const startNew = () => { setState(INITIAL_STATE); setStep(0); setMode('wizard'); };
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const updateParte = (index: number, field: keyof ParteInterna, value: string) => {
    setState(s => {
      const updated = [...s.partes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...s, partes: updated };
    });
  };

  const addParte = () => {
    if (state.partes.length >= 8) return;
    const cor = CORES_PARTE[state.partes.length % CORES_PARTE.length];
    setState(s => ({ ...s, partes: [...s.partes, { ...EMPTY_PARTE, cor }] }));
  };

  const removeParte = (index: number) => {
    setState(s => ({ ...s, partes: s.partes.filter((_, i) => i !== index) }));
  };

  const addDialogo = () => {
    setState(s => ({ ...s, dialogos: [...s.dialogos, { deParte: '', paraParte: '', mensagem: '' }] }));
  };

  const removeDialogo = (index: number) => {
    setState(s => ({ ...s, dialogos: s.dialogos.filter((_, i) => i !== index) }));
  };

  const updateDialogo = (index: number, field: keyof Dialogo, value: string) => {
    setState(s => {
      const updated = [...s.dialogos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...s, dialogos: updated };
    });
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await (supabase.from('conselho_partes_internas' as any) as any).insert({
      client_id: clienteId,
      therapist_id: user.id,
      partes_json: state.partes,
      dialogos_json: state.dialogos,
      tema_conselho: state.temaConselho || null,
      sabedoria_integrada: state.sabedoriaIntegrada || null,
      decisao_conselho: state.decisaoConselho || null,
      reflexao_final: state.reflexaoFinal || null,
    });
    setSaving(false);
    if (error) { toast.error('Erro ao salvar'); return; }
    toast.success('Conselho salvo');
    setMode('list');
    loadHistory();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (mode === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Conselho das Partes Internas</h3>
          <Button variant="gold" size="sm" onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Novo Conselho</Button>
        </div>
        {history.length === 0 ? (
          <Card className="border-border/30 bg-card/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum conselho realizado ainda.</p>
              <Button variant="gold" onClick={startNew}>Convocar Primeiro Conselho</Button>
            </CardContent>
          </Card>
        ) : (
          history.map((h: any) => (
            <Card key={h.id} className="border-border/30 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  {format(new Date(h.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {(h.partes_json as any[])?.length || 0} partes convocadas
                  {h.tema_conselho && ` · Tema: ${h.tema_conselho}`}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  const currentStep = STEPS[step];

  return (
    <div className="space-y-4">
      {step > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Passo {step + 1} de {STEPS.length}</span>
          <div className="flex gap-1">
            {STEPS.map((_, i) => <div key={i} className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />)}
          </div>
        </div>
      )}

      {currentStep === 'abertura' && <TelaAbertura onStart={next} />}
      {currentStep === 'identificacao' && <TelaIdentificacao partes={state.partes} onUpdate={updateParte} onAdd={addParte} onRemove={removeParte} />}
      {currentStep === 'caracterizacao' && <TelaCaracterizacao partes={state.partes} onUpdate={updateParte} />}
      {currentStep === 'dialogo' && (
        <TelaDialogo
          partes={state.partes} dialogos={state.dialogos} temaConselho={state.temaConselho}
          onAddDialogo={addDialogo} onRemoveDialogo={removeDialogo} onUpdateDialogo={updateDialogo}
          onChangeTema={v => setState(s => ({ ...s, temaConselho: v }))}
        />
      )}
      {currentStep === 'sabedoria' && <TelaSabedoria state={state} onChange={(field, value) => setState(s => ({ ...s, [field]: value }))} />}
      {currentStep === 'sintese' && <TelaSintese state={state} />}

      {step > 0 && (
        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={prev}><ChevronLeft className="h-4 w-4 mr-1" /> Anterior</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="gold" size="sm" onClick={next} disabled={currentStep === 'identificacao' && state.partes.length === 0}>
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="gold" size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Salvar Conselho
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
