import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import type { MandalaDistrict, MandalaDistrictState } from '@/components/cidadela/MandalaCidadela';
import {
  Play, Pause, SkipBack, SkipForward, X, ArrowLeftRight,
  MapPin, Wrench, MessageCircle, Sparkles, Key, Brain,
  Compass, Clock, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionData {
  id: string;
  district_id: string | null;
  created_at: string;
  date?: string;
  checkin_state: string | null;
  tool_id: string | null;
  oracle_card_id: string | null;
  insight: string | null;
  task?: string | null;
}

interface StateChange {
  district_id: string;
  to_state: string;
  created_at: string;
  session_id?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  sessions: SessionData[];
  districts: MandalaDistrict[];
  journeyDistricts: MandalaDistrictState[];
  tools: any[];
  oracleCards: any[];
  stateChanges: StateChange[];
}

type EventType = 'insight' | 'porta' | 'arquetipo' | 'integrado' | 'ativo' | 'ferramenta';

interface TimelineEvent {
  type: EventType;
  label: string;
  sessionIndex: number;
}

const EVENT_ICONS: Record<EventType, { icon: typeof Sparkles; color: string }> = {
  insight: { icon: MessageCircle, color: '#6366F1' },
  porta: { icon: Key, color: '#E879A0' },
  arquetipo: { icon: Brain, color: '#C9A24A' },
  integrado: { icon: Compass, color: '#556B57' },
  ativo: { icon: MapPin, color: '#C9A24A' },
  ferramenta: { icon: Wrench, color: '#3B82F6' },
};

const PLAYBACK_INTERVAL = 3000; // 3 seconds per session — contemplative pace

export function ReplayJornada({
  open, onClose, sessions, districts, journeyDistricts,
  tools, oracleCards, stateChanges,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = mapa atual
  const [isPlaying, setIsPlaying] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const orderedSessions = useMemo(() =>
    [...sessions].sort((a, b) =>
      new Date(a.created_at || a.date || '').getTime() - new Date(b.created_at || b.date || '').getTime()
    ), [sessions]);

  // Build cumulative district states at each session point
  const statesAtSession = useMemo(() => {
    const snapshots: MandalaDistrictState[][] = [];
    const cumulative: Record<string, MandalaDistrictState> = {};

    // Initialize all districts as inativo
    districts.forEach(d => {
      cumulative[d.id] = { district_id: d.id, state: 'inativo', sessions_count: 0, last_session_at: null };
    });

    orderedSessions.forEach((session, i) => {
      // Activate district if session has one
      if (session.district_id && cumulative[session.district_id]) {
        const prev = cumulative[session.district_id];
        if (prev.state === 'inativo') {
          cumulative[session.district_id] = {
            ...prev,
            state: 'ativo',
            sessions_count: (prev.sessions_count || 0) + 1,
            last_session_at: session.created_at,
          };
        } else {
          cumulative[session.district_id] = {
            ...prev,
            sessions_count: (prev.sessions_count || 0) + 1,
            last_session_at: session.created_at,
          };
        }
      }

      // Apply state changes that happened at or before this session
      stateChanges.forEach(sc => {
        const scTime = new Date(sc.created_at).getTime();
        const sessionTime = new Date(session.created_at).getTime();
        if (scTime <= sessionTime && cumulative[sc.district_id]) {
          cumulative[sc.district_id] = {
            ...cumulative[sc.district_id],
            state: sc.to_state as any,
          };
        }
      });

      snapshots.push(Object.values({ ...cumulative }).map(v => ({ ...v })));
    });

    return snapshots;
  }, [orderedSessions, districts, stateChanges]);

  // Timeline events
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    orderedSessions.forEach((s, i) => {
      if (s.insight) events.push({ type: 'insight', label: s.insight.slice(0, 40) + '…', sessionIndex: i });
      if (s.tool_id) {
        const tool = tools.find(t => t.id === s.tool_id);
        if (tool) events.push({ type: 'ferramenta', label: tool.nome, sessionIndex: i });
      }
    });
    stateChanges.forEach(sc => {
      const idx = orderedSessions.findIndex(s =>
        new Date(s.created_at).getTime() >= new Date(sc.created_at).getTime()
      );
      if (idx >= 0) {
        const d = districts.find(dd => dd.id === sc.district_id);
        const name = d?.nome || 'Distrito';
        if (sc.to_state === 'integrado') {
          events.push({ type: 'integrado', label: `${name} integrado`, sessionIndex: idx });
        } else if (sc.to_state === 'ativo') {
          events.push({ type: 'ativo', label: `${name} ativado`, sessionIndex: idx });
        }
      }
    });
    return events;
  }, [orderedSessions, stateChanges, districts, tools]);

  // Current display states
  const displayStates = useMemo(() => {
    if (currentIndex < 0 || currentIndex >= statesAtSession.length) return journeyDistricts;
    return statesAtSession[currentIndex];
  }, [currentIndex, statesAtSession, journeyDistricts]);

  // Path points for mandala
  const INNER_RING_NUMS = [1, 2, 3, 4, 5, 6];
  const cx = 50, cy = 50, innerR = 24, outerR = 40;
  const getPos = (num: number) => {
    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12];
    const idx = ring.indexOf(num);
    const r = isInner ? innerR : outerR;
    const angle = ((idx / ring.length) * 360 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const pathPoints = useMemo(() => {
    const visited = displayStates
      .filter(jd => jd.state !== 'inativo' && jd.last_session_at)
      .sort((a, b) => new Date(a.last_session_at!).getTime() - new Date(b.last_session_at!).getTime());
    return visited.map(jd => {
      const d = districts.find(dd => dd.id === jd.district_id);
      return d ? getPos(d.numero) : null;
    }).filter(Boolean) as { x: number; y: number }[];
  }, [displayStates, districts]);

  // Playback controls
  const startPlayback = useCallback(() => {
    setIsPlaying(true);
    setCurrentIndex(0);
  }, []);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (playRef.current) clearInterval(playRef.current);
    playRef.current = null;
  }, []);

  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= orderedSessions.length - 1) {
            stopPlayback();
            return prev;
          }
          return prev + 1;
        });
      }, PLAYBACK_INTERVAL);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, orderedSessions.length, stopPlayback]);

  useEffect(() => {
    if (!open) {
      stopPlayback();
      setCurrentIndex(-1);
      setCompareMode(false);
    }
  }, [open, stopPlayback]);

  const currentSession = currentIndex >= 0 ? orderedSessions[currentIndex] : null;
  const currentDistrict = currentSession?.district_id
    ? districts.find(d => d.id === currentSession.district_id)
    : null;
  const currentTool = currentSession?.tool_id
    ? tools.find(t => t.id === currentSession.tool_id)
    : null;
  const currentCard = currentSession?.oracle_card_id
    ? oracleCards.find(c => c.id === currentSession.oracle_card_id)
    : null;

  const eventsAtCurrent = timelineEvents.filter(e => e.sessionIndex === currentIndex);

  // Comparison stats
  const initialStates = statesAtSession[0] || [];
  const finalStates = journeyDistricts;
  const initialActive = initialStates.filter(s => s.state !== 'inativo').length;
  const initialIntegrated = initialStates.filter(s => s.state === 'integrado').length;
  const finalActive = finalStates.filter(s => s.state !== 'inativo').length;
  const finalIntegrated = finalStates.filter(s => s.state === 'integrado').length;

  if (orderedSessions.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-[#0B1B2B] border-[#C9A24A]/15 p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#C9A24A]/10 shrink-0">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#C9A24A]/60" />
            <div>
              <h2 className="text-sm font-medium text-[#F5F1E8]/80">Replay da Jornada da Psique</h2>
              <p className="text-[10px] text-[#F5F1E8]/30">
                {currentIndex >= 0
                  ? `Sessão ${currentIndex + 1} de ${orderedSessions.length}`
                  : 'Mapa Atual'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => setCompareMode(!compareMode)}
              className={`text-xs h-8 gap-1.5 border-[#C9A24A]/15 ${compareMode ? 'bg-[#C9A24A]/10 text-[#C9A24A]' : 'text-[#F5F1E8]/50 hover:text-[#C9A24A]'}`}
            >
              <ArrowLeftRight className="w-3 h-3" />
              Comparar
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-[#F5F1E8]/30 hover:text-[#F5F1E8]/60 h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            {compareMode ? (
              <div className="flex gap-6 w-full max-w-[900px]">
                {/* Initial state */}
                <div className="flex-1 flex flex-col items-center">
                  <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-wider mb-3">Sessão Inicial</p>
                  <MandalaCidadela
                    districts={districts}
                    districtStates={initialStates}
                    mode="clinico"
                    pathPoints={[]}
                    onDistrictClick={() => {}}
                    className="w-full max-w-[360px] transition-all duration-700"
                  />
                  <div className="flex gap-3 mt-3">
                    <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]/60">{initialActive} ativos</Badge>
                    <Badge variant="outline" className="text-[9px] border-[#556B57]/20 text-[#556B57]">{initialIntegrated} integrados</Badge>
                  </div>
                </div>
                {/* Divider */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#C9A24A]/20 to-transparent" />
                  <ArrowLeftRight className="w-4 h-4 text-[#C9A24A]/30" />
                  <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#C9A24A]/20 to-transparent" />
                </div>
                {/* Current state */}
                <div className="flex-1 flex flex-col items-center">
                  <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-wider mb-3">Estado Atual</p>
                  <MandalaCidadela
                    districts={districts}
                    districtStates={finalStates}
                    mode="clinico"
                    pathPoints={pathPoints}
                    onDistrictClick={() => {}}
                    className="w-full max-w-[360px] transition-all duration-700"
                  />
                  <div className="flex gap-3 mt-3">
                    <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]/60">{finalActive} ativos</Badge>
                    <Badge variant="outline" className="text-[9px] border-[#556B57]/20 text-[#556B57]">{finalIntegrated} integrados</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <MandalaCidadela
                  districts={districts}
                  districtStates={displayStates}
                  mode="clinico"
                  pathPoints={pathPoints}
                  onDistrictClick={() => {}}
                  showConnections
                  className="w-full max-w-[500px] transition-all duration-700 ease-in-out"
                />
                <MandalaLegend mode="clinico" />
              </>
            )}

            {/* Ethical notice */}
            <div className="absolute bottom-2 left-4 flex items-center gap-1.5 opacity-40">
              <Eye className="w-3 h-3 text-[#C9A24A]" />
              <span className="text-[8px] text-[#C9A24A] italic">Leitura simbólica. Não substitui julgamento clínico.</span>
            </div>
          </div>

          {/* Side panel — Session summary */}
          <div className="w-[280px] border-l border-[#C9A24A]/10 bg-[#0B1B2B]/80 flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-[#C9A24A]/10">
              <h3 className="text-[10px] uppercase tracking-wider text-[#C9A24A]/50 font-semibold">
                {currentIndex >= 0 ? 'Resumo da Sessão' : 'Visão Geral'}
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {currentIndex >= 0 && currentSession ? (
                  <>
                    {/* Date */}
                    <div>
                      <p className="text-[9px] text-[#F5F1E8]/30 uppercase">Data</p>
                      <p className="text-xs text-[#F5F1E8]/70">
                        {format(new Date(currentSession.created_at || currentSession.date || ''), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                    </div>

                    {/* District */}
                    {currentDistrict && (
                      <div>
                        <p className="text-[9px] text-[#F5F1E8]/30 uppercase">Distrito Visitado</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3 text-[#C9A24A]/60" />
                          <p className="text-xs text-[#F5F1E8]/70 font-medium">{currentDistrict.nome}</p>
                        </div>
                      </div>
                    )}

                    {/* Tool */}
                    {currentTool && (
                      <div>
                        <p className="text-[9px] text-[#F5F1E8]/30 uppercase">Ferramenta Utilizada</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Wrench className="w-3 h-3 text-[#3B82F6]/60" />
                          <p className="text-xs text-[#F5F1E8]/60">{currentTool.nome}</p>
                        </div>
                      </div>
                    )}

                    {/* Oracle card */}
                    {currentCard && (
                      <div>
                        <p className="text-[9px] text-[#F5F1E8]/30 uppercase">Carta Oracular</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[#C9A24A]/60">✦</span>
                          <p className="text-xs text-[#C9A24A]/60 italic">{currentCard.name}</p>
                        </div>
                      </div>
                    )}

                    {/* Insight */}
                    {currentSession.insight && (
                      <div>
                        <p className="text-[9px] text-[#F5F1E8]/30 uppercase">Insight Clínico</p>
                        <p className="text-[11px] text-[#F5F1E8]/50 italic leading-relaxed mt-1">
                          "{currentSession.insight}"
                        </p>
                      </div>
                    )}

                    {/* Check-in state */}
                    {currentSession.checkin_state && (
                      <div>
                        <p className="text-[9px] text-[#F5F1E8]/30 uppercase">Estado no Check-in</p>
                        <Badge variant="outline" className={`mt-1 text-[9px] ${
                          currentSession.checkin_state === 'presente' ? 'border-[#556B57]/30 text-[#556B57]'
                          : currentSession.checkin_state === 'instavel' ? 'border-yellow-400/30 text-yellow-400'
                          : 'border-red-400/30 text-red-400'
                        }`}>
                          {currentSession.checkin_state}
                        </Badge>
                      </div>
                    )}

                    {/* Events at this session */}
                    {eventsAtCurrent.length > 0 && (
                      <div>
                        <p className="text-[9px] text-[#F5F1E8]/30 uppercase mb-2">Eventos Nesta Sessão</p>
                        <div className="space-y-1.5">
                          {eventsAtCurrent.map((evt, i) => {
                            const conf = EVENT_ICONS[evt.type];
                            const Icon = conf.icon;
                            return (
                              <div key={i} className="flex items-center gap-2 py-1 px-2 rounded bg-[#F5F1E8]/[0.02] border border-[#F5F1E8]/5">
                                <Icon className="w-3 h-3 shrink-0" style={{ color: conf.color }} />
                                <span className="text-[10px] text-[#F5F1E8]/50 truncate">{evt.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Snapshot stats */}
                    <div className="pt-2 border-t border-[#C9A24A]/10">
                      <p className="text-[9px] text-[#F5F1E8]/30 uppercase mb-2">Estado do Mapa</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center py-2 rounded bg-[#C9A24A]/5 border border-[#C9A24A]/10">
                          <p className="text-lg font-bold text-[#C9A24A]">{displayStates.filter(s => s.state !== 'inativo').length}</p>
                          <p className="text-[8px] text-[#F5F1E8]/30">Explorados</p>
                        </div>
                        <div className="text-center py-2 rounded bg-[#556B57]/5 border border-[#556B57]/10">
                          <p className="text-lg font-bold text-[#556B57]">{displayStates.filter(s => s.state === 'integrado').length}</p>
                          <p className="text-[8px] text-[#F5F1E8]/30">Integrados</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-[#F5F1E8]/50 leading-relaxed">
                      Use o controle temporal abaixo para navegar entre sessões e observar a evolução da CidaDELA Interior.
                    </p>
                    <p className="text-[10px] text-[#F5F1E8]/30 italic">
                      Cada sessão revela um fragmento da travessia. O mapa guarda a memória de cada passagem.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="text-center py-2 rounded bg-[#C9A24A]/5 border border-[#C9A24A]/10">
                        <p className="text-lg font-bold text-[#C9A24A]">{finalActive}</p>
                        <p className="text-[8px] text-[#F5F1E8]/30">Explorados</p>
                      </div>
                      <div className="text-center py-2 rounded bg-[#556B57]/5 border border-[#556B57]/10">
                        <p className="text-lg font-bold text-[#556B57]">{finalIntegrated}</p>
                        <p className="text-[8px] text-[#F5F1E8]/30">Integrados</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-[9px] text-[#F5F1E8]/30 uppercase mb-2">Total de Sessões</p>
                      <p className="text-2xl font-bold text-[#F5F1E8]/60">{orderedSessions.length}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="px-5 py-3 border-t border-[#C9A24A]/10 shrink-0 space-y-3">
          {/* Timeline with event markers */}
          <TooltipProvider delayDuration={200}>
            <div className="relative">
              {/* Event markers */}
              <div className="absolute -top-5 left-0 right-0 h-4 pointer-events-auto">
                {timelineEvents.map((evt, i) => {
                  const pos = ((evt.sessionIndex) / Math.max(orderedSessions.length - 1, 1)) * 100;
                  const conf = EVENT_ICONS[evt.type];
                  const Icon = conf.icon;
                  return (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <button
                          className="absolute -translate-x-1/2 cursor-pointer hover:scale-125 transition-transform"
                          style={{ left: `${pos}%` }}
                          onClick={() => { stopPlayback(); setCurrentIndex(evt.sessionIndex); }}
                        >
                          <Icon className="w-3 h-3" style={{ color: conf.color }} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#0B1B2B] border-[#C9A24A]/20 text-[#F5F1E8]/70 text-[10px] max-w-[200px]">
                        <p>{evt.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Slider */}
              <Slider
                value={[currentIndex >= 0 ? currentIndex : 0]}
                min={0}
                max={Math.max(orderedSessions.length - 1, 0)}
                step={1}
                onValueChange={([v]) => { stopPlayback(); setCurrentIndex(v); }}
                className="w-full"
              />

              {/* Session labels */}
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-[#F5F1E8]/20">
                  {orderedSessions.length > 0
                    ? format(new Date(orderedSessions[0].created_at || orderedSessions[0].date || ''), 'dd/MM/yy', { locale: ptBR })
                    : ''}
                </span>
                <span className="text-[8px] text-[#F5F1E8]/20">
                  {orderedSessions.length > 0
                    ? format(new Date(orderedSessions[orderedSessions.length - 1].created_at || orderedSessions[orderedSessions.length - 1].date || ''), 'dd/MM/yy', { locale: ptBR })
                    : ''}
                </span>
              </div>
            </div>
          </TooltipProvider>

          {/* Playback controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost" size="sm"
              onClick={() => { stopPlayback(); setCurrentIndex(-1); }}
              className="text-[#F5F1E8]/40 hover:text-[#F5F1E8]/70 h-8 text-xs gap-1"
            >
              <SkipBack className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost" size="sm"
              onClick={() => { stopPlayback(); setCurrentIndex(Math.max(0, currentIndex - 1)); }}
              className="text-[#F5F1E8]/40 hover:text-[#F5F1E8]/70 h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={isPlaying ? stopPlayback : startPlayback}
              className={`h-9 px-5 gap-2 border-[#C9A24A]/20 text-xs ${
                isPlaying
                  ? 'bg-[#C9A24A]/10 text-[#C9A24A] border-[#C9A24A]/30'
                  : 'text-[#F5F1E8]/60 hover:text-[#C9A24A] hover:border-[#C9A24A]/30'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pausar' : 'Reproduzir Jornada'}
            </Button>
            <Button
              variant="ghost" size="sm"
              onClick={() => { stopPlayback(); setCurrentIndex(Math.min(orderedSessions.length - 1, currentIndex + 1)); }}
              className="text-[#F5F1E8]/40 hover:text-[#F5F1E8]/70 h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost" size="sm"
              onClick={() => { stopPlayback(); setCurrentIndex(-1); }}
              className="text-[#F5F1E8]/40 hover:text-[#F5F1E8]/70 h-8 text-xs gap-1"
            >
              <SkipForward className="w-3 h-3" />
              Atual
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
