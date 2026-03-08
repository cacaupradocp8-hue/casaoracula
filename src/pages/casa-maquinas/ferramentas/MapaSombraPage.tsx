import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowRight, ArrowLeft, Save, History, Eye, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Irritacao {
  pessoa: string;
  o_que_irrita: string;
  intensidade: number;
  como_eu_tambem_tenho: string;
}

interface Admiracao {
  pessoa: string;
  o_que_admiro: string;
  qual_permissao_nao_me_dou: string;
}

interface MapaSombra {
  id: string;
  cliente_id: string;
  therapist_id: string;
  irritacoes: Irritacao[];
  admiracoes: Admiracao[];
  sintese_sombra_negativa: string | null;
  sintese_sombra_dourada: string | null;
  created_at: string;
}

type View = 'overview' | 'irritacao' | 'admiracao' | 'sintese' | 'historico';

const emptyIrritacao = (): Irritacao => ({ pessoa: '', o_que_irrita: '', intensidade: 5, como_eu_tambem_tenho: '' });
const emptyAdmiracao = (): Admiracao => ({ pessoa: '', o_que_admiro: '', qual_permissao_nao_me_dou: '' });

export default function MapaSombraPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');
  const [irritacoes, setIrritacoes] = useState<Irritacao[]>([emptyIrritacao()]);
  const [admiracoes, setAdmiracoes] = useState<Admiracao[]>([emptyAdmiracao()]);
  const [sintese, setSintese] = useState({ negativa: '', dourada: '' });
  const [historico, setHistorico] = useState<MapaSombra[]>([]);
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
      .from('mapa_sombra' as any)
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false }) as any);
    if (data) setHistorico(data as MapaSombra[]);
  };

  useEffect(() => { loadHistorico(); }, [clienteId]);

  const salvarAnalise = async () => {
    if (!clienteId || !user) return;
    setLoading(true);
    const { error } = await (supabase.from('mapa_sombra' as any).insert({
      cliente_id: clienteId,
      therapist_id: user.id,
      irritacoes: irritacoes,
      admiracoes: admiracoes,
      sintese_sombra_negativa: sintese.negativa || null,
      sintese_sombra_dourada: sintese.dourada || null,
    }) as any);
    setLoading(false);
    if (error) { toast.error('Erro ao salvar mapeamento'); return; }
    toast.success('Mapa da Sombra salvo com sucesso');
    setIrritacoes([emptyIrritacao()]);
    setAdmiracoes([emptyAdmiracao()]);
    setSintese({ negativa: '', dourada: '' });
    await loadHistorico();
    setView('overview');
  };

  // ── Overview ──
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="Mapa da Sombra Pessoal" subtitle={clienteNome || 'Ferramenta Clínica'}>
        <div className="max-w-2xl mx-auto space-y-6 mt-8">
          <Card className="border-primary/10 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Mapa da Sombra Pessoal</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                O Mapa da Sombra revela conteúdos psíquicos negados através de dois espelhos: a irritação
                (projeção negativa) e a admiração (sombra dourada). Ao reconhecer o que projetamos nos outros,
                tornamos visíveis potenciais reprimidos e feridas não integradas.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setView('irritacao')} variant="gold" className="gap-2">
                <Moon className="w-4 h-4" /> Iniciar Mapeamento
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

  // ── Sombra via Irritação ──
  if (view === 'irritacao') {
    return (
      <CasaMaquinasLayout title="Sombra via Irritação" subtitle={clienteNome}>
        <div className="space-y-4 max-w-5xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="gap-1 text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>

          {irritacoes.map((item, idx) => (
            <Card key={idx} className="border-border bg-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Pessoa #{idx + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => { if (irritacoes.length > 1) setIrritacoes(prev => prev.filter((_, i) => i !== idx)); }} disabled={irritacoes.length <= 1} className="text-destructive/60 hover:text-destructive h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Pessoa</label>
                    <Input value={item.pessoa} onChange={e => setIrritacoes(prev => prev.map((it, i) => i === idx ? { ...it, pessoa: e.target.value } : it))} placeholder="Nome ou relação" className="bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Intensidade: {item.intensidade}/10</label>
                    <Slider value={[item.intensidade]} onValueChange={v => setIrritacoes(prev => prev.map((it, i) => i === idx ? { ...it, intensidade: v[0] } : it))} min={0} max={10} step={1} className="mt-2" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">O que irrita?</label>
                  <Textarea value={item.o_que_irrita} onChange={e => setIrritacoes(prev => prev.map((it, i) => i === idx ? { ...it, o_que_irrita: e.target.value } : it))} rows={2} className="bg-background" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Como eu também tenho isso?</label>
                  <Textarea value={item.como_eu_tambem_tenho} onChange={e => setIrritacoes(prev => prev.map((it, i) => i === idx ? { ...it, como_eu_tambem_tenho: e.target.value } : it))} rows={2} className="bg-background" />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setIrritacoes(prev => [...prev, emptyIrritacao()])} className="gap-1">
              <Plus className="w-4 h-4" /> Adicionar Pessoa
            </Button>
            <Button variant="gold" onClick={() => setView('admiracao')} className="gap-1">
              Próximo: Sombra Dourada <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // ── Sombra via Admiração ──
  if (view === 'admiracao') {
    return (
      <CasaMaquinasLayout title="Sombra Dourada — Admiração" subtitle={clienteNome}>
        <div className="space-y-4 max-w-5xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => setView('irritacao')} className="gap-1 text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar à Irritação
          </Button>

          {admiracoes.map((item, idx) => (
            <Card key={idx} className="border-border bg-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Pessoa #{idx + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => { if (admiracoes.length > 1) setAdmiracoes(prev => prev.filter((_, i) => i !== idx)); }} disabled={admiracoes.length <= 1} className="text-destructive/60 hover:text-destructive h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Pessoa</label>
                  <Input value={item.pessoa} onChange={e => setAdmiracoes(prev => prev.map((it, i) => i === idx ? { ...it, pessoa: e.target.value } : it))} placeholder="Nome ou relação" className="bg-background" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">O que admiro?</label>
                  <Textarea value={item.o_que_admiro} onChange={e => setAdmiracoes(prev => prev.map((it, i) => i === idx ? { ...it, o_que_admiro: e.target.value } : it))} rows={2} className="bg-background" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Qual permissão não me dou?</label>
                  <Textarea value={item.qual_permissao_nao_me_dou} onChange={e => setAdmiracoes(prev => prev.map((it, i) => i === idx ? { ...it, qual_permissao_nao_me_dou: e.target.value } : it))} rows={2} className="bg-background" />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setAdmiracoes(prev => [...prev, emptyAdmiracao()])} className="gap-1">
              <Plus className="w-4 h-4" /> Adicionar Pessoa
            </Button>
            <Button variant="gold" onClick={() => setView('sintese')} className="gap-1">
              Analisar Síntese <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // ── Síntese ──
  if (view === 'sintese') {
    return (
      <CasaMaquinasLayout title="Síntese e Integração" subtitle={clienteNome}>
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" size="sm" onClick={() => setView('admiracao')} className="gap-1 text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar à Admiração
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border bg-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-foreground flex items-center gap-2"><Moon className="w-4 h-4" /> Irritações</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {irritacoes.filter(i => i.pessoa.trim()).map((i, idx) => (
                  <div key={idx} className="p-2 rounded bg-muted/30 border border-border text-xs">
                    <span className="font-medium text-foreground">{i.pessoa}</span>
                    <span className="text-muted-foreground ml-2">({i.intensidade}/10)</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-foreground flex items-center gap-2"><Sun className="w-4 h-4" /> Admirações</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {admiracoes.filter(a => a.pessoa.trim()).map((a, idx) => (
                  <div key={idx} className="p-2 rounded bg-muted/30 border border-border text-xs">
                    <span className="font-medium text-foreground">{a.pessoa}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Projeção Negativa (Sombra)</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">O que as irritações revelam sobre conteúdos negados em você?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={sintese.negativa} onChange={e => setSintese(prev => ({ ...prev, negativa: e.target.value }))} rows={4} className="bg-background" placeholder="Registre aqui..." />
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Projeção Positiva (Sombra Dourada)</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Quais potenciais não vividos as admirações revelam?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={sintese.dourada} onChange={e => setSintese(prev => ({ ...prev, dourada: e.target.value }))} rows={4} className="bg-background" placeholder="Registre aqui..." />
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
    <CasaMaquinasLayout title="Histórico — Mapa da Sombra" subtitle={clienteNome}>
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="gap-1 text-muted-foreground mb-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        {historico.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center text-muted-foreground">Nenhum mapeamento registrado ainda.</CardContent>
          </Card>
        ) : (
          historico.map(m => {
            const expanded = expandedId === m.id;
            const irrs = (m.irritacoes || []) as Irritacao[];
            const adms = (m.admiracoes || []) as Admiracao[];
            return (
              <Card key={m.id} className="border-border bg-card cursor-pointer" onClick={() => setExpandedId(expanded ? null : m.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-foreground">
                      {format(new Date(m.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </CardTitle>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-muted-foreground text-xs">
                    {irrs.length} irritação(ões) · {adms.length} admiração(ões)
                  </CardDescription>
                </CardHeader>
                {expanded && (
                  <CardContent className="space-y-4 text-sm">
                    {irrs.length > 0 && (
                      <div>
                        <p className="font-medium text-foreground mb-2 flex items-center gap-1"><Moon className="w-3 h-3" /> Irritações</p>
                        {irrs.map((i, idx) => (
                          <div key={idx} className="p-2 rounded bg-muted/30 border border-border mb-1 text-xs">
                            <span className="font-medium text-foreground">{i.pessoa}</span> ({i.intensidade}/10) — {i.o_que_irrita}
                            {i.como_eu_tambem_tenho && <p className="text-muted-foreground mt-0.5 italic">↳ {i.como_eu_tambem_tenho}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {adms.length > 0 && (
                      <div>
                        <p className="font-medium text-foreground mb-2 flex items-center gap-1"><Sun className="w-3 h-3" /> Admirações</p>
                        {adms.map((a, idx) => (
                          <div key={idx} className="p-2 rounded bg-muted/30 border border-border mb-1 text-xs">
                            <span className="font-medium text-foreground">{a.pessoa}</span> — {a.o_que_admiro}
                            {a.qual_permissao_nao_me_dou && <p className="text-muted-foreground mt-0.5 italic">↳ Permissão negada: {a.qual_permissao_nao_me_dou}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {m.sintese_sombra_negativa && <div><p className="font-medium text-foreground">Sombra</p><p className="text-muted-foreground">{m.sintese_sombra_negativa}</p></div>}
                    {m.sintese_sombra_dourada && <div><p className="font-medium text-foreground">Sombra Dourada</p><p className="text-muted-foreground">{m.sintese_sombra_dourada}</p></div>}
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
