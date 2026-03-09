import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { RitualState, INITIAL_STATE, Aprendizado, ElementoRitual, EMPTY_APRENDIZADO, EMPTY_ELEMENTO } from './constants';
import { TelaAbertura } from './TelaAbertura';
import { TelaAprendizados } from './TelaAprendizados';
import { TelaTransicao } from './TelaTransicao';
import { TelaConstrucao } from './TelaConstrucao';
import { TelaSintese } from './TelaSintese';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props { clienteId: string; }

const STEPS = ['abertura', 'aprendizados', 'transicao', 'construcao', 'reflexao', 'sintese'] as const;

export function RitualIntegracao({ clienteId }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'list' | 'wizard'>('list');
  const [step, setStep] = useState(0);
  const [state, setState] = useState<RitualState>(INITIAL_STATE);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadHistory(); }, [clienteId]);

  const loadHistory = async () => {
    setLoading(true);
    const { data } = await (supabase.from('rituais_integracao' as any) as any)
      .select('*').eq('client_id', clienteId).order('created_at', { ascending: false });
    setHistory(data || []);
    setLoading(false);
  };

  const startNew = () => { setState(INITIAL_STATE); setStep(0); setMode('wizard'); };
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const updateAprendizado = (index: number, field: keyof Aprendizado, value: any) => {
    setState(s => {
      const updated = [...s.aprendizados];
      updated[index] = { ...updated[index], [field]: value };
      return { ...s, aprendizados: updated };
    });
  };
  const addAprendizado = () => { if (state.aprendizados.length < 10) setState(s => ({ ...s, aprendizados: [...s.aprendizados, { ...EMPTY_APRENDIZADO }] })); };
  const removeAprendizado = (i: number) => setState(s => ({ ...s, aprendizados: s.aprendizados.filter((_, idx) => idx !== i) }));

  const updateElemento = (index: number, field: keyof ElementoRitual, value: string) => {
    setState(s => {
      const updated = [...s.elementos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...s, elementos: updated };
    });
  };
  const addElemento = () => setState(s => ({ ...s, elementos: [...s.elementos, { ...EMPTY_ELEMENTO }] }));
  const removeElemento = (i: number) => setState(s => ({ ...s, elementos: s.elementos.filter((_, idx) => idx !== i) }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await (supabase.from('rituais_integracao' as any) as any).insert({
      client_id: clienteId,
      therapist_id: user.id,
      aprendizados_json: state.aprendizados,
      o_que_deixo: state.oQueDeixo || null,
      o_que_levo: state.oQueLevo || null,
      simbolo_transicao: state.simboloTransicao || null,
      elementos_ritual: state.elementos,
      intencao: state.intencao || null,
      compromisso: state.compromisso || null,
      data_ritual: state.dataRitual || null,
      reflexao_final: state.reflexaoFinal || null,
    });
    setSaving(false);
    if (error) { toast.error('Erro ao salvar'); return; }
    toast.success('Ritual salvo');
    setMode('list');
    loadHistory();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (mode === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Ritual de Integração</h3>
          <Button variant="gold" size="sm" onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Novo Ritual</Button>
        </div>
        {history.length === 0 ? (
          <Card className="border-border/30 bg-card/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum ritual criado ainda.</p>
              <Button variant="gold" onClick={startNew}>Criar Primeiro Ritual</Button>
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
                  {(h.aprendizados_json as any[])?.length || 0} aprendizados
                  {h.simbolo_transicao && ` · Símbolo: ${h.simbolo_transicao}`}
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
      {currentStep === 'aprendizados' && <TelaAprendizados aprendizados={state.aprendizados} onUpdate={updateAprendizado} onAdd={addAprendizado} onRemove={removeAprendizado} />}
      {currentStep === 'transicao' && <TelaTransicao state={state} onChange={(field, value) => setState(s => ({ ...s, [field]: value }))} />}
      {currentStep === 'construcao' && (
        <TelaConstrucao state={state} onChange={(field, value) => setState(s => ({ ...s, [field]: value }))}
          onAddElemento={addElemento} onRemoveElemento={removeElemento} onUpdateElemento={updateElemento} />
      )}
      {currentStep === 'reflexao' && (
        <Card className="border-border/30 bg-card/80">
          <CardHeader><CardTitle className="text-lg">Reflexão Final</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="O que este ritual significa para você neste momento da jornada?" value={state.reflexaoFinal}
              onChange={e => setState(s => ({ ...s, reflexaoFinal: e.target.value }))} className="min-h-[120px]" />
          </CardContent>
        </Card>
      )}
      {currentStep === 'sintese' && <TelaSintese state={state} />}

      {step > 0 && (
        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={prev}><ChevronLeft className="h-4 w-4 mr-1" /> Anterior</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="gold" size="sm" onClick={next}>Próximo <ChevronRight className="h-4 w-4 ml-1" /></Button>
          ) : (
            <Button variant="gold" size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Salvar Ritual
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
