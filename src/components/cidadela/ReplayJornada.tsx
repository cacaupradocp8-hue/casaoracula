import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CidadelaMapSVG, { type DistrictDisplayState } from './CidadelaMapSVG';
import {
  Play, Pause, SkipBack, SkipForward, GitCompare,
  Clock, MapPin, Wrench, Sparkles, Eye, KeyRound,
  Compass, Milestone, X,
} from 'lucide-react';

interface SessionSnapshot {
  sessionId: string;
  date: string;
  districtName: string | null;
  districtId: string | null;
  events: Array<{
    id: string;
    evento: string | null;
    distrito: string | null;
    detalhe: string | null;
    created_at: string;
    tool_id: string | null;
  }>;
  stateChanges: Array<{
    district_id: string;
    to_state: string;
    reason: string | null;
  }>;
}

interface TimelineEvent {
  type: 'insight' | 'porta' | 'arquetipo' | 'ferramenta' | 'integrado';
  label: string;
  sessionIndex: number;
}

interface ReplayJornadaProps {
  clienteId: string;
  onClose: () => void;
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  insight: Sparkles,
  porta: KeyRound,
  arquetipo: Eye,
  ferramenta: Wrench,
  integrado: Milestone,
};

const EVENT_COLORS: Record<string, string> = {
  insight: '#D4B96E',
  porta: '#7C6BC4',
  arquetipo: '#5B8E63',
  ferramenta: '#4F7C82',
  integrado: '#6BAF6E',
};

export default function ReplayJornada({ clienteId, onClose }: ReplayJornadaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch sessions for this client
  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ['replay-sessions', clienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('id, date, district_id, notes, created_at')
        .eq('client_id', clienteId)
        .order('date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
  });

  // Fetch all history events
  const { data: allHistory = [] } = useQuery({
    queryKey: ['replay-history', clienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('co_city_history')
        .select('*')
        .eq('client_id', clienteId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
  });

  // Fetch all state changes
  const { data: allStateChanges = [] } = useQuery({
    queryKey: ['replay-state-changes', clienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('district_state_changes')
        .select('district_id, from_state, to_state, reason, created_at')
        .eq('client_id', clienteId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
  });

  // Fetch districts for name resolution
  const { data: districts = [] } = useQuery({
    queryKey: ['replay-districts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('city_districts')
        .select('id, nome')
        .eq('ativo', true);
      if (error) throw error;
      return data || [];
    },
  });

  const districtNameById = useMemo(() => {
    const map: Record<string, string> = {};
    districts.forEach(d => { map[d.id] = d.nome; });
    return map;
  }, [districts]);

  // Build snapshots per session
  const snapshots = useMemo<SessionSnapshot[]>(() => {
    return sessions.map(session => {
      const sessionDate = new Date(session.date || session.created_at);
      const events = allHistory.filter(h => h.session_id === session.id);
      const stateChanges = allStateChanges.filter(sc => {
        const scDate = new Date(sc.created_at);
        return scDate <= sessionDate || sc.created_at <= (session.created_at || session.date);
      });

      return {
        sessionId: session.id,
        date: session.date || session.created_at,
        districtName: session.district_id ? districtNameById[session.district_id] || null : null,
        districtId: session.district_id,
        events,
        stateChanges: stateChanges.map(sc => ({
          district_id: sc.district_id,
          to_state: sc.to_state,
          reason: sc.reason,
        })),
      };
    });
  }, [sessions, allHistory, allStateChanges, districtNameById]);

  // Compute cumulative map state up to currentIndex
  const cumulativeMapState = useMemo(() => {
    const states: Record<string, DistrictDisplayState> = {};
    if (snapshots.length === 0) return states;

    const upTo = Math.min(currentIndex, snapshots.length - 1);

    // Apply all state changes up to this session
    for (let i = 0; i <= upTo; i++) {
      const snap = snapshots[i];
      // Mark session district as active for current, integrado for past
      if (snap.districtName) {
        const name = snap.districtName.toLowerCase();
        if (i < upTo) {
          if (states[name] !== 'integrado') states[name] = 'integrado';
        } else {
          states[name] = 'ativo';
        }
      }
      // Apply state changes
      snap.stateChanges.forEach(sc => {
        const dName = districtNameById[sc.district_id]?.toLowerCase();
        if (!dName) return;
        if (sc.to_state === 'integrado') states[dName] = 'integrado';
        else if (sc.to_state === 'ativo' || sc.to_state === 'em_tensao') {
          if (states[dName] !== 'integrado') states[dName] = sc.to_state === 'em_tensao' ? 'em_tensao' : 'ativo';
        }
      });
    }

    return states;
  }, [snapshots, currentIndex, districtNameById]);

  // Initial state (session 0) for comparison
  const initialMapState = useMemo(() => {
    if (snapshots.length === 0) return {};
    const states: Record<string, DistrictDisplayState> = {};
    const snap = snapshots[0];
    if (snap.districtName) {
      states[snap.districtName.toLowerCase()] = 'ativo';
    }
    snap.stateChanges.forEach(sc => {
      const dName = districtNameById[sc.district_id]?.toLowerCase();
      if (dName && sc.to_state === 'ativo') states[dName] = 'ativo';
    });
    return states;
  }, [snapshots, districtNameById]);

  // Build timeline events
  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = [];
    snapshots.forEach((snap, idx) => {
      snap.events.forEach(e => {
        const evento = (e.evento || '').toLowerCase();
        if (evento.includes('insight')) events.push({ type: 'insight', label: e.detalhe || 'Insight', sessionIndex: idx });
        else if (evento.includes('porta')) events.push({ type: 'porta', label: e.detalhe || 'Porta atravessada', sessionIndex: idx });
        else if (evento.includes('arqu')) events.push({ type: 'arquetipo', label: e.detalhe || 'Arquétipo emergente', sessionIndex: idx });
        else if (evento.includes('ferramenta')) events.push({ type: 'ferramenta', label: e.detalhe || 'Ferramenta utilizada', sessionIndex: idx });
      });
      snap.stateChanges.forEach(sc => {
        if (sc.to_state === 'integrado') {
          const dName = districtNameById[sc.district_id];
          events.push({ type: 'integrado', label: `${dName || 'Distrito'} integrado`, sessionIndex: idx });
        }
      });
    });
    return events;
  }, [snapshots, districtNameById]);

  // Current snapshot
  const currentSnap = snapshots[currentIndex] || null;

  // Playback
  useEffect(() => {
    if (isPlaying && snapshots.length > 1) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= snapshots.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, snapshots.length]);

  const togglePlay = useCallback(() => {
    if (currentIndex >= snapshots.length - 1) setCurrentIndex(0);
    setIsPlaying(p => !p);
  }, [currentIndex, snapshots.length]);

  // Count changes between initial and current for compare mode
  const compareStats = useMemo(() => {
    const initialKeys = Object.keys(initialMapState);
    const currentKeys = Object.keys(cumulativeMapState);
    const newDistricts = currentKeys.filter(k => !initialKeys.includes(k));
    const integrados = currentKeys.filter(k => cumulativeMapState[k] === 'integrado');
    return { initialCount: initialKeys.length, currentCount: currentKeys.length, newDistricts: newDistricts.length, integrados: integrados.length };
  }, [initialMapState, cumulativeMapState]);

  if (loadingSessions) {
    return (
      <div className="flex items-center justify-center py-20">
        <Clock className="w-5 h-5 animate-spin text-[hsl(var(--gold))]/50" />
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <Card className="border-[hsl(var(--gold))]/10 bg-[#0a0a14]/80">
        <CardContent className="p-6 text-center">
          <p className="text-xs text-[#F5F1E8]/40">Nenhuma sessão registrada para visualizar a jornada.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={onClose}>Voltar ao mapa</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#F5F1E8]/80 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#C9A24A]" />
          Replay da Jornada da Psique
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-[#F5F1E8]/40 h-7">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Timeline Slider */}
      <Card className="border-[#C9A24A]/10 bg-[#0a0a14]/80">
        <CardContent className="p-4 space-y-3">
          {/* Session labels */}
          <div className="flex items-center justify-between text-[9px] text-[#F5F1E8]/30">
            <span>Sessão 1</span>
            <span>Sessão {snapshots.length}</span>
          </div>

          {/* Slider with event markers */}
          <div className="relative">
            <Slider
              min={0}
              max={snapshots.length - 1}
              step={1}
              value={[currentIndex]}
              onValueChange={([v]) => { setCurrentIndex(v); setIsPlaying(false); }}
              className="w-full"
            />
            {/* Event markers */}
            <TooltipProvider>
              <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
                {timelineEvents.map((evt, i) => {
                  const left = snapshots.length > 1
                    ? `${(evt.sessionIndex / (snapshots.length - 1)) * 100}%`
                    : '50%';
                  const Icon = EVENT_ICONS[evt.type] || Sparkles;
                  const color = EVENT_COLORS[evt.type] || '#C9A24A';
                  return (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute -top-5 pointer-events-auto cursor-pointer"
                          style={{ left, transform: 'translateX(-50%)' }}
                        >
                          <Icon className="w-3 h-3" style={{ color }} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px] max-w-[200px]">
                        {evt.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[#F5F1E8]/40"
              onClick={() => { setCurrentIndex(0); setIsPlaying(false); }}>
              <SkipBack className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="sm"
              className="h-8 gap-1.5 border-[#C9A24A]/20 text-[#C9A24A]/70 text-xs"
              onClick={togglePlay}>
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pausar' : 'Reproduzir Jornada'}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[#F5F1E8]/40"
              onClick={() => { setCurrentIndex(snapshots.length - 1); setIsPlaying(false); }}>
              <SkipForward className="w-3.5 h-3.5" />
            </Button>
            <div className="w-px h-5 bg-[#F5F1E8]/10 mx-1" />
            <Button variant={compareMode ? 'default' : 'ghost'} size="sm"
              className={`h-7 gap-1 text-[10px] ${compareMode ? 'bg-[#C9A24A]/20 text-[#C9A24A]' : 'text-[#F5F1E8]/40'}`}
              onClick={() => setCompareMode(!compareMode)}>
              <GitCompare className="w-3 h-3" />
              Comparar
            </Button>
          </div>

          {/* Current session info */}
          <div className="text-center text-[10px] text-[#F5F1E8]/40">
            Sessão {currentIndex + 1} de {snapshots.length}
            {currentSnap && (
              <span className="ml-2 text-[#C9A24A]/50">
                {new Date(currentSnap.date).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map + Comparison */}
      <div className={`grid ${compareMode ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
        {compareMode && (
          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-wider text-[#F5F1E8]/30 text-center">Sessão Inicial</p>
            <div className="rounded-2xl border border-[#F5F1E8]/5 bg-[#0a0a14]/60 p-2">
              <CidadelaMapSVG
                districtStates={initialMapState}
                maxWidth={compareMode ? 300 : 620}
                forceCircular
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {compareMode && (
            <p className="text-[9px] uppercase tracking-wider text-[#F5F1E8]/30 text-center">
              Sessão {currentIndex + 1} — Atual
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="rounded-2xl border border-[#C9A24A]/10 bg-[#0a0a14]/80 p-2 md:p-4"
            >
              <CidadelaMapSVG
                districtStates={cumulativeMapState}
                activeDistrict={currentSnap?.districtName || null}
                maxWidth={compareMode ? 300 : 620}
                forceCircular
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Compare stats */}
      {compareMode && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2">
          <StatCard label="Distritos iniciais" value={compareStats.initialCount} />
          <StatCard label="Distritos atuais" value={compareStats.currentCount} />
          <StatCard label="Novos territórios" value={compareStats.newDistricts} color="#5B8E63" />
          <StatCard label="Integrados" value={compareStats.integrados} color="#6BAF6E" />
        </motion.div>
      )}

      {/* Session detail panel */}
      {currentSnap && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSnap.sessionId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-[#C9A24A]/10 bg-[#0a0a14]/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A24A]/60" />
                  <span className="text-xs text-[#F5F1E8]/70 font-medium">
                    Sessão {currentIndex + 1}
                  </span>
                  <span className="text-[10px] text-[#F5F1E8]/30">
                    {new Date(currentSnap.date).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <DetailItem
                    icon={MapPin}
                    label="Distrito visitado"
                    value={currentSnap.districtName || 'Não registrado'}
                  />
                  <DetailItem
                    icon={Wrench}
                    label="Eventos"
                    value={`${currentSnap.events.length} registro(s)`}
                  />
                  <DetailItem
                    icon={Sparkles}
                    label="Insight principal"
                    value={currentSnap.events.find(e => e.evento?.toLowerCase().includes('insight'))?.detalhe || '—'}
                  />
                  <DetailItem
                    icon={Eye}
                    label="Mudanças de estado"
                    value={`${currentSnap.stateChanges.filter(sc => sc.to_state === 'integrado').length} integração(ões)`}
                  />
                </div>

                {currentSnap.events.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F5F1E8]/5 space-y-1.5">
                    {currentSnap.events.slice(0, 5).map(evt => (
                      <div key={evt.id} className="flex items-start gap-2 text-[10px]">
                        <div className="w-1 h-1 rounded-full bg-[#C9A24A]/30 mt-1.5 shrink-0" />
                        <span className="text-[#F5F1E8]/40">{evt.evento}</span>
                        {evt.detalhe && (
                          <span className="text-[#F5F1E8]/25 truncate">{evt.detalhe}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Card className="border-[#F5F1E8]/5 bg-[#F5F1E8]/[0.02]">
      <CardContent className="p-3 text-center">
        <p className="text-lg font-semibold" style={{ color: color || '#C9A24A' }}>{value}</p>
        <p className="text-[9px] text-[#F5F1E8]/30">{label}</p>
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1 text-[9px] text-[#F5F1E8]/30 uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-[11px] text-[#F5F1E8]/60 truncate">{value}</p>
    </div>
  );
}
