import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowRight, ArrowLeft, Save, History, Eye, Users, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PersonaContexto {
  contexto: string;
  como_apresento: string;
  o_que_escondo: string;
  o_que_exagero: string;
  quem_nao_posso_ser: string;
}

interface Inventario {
  id: string;
  cliente_id: string;
  therapist_id: string;
  contextos_personas: PersonaContexto[];
  analise_discrepancia: string | null;
  custo_energetico: string | null;
  sombra_revelada: string | null;
  pergunta_incomoda_resposta: string | null;
  created_at: string;
}

type View = 'overview' | 'contextos' | 'analise' | 'historico';

const DEFAULT_CONTEXTOS: PersonaContexto[] = [
  { contexto: 'Trabalho', como_apresento: '', o_que_escondo: '', o_que_exagero: '', quem_nao_posso_ser: '' },
  { contexto: 'Família', como_apresento: '', o_que_escondo: '', o_que_exagero: '', quem_nao_posso_ser: '' },
  { contexto: 'Relacionamento', como_apresento: '', o_que_escondo: '', o_que_exagero: '', quem_nao_posso_ser: '' },
  { contexto: 'Amizades', como_apresento: '', o_que_escondo: '', o_que_exagero: '', quem_nao_posso_ser: '' },
  { contexto: 'Redes Sociais', como_apresento: '', o_que_escondo: '', o_que_exagero: '', quem_nao_posso_ser: '' },
  { contexto: 'Sozinha', como_apresento: '', o_que_escondo: '', o_que_exagero: '', quem_nao_posso_ser: '' },
];

export default function InventarioPersonasPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');
  const [contextos, setContextos] = useState<PersonaContexto[]>(DEFAULT_CONTEXTOS);
  const [analise, setAnalise] = useState({ discrepancia: '', custo: '', sombra: '', pergunta: '' });
  const [historico, setHistorico] = useState<Inventario[]>([]);
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
    const { data } = await supabase
      .from('inventario_personas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    if (data) setHistorico(data as unknown as Inventario[]);
  };

  useEffect(() => { loadHistorico(); }, [clienteId]);

  const addContexto = () => {
    setContextos(prev => [...prev, { contexto: '', como_apresento: '', o_que_escondo: '', o_que_exagero: '', quem_nao_posso_ser: '' }]);
  };

  const removeContexto = (idx: number) => {
    if (contextos.length <= 1) return;
    setContextos(prev => prev.filter((_, i) => i !== idx));
  };

  const updateContexto = (idx: number, field: keyof PersonaContexto, value: string) => {
    setContextos(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const salvarAnalise = async () => {
    if (!clienteId || !user) return;
    setLoading(true);
    const { error } = await (supabase.from('inventario_personas' as any).insert({
      cliente_id: clienteId,
      therapist_id: user.id,
      contextos_personas: contextos,
      analise_discrepancia: analise.discrepancia || null,
      custo_energetico: analise.custo || null,
      sombra_revelada: analise.sombra || null,
      pergunta_incomoda_resposta: analise.pergunta || null,
    }) as any);
    setLoading(false);
    if (error) { toast.error('Erro ao salvar inventário'); return; }
    toast.success('Inventário salvo com sucesso');
    setContextos(DEFAULT_CONTEXTOS);
    setAnalise({ discrepancia: '', custo: '', sombra: '', pergunta: '' });
    await loadHistorico();
    setView('overview');
  };

  // ── Overview ──
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="Inventário de Personas" subtitle={clienteNome || 'Ferramenta Clínica'}>
        <div className="max-w-2xl mx-auto space-y-6 mt-8">
          <Card className="border-[hsl(var(--primary))]/10 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Inventário de Personas</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                O Inventário de Personas mapeia as diferentes versões de si que a cliente apresenta em cada contexto da vida.
                Revela discrepâncias, custos energéticos e sombras escondidas entre as personas sociais.
                É uma ferramenta de consciência relacional e integração psíquica.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setView('contextos')} variant="gold" className="gap-2">
                <Sparkles className="w-4 h-4" /> Iniciar Inventário
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

  // ── Contextos & Personas ──
  if (view === 'contextos') {
    return (
      <CasaMaquinasLayout title="Contextos e Personas" subtitle={clienteNome}>
        <div className="space-y-4 max-w-6xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="gap-1 text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-3 text-left text-muted-foreground font-medium w-36">Contexto</th>
                  <th className="p-3 text-left text-muted-foreground font-medium">Como me apresento?</th>
                  <th className="p-3 text-left text-muted-foreground font-medium">O que escondo?</th>
                  <th className="p-3 text-left text-muted-foreground font-medium">O que exagero?</th>
                  <th className="p-3 text-left text-muted-foreground font-medium">Quem não posso ser?</th>
                  <th className="p-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {contextos.map((c, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="p-2">
                      <Input value={c.contexto} onChange={e => updateContexto(idx, 'contexto', e.target.value)} placeholder="Ex: Trabalho" className="bg-background" />
                    </td>
                    <td className="p-2">
                      <Textarea value={c.como_apresento} onChange={e => updateContexto(idx, 'como_apresento', e.target.value)} rows={2} className="bg-background min-h-[60px]" />
                    </td>
                    <td className="p-2">
                      <Textarea value={c.o_que_escondo} onChange={e => updateContexto(idx, 'o_que_escondo', e.target.value)} rows={2} className="bg-background min-h-[60px]" />
                    </td>
                    <td className="p-2">
                      <Textarea value={c.o_que_exagero} onChange={e => updateContexto(idx, 'o_que_exagero', e.target.value)} rows={2} className="bg-background min-h-[60px]" />
                    </td>
                    <td className="p-2">
                      <Textarea value={c.quem_nao_posso_ser} onChange={e => updateContexto(idx, 'quem_nao_posso_ser', e.target.value)} rows={2} className="bg-background min-h-[60px]" />
                    </td>
                    <td className="p-2">
                      <Button variant="ghost" size="icon" onClick={() => removeContexto(idx)} disabled={contextos.length <= 1} className="text-destructive/60 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={addContexto} className="gap-1">
              <Plus className="w-4 h-4" /> Adicionar Contexto
            </Button>
            <Button variant="gold" onClick={() => setView('analise')} className="gap-1">
              Analisar Inventário <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // ── Análise & Insights ──
  if (view === 'analise') {
    return (
      <CasaMaquinasLayout title="Análise e Insights" subtitle={clienteNome}>
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" size="sm" onClick={() => setView('contextos')} className="gap-1 text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar aos Contextos
          </Button>

          {/* Summary of contexts */}
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="text-base text-foreground">Resumo dos Contextos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {contextos.filter(c => c.contexto.trim()).map((c, i) => (
                <div key={i} className="p-3 rounded-md bg-muted/30 border border-border">
                  <p className="font-medium text-foreground text-sm">{c.contexto}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{c.como_apresento || '—'}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {[
            { key: 'discrepancia' as const, label: 'Análise de Discrepância', hint: 'Onde há mais diferença entre as personas? O que isso revela?' },
            { key: 'custo' as const, label: 'Custo Energético', hint: 'Qual persona exige mais energia para ser mantida?' },
            { key: 'sombra' as const, label: 'Sombra Revelada', hint: 'O que "não poder ser" em certos contextos revela sobre a sombra?' },
            { key: 'pergunta' as const, label: 'Pergunta Incômoda', hint: 'Se todas as personas estivessem na mesma sala, o que aconteceria?' },
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
    <CasaMaquinasLayout title="Histórico de Inventários" subtitle={clienteNome}>
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="gap-1 text-muted-foreground mb-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        {historico.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhum inventário registrado ainda.
            </CardContent>
          </Card>
        ) : (
          historico.map(inv => {
            const expanded = expandedId === inv.id;
            const ctxs = (inv.contextos_personas || []) as PersonaContexto[];
            return (
              <Card key={inv.id} className="border-border bg-card cursor-pointer" onClick={() => setExpandedId(expanded ? null : inv.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-foreground">
                      {format(new Date(inv.created_at), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                    </CardTitle>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-muted-foreground text-xs">
                    {ctxs.length} contexto(s) registrado(s)
                  </CardDescription>
                </CardHeader>
                {expanded && (
                  <CardContent className="space-y-4 text-sm">
                    <div className="overflow-x-auto rounded border border-border">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/40">
                            <th className="p-2 text-left text-muted-foreground">Contexto</th>
                            <th className="p-2 text-left text-muted-foreground">Apresento</th>
                            <th className="p-2 text-left text-muted-foreground">Escondo</th>
                            <th className="p-2 text-left text-muted-foreground">Exagero</th>
                            <th className="p-2 text-left text-muted-foreground">Não posso ser</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ctxs.map((c, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="p-2 font-medium text-foreground">{c.contexto}</td>
                              <td className="p-2 text-muted-foreground">{c.como_apresento || '—'}</td>
                              <td className="p-2 text-muted-foreground">{c.o_que_escondo || '—'}</td>
                              <td className="p-2 text-muted-foreground">{c.o_que_exagero || '—'}</td>
                              <td className="p-2 text-muted-foreground">{c.quem_nao_posso_ser || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {inv.analise_discrepancia && (
                      <div><p className="font-medium text-foreground">Discrepância</p><p className="text-muted-foreground">{inv.analise_discrepancia}</p></div>
                    )}
                    {inv.custo_energetico && (
                      <div><p className="font-medium text-foreground">Custo Energético</p><p className="text-muted-foreground">{inv.custo_energetico}</p></div>
                    )}
                    {inv.sombra_revelada && (
                      <div><p className="font-medium text-foreground">Sombra Revelada</p><p className="text-muted-foreground">{inv.sombra_revelada}</p></div>
                    )}
                    {inv.pergunta_incomoda_resposta && (
                      <div><p className="font-medium text-foreground">Pergunta Incômoda</p><p className="text-muted-foreground">{inv.pergunta_incomoda_resposta}</p></div>
                    )}
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
