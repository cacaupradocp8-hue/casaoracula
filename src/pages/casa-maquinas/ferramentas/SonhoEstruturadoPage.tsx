
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
import { Loader2, ChevronDown, ChevronUp, ArrowLeft, Moon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type View = 'overview' | 'registro' | 'perguntas' | 'history';

interface AmpPessoal {
  elemento: string;
  significado: string;
  memorias: string;
}

interface AmpArquetipica {
  simbolo: string;
  mitos: string;
  padrao: string;
}

export default function SonhoEstruturadoPage() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');

  // Registro
  const [imagensPrincipais, setImagensPrincipais] = useState('');
  const [emocao, setEmocao] = useState('');
  const [sensacao, setSensacao] = useState('');
  const [ampPessoal, setAmpPessoal] = useState<AmpPessoal[]>([{ elemento: '', significado: '', memorias: '' }]);
  const [ampArquetipica, setAmpArquetipica] = useState<AmpArquetipica[]>([{ simbolo: '', mitos: '', padrao: '' }]);

  // Perguntas
  const [compensar, setCompensar] = useState('');
  const [perspectiva, setPerspectiva] = useState('');
  const [conselho, setConselho] = useState('');
  const [resposta, setResposta] = useState('');

  // History
  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!clienteId) return;
    setLoadingHistory(true);
    const { data } = await (supabase
      .from('sonho_estruturado' as any)
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false }) as any);
    setHistorico(data || []);
    setLoadingHistory(false);
  };

  useEffect(() => {
    if (view === 'history') loadHistory();
  }, [view]);

  const resetForm = () => {
    setImagensPrincipais(''); setEmocao(''); setSensacao('');
    setAmpPessoal([{ elemento: '', significado: '', memorias: '' }]);
    setAmpArquetipica([{ simbolo: '', mitos: '', padrao: '' }]);
    setCompensar(''); setPerspectiva(''); setConselho(''); setResposta('');
  };

  const handleSave = async () => {
    if (!clienteId || !user) return;
    setSaving(true);
    const { error } = await (supabase.from('sonho_estruturado' as any).insert({
      cliente_id: clienteId,
      therapist_id: user.id,
      imagens_principais: imagensPrincipais || null,
      emocao_predominante: emocao || null,
      sensacao_corporal: sensacao || null,
      amplificacao_pessoal: ampPessoal.filter(a => a.elemento.trim()),
      amplificacao_arquetipica: ampArquetipica.filter(a => a.simbolo.trim()),
      pergunta_compensar: compensar || null,
      pergunta_perspectiva: perspectiva || null,
      pergunta_conselho: conselho || null,
      resposta_ao_sonho: resposta || null,
    }) as any);
    setSaving(false);
    if (error) { toast.error('Erro ao salvar.'); return; }
    toast.success('Sonho registrado com sucesso.');
    resetForm();
    setView('overview');
  };

  // --- OVERVIEW ---
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="Trabalho com Sonhos — Método Estruturado">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-[#C9A24A]" />
              </div>
              <CardTitle className="text-[#F5F1E8] text-lg">Trabalho com Sonhos — Método Estruturado</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#F5F1E8]/70 leading-relaxed">
              Ferramenta de registro e amplificação onírica estruturada. Permite à cliente documentar imagens, 
              emoções e sensações corporais do sonho, realizar amplificação pessoal e arquetípica dos símbolos, 
              e formular perguntas ao sonho como prática de integração simbólica.
            </p>
            <p className="text-xs text-[#F5F1E8]/40">
              Baseado no método junguiano de análise de sonhos: registro → amplificação → interpretação → resposta.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setView('registro')} variant="gold">Registrar Novo Sonho</Button>
              <Button onClick={() => setView('history')} variant="outline" className="border-[#C9A24A]/20 text-[#C9A24A]">Ver Histórico</Button>
            </div>
          </CardContent>
        </Card>
      </CasaMaquinasLayout>
    );
  }

  // --- REGISTRO E AMPLIFICAÇÃO ---
  if (view === 'registro') {
    return (
      <CasaMaquinasLayout title="Registro e Amplificação do Sonho">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>

        <div className="space-y-6">
          {/* Campos principais */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-[#F5F1E8] text-base">Registro do Sonho</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Imagens Principais</label>
                <Textarea value={imagensPrincipais} onChange={e => setImagensPrincipais(e.target.value)}
                  placeholder="Descreva as imagens centrais do sonho..."
                  className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Emoção Predominante</label>
                <Textarea value={emocao} onChange={e => setEmocao(e.target.value)}
                  placeholder="O que sentiu durante ou ao lembrar do sonho..."
                  className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Sensação Corporal ao Acordar</label>
                <Textarea value={sensacao} onChange={e => setSensacao(e.target.value)}
                  placeholder="Onde sentiu no corpo? Que tipo de sensação?"
                  className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
              </div>
            </CardContent>
          </Card>

          {/* Amplificação Pessoal */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Amplificação Pessoal</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">O que cada elemento do sonho significa pessoalmente.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {ampPessoal.map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-[#C9A24A]/10 bg-[#0B1B2B]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]">Elemento {i + 1}</Badge>
                    {ampPessoal.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => setAmpPessoal(ampPessoal.filter((_, idx) => idx !== i))}
                        className="text-red-400/60 hover:text-red-400 h-6 w-6 p-0"><Trash2 className="w-3 h-3" /></Button>
                    )}
                  </div>
                  <Input value={item.elemento} onChange={e => { const n = [...ampPessoal]; n[i] = { ...n[i], elemento: e.target.value }; setAmpPessoal(n); }}
                    placeholder="Elemento do sonho" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm placeholder:text-[#F5F1E8]/30" />
                  <Textarea value={item.significado} onChange={e => { const n = [...ampPessoal]; n[i] = { ...n[i], significado: e.target.value }; setAmpPessoal(n); }}
                    placeholder="Significado para MIM" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm min-h-[60px] placeholder:text-[#F5F1E8]/30" />
                  <Textarea value={item.memorias} onChange={e => { const n = [...ampPessoal]; n[i] = { ...n[i], memorias: e.target.value }; setAmpPessoal(n); }}
                    placeholder="Memórias / Emoções associadas" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm min-h-[60px] placeholder:text-[#F5F1E8]/30" />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setAmpPessoal([...ampPessoal, { elemento: '', significado: '', memorias: '' }])}
                className="border-[#C9A24A]/20 text-[#C9A24A]"><Plus className="w-3 h-3 mr-1" /> Adicionar Elemento Pessoal</Button>
            </CardContent>
          </Card>

          {/* Amplificação Arquetípica */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Amplificação Arquetípica</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">Conexões com símbolos universais, mitos e padrões coletivos.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {ampArquetipica.map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-[#C9A24A]/10 bg-[#0B1B2B]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] border-[#556B57]/30 text-[#556B57]">Símbolo {i + 1}</Badge>
                    {ampArquetipica.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => setAmpArquetipica(ampArquetipica.filter((_, idx) => idx !== i))}
                        className="text-red-400/60 hover:text-red-400 h-6 w-6 p-0"><Trash2 className="w-3 h-3" /></Button>
                    )}
                  </div>
                  <Input value={item.simbolo} onChange={e => { const n = [...ampArquetipica]; n[i] = { ...n[i], simbolo: e.target.value }; setAmpArquetipica(n); }}
                    placeholder="Símbolo Universal" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm placeholder:text-[#F5F1E8]/30" />
                  <Textarea value={item.mitos} onChange={e => { const n = [...ampArquetipica]; n[i] = { ...n[i], mitos: e.target.value }; setAmpArquetipica(n); }}
                    placeholder="Mitos / Contos / Religiões" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm min-h-[60px] placeholder:text-[#F5F1E8]/30" />
                  <Textarea value={item.padrao} onChange={e => { const n = [...ampArquetipica]; n[i] = { ...n[i], padrao: e.target.value }; setAmpArquetipica(n); }}
                    placeholder="Padrão Universal" className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] text-sm min-h-[60px] placeholder:text-[#F5F1E8]/30" />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setAmpArquetipica([...ampArquetipica, { simbolo: '', mitos: '', padrao: '' }])}
                className="border-[#C9A24A]/20 text-[#C9A24A]"><Plus className="w-3 h-3 mr-1" /> Adicionar Símbolo Arquetípico</Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setView('perguntas')} variant="gold">Próximo: Perguntas ao Sonho</Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- PERGUNTAS E RESPOSTA ---
  if (view === 'perguntas') {
    return (
      <CasaMaquinasLayout title="Perguntas e Resposta ao Sonho">
        <Button variant="ghost" size="sm" onClick={() => setView('registro')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Registro
        </Button>

        <div className="space-y-6">
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader><CardTitle className="text-[#F5F1E8] text-base">Perguntas ao Sonho</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#C9A24A] mb-1 block">O que o sonho tenta compensar?</label>
                <Textarea value={compensar} onChange={e => setCompensar(e.target.value)}
                  placeholder="Que aspecto da vida consciente o sonho está equilibrando..."
                  className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Que perspectiva o sonho oferece?</label>
                <Textarea value={perspectiva} onChange={e => setPerspectiva(e.target.value)}
                  placeholder="Que ângulo novo o sonho traz sobre a situação atual..."
                  className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#C9A24A] mb-1 block">Se fosse um conselho, qual seria?</label>
                <Textarea value={conselho} onChange={e => setConselho(e.target.value)}
                  placeholder="Se o sonho pudesse falar diretamente..."
                  className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Minha Resposta ao Sonho</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">Escrita, desenho, ação concreta — como você responde ao chamado onírico?</p>
            </CardHeader>
            <CardContent>
              <Textarea value={resposta} onChange={e => setResposta(e.target.value)}
                placeholder="Registre aqui sua resposta ao sonho..."
                className="min-h-[120px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30" />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="gold" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salvar Análise do Sonho
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- HISTORY ---
  return (
    <CasaMaquinasLayout title="Histórico de Sonhos">
      <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      {loadingHistory ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      ) : historico.length === 0 ? (
        <p className="text-sm text-[#F5F1E8]/40 text-center py-10">Nenhum sonho registrado.</p>
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
                      <Moon className="w-4 h-4 text-[#C9A24A]" />
                      <span className="text-sm text-[#F5F1E8]">
                        {format(new Date(h.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[#F5F1E8]/40" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
                  </div>
                  {h.imagens_principais && !expanded && (
                    <p className="text-xs text-[#F5F1E8]/40 mt-1 line-clamp-1">{h.imagens_principais}</p>
                  )}

                  {expanded && (
                    <div className="mt-4 space-y-4 border-t border-[#C9A24A]/10 pt-4">
                      {h.imagens_principais && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Imagens Principais</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.imagens_principais}</p></div>
                      )}
                      {h.emocao_predominante && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Emoção Predominante</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.emocao_predominante}</p></div>
                      )}
                      {h.sensacao_corporal && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Sensação Corporal</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.sensacao_corporal}</p></div>
                      )}
                      {(h.amplificacao_pessoal || []).length > 0 && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Amplificação Pessoal</p>
                          {h.amplificacao_pessoal.map((a: any, i: number) => (
                            <div key={i} className="ml-2 mb-2">
                              <p className="text-xs text-[#F5F1E8]/70 font-medium">• {a.elemento}</p>
                              {a.significado && <p className="text-xs text-[#F5F1E8]/50 ml-3">Significado: {a.significado}</p>}
                              {a.memorias && <p className="text-xs text-[#F5F1E8]/50 ml-3">Memórias: {a.memorias}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {(h.amplificacao_arquetipica || []).length > 0 && (
                        <div><p className="text-xs font-medium text-[#556B57] mb-1">Amplificação Arquetípica</p>
                          {h.amplificacao_arquetipica.map((a: any, i: number) => (
                            <div key={i} className="ml-2 mb-2">
                              <p className="text-xs text-[#F5F1E8]/70 font-medium">• {a.simbolo}</p>
                              {a.mitos && <p className="text-xs text-[#F5F1E8]/50 ml-3">Mitos: {a.mitos}</p>}
                              {a.padrao && <p className="text-xs text-[#F5F1E8]/50 ml-3">Padrão: {a.padrao}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {h.pergunta_compensar && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">O que o sonho tenta compensar?</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.pergunta_compensar}</p></div>
                      )}
                      {h.pergunta_perspectiva && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Que perspectiva o sonho oferece?</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.pergunta_perspectiva}</p></div>
                      )}
                      {h.pergunta_conselho && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Se fosse um conselho?</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.pergunta_conselho}</p></div>
                      )}
                      {h.resposta_ao_sonho && (
                        <div><p className="text-xs font-medium text-[#C9A24A] mb-1">Resposta ao Sonho</p>
                          <p className="text-xs text-[#F5F1E8]/60 whitespace-pre-wrap">{h.resposta_ao_sonho}</p></div>
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
