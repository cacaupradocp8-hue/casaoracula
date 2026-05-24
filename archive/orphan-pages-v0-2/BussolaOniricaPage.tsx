import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Moon, BookOpen, Sparkles, Save, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const SIMBOLOS_CHAVE = [
  { key: 'pes', label: 'Pés', icon: '🦶' },
  { key: 'joelhos', label: 'Joelhos', icon: '🦵' },
  { key: 'deitar', label: 'Deitar', icon: '🛏️' },
  { key: 'estradas', label: 'Estradas', icon: '🛤️' },
  { key: 'voos', label: 'Voos', icon: '🕊️' },
  { key: 'maos', label: 'Mãos', icon: '🤲' },
  { key: 'bocas', label: 'Bocas', icon: '👄' },
  { key: 'dentes', label: 'Dentes', icon: '🦷' },
];

const DISTRITOS = [
  'Portão da Chegada', 'Torres', 'Portas', 'Jardim dos Arquétipos',
  'Praça do Abalo', 'Casa dos Sonhos', 'Espelho dos Vínculos', 'Forja',
  'Conselho Interior', 'Labirinto', 'Praça da Integração', 'Portal de Renascimento',
];

const LABIRINTOS = [
  'Autossabotagem', 'Abandono', 'Controle', 'Perfeccionismo',
  'Codependência', 'Invisibilidade', 'Raiva Contida', 'Desconexão Corporal',
];

type View = 'register' | 'analysis' | 'history';

export default function BussolaOniricaPage() {
  const { user } = useAuth();
  const { clienteId } = useParams<{ clienteId: string }>();
  const [view, setView] = useState<View>('register');

  // Register state
  const [descricao, setDescricao] = useState('');
  const [simbolos, setSimbolos] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  // Analysis state
  const [interpretacao, setInterpretacao] = useState('');
  const [distritos, setDistritos] = useState<string[]>([]);
  const [labirintos, setLabirintos] = useState<string[]>([]);
  const [praticas, setPraticas] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // History state
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSimbolo = (key: string) => {
    setSimbolos(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };
  const toggleDistrito = (d: string) => {
    setDistritos(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };
  const toggleLabirinto = (l: string) => {
    setLabirintos(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  };

  const handleAnalyze = async () => {
    if (!descricao.trim()) { toast.error('Descreva o sonho antes de analisar'); return; }
    setAnalyzing(true);

    try {
      const selectedLabels = simbolos.map(k => SIMBOLOS_CHAVE.find(s => s.key === k)?.label || k);

      const { data, error } = await supabase.functions.invoke('bussola-onirica', {
        body: { descricao_sonho: descricao, simbolos_chave: selectedLabels },
      });

      if (error) throw error;

      setInterpretacao(data.interpretacao || '');
      setDistritos(data.distritos_sugeridos || []);
      setLabirintos(data.labirintos_sugeridos || []);
      setPraticas(data.praticas_sugeridas || []);
      setView('analysis');
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || 'Erro ao analisar sonho';
      toast.error(msg);
    }
    setAnalyzing(false);
  };

  const handleSave = async () => {
    if (!user || !clienteId) return;
    setSaving(true);
    const selectedLabels = simbolos.map(k => SIMBOLOS_CHAVE.find(s => s.key === k)?.label || k);

    const { error } = await supabase.from('sonhos_cabalisticos').insert({
      client_id: clienteId,
      therapist_id: user.id,
      descricao_sonho: descricao,
      simbolos_chave: selectedLabels,
      interpretacao_ia: interpretacao,
      distritos_relacionados: distritos,
      labirintos_potenciais: labirintos,
      praticas_sugeridas: praticas,
    } as any);

    if (error) {
      console.error(error);
      toast.error('Erro ao salvar análise');
    } else {
      toast.success('Análise onírica salva ✨');
      setDescricao('');
      setSimbolos([]);
      setInterpretacao('');
      setDistritos([]);
      setLabirintos([]);
      setPraticas([]);
      setView('register');
    }
    setSaving(false);
  };

  const loadHistory = async () => {
    if (!clienteId) return;
    setLoadingHistory(true);
    const { data } = await supabase
      .from('sonhos_cabalisticos')
      .select('*')
      .eq('client_id', clienteId)
      .order('data_registro', { ascending: false });
    setHistory(data || []);
    setLoadingHistory(false);
  };

  const openHistory = () => { setView('history'); loadHistory(); };

  return (
    <CasaMaquinasLayout
      title="Bússola Onírica"
      subtitle="Decifrando os Sonhos Cabalísticos — leitura simbólica do campo onírico"
    >
      <AnimatePresence mode="wait">
        {/* ─── REGISTER ─── */}
        {view === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Moon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Registre o sonho da cliente e deixe a Bússola Onírica oferecer uma leitura simbólica
                com base na tradição cabalística e na psicologia arquetípica.
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={openHistory}>
                <BookOpen className="w-4 h-4 mr-2" /> Ver Histórico
              </Button>
            </div>

            <Card className="border-border/10 bg-card/60">
              <CardContent className="p-5 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Descrição do Sonho</label>
                  <Textarea
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Descreva o sonho com o máximo de detalhes: cenário, personagens, sensações, movimentos..."
                    className="min-h-[180px] bg-card border-border/20 placeholder:text-muted-foreground/30"
                    maxLength={5000}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Símbolos-Chave</label>
                  <div className="flex flex-wrap gap-2">
                    {SIMBOLOS_CHAVE.map(s => (
                      <button
                        key={s.key}
                        onClick={() => toggleSimbolo(s.key)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${
                          simbolos.includes(s.key)
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'border-border/20 text-muted-foreground hover:border-border/40'
                        }`}
                      >
                        <span>{s.icon}</span> {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !descricao.trim()}
                  variant="gold"
                  className="w-full"
                >
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analisando sonho...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Analisar Sonho</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <p className="text-[10px] text-center text-muted-foreground/40">
              Ferramenta de leitura simbólica. Não substitui julgamento clínico.
            </p>
          </motion.div>
        )}

        {/* ─── ANALYSIS ─── */}
        {view === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5 max-w-2xl mx-auto"
          >
            <Button variant="ghost" size="sm" onClick={() => setView('register')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao registro
            </Button>

            {/* Sonho original */}
            <Card className="border-border/10 bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Moon className="w-4 h-4" /> Sonho Registrado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 whitespace-pre-line">{descricao}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {simbolos.map(k => {
                    const s = SIMBOLOS_CHAVE.find(x => x.key === k);
                    return s ? (
                      <Badge key={k} variant="outline" className="text-[10px] border-primary/20 text-primary">
                        {s.icon} {s.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Interpretação IA */}
            <Card className="border-primary/10 bg-primary/[0.02]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Interpretação Cabalística Sugerida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{interpretacao}</p>
              </CardContent>
            </Card>

            {/* Distritos */}
            <Card className="border-border/10 bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">Distritos da CidaDELA Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {DISTRITOS.map(d => (
                    <button
                      key={d}
                      onClick={() => toggleDistrito(d)}
                      className={`rounded-full px-3 py-1 text-xs transition-all border ${
                        distritos.includes(d)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-border/20 text-muted-foreground hover:border-border/40'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Labirintos */}
            <Card className="border-border/10 bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">Labirintos Potenciais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {LABIRINTOS.map(l => (
                    <button
                      key={l}
                      onClick={() => toggleLabirinto(l)}
                      className={`rounded-full px-3 py-1 text-xs transition-all border ${
                        labirintos.includes(l)
                          ? 'bg-destructive/10 border-destructive/30 text-destructive'
                          : 'border-border/20 text-muted-foreground hover:border-border/40'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Práticas sugeridas */}
            {praticas.length > 0 && (
              <Card className="border-border/10 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Sugestões de Práticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {praticas.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="w-5 h-5 rounded-full bg-accent/10 text-accent-foreground text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Button onClick={handleSave} disabled={saving} variant="gold" className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar Análise
            </Button>

            <p className="text-[10px] text-center text-muted-foreground/40">
              Leitura simbólica do campo onírico. Não substitui julgamento clínico.
            </p>
          </motion.div>
        )}

        {/* ─── HISTORY ─── */}
        {view === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <Button variant="ghost" size="sm" onClick={() => setView('register')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao registro
            </Button>

            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" /> Histórico de Sonhos
            </h2>

            {loadingHistory ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-center text-muted-foreground/40 py-10">Nenhum sonho registrado ainda</p>
            ) : (
              <div className="space-y-2">
                {history.map((h: any) => {
                  const isExpanded = expandedId === h.id;
                  return (
                    <Card
                      key={h.id}
                      className="border-border/10 bg-card/60 cursor-pointer transition-colors hover:border-border/20"
                      onClick={() => setExpandedId(isExpanded ? null : h.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{h.descricao_sonho}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {new Date(h.data_registro).toLocaleDateString('pt-BR', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {h.simbolos_chave?.length > 0 && (
                              <Badge variant="outline" className="text-[9px] border-border/20 text-muted-foreground">
                                {h.simbolos_chave.length} símbolos
                              </Badge>
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-border/10 space-y-3"
                          >
                            <p className="text-xs text-foreground/70 whitespace-pre-line">{h.descricao_sonho}</p>

                            {h.simbolos_chave?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {(h.simbolos_chave as string[]).map((s: string) => (
                                  <Badge key={s} variant="outline" className="text-[9px] border-primary/20 text-primary">{s}</Badge>
                                ))}
                              </div>
                            )}

                            {h.interpretacao_ia && (
                              <div className="bg-primary/[0.03] rounded-lg p-3">
                                <p className="text-[10px] font-semibold text-primary mb-1">Interpretação Cabalística</p>
                                <p className="text-xs text-foreground/70 whitespace-pre-line">{h.interpretacao_ia}</p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-1">
                              {(h.distritos_relacionados as string[] || []).map((d: string) => (
                                <Badge key={d} variant="outline" className="text-[8px] border-accent/20 text-accent-foreground">{d}</Badge>
                              ))}
                              {(h.labirintos_potenciais as string[] || []).map((l: string) => (
                                <Badge key={l} variant="outline" className="text-[8px] border-destructive/20 text-destructive">{l}</Badge>
                              ))}
                            </div>

                            {(h.praticas_sugeridas as string[] || []).length > 0 && (
                              <div>
                                <p className="text-[10px] font-semibold text-muted-foreground mb-1">Práticas Sugeridas</p>
                                <ul className="space-y-1">
                                  {(h.praticas_sugeridas as string[]).map((p: string, i: number) => (
                                    <li key={i} className="text-[10px] text-foreground/60">• {p}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </CasaMaquinasLayout>
  );
}
