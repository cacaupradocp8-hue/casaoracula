
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { EspelhoState, INITIAL_STATE, Relacionamento } from './constants';
import { TelaAbertura } from './TelaAbertura';
import { TelaIdentificacao } from './TelaIdentificacao';
import { TelaEspelhoLuz } from './TelaEspelhoLuz';
import { TelaEspelhoSombra } from './TelaEspelhoSombra';
import { TelaProjecoes } from './TelaProjecoes';
import { TelaPadroes } from './TelaPadroes';
import { TelaSintese } from './TelaSintese';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  clienteId: string;
}

const STEPS = ['abertura', 'identificacao', 'luz', 'sombra', 'projecoes', 'padroes', 'sintese'] as const;

export function RelacionamentosEspelho({ clienteId }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'list' | 'wizard'>('list');
  const [step, setStep] = useState(0);
  const [state, setState] = useState<EspelhoState>(INITIAL_STATE);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadHistory(); }, [clienteId]);

  const loadHistory = async () => {
    setLoading(true);
    const { data } = await (supabase.from('relacionamentos_espelho' as any) as any)
      .select('*')
      .eq('client_id', clienteId)
      .order('created_at', { ascending: false });
    setHistory(data || []);
    setLoading(false);
  };

  const startNew = () => {
    setState(INITIAL_STATE);
    setStep(0);
    setMode('wizard');
  };

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const updateRelacionamento = (index: number, field: keyof Relacionamento, value: string) => {
    setState(s => {
      const updated = [...s.relacionamentos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...s, relacionamentos: updated };
    });
  };

  const addRelacionamento = () => {
    if (state.relacionamentos.length >= 7) return;
    setState(s => ({
      ...s,
      relacionamentos: [...s.relacionamentos, { nome: '', tipo: '', qualidade: '', admiracao: '', irritacao: '', projecao: '' }],
    }));
  };

  const removeRelacionamento = (index: number) => {
    setState(s => ({ ...s, relacionamentos: s.relacionamentos.filter((_, i) => i !== index) }));
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const admiradas: Record<string, string> = {};
    const irritantes: Record<string, string> = {};
    const projecoes: Record<string, string> = {};
    state.relacionamentos.forEach(r => {
      admiradas[r.nome] = r.admiracao;
      irritantes[r.nome] = r.irritacao;
      projecoes[r.nome] = r.projecao;
    });

    const { error } = await (supabase.from('relacionamentos_espelho' as any) as any).insert({
      client_id: clienteId,
      therapist_id: user.id,
      relacionamentos_json: state.relacionamentos,
      qualidades_admiradas: admiradas,
      qualidades_irritantes: irritantes,
      projecoes_json: projecoes,
      padroes_recorrentes: state.padroes,
      padrao_central: state.padraoCentral,
      reflexao_final: state.reflexaoFinal,
    });

    setSaving(false);
    if (error) { toast.error('Erro ao salvar'); return; }
    toast.success('Mapeamento salvo');
    setMode('list');
    loadHistory();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (mode === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Relacionamentos como Espelho</h3>
          <Button variant="gold" size="sm" onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Novo Mapeamento</Button>
        </div>
        {history.length === 0 ? (
          <Card className="border-border/30 bg-card/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum mapeamento realizado ainda.</p>
              <Button variant="gold" onClick={startNew}>Iniciar Primeiro Mapeamento</Button>
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
                  {(h.relacionamentos_json as any[])?.length || 0} relacionamentos mapeados
                  {h.padrao_central && ` · Padrão: ${h.padrao_central}`}
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
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>
      )}

      {currentStep === 'abertura' && <TelaAbertura onStart={next} />}
      {currentStep === 'identificacao' && (
        <TelaIdentificacao
          relacionamentos={state.relacionamentos}
          onUpdate={updateRelacionamento}
          onAdd={addRelacionamento}
          onRemove={removeRelacionamento}
        />
      )}
      {currentStep === 'luz' && (
        <TelaEspelhoLuz relacionamentos={state.relacionamentos} onUpdate={updateRelacionamento} />
      )}
      {currentStep === 'sombra' && (
        <TelaEspelhoSombra relacionamentos={state.relacionamentos} onUpdate={updateRelacionamento} />
      )}
      {currentStep === 'projecoes' && (
        <TelaProjecoes relacionamentos={state.relacionamentos} onUpdate={updateRelacionamento} />
      )}
      {currentStep === 'padroes' && (
        <TelaPadroes state={state} onChange={(field, value) => setState(s => ({ ...s, [field]: value }))} />
      )}
      {currentStep === 'sintese' && <TelaSintese state={state} />}

      {step > 0 && (
        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={prev}><ChevronLeft className="h-4 w-4 mr-1" /> Anterior</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="gold" size="sm" onClick={next} disabled={currentStep === 'identificacao' && state.relacionamentos.length === 0}>
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="gold" size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Salvar Mapeamento
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
