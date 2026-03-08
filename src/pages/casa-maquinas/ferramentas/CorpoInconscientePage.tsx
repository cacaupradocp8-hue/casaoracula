
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ChevronDown, ChevronUp, ArrowLeft, Heart, Plus, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type View = 'overview' | 'mapeamento' | 'diario' | 'history';

const AREAS_CORPORAIS = [
  { key: 'mandibula', label: 'Mandíbula' },
  { key: 'ombros_pescoco', label: 'Ombros / Pescoço' },
  { key: 'peito', label: 'Peito' },
  { key: 'estomago', label: 'Estômago' },
  { key: 'lombar', label: 'Lombar' },
  { key: 'pelve', label: 'Pelve' },
];

interface TensaoArea { area: string; o_que_segura: string; o_que_precisa_soltar: string; }
interface DiarioEntry { data: string; sintomas_fisicos: string; estado_emocional_relacional: string; conexao_percebida: string; }

export default function CorpoInconscientePage() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');

  const [tensoes, setTensoes] = useState<TensaoArea[]>(
    AREAS_CORPORAIS.map(a => ({ area: a.label, o_que_segura: '', o_que_precisa_soltar: '' }))
  );
  const [diario, setDiario] = useState<DiarioEntry[]>([
    { data: new Date().toISOString().split('T')[0], sintomas_fisicos: '', estado_emocional_relacional: '', conexao_percebida: '' }
  ]);

  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!clienteId) return;
    setLoadingHistory(true);
    const { data } = await (supabase
      .from('corpo_inconsciente' as any)
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false }) as any);
    setHistorico(data || []);
    setLoadingHistory(false);
  };

  useEffect(() => { if (view === 'history') loadHistory(); }, [view]);

  const saveMapeamento = async () => {
    if (!clienteId || !user) return;
    setSaving(true);
    const { error } = await (supabase.from('corpo_inconsciente' as any).insert({
      cliente_id: clienteId, therapist_id: user.id, tipo: 'mapeamento',
      mapeamento_tensoes: tensoes.filter(t => t.o_que_segura.trim() || t.o_que_precisa_soltar.trim()),
    }) as any);
    setSaving(false);
    if (error) { toast.error('Erro ao salvar.'); return; }
    toast.success('Mapeamento salvo.');
    setTensoes(AREAS_CORPORAIS.map(a => ({ area: a.label, o_que_segura: '', o_que_precisa_soltar: '' })));
    setView('overview');
  };

  const saveDiario = async () => {
    if (!clienteId || !user) return;
    setSaving(true);
    const { error } = await (supabase.from('corpo_inconsciente' as any).insert({
      cliente_id: clienteId, therapist_id: user.id, tipo: 'diario',
      diario_corpo_mente: diario.filter(d => d.sintomas_fisicos.trim() || d.estado_emocional_relacional.trim()),
    }) as any);
    setSaving(false);
    if (error) { toast.error('Erro ao salvar.'); return; }
    toast.success('Diário salvo.');
    setDiario([{ data: new Date().toISOString().split('T')[0], sintomas_fisicos: '', estado_emocional_relacional: '', conexao_percebida: '' }]);
    setView('overview');
  };

  // --- OVERVIEW ---
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="O Corpo como Inconsciente">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#C9A24A]" />
              </div>
              <CardTitle className="text-[#F5F1E8] text-lg">O Corpo como Inconsciente</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#F5F1E8]/70 leading-relaxed">
              O corpo carrega o que a mente não consegue processar. Esta ferramenta permite mapear tensões crônicas
              em áreas corporais específicas e manter um diário corpo-mente para identificar padrões de somatização
              e conexões entre estados emocionais e sintomas físicos.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => setView('mapeamento')} variant="gold">Iniciar Mapeamento Corporal</Button>
              <Button onClick={() => setView('diario')} variant="mystical">
                <BookOpen className="w-4 h-4 mr-1" /> Diário Corpo-Mente
              </Button>
              <Button onClick={() => setView('history')} variant="outline" className="border-[#C9A24A]/20 text-[#C9A24A]">Ver Histórico</Button>
            </div>
          </CardContent>
        </Card>
      </CasaMaquinasLayout>
    );
  }

  // --- MAPEAMENTO ---
  if (view === 'mapeamento') {
    return (
      <CasaMaquinasLayout title="Mapeamento de Tensões Crônicas">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="space-y-4">
          {tensoes.map((t, i) => (
            <Card key={i} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px] border-[#C9A24A]/20 text-[#C9A24A]">{t.area}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#F5F1E8]/50 mb-1 block">O que está segurando?</label>
                  <Textarea value={t.o_que_segura}
                    onChange={e => { const n = [...tensoes]; n[i] = { ...n[i], o_que_segura: e.target.value }; setTensoes(n); }}
                    placeholder="O que essa região do corpo está guardando..."
                    className="min-h-[60px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm placeholder:text-[#F5F1E8]/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#F5F1E8]/50 mb-1 block">O que precisa para soltar?</label>
                  <Textarea value={t.o_que_precisa_soltar}
                    onChange={e => { const n = [...tensoes]; n[i] = { ...n[i], o_que_precisa_soltar: e.target.value }; setTensoes(n); }}
                    placeholder="O que seria necessário para liberar..."
                    className="min-h-[60px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm placeholder:text-[#F5F1E8]/30" />
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button onClick={saveMapeamento} variant="gold" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Salvar Mapeamento
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- DIÁRIO ---
  if (view === 'diario') {
    return (
      <CasaMaquinasLayout title="Diário Corpo-Mente">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="space-y-4">
          {diario.map((d, i) => (
            <Card key={i} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]">Registro {i + 1}</Badge>
                  {diario.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => setDiario(diario.filter((_, idx) => idx !== i))}
                      className="text-red-400/60 hover:text-red-400 h-6 w-6 p-0"><Trash2 className="w-3 h-3" /></Button>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Data</label>
                  <Input type="date" value={d.data}
                    onChange={e => { const n = [...diario]; n[i] = { ...n[i], data: e.target.value }; setDiario(n); }}
                    className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#F5F1E8]/50 mb-1 block">Sintomas Físicos</label>
                  <Textarea value={d.sintomas_fisicos}
                    onChange={e => { const n = [...diario]; n[i] = { ...n[i], sintomas_fisicos: e.target.value }; setDiario(n); }}
                    placeholder="Dores, tensões, desconfortos..."
                    className="min-h-[60px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm placeholder:text-[#F5F1E8]/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#F5F1E8]/50 mb-1 block">Estado Emocional / Relacional</label>
                  <Textarea value={d.estado_emocional_relacional}
                    onChange={e => { const n = [...diario]; n[i] = { ...n[i], estado_emocional_relacional: e.target.value }; setDiario(n); }}
                    placeholder="Como se sentiu emocionalmente, relações do dia..."
                    className="min-h-[60px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm placeholder:text-[#F5F1E8]/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#F5F1E8]/50 mb-1 block">Conexão Percebida</label>
                  <Textarea value={d.conexao_percebida}
                    onChange={e => { const n = [...diario]; n[i] = { ...n[i], conexao_percebida: e.target.value }; setDiario(n); }}
                    placeholder="Que relação percebe entre o corpo e o emocional?"
                    className="min-h-[60px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm placeholder:text-[#F5F1E8]/30" />
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm"
              onClick={() => setDiario([...diario, { data: new Date().toISOString().split('T')[0], sintomas_fisicos: '', estado_emocional_relacional: '', conexao_percebida: '' }])}
              className="border-[#C9A24A]/20 text-[#C9A24A]"><Plus className="w-3 h-3 mr-1" /> Adicionar Registro</Button>
            <Button onClick={saveDiario} variant="gold" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Salvar Diário
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- HISTORY ---
  return (
    <CasaMaquinasLayout title="Histórico">
      <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>
      {loadingHistory ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      ) : historico.length === 0 ? (
        <p className="text-sm text-[#F5F1E8]/40 text-center py-10">Nenhum registro encontrado.</p>
      ) : (
        <div className="space-y-3">
          {historico.map((h: any) => {
            const expanded = expandedId === h.id;
            const isMapeamento = h.tipo === 'mapeamento';
            return (
              <Card key={h.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : h.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isMapeamento ? <Heart className="w-4 h-4 text-[#C9A24A]" /> : <BookOpen className="w-4 h-4 text-[#556B57]" />}
                      <span className="text-sm text-[#F5F1E8]">
                        {format(new Date(h.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      <Badge variant="outline" className={`text-[9px] ${isMapeamento ? 'border-[#C9A24A]/20 text-[#C9A24A]' : 'border-[#556B57]/30 text-[#556B57]'}`}>
                        {isMapeamento ? 'Mapeamento' : 'Diário'}
                      </Badge>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[#F5F1E8]/40" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
                  </div>
                  {expanded && (
                    <div className="mt-4 space-y-3 border-t border-[#C9A24A]/10 pt-4">
                      {isMapeamento && (h.mapeamento_tensoes || []).map((t: any, i: number) => (
                        (t.o_que_segura || t.o_que_precisa_soltar) && (
                          <div key={i}>
                            <p className="text-xs font-medium text-[#C9A24A] mb-1">{t.area}</p>
                            {t.o_que_segura && <p className="text-xs text-[#F5F1E8]/60 ml-2">Segurando: {t.o_que_segura}</p>}
                            {t.o_que_precisa_soltar && <p className="text-xs text-[#F5F1E8]/50 ml-2">Para soltar: {t.o_que_precisa_soltar}</p>}
                          </div>
                        )
                      ))}
                      {!isMapeamento && (h.diario_corpo_mente || []).map((d: any, i: number) => (
                        <div key={i} className="p-2 rounded bg-[#0B1B2B]/40">
                          <p className="text-xs text-[#C9A24A] font-medium mb-1">{d.data}</p>
                          {d.sintomas_fisicos && <p className="text-xs text-[#F5F1E8]/60">Físico: {d.sintomas_fisicos}</p>}
                          {d.estado_emocional_relacional && <p className="text-xs text-[#F5F1E8]/50">Emocional: {d.estado_emocional_relacional}</p>}
                          {d.conexao_percebida && <p className="text-xs text-[#F5F1E8]/50">Conexão: {d.conexao_percebida}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </CasaMaquinasLayout>
  );
}
