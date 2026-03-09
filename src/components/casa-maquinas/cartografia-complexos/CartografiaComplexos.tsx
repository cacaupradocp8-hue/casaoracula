import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { ComplexosState, INITIAL_STATE, Complexo, EMPTY_COMPLEXO } from './constants';
import { TelaAbertura } from './TelaAbertura';
import { TelaRegistro } from './TelaRegistro';
import { TelaOrigem } from './TelaOrigem';
import { TelaPadroes } from './TelaPadroes';
import { TelaSintese } from './TelaSintese';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props { clienteId: string; }

const STEPS = ['abertura', 'registro', 'origem', 'padroes', 'sintese'] as const;

export function CartografiaComplexos({ clienteId }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'list' | 'wizard'>('list');
  const [step, setStep] = useState(0);
  const [state, setState] = useState<ComplexosState>(INITIAL_STATE);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadHistory(); }, [clienteId]);

  const loadHistory = async () => {
    setLoading(true);
    const { data } = await (supabase.from('cartografia_complexos' as any) as any)
      .select('*').eq('client_id', clienteId).order('created_at', { ascending: false });
    setHistory(data || []);
    setLoading(false);
  };

  const startNew = () => { setState(INITIAL_STATE); setStep(0); setMode('wizard'); };
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const updateComplexo = (index: number, field: keyof Complexo, value: any) => {
    setState(s => {
      const updated = [...s.complexos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...s, complexos: updated };
    });
  };

  const addComplexo = () => {
    if (state.complexos.length >= 8) return;
    setState(s => ({ ...s, complexos: [...s.complexos, { ...EMPTY_COMPLEXO }] }));
  };

  const removeComplexo = (index: number) => {
    setState(s => ({ ...s, complexos: s.complexos.filter((_, i) => i !== index) }));
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const sorted = [...state.complexos].sort((a, b) => b.intensidade - a.intensidade);
    const { error } = await (supabase.from('cartografia_complexos' as any) as any).insert({
      client_id: clienteId,
      therapist_id: user.id,
      complexos_json: state.complexos,
      gatilhos_gerais: state.gatilhosGerais || null,
      padrao_central: state.padraoCentral || null,
      complexo_dominante: sorted[0]?.nome || null,
      complexo_latente: sorted.length > 1 ? sorted[sorted.length - 1]?.nome : null,
      reflexao_origem: state.reflexaoOrigem || null,
      reflexao_final: state.reflexaoFinal || null,
    });
    setSaving(false);
    if (error) { toast.error('Erro ao salvar'); return; }
    toast.success('Cartografia salva');
    setMode('list');
    loadHistory();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (mode === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Cartografia de Complexos</h3>
          <Button variant="gold" size="sm" onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Nova Cartografia</Button>
        </div>
        {history.length === 0 ? (
          <Card className="border-border/30 bg-card/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhuma cartografia realizada ainda.</p>
              <Button variant="gold" onClick={startNew}>Iniciar Primeira Cartografia</Button>
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
                  {(h.complexos_json as any[])?.length || 0} complexos mapeados
                  {h.complexo_dominante && ` · Dominante: ${h.complexo_dominante}`}
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
      {currentStep === 'registro' && <TelaRegistro complexos={state.complexos} onUpdate={updateComplexo} onAdd={addComplexo} onRemove={removeComplexo} />}
      {currentStep === 'origem' && <TelaOrigem complexos={state.complexos} onUpdate={updateComplexo} />}
      {currentStep === 'padroes' && <TelaPadroes state={state} onChange={(field, value) => setState(s => ({ ...s, [field]: value }))} />}
      {currentStep === 'sintese' && <TelaSintese state={state} />}

      {step > 0 && (
        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={prev}><ChevronLeft className="h-4 w-4 mr-1" /> Anterior</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="gold" size="sm" onClick={next} disabled={currentStep === 'registro' && state.complexos.length === 0}>
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="gold" size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Salvar Cartografia
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
