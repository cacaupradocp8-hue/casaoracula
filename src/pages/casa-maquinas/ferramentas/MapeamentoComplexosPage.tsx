import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowRight, ArrowLeft, Save, History, Eye, Zap, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GatilhoRegistro {
  data: string;
  situacao: string;
  reacao: string;
  intensidade: number;
  discrepancia: boolean;
  familiar: boolean;
}

interface Mapeamento {
  id: string;
  cliente_id: string;
  therapist_id: string;
  registros_gatilhos: GatilhoRegistro[];
  padroes_identificados: string | null;
  personagem_ativado: string | null;
  nome_complexo: string | null;
  created_at: string;
}

type View = 'overview' | 'registro' | 'analise' | 'historico';

const emptyGatilho = (): GatilhoRegistro => ({
  data: new Date().toISOString().slice(0, 10),
  situacao: '',
  reacao: '',
  intensidade: 5,
  discrepancia: false,
  familiar: false,
});

export default function MapeamentoComplexosPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');
  const [gatilhos, setGatilhos] = useState<GatilhoRegistro[]>([emptyGatilho()]);
  const [analise, setAnalise] = useState({ padroes: '', personagem: '', nomeComplexo: '' });
  const [historico, setHistorico] = useState<Mapeamento[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clienteNome, setClienteNome] = useState('');

  useEffect(() => {
    if (clienteId) {
      supabase.from('clientes').select('nome').eq('id', clienteId).single()
        .then(({ data }) => { if (data) setClienteNome(data.nome); });
    }
  }, [clienteId]);

  const loadHistorico = async () => {
    if (!clienteId) return;
    const { data } = await (supabase
      .from('mapeamento_complexos' as any)
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false }) as any);
    if (data) setHistorico(data as Mapeamento[]);
  };

  useEffect(() => { loadHistorico(); }, [clienteId]);

  const addGatilho = () => setGatilhos(prev => [...prev, emptyGatilho()]);

  const removeGatilho = (idx: number) => {
    if (gatilhos.length <= 1) return;
    setGatilhos(prev => prev.filter((_, i) => i !== idx));
  };

  const updateGatilho = (idx: number, field: keyof GatilhoRegistro, value: any) => {
    setGatilhos(prev => prev.map((g, i) => i === idx ? { ...g, [field]: value } : g));
  };

  const salvarAnalise = async () => {
    if (!clienteId || !user) return;
    setLoading(true);
    const { error } = await (supabase.from('mapeamento_complexos' as any).insert({
      cliente_id: clienteId,
      therapist_id: user.id,
      registros_gatilhos: gatilhos,
      padroes_identificados: analise.padroes || null,
      personagem_ativado: analise.personagem || null,
      nome_complexo: analise.nomeComplexo || null,
    }) as any);
    setLoading(false);
    if (error) { toast.error('Erro ao salvar mapeamento'); return; }
    toast.success('Mapeamento salvo com sucesso');
    setGatilhos([emptyGatilho()]);
    setAnalise({ padroes: '', personagem: '', nomeComplexo: '' });
    await loadHistorico();
    setView('overview');
  };

  // ── Overview ──
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="Mapeamento de Complexos" subtitle={clienteNome || 'Ferramenta Clínica'}>
        <div className="max-w-2xl mx-auto space-y-6 mt-8">
          <Card className="border-primary/10 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Mapeamento de Complexos via Gatilhos</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Identifica padrões emocionais repetitivos a partir de situações-gatilho do cotidiano.
                Ao registrar reações desproporcionais e recorrentes, a cliente pode nomear o complexo
                que opera por trás dessas respostas automáticas — tornando visível o que era inconsciente.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setView('registro')} variant="gold" className="gap-2">
                <Zap className="w-4 h-4" /> Iniciar Registro de Gatilhos
              </Button>
              <Button onClick={() => { loadHistorico(); setView('historico'); }} variant="outline" className="gap-2">
                <History className="w-4 h-4" /> Ver Histórico ({historico.length})
              </Button>
            </CardContent>
          </Card>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // ── Registro de Gatilhos ──
  if (view === 'registro') {
    return (
      <CasaMaquinasLayout title="Registro de Gatilhos" subtitle={clienteNome}>
        <div className="space-y-4 max-w-6xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="gap-1 text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>

          <div className="space-y-4">
            {gatilhos.map((g, idx) => (
              <Card key={idx} className="border-border bg-card">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Gatilho #{idx + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeGatilho(idx)} disabled={gatilhos.length <= 1} className="text-destructive/60 hover:text-destructive h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Data</label>
                      <Input type="date" value={g.data} onChange={e => updateGatilho(idx, 'data', e.target.value)} className="bg-background" />
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Intensidade: {g.intensidade}/10</label>
                        <Slider value={[g.intensidade]} onValueChange={v => updateGatilho(idx, 'intensidade', v[0])} min={0} max={10} step={1} className="mt-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Situação — O que aconteceu objetivamente?</label>
                    <Textarea value={g.situacao} onChange={e => updateGatilho(idx, 'situacao', e.target.value)} rows={2} className="bg-background" />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Reação — O que senti? Pensei? Fiz ou quis fazer?</label>
                    <Textarea value={g.reacao} onChange={e => updateGatilho(idx, 'reacao', e.target.value)} rows={2} className="bg-background" />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <Checkbox checked={g.discrepancia} onCheckedChange={v => updateGatilho(idx, 'discrepancia', !!v)} />
                      Intensidade desproporcional à situação?
                    </label>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <Checkbox checked={g.familiar} onCheckedChange={v => updateGatilho(idx, 'familiar', !!v)} />
                      Reação já conhecida / recorrente?
                    </label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={addGatilho} className="gap-1">
              <Plus className="w-4 h-4" /> Adicionar Registro
            </Button>
            <Button variant="gold" onClick={() => setView('analise')} className="gap-1">
              Analisar Padrões <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // ── Análise de Padrões ──
  if (view === 'analise') {
    return (
      <CasaMaquinasLayout title="Análise de Padrões e Nomeação" subtitle={clienteNome}>
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" size="sm" onClick={() => setView('registro')} className="gap-1 text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar aos Registros
          </Button>

          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-base text-foreground">Resumo dos Gatilhos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {gatilhos.filter(g => g.situacao.trim()).map((g, i) => (
                <div key={i} className="p-3 rounded-md bg-muted/30 border border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{g.data} — Intensidade {g.intensidade}/10</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{g.situacao}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {g.discrepancia && <span className="px-2 py-0.5 rounded bg-destructive/10 text-destructive">Desproporcional</span>}
                    {g.familiar && <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">Recorrente</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {[
            { key: 'padroes' as const, label: 'Padrões Identificados', hint: 'Quais tipos de situação e temas se repetem nos gatilhos registrados?' },
            { key: 'personagem' as const, label: 'Personagem Ativado', hint: 'Quem "assume" quando o gatilho dispara? Que parte de você responde?' },
          ].map(s => (
            <Card key={s.key} className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base text-foreground">{s.label}</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">{s.hint}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={analise[s.key]}
                  onChange={e => setAnalise(prev => ({ ...prev, [s.key]: e.target.value }))}
                  rows={4}
                  className="bg-background"
                  placeholder="Registre aqui..."
                />
              </CardContent>
            </Card>
          ))}

          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Nome do Complexo</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Dê um nome simbólico ao complexo identificado (ex: "O complexo da menina invisível")
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={analise.nomeComplexo}
                onChange={e => setAnalise(prev => ({ ...prev, nomeComplexo: e.target.value }))}
                className="bg-background"
                placeholder="Ex: O complexo da menina invisível"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="gold" onClick={salvarAnalise} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" /> {loading ? 'Salvando...' : 'Salvar Análise'}
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // ── Histórico ──
  return (
    <CasaMaquinasLayout title="Histórico de Mapeamentos" subtitle={clienteNome}>
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="gap-1 text-muted-foreground mb-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        {historico.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhum mapeamento registrado ainda.
            </CardContent>
          </Card>
        ) : (
          historico.map(m => {
            const expanded = expandedId === m.id;
            const regs = (m.registros_gatilhos || []) as GatilhoRegistro[];
            return (
              <Card key={m.id} className="border-border bg-card cursor-pointer" onClick={() => setExpandedId(expanded ? null : m.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-foreground">
                      {m.nome_complexo || 'Sem nome'}
                    </CardTitle>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-muted-foreground text-xs">
                    {format(new Date(m.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} — {regs.length} gatilho(s)
                  </CardDescription>
                </CardHeader>
                {expanded && (
                  <CardContent className="space-y-4 text-sm">
                    {regs.map((g, i) => (
                      <div key={i} className="p-3 rounded-md bg-muted/30 border border-border space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground text-xs">{g.data} — Intensidade {g.intensidade}/10</span>
                          <div className="flex gap-1">
                            {g.discrepancia && <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[10px]">Desproporcional</span>}
                            {g.familiar && <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">Recorrente</span>}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground"><strong>Situação:</strong> {g.situacao}</p>
                        <p className="text-xs text-muted-foreground"><strong>Reação:</strong> {g.reacao}</p>
                      </div>
                    ))}
                    {m.padroes_identificados && <div><p className="font-medium text-foreground">Padrões</p><p className="text-muted-foreground">{m.padroes_identificados}</p></div>}
                    {m.personagem_ativado && <div><p className="font-medium text-foreground">Personagem</p><p className="text-muted-foreground">{m.personagem_ativado}</p></div>}
                    {m.nome_complexo && <div><p className="font-medium text-foreground">Complexo</p><p className="text-muted-foreground">{m.nome_complexo}</p></div>}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </CasaMaquinasLayout>
  );
}
