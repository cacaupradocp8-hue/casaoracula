
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ChevronDown, ChevronUp, ArrowLeft, Eye, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type View = 'overview' | 'preparacao' | 'convocacao' | 'registro' | 'history';

const PONTOS_PARTIDA = [
  { value: 'imagem_sonho', label: 'Imagem de Sonho' },
  { value: 'emocao_forte', label: 'Emoção Forte' },
  { value: 'complexo_identificado', label: 'Complexo Identificado' },
  { value: 'figura_interna', label: 'Figura Interna' },
  { value: 'outro', label: 'Outro' },
];

interface DialogoItem { pergunta: string; resposta: string; }

export default function ImaginacaoAtivaPage() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');

  const [pontoTipo, setPontoTipo] = useState('');
  const [pontoDetalhes, setPontoDetalhes] = useState('');
  const [descricaoFigura, setDescricaoFigura] = useState('');
  const [dialogos, setDialogos] = useState<DialogoItem[]>([{ pergunta: '', resposta: '' }]);
  const [negociacao, setNegociacao] = useState('');
  const [registroPos, setRegistroPos] = useState('');

  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!clienteId) return;
    setLoadingHistory(true);
    const { data } = await (supabase
      .from('imaginacao_ativa' as any)
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false }) as any);
    setHistorico(data || []);
    setLoadingHistory(false);
  };

  useEffect(() => { if (view === 'history') loadHistory(); }, [view]);

  const resetForm = () => {
    setPontoTipo(''); setPontoDetalhes(''); setDescricaoFigura('');
    setDialogos([{ pergunta: '', resposta: '' }]);
    setNegociacao(''); setRegistroPos('');
  };

  const handleSave = async () => {
    if (!clienteId || !user) return;
    setSaving(true);
    const { error } = await (supabase.from('imaginacao_ativa' as any).insert({
      cliente_id: clienteId,
      therapist_id: user.id,
      ponto_partida_tipo: pontoTipo || null,
      ponto_partida_detalhes: pontoDetalhes || null,
      descricao_figura: descricaoFigura || null,
      dialogo_registros: dialogos.filter(d => d.pergunta.trim() || d.resposta.trim()),
      negociacao_registro: negociacao || null,
      registro_pos_sessao: registroPos || null,
    }) as any);
    setSaving(false);
    if (error) { toast.error('Erro ao salvar sessão.'); return; }
    toast.success('Sessão de Imaginação Ativa salva.');
    resetForm();
    setView('overview');
  };

  const getPontoLabel = (v: string) => PONTOS_PARTIDA.find(p => p.value === v)?.label || v;

  // --- OVERVIEW ---
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="Imaginação Ativa — Protocolo Básico">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#C9A24A]" />
              </div>
              <CardTitle className="text-[#F5F1E8] text-lg">Imaginação Ativa — Protocolo Básico</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#F5F1E8]/70 leading-relaxed">
              Técnica junguiana de diálogo consciente com conteúdos do inconsciente. A cliente é guiada a
              convocar uma imagem interna, estabelecer diálogo com ela e buscar uma posição de integração — 
              sem se identificar nem reprimir o que emerge.
            </p>
            <div className="p-3 rounded-lg bg-red-900/10 border border-red-400/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-400 mb-1">Advertências Clínicas</p>
                  <ul className="text-xs text-[#F5F1E8]/50 space-y-1">
                    <li>• Não indicada para clientes em crise aguda ou estados dissociativos.</li>
                    <li>• A facilitadora deve ter experiência prévia com a técnica antes de conduzir.</li>
                    <li>• Interromper imediatamente se houver sinais de flooding emocional.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setView('preparacao')} variant="gold">Iniciar Sessão de Imaginação Ativa</Button>
              <Button onClick={() => setView('history')} variant="outline" className="border-[#C9A24A]/20 text-[#C9A24A]">Ver Histórico</Button>
            </div>
          </CardContent>
        </Card>
      </CasaMaquinasLayout>
    );
  }

  // --- PREPARAÇÃO ---
  if (view === 'preparacao') {
    return (
      <CasaMaquinasLayout title="Preparação e Ponto de Partida">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="space-y-6">
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-[#F5F1E8] text-base">Preparação</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm text-[#F5F1E8]/70 space-y-2">
                <li className="flex items-start gap-2"><span className="text-[#C9A24A]">1.</span> Ambiente silencioso e seguro, sem interrupções.</li>
                <li className="flex items-start gap-2"><span className="text-[#C9A24A]">2.</span> Reserve ao menos 30 minutos de tempo protegido.</li>
                <li className="flex items-start gap-2"><span className="text-[#C9A24A]">3.</span> Tenha papel e caneta à mão para registro imediato.</li>
                <li className="flex items-start gap-2"><span className="text-[#C9A24A]">4.</span> Faça um breve relaxamento corporal antes de iniciar.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-[#F5F1E8] text-base">Ponto de Partida</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Tipo de Ponto de Partida</label>
                <Select value={pontoTipo} onValueChange={setPontoTipo}>
                  <SelectTrigger className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8]">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PONTOS_PARTIDA.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {pontoTipo === 'outro' && (
                <div>
                  <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Detalhes do Ponto de Partida</label>
                  <Textarea value={pontoDetalhes} onChange={e => setPontoDetalhes(e.target.value)}
                    placeholder="Descreva o ponto de partida..."
                    className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setView('convocacao')} variant="gold" disabled={!pontoTipo}>Iniciar Convocação</Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- CONVOCAÇÃO E DIÁLOGO ---
  if (view === 'convocacao') {
    return (
      <CasaMaquinasLayout title="Convocação e Diálogo">
        <Button variant="ghost" size="sm" onClick={() => setView('preparacao')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="space-y-6">
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-[#F5F1E8] text-base">Instruções de Convocação</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm text-[#F5F1E8]/70 space-y-2">
                <li>• Feche os olhos. Respire profundamente três vezes.</li>
                <li>• Convide a imagem ou figura interna a se apresentar.</li>
                <li>• Observe sem julgar. Permita que a imagem se forme sozinha.</li>
                <li>• Quando a figura estiver presente, inicie o diálogo.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-[#F5F1E8] text-base">Descrição da Figura/Imagem</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={descricaoFigura} onChange={e => setDescricaoFigura(e.target.value)}
                placeholder="Como a figura apareceu? Forma, cor, postura, sensação..."
                className="min-h-[100px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
            </CardContent>
          </Card>

          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Diálogo</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">Registre as perguntas feitas e as respostas recebidas da figura.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {dialogos.map((d, i) => (
                <div key={i} className="p-3 rounded-lg border border-[#C9A24A]/10 bg-[#0B1B2B]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]">Troca {i + 1}</Badge>
                    {dialogos.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => setDialogos(dialogos.filter((_, idx) => idx !== i))}
                        className="text-red-400/60 hover:text-red-400 h-6 w-6 p-0"><Trash2 className="w-3 h-3" /></Button>
                    )}
                  </div>
                  <Textarea value={d.pergunta} onChange={e => { const n = [...dialogos]; n[i] = { ...n[i], pergunta: e.target.value }; setDialogos(n); }}
                    placeholder="Minha Pergunta" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm min-h-[60px] placeholder:text-[#F5F1E8]/30" />
                  <Textarea value={d.resposta} onChange={e => { const n = [...dialogos]; n[i] = { ...n[i], resposta: e.target.value }; setDialogos(n); }}
                    placeholder="Resposta da Figura" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm min-h-[60px] placeholder:text-[#F5F1E8]/30" />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setDialogos([...dialogos, { pergunta: '', resposta: '' }])}
                className="border-[#C9A24A]/20 text-[#C9A24A]"><Plus className="w-3 h-3 mr-1" /> Adicionar Pergunta/Resposta</Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setView('registro')} variant="gold">Próximo: Negociação e Registro</Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- NEGOCIAÇÃO E REGISTRO ---
  if (view === 'registro') {
    return (
      <CasaMaquinasLayout title="Negociação e Registro">
        <Button variant="ghost" size="sm" onClick={() => setView('convocacao')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="space-y-6">
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Negociação</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">Registre conflitos entre ego e figura, e a busca pela 'terceira posição'.</p>
            </CardHeader>
            <CardContent>
              <Textarea value={negociacao} onChange={e => setNegociacao(e.target.value)}
                placeholder="Houve conflito? Qual foi a tensão? Como se buscou um terceiro caminho?"
                className="min-h-[120px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
            </CardContent>
          </Card>

          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Registro Pós-Sessão</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">O que aconteceu (narrativa), o que sentiu, o que surpreendeu, insight/compromisso emergente.</p>
            </CardHeader>
            <CardContent>
              <Textarea value={registroPos} onChange={e => setRegistroPos(e.target.value)}
                placeholder="Registre livremente o que aconteceu, sentimentos, surpresas e compromissos..."
                className="min-h-[150px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="gold" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salvar Sessão de Imaginação Ativa
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- HISTORY ---
  return (
    <CasaMaquinasLayout title="Histórico de Sessões">
      <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      {loadingHistory ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      ) : historico.length === 0 ? (
        <p className="text-sm text-[#F5F1E8]/40 text-center py-10">Nenhuma sessão registrada.</p>
      ) : (
        <div className="space-y-3">
          {historico.map((h: any) => {
            const expanded = expandedId === h.id;
            return (
              <Card key={h.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : h.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-[#C9A24A]" />
                      <span className="text-sm text-[#F5F1E8]">
                        {format(new Date(h.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      {h.ponto_partida_tipo && (
                        <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]">
                          {getPontoLabel(h.ponto_partida_tipo)}
                        </Badge>
                      )}
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[#F5F1E8]/40" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
                  </div>

                  {expanded && (
                    <div className="mt-4 space-y-4 border-t border-[#C9A24A]/10 pt-4">
                      {h.ponto_partida_detalhes && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Ponto de Partida</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.ponto_partida_detalhes}</p></div>
                      )}
                      {h.descricao_figura && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Figura/Imagem</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.descricao_figura}</p></div>
                      )}
                      {(h.dialogo_registros || []).length > 0 && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Diálogo</p>
                          {h.dialogo_registros.map((d: any, i: number) => (
                            <div key={i} className="ml-2 mb-2 p-2 rounded bg-[#0B1B2B]/40">
                              {d.pergunta && <p className="text-xs text-[#F5F1E8]/70"><strong>Eu:</strong> {d.pergunta}</p>}
                              {d.resposta && <p className="text-xs text-[#F5F1E8]/50"><strong>Figura:</strong> {d.resposta}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {h.negociacao_registro && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Negociação</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.negociacao_registro}</p></div>
                      )}
                      {h.registro_pos_sessao && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Registro Pós-Sessão</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.registro_pos_sessao}</p></div>
                      )}
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
