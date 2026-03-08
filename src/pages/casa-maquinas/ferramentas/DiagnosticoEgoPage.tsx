
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ChevronDown, ChevronUp, ArrowLeft, Scale, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type View = 'overview' | 'checklist' | 'results' | 'history';

const INFLACAO_ITEMS = [
  'Sinto que tenho uma missão especial que poucos entendem.',
  'Tenho dificuldade em aceitar críticas, mesmo construtivas.',
  'Frequentemente sinto que sou melhor do que as pessoas ao meu redor.',
  'Acredito que mereço reconhecimento especial por quem sou.',
  'Tenho dificuldade em pedir desculpas genuinamente.',
  'Sinto que as regras não se aplicam a mim da mesma forma.',
  'Quando algo dá errado, geralmente é culpa dos outros.',
  'Preciso ser vista como extraordinária ou única.',
  'Sinto raiva quando alguém questiona minha competência.',
  'Tenho fantasias de grandeza sobre meu futuro ou papel no mundo.',
];

const DEFLACAO_ITEMS = [
  'Sinto que não mereço ocupar espaço ou ser vista.',
  'Tenho medo de parecer arrogante se mostrar minhas qualidades.',
  'Frequentemente minimizo minhas conquistas.',
  'Sinto que sou uma fraude e que vão "me descobrir".',
  'Tenho dificuldade em aceitar elogios genuínos.',
  'Coloco as necessidades dos outros sempre acima das minhas.',
  'Evito conflitos mesmo quando preciso me posicionar.',
  'Sinto que preciso de permissão para existir ou agir.',
  'Tenho vergonha de expressar raiva ou descontentamento.',
  'Acredito que minha opinião vale menos que a dos outros.',
];

export default function DiagnosticoEgoPage() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');
  const [inflacao, setInflacao] = useState<boolean[]>(new Array(INFLACAO_ITEMS.length).fill(false));
  const [deflacao, setDeflacao] = useState<boolean[]>(new Array(DEFLACAO_ITEMS.length).fill(false));
  const [integracaoResp, setIntegracaoResp] = useState('');
  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const contagemInflacao = inflacao.filter(Boolean).length;
  const contagemDeflacao = deflacao.filter(Boolean).length;

  const loadHistory = async () => {
    if (!clienteId) return;
    setLoadingHistory(true);
    const { data } = await (supabase
      .from('diagnostico_ego' as any)
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false }) as any);
    setHistorico(data || []);
    setLoadingHistory(false);
  };

  useEffect(() => {
    if (view === 'history') loadHistory();
  }, [view]);

  const handleSave = async () => {
    if (!clienteId || !user) return;
    setSaving(true);
    const { error } = await (supabase.from('diagnostico_ego' as any).insert({
      cliente_id: clienteId,
      therapist_id: user.id,
      respostas_inflacao: inflacao,
      respostas_deflacao: deflacao,
      contagem_inflacao: contagemInflacao,
      contagem_deflacao: contagemDeflacao,
      pergunta_integracao_resposta: integracaoResp || null,
    }) as any);
    setSaving(false);
    if (error) {
      toast.error('Erro ao salvar diagnóstico.');
      return;
    }
    toast.success('Diagnóstico salvo com sucesso.');
    setInflacao(new Array(INFLACAO_ITEMS.length).fill(false));
    setDeflacao(new Array(DEFLACAO_ITEMS.length).fill(false));
    setIntegracaoResp('');
    setView('overview');
  };

  const getDiagnosticoTexto = (ci: number, cd: number) => {
    const parts: string[] = [];
    if (ci >= 3) parts.push('Padrão significativo de inflação do ego identificado.');
    if (cd >= 3) parts.push('Padrão significativo de deflação do ego identificado.');
    if (ci < 3 && cd < 3) parts.push('Nenhum padrão significativo identificado neste momento.');
    if (ci >= 3 && cd >= 3) parts.push('A coexistência de inflação e deflação sugere oscilação egoica — um campo clínico importante.');
    return parts.join(' ');
  };

  // --- OVERVIEW ---
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="Diagnóstico de Inflação/Deflação do Ego">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#C9A24A]" />
              </div>
              <CardTitle className="text-[#F5F1E8] text-lg">Diagnóstico de Inflação/Deflação do Ego</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#F5F1E8]/70 leading-relaxed">
              Esta ferramenta permite identificar padrões de inflação (grandiosidade) e deflação (auto-anulação) do ego.
              Através de um checklist clínico, a cliente pode reconhecer onde sua autoimagem está distorcida —
              seja para cima ou para baixo — e iniciar o trabalho de integração.
            </p>
            <p className="text-xs text-[#F5F1E8]/40">
              Baseado nos conceitos junguianos de inflação egoica e identificação com a persona ou a sombra.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setView('checklist')} variant="gold">
                Iniciar Diagnóstico
              </Button>
              <Button onClick={() => setView('history')} variant="outline" className="border-[#C9A24A]/20 text-[#C9A24A]">
                Ver Histórico
              </Button>
            </div>
          </CardContent>
        </Card>
      </CasaMaquinasLayout>
    );
  }

  // --- CHECKLIST ---
  if (view === 'checklist') {
    return (
      <CasaMaquinasLayout title="Checklist — Inflação / Deflação">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inflação */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-400" />
                <CardTitle className="text-[#F5F1E8] text-base">Checklist de Inflação</CardTitle>
              </div>
              <p className="text-xs text-[#F5F1E8]/40">Sinais de grandiosidade e identificação com o ideal.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {INFLACAO_ITEMS.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox
                    checked={inflacao[i]}
                    onCheckedChange={(checked) => {
                      const next = [...inflacao];
                      next[i] = !!checked;
                      setInflacao(next);
                    }}
                  />
                  <span className="text-sm text-[#F5F1E8]/70 group-hover:text-[#F5F1E8] transition-colors leading-snug">
                    {item}
                  </span>
                </label>
              ))}
              <div className="pt-2 text-right">
                <Badge variant="outline" className="border-red-400/30 text-red-400">
                  {contagemInflacao} / {INFLACAO_ITEMS.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Deflação */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-[#F5F1E8] text-base">Checklist de Deflação</CardTitle>
              </div>
              <p className="text-xs text-[#F5F1E8]/40">Sinais de auto-anulação e identificação com a sombra.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEFLACAO_ITEMS.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox
                    checked={deflacao[i]}
                    onCheckedChange={(checked) => {
                      const next = [...deflacao];
                      next[i] = !!checked;
                      setDeflacao(next);
                    }}
                  />
                  <span className="text-sm text-[#F5F1E8]/70 group-hover:text-[#F5F1E8] transition-colors leading-snug">
                    {item}
                  </span>
                </label>
              ))}
              <div className="pt-2 text-right">
                <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                  {contagemDeflacao} / {DEFLACAO_ITEMS.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => setView('results')} variant="gold" disabled={contagemInflacao === 0 && contagemDeflacao === 0}>
            Gerar Diagnóstico
          </Button>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- RESULTS ---
  if (view === 'results') {
    return (
      <CasaMaquinasLayout title="Resultados e Integração">
        <Button variant="ghost" size="sm" onClick={() => setView('checklist')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Checklist
        </Button>

        <div className="space-y-6">
          {/* Contagens */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-red-400/20 bg-[#0B1B2B]/60">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-400">{contagemInflacao}</p>
                <p className="text-xs text-[#F5F1E8]/50">Inflação</p>
              </CardContent>
            </Card>
            <Card className="border-blue-400/20 bg-[#0B1B2B]/60">
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">{contagemDeflacao}</p>
                <p className="text-xs text-[#F5F1E8]/50">Deflação</p>
              </CardContent>
            </Card>
          </div>

          {/* Diagnóstico automático */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#F5F1E8]/70 leading-relaxed">
                {getDiagnosticoTexto(contagemInflacao, contagemDeflacao)}
              </p>
            </CardContent>
          </Card>

          {/* Pergunta de integração */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Pergunta de Integração</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">
                Onde minha autoimagem é maior que minha realidade? Onde é menor?
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={integracaoResp}
                onChange={e => setIntegracaoResp(e.target.value)}
                placeholder="Registre aqui suas reflexões..."
                className="min-h-[120px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="gold" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salvar Diagnóstico
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- HISTORY ---
  return (
    <CasaMaquinasLayout title="Histórico de Diagnósticos">
      <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      {loadingHistory ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      ) : historico.length === 0 ? (
        <p className="text-sm text-[#F5F1E8]/40 text-center py-10">Nenhum diagnóstico registrado.</p>
      ) : (
        <div className="space-y-3">
          {historico.map((h: any) => {
            const expanded = expandedId === h.id;
            return (
              <Card
                key={h.id}
                className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : h.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-[#C9A24A]" />
                      <span className="text-sm text-[#F5F1E8]">
                        {format(new Date(h.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      <Badge variant="outline" className="text-[9px] border-red-400/30 text-red-400">
                        Inf: {h.contagem_inflacao}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] border-blue-400/30 text-blue-400">
                        Def: {h.contagem_deflacao}
                      </Badge>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[#F5F1E8]/40" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
                  </div>

                  {expanded && (
                    <div className="mt-4 space-y-4 border-t border-[#C9A24A]/10 pt-4">
                      <div>
                        <p className="text-xs font-medium text-red-400 mb-1">Inflação marcados:</p>
                        <ul className="space-y-1">
                          {(h.respostas_inflacao || []).map((v: boolean, i: number) =>
                            v ? (
                              <li key={i} className="text-xs text-[#F5F1E8]/60">• {INFLACAO_ITEMS[i]}</li>
                            ) : null
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-400 mb-1">Deflação marcados:</p>
                        <ul className="space-y-1">
                          {(h.respostas_deflacao || []).map((v: boolean, i: number) =>
                            v ? (
                              <li key={i} className="text-xs text-[#F5F1E8]/60">• {DEFLACAO_ITEMS[i]}</li>
                            ) : null
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#C9A24A] mb-1">Diagnóstico:</p>
                        <p className="text-xs text-[#F5F1E8]/60">{getDiagnosticoTexto(h.contagem_inflacao, h.contagem_deflacao)}</p>
                      </div>
                      {h.pergunta_integracao_resposta && (
                        <div>
                          <p className="text-xs font-medium text-[#C9A24A] mb-1">Reflexão de Integração:</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.pergunta_integracao_resposta}</p>
                        </div>
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
