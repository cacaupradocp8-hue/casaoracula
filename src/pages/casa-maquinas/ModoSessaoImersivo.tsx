import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCidadelaMap } from '@/hooks/useCidadelaMap';
import CidadelaMapSVG from '@/components/cidadela/CidadelaMapSVG';
import { useSessionMode, type SessionMode } from '@/hooks/useSessionMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, Save, Play, Pause, Square, BookOpen, Map, FileText,
  Clock, ArrowLeft, Hash, Sparkles, User, AlertCircle, Castle, Key, Brain, Compass
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SessionModeSelector } from '@/components/casa-maquinas/SessionModeSelector';
import { SessionModeIndicator } from '@/components/casa-maquinas/SessionModeIndicator';

// ─── Timer Hook ───
function useSessionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const stop = () => { setRunning(false); setSeconds(0); };
  const formatted = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return { seconds, running, start, pause, stop, formatted };
}

function extractTags(text: string): string[] {
  const matches = text.match(/#\w+/g);
  return matches ? [...new Set(matches.map(t => t.toLowerCase()))] : [];
}

interface ClientData {
  id: string; nome: string; status: string; objetivo_terapeutico: string | null;
}
interface PastSession {
  id: string; date: string; notes: string | null; insight: string | null; district_name?: string;
}
interface ActiveDistrict {
  district_id: string; district_name: string; state: string; sessions_count: number;
}
interface SuggestedTool {
  id: string; title: string; type: string; content: string;
}

export default function ModoSessaoImersivo() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const timer = useSessionTimer();
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { updateFromSession } = useCidadelaMap();
  const sessionMode = useSessionMode();

  // Mode initialization
  const initialMode = searchParams.get('modo') as SessionMode | null;
  const [modeSelectorOpen, setModeSelectorOpen] = useState(!initialMode);

  useEffect(() => {
    if (initialMode && !sessionMode.mode) {
      sessionMode.selectMode(initialMode);
    }
  }, [initialMode]);

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<ClientData | null>(null);
  const [prontuario, setProntuario] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [activeDistricts, setActiveDistricts] = useState<ActiveDistrict[]>([]);
  const [suggestedTools, setSuggestedTools] = useState<SuggestedTool[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  // Session registration fields
  const [sessDistrict, setSessDistrict] = useState('');
  const [sessTorre, setSessTorre] = useState('');
  const [sessPorta, setSessPorta] = useState('');
  const [sessArquetipo, setSessArquetipo] = useState('');
  const [sessInsight, setSessInsight] = useState('');
  const [sessFerramenta, setSessFerramenta] = useState('');

  useEffect(() => {
    if (!user || !clienteId) return;
    loadAll();
  }, [user, clienteId]);

  // Orácula mode: auto-fetch initial suggestion
  useEffect(() => {
    if (sessionMode.mode === 'oracula' && !sessionMode.nextStep && !loading) {
      sessionMode.fetchInitialSuggestion();
    }
  }, [sessionMode.mode, loading]);

  async function loadAll() {
    setLoading(true);
    try {
      await Promise.all([loadClient(), loadPastSessions(), loadActiveDistricts()]);
    } finally {
      setLoading(false);
    }
  }

  async function loadClient() {
    const { data } = await supabase
      .from('clientes').select('id, nome, status, objetivo_terapeutico')
      .eq('id', clienteId!).single();
    if (data) setClient(data);
  }

  async function loadPastSessions() {
    const { data } = await supabase
      .from('sessions').select('id, date, notes, insight, district_id, districts(name)')
      .eq('client_id', clienteId!).order('date', { ascending: false }).limit(10);
    if (data) {
      setPastSessions(data.map((s: any) => ({
        id: s.id, date: s.date, notes: s.notes, insight: s.insight,
        district_name: s.districts?.name,
      })));
    }
  }

  async function loadActiveDistricts() {
    const { data: journeys } = await supabase
      .from('journeys').select('id').eq('client_id', clienteId!).limit(1);
    if (journeys && journeys.length > 0) {
      const { data: jd } = await supabase
        .from('journey_districts').select('district_id, state, sessions_count, districts(name)')
        .eq('journey_id', journeys[0].id).eq('state', 'ativo');
      if (jd) {
        setActiveDistricts(jd.map((d: any) => ({
          district_id: d.district_id, district_name: d.districts?.name || '—',
          state: d.state, sessions_count: d.sessions_count || 0,
        })));
        loadSuggestedTools(jd.map((d: any) => d.district_id));
      }
    }
  }

  async function loadSuggestedTools(districtIds: string[]) {
    if (districtIds.length === 0) return;
    setLoadingSuggestions(true);
    try {
      const { data } = await supabase
        .from('interventions').select('id, title, type, content, district_id')
        .in('district_id', districtIds).eq('ativa', true).limit(5);
      if (data) {
        setSuggestedTools(data.map(d => ({ id: d.id, title: d.title, type: d.type, content: d.content })));
      }
    } finally {
      setLoadingSuggestions(false);
    }
  }

  const handleProntuarioChange = useCallback((value: string) => {
    setProntuario(value);
    setTags(extractTags(value));
    setAutoSaved(false);
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => setAutoSaved(true), 2000);
  }, []);

  async function handleSaveSession(finalize = false) {
    if (!client || !user) return;
    setSaving(true);

    const { error } = await supabase.from('sessions').insert({
      client_id: client.id, user_id: user.id,
      notes: prontuario || null, insight: sessInsight || null, task: null,
    } as any);

    if (error) {
      toast.error('Erro ao salvar sessão');
      setSaving(false);
      return;
    }

    // Auto-update CidaDELA map (always in Orácula, on finalize in Livre)
    if (finalize && clienteId) {
      await updateFromSession(clienteId, {
        distrito: sessDistrict || undefined,
        torre: sessTorre || undefined,
        porta: sessPorta || undefined,
        arquetipo: sessArquetipo || undefined,
        ferramenta: sessFerramenta || undefined,
        insight: sessInsight || undefined,
      });
    }

    toast.success(finalize ? 'Sessão finalizada' : 'Sessão salva');
    setSaving(false);

    if (finalize) {
      timer.stop();
      navigate('/casa-das-maquinas');
    }
  }

  const handleModeSelect = (mode: SessionMode) => {
    sessionMode.selectMode(mode);
    setModeSelectorOpen(false);
  };

  const handleFollowNextStep = (rota: string) => {
    sessionMode.fetchNextStep(rota);
    navigate(rota);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border/50 max-w-sm">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <p className="text-foreground">Cliente não encontrado.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/casa-das-maquinas/clientes')}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lastSession = pastSessions[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Mode Selector */}
      <SessionModeSelector
        open={modeSelectorOpen}
        onSelect={handleModeSelect}
        onClose={() => { if (!sessionMode.mode) sessionMode.selectMode('livre'); setModeSelectorOpen(false); }}
      />

      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center justify-between px-4 py-2 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/casa-das-maquinas')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Modo Sessão</h1>
              <p className="text-xs text-muted-foreground">{client.nome}</p>
            </div>
            {/* Mode indicator in top bar */}
            {sessionMode.mode && (
              <SessionModeIndicator
                mode={sessionMode.mode}
                onToggle={sessionMode.toggleMode}
                compact
              />
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm text-foreground tabular-nums">{timer.formatted}</span>
            {!timer.running ? (
              <Button variant="ghost" size="icon" onClick={timer.start} className="h-7 w-7">
                <Play className="w-3.5 h-3.5 text-primary" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={timer.pause} className="h-7 w-7">
                <Pause className="w-3.5 h-3.5 text-primary" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={timer.stop} className="h-7 w-7" disabled={timer.seconds === 0}>
              <Square className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSaveSession(false)} disabled={saving || !prontuario.trim()} className="gap-1.5 text-xs">
              <Save className="w-3.5 h-3.5" /> Salvar
            </Button>
            <Button variant="gold" size="sm" onClick={() => handleSaveSession(true)} disabled={saving} className="gap-1.5 text-xs">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Finalizar Sessão'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-screen-2xl mx-auto" style={{ height: 'calc(100vh - 49px)' }}>
        {/* Editor Area */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs font-mono bg-primary/10 text-primary border-primary/20">
                  <Hash className="w-2.5 h-2.5 mr-0.5" />{tag.replace('#', '')}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex-1 relative">
            <Textarea
              value={prontuario}
              onChange={e => handleProntuarioChange(e.target.value)}
              placeholder="Escreva suas anotações de sessão aqui...&#10;&#10;Use #tags para marcar temas (ex: #ArquétipoGuardiã, #TorreSilêncio)"
              className="h-full w-full resize-none bg-card/30 border-border/30 text-foreground placeholder:text-muted-foreground/40 text-sm leading-relaxed focus:ring-primary/30"
            />
            {autoSaved && (
              <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/50">✓ Auto-salvo</span>
            )}
          </div>
        </motion.div>

        {/* Contextual Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-80 border-l border-border/30 bg-card/20 flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-5">
              {/* Client Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{client.nome}</p>
                  <Badge variant="secondary" className="text-[10px]">{client.status}</Badge>
                </div>
              </div>
              {client.objetivo_terapeutico && (
                <p className="text-xs text-muted-foreground italic leading-relaxed">{client.objetivo_terapeutico}</p>
              )}

              <Separator className="bg-border/20" />

              {/* Orácula Mode: Next Step Suggestion */}
              {sessionMode.mode === 'oracula' && (
                <>
                  <SessionModeIndicator
                    mode={sessionMode.mode}
                    onToggle={sessionMode.toggleMode}
                    nextStep={sessionMode.nextStep}
                    loadingNext={sessionMode.loadingNext}
                    onFollowNextStep={handleFollowNextStep}
                  />
                  <Separator className="bg-border/20" />
                </>
              )}

              {/* Livre Mode: Optional suggestion */}
              {sessionMode.mode === 'livre' && (
                <>
                  <SessionModeIndicator
                    mode={sessionMode.mode}
                    onToggle={sessionMode.toggleMode}
                    onRequestSuggestion={sessionMode.fetchInitialSuggestion}
                    nextStep={sessionMode.nextStep}
                    loadingNext={sessionMode.loadingNext}
                    onFollowNextStep={handleFollowNextStep}
                  />
                  <Separator className="bg-border/20" />
                </>
              )}

              {/* Last Session */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Última Sessão</h3>
                {lastSession ? (
                  <div className="text-xs space-y-1">
                    <p className="text-foreground/70">{new Date(lastSession.date).toLocaleDateString('pt-BR')}</p>
                    {lastSession.district_name && <Badge variant="outline" className="text-[10px]">{lastSession.district_name}</Badge>}
                    {lastSession.notes && <p className="text-muted-foreground line-clamp-3 leading-relaxed">{lastSession.notes}</p>}
                    {lastSession.insight && <p className="text-primary/70 text-[11px]">✦ {lastSession.insight}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Primeira sessão</p>
                )}
              </div>

              <Separator className="bg-border/20" />

              {/* Active Districts */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Distritos Ativos</h3>
                {activeDistricts.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeDistricts.map(d => (
                      <div key={d.district_id} className="flex items-center justify-between text-xs">
                        <span className="text-foreground/80">{d.district_name}</span>
                        <span className="text-muted-foreground font-mono">{d.sessions_count}x</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhum distrito ativo</p>
                )}
              </div>

              <Separator className="bg-border/20" />

              {/* Session Registration Fields */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Castle className="w-3 h-3 text-primary" /> Registro da CidaDELA
                </h3>
                {sessionMode.mode === 'oracula' && (
                  <p className="text-[9px] text-primary/50 mb-2 italic">O mapa será atualizado automaticamente ao finalizar.</p>
                )}
                <div className="space-y-2">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Distrito visitado</Label>
                    <Input value={sessDistrict} onChange={e => setSessDistrict(e.target.value)} placeholder="Ex: Torres" className="h-7 text-xs bg-background/30 border-border/30" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Porta trabalhada</Label>
                    <Input value={sessPorta} onChange={e => setSessPorta(e.target.value)} placeholder="Ex: Porta do Medo" className="h-7 text-xs bg-background/30 border-border/30" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Arquétipo emergente</Label>
                    <Input value={sessArquetipo} onChange={e => setSessArquetipo(e.target.value)} placeholder="Ex: Guardiã" className="h-7 text-xs bg-background/30 border-border/30" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Ferramenta utilizada</Label>
                    <Input value={sessFerramenta} onChange={e => setSessFerramenta(e.target.value)} placeholder="Ex: Atlas de Arquétipos" className="h-7 text-xs bg-background/30 border-border/30" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Insight clínico</Label>
                    <Textarea value={sessInsight} onChange={e => setSessInsight(e.target.value)} placeholder="Insight desta sessão..." className="min-h-[50px] text-xs bg-background/30 border-border/30" />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/20" />

              {/* Suggested Tools */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Ferramentas Sugeridas
                </h3>
                {loadingSuggestions ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
                ) : suggestedTools.length > 0 ? (
                  <div className="space-y-2">
                    {suggestedTools.slice(0, 3).map(tool => (
                      <div key={tool.id} className="p-2 rounded-md bg-background/50 border border-border/20">
                        <p className="text-xs font-medium text-foreground/80">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{tool.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Sem sugestões disponíveis</p>
                )}
              </div>

              <Separator className="bg-border/20" />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs border-border/30">
                      <Map className="w-3.5 h-3.5" /> Ver Mapa da CidaDELA
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Mapa da CidaDELA — {client.nome}</DialogTitle>
                    </DialogHeader>
                    <div className="py-6">
                      {activeDistricts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {activeDistricts.map(d => (
                            <Card key={d.district_id} className="bg-background/50 border-primary/20">
                              <CardContent className="p-3">
                                <p className="text-sm font-medium text-foreground">{d.district_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-[10px]">{d.state}</Badge>
                                  <span className="text-[10px] text-muted-foreground">{d.sessions_count} sessões</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">Nenhum distrito ativo ainda.</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs border-border/30">
                      <FileText className="w-3.5 h-3.5" /> Ver Prontuário Completo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Histórico — {client.nome}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      <div className="space-y-4 py-4">
                        {pastSessions.length > 0 ? pastSessions.map(s => (
                          <div key={s.id} className="border-b border-border/10 pb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-foreground/70">{new Date(s.date).toLocaleDateString('pt-BR')}</span>
                              {s.district_name && <Badge variant="outline" className="text-[10px]">{s.district_name}</Badge>}
                            </div>
                            {s.insight && <p className="text-xs text-primary/80 mb-1">✦ {s.insight}</p>}
                            {s.notes && <p className="text-xs text-muted-foreground leading-relaxed">{s.notes}</p>}
                          </div>
                        )) : (
                          <p className="text-sm text-muted-foreground text-center">Sem sessões anteriores.</p>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs border-border/30">
                      <BookOpen className="w-3.5 h-3.5" /> Acessar Biblioteca
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Biblioteca de Intervenções</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      <div className="space-y-3 py-4">
                        {suggestedTools.length > 0 ? suggestedTools.map(tool => (
                          <Card key={tool.id} className="bg-background/50 border-border/20">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-foreground">{tool.title}</p>
                                <Badge variant="secondary" className="text-[10px]">{tool.type}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{tool.content}</p>
                            </CardContent>
                          </Card>
                        )) : (
                          <p className="text-sm text-muted-foreground text-center">
                            Acesse a{' '}
                            <button className="text-primary underline" onClick={() => navigate('/casa-das-maquinas/biblioteca')}>
                              Biblioteca completa
                            </button>
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </ScrollArea>
        </motion.aside>
      </div>
    </div>
  );
}
