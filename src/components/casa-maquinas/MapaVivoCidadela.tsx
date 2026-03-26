import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCidadelaMap, type ClientCidadelaMap } from '@/hooks/useCidadelaMap';
import { useCartografiaGPS, type CartografiaGPSResult, type GPSDistrictState } from '@/hooks/useCartografiaGPS';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import { MandalaMobile } from '@/components/cidadela/MandalaMobile';
import { useIsMobile } from '@/hooks/use-mobile';
import type { MandalaDistrict, MandalaDistrictState } from '@/components/cidadela/MandalaCidadela';
import { DistrictPanel } from './DistrictPanel';
import { JourneyTimeline } from './JourneyTimeline';
import { ReplayJornada } from './ReplayJornada';
import { RelatorioNarrativo } from './RelatorioNarrativo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Loader2, Clock, Sparkles, Maximize2, Minimize2,
  Castle, Key, Brain, Compass, Wrench, Eye, PlayCircle, FileText,
  MapPin, AlertTriangle, CheckCircle2
} from 'lucide-react';

interface Props {
  clienteId: string;
  compact?: boolean; // Mini mode for client detail page
}

export function MapaVivoCidadela({ clienteId, compact = false }: Props) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { fetchMap } = useCidadelaMap();
  const { loadClientCartografia, computeDistrictStates } = useCartografiaGPS();
  const [cidadelaMap, setCidadelaMap] = useState<ClientCidadelaMap | null>(null);
  const [clientCartografia, setClientCartografia] = useState<CartografiaGPSResult | null>(null);
  const [districts, setDistricts] = useState<MandalaDistrict[]>([]);
  const [journeyDistricts, setJourneyDistricts] = useState<MandalaDistrictState[]>([]);
  const [gpsStates, setGpsStates] = useState<GPSDistrictState[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [oracleCards, setOracleCards] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<MandalaDistrict | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [showNarrativo, setShowNarrativo] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manualChanges, setManualChanges] = useState<Record<string, boolean>>({});
  const [stateChangesList, setStateChangesList] = useState<any[]>([]);

  useEffect(() => { loadData(); }, [clienteId]);

  const loadData = async () => {
    const [distRes, toolsRes, sessRes, mapData] = await Promise.all([
      supabase.from('districts').select('*').order('numero'),
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
      supabase.from('sessions').select('id, district_id, created_at, checkin_state, tool_id, oracle_card_id, insight, task').eq('client_id', clienteId).order('created_at', { ascending: true }),
      fetchMap(clienteId),
    ]);

    setDistricts(distRes.data || []);
    setTools(toolsRes.data || []);
    setSessions(sessRes.data || []);
    setCidadelaMap(mapData);

    const cardIds = (sessRes.data || []).map((s: any) => s.oracle_card_id).filter(Boolean);
    if (cardIds.length > 0) {
      const { data: cards } = await supabase
        .from('cidadela_oracle_cards').select('id, name, family, district_id').in('id', cardIds);
      setOracleCards(cards || []);
    }

    const { data: journeys } = await supabase
      .from('journeys').select('id').eq('client_id', clienteId).limit(1);

    if (journeys?.length) {
      const { data: jd } = await supabase
        .from('journey_districts').select('*').eq('journey_id', journeys[0].id);
      setJourneyDistricts((jd || []).map((j: any) => ({
        district_id: j.district_id,
        state: j.state,
        sessions_count: j.sessions_count,
        last_session_at: j.last_session_at,
      })));
    }

    const { data: stateChanges } = await supabase
      .from('district_state_changes')
      .select('district_id, to_state, created_at')
      .eq('client_id', clienteId)
      .order('created_at', { ascending: true });

    setStateChangesList(stateChanges || []);

    const manualMap: Record<string, boolean> = {};
    (stateChanges || []).filter((sc: any) => sc.to_state === 'integrado').forEach((sc: any) => { manualMap[sc.district_id] = true; });
    setManualChanges(manualMap);

    setLoading(false);
  };

  const getState = (id: string) => journeyDistricts.find(j => j.district_id === id)?.state || 'inativo';
  const getSessionCount = (id: string) => journeyDistricts.find(j => j.district_id === id)?.sessions_count || 0;

  const INNER_RING_NUMS = [1, 2, 3, 4, 5, 6];
  const cx = 50, cy = 50, innerR = 24, outerR = 40;

  const getPos = (num: number) => {
    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12];
    const idx = ring.indexOf(num);
    const count = ring.length;
    const r = isInner ? innerR : outerR;
    const angle = ((idx / count) * 360 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const visitedPath = journeyDistricts
    .filter(jd => jd.state !== 'inativo' && jd.last_session_at)
    .sort((a, b) => new Date(a.last_session_at!).getTime() - new Date(b.last_session_at!).getTime());

  const pathPoints = useMemo(() =>
    visitedPath.map(jd => {
      const d = districts.find(dd => dd.id === jd.district_id);
      return d ? getPos(d.numero) : null;
    }).filter(Boolean) as { x: number; y: number }[],
    [visitedPath, districts]
  );

  const handleClick = (d: MandalaDistrict) => {
    setSelectedDistrict(d);
    setPanelOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>;
  }

  // Symbolic data cards
  const symbolicCards = [
    { icon: Castle, label: 'Torres', items: cidadelaMap?.torres_identificadas || [], color: '#C9A24A' },
    { icon: Key, label: 'Portas', items: cidadelaMap?.portas_cruzadas || [], color: '#6366F1' },
    { icon: Brain, label: 'Arquétipos', items: cidadelaMap?.arquetipos_emergentes || [], color: '#E879A0' },
    { icon: Compass, label: 'Labirintos', items: cidadelaMap?.labirintos_visitados || [], color: '#556B57' },
    { icon: Wrench, label: 'Ferramentas', items: cidadelaMap?.ferramentas_utilizadas || [], color: '#3B82F6' },
  ];

  const exploredCount = journeyDistricts.filter(jd => jd.state !== 'inativo').length;
  const integratedCount = journeyDistricts.filter(jd => jd.state === 'integrado').length;

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]/60" />
            <h3 className="text-xs font-medium text-[#F5F1E8]/60">Mapa da CidaDELA</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[8px] border-[#C9A24A]/20 text-[#C9A24A]/60">{exploredCount} explorados</Badge>
            <Badge variant="outline" className="text-[8px] border-[#556B57]/20 text-[#556B57]">{integratedCount} integrados</Badge>
          </div>
        </div>
        <MandalaCidadela
          districts={districts}
          districtStates={journeyDistricts}
          mode="clinico"
          selectedId={selectedDistrict?.id}
          pathPoints={pathPoints}
          onDistrictClick={handleClick}
          className="w-full max-w-[280px] mx-auto"
        />
        <MandalaLegend mode="clinico" />

        <DistrictPanel
          district={selectedDistrict}
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          state={selectedDistrict ? getState(selectedDistrict.id) : 'inativo'}
          sessionCount={selectedDistrict ? getSessionCount(selectedDistrict.id) : 0}
          tools={selectedDistrict ? tools.filter((t: any) => t.district_id === selectedDistrict.id) : []}
          sessions={selectedDistrict ? sessions.filter((s: any) => s.district_id === selectedDistrict?.id) : []}
          clienteId={clienteId}
          isManuallyIntegrated={selectedDistrict ? !!manualChanges[selectedDistrict.id] : false}
          onStateChanged={loadData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ethical notice */}
      <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-[#C9A24A]/5 border border-[#C9A24A]/10">
        <Eye className="w-4 h-4 text-[#C9A24A]/50 mt-0.5 shrink-0" />
        <p className="text-[10px] text-[#C9A24A]/50 italic">
          Ferramenta de leitura simbólica. Não substitui julgamento clínico.
        </p>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A24A]/60 shrink-0" />
          <h3 className="text-sm font-medium text-[#F5F1E8]/70 whitespace-nowrap">Mapa Vivo — CidaDELA Interior</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-8 gap-1.5 whitespace-nowrap" onClick={() => setFullscreen(true)}>
            <Maximize2 className="w-3 h-3" /> Tela Cheia
          </Button>
          <Button variant="outline" size="sm" className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-8 gap-1.5 whitespace-nowrap" onClick={() => setShowTimeline(true)}>
            <Clock className="w-3 h-3" /> Linha do tempo
          </Button>
          {sessions.length >= 2 && (
            <Button variant="outline" size="sm" className="border-[#6366F1]/20 text-[#6366F1]/70 hover:text-[#6366F1] hover:border-[#6366F1]/30 text-xs h-8 gap-1.5 whitespace-nowrap" onClick={() => setShowReplay(true)}>
              <PlayCircle className="w-3 h-3" /> Replay
            </Button>
          )}
          {sessions.length >= 1 && (
            <Button variant="outline" size="sm" className="border-[#556B57]/20 text-[#556B57]/70 hover:text-[#556B57] hover:border-[#556B57]/30 text-xs h-8 gap-1.5 whitespace-nowrap" onClick={() => setShowNarrativo(true)}>
              <FileText className="w-3 h-3" /> Narrativa
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-[#C9A24A]">{exploredCount}</p>
            <p className="text-[10px] text-[#F5F1E8]/40">Explorados</p>
          </CardContent>
        </Card>
        <Card className="border-[#556B57]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-[#556B57]">{integratedCount}</p>
            <p className="text-[10px] text-[#F5F1E8]/40">Integrados</p>
          </CardContent>
        </Card>
        <Card className="border-[#F5F1E8]/5 bg-[#0B1B2B]/60">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-[#F5F1E8]/60">{sessions.length}</p>
            <p className="text-[10px] text-[#F5F1E8]/40">Sessões</p>
          </CardContent>
        </Card>
      </div>

      {/* Mandala */}
      <MandalaCidadela
        districts={districts}
        districtStates={journeyDistricts}
        mode="clinico"
        selectedId={selectedDistrict?.id}
        pathPoints={pathPoints}
        onDistrictClick={handleClick}
        showConnections={true}
        className="w-full max-w-[520px] mx-auto"
      />
      <MandalaLegend mode="clinico" />

      {/* Symbolic Data Cards */}
      {cidadelaMap && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#F5F1E8]/40 uppercase tracking-wider">
            Territórios Simbólicos Registrados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {symbolicCards.map(({ icon: Icon, label, items, color }) => (
              <Card key={label} className="border-[#C9A24A]/8 bg-[#0B1B2B]/60">
                <CardContent className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: `${color}80` }} />
                    <span className="text-[10px] font-medium" style={{ color: `${color}CC` }}>{label}</span>
                    <Badge variant="outline" className="text-[7px] ml-auto py-0" style={{ borderColor: `${color}30`, color: `${color}80` }}>
                      {items.length}
                    </Badge>
                  </div>
                  {items.length > 0 ? (
                    <div className="space-y-0.5">
                      {items.slice(0, 4).map((item, i) => (
                        <p key={i} className="text-[9px] text-[#F5F1E8]/40 truncate">• {item}</p>
                      ))}
                      {items.length > 4 && (
                        <p className="text-[8px] text-[#F5F1E8]/20">+{items.length - 4} mais</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[8px] text-[#F5F1E8]/20 italic">Nenhum registro</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {cidadelaMap && cidadelaMap.insights_ia && cidadelaMap.insights_ia.length > 0 && (
        <Card className="border-[#6366F1]/15 bg-[#6366F1]/5">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-[#6366F1]/70 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Insights da Jornada
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="space-y-1.5">
              {(cidadelaMap.insights_ia as any[]).slice(-5).reverse().map((insight: any, i: number) => (
                <p key={i} className="text-[10px] text-[#F5F1E8]/50 leading-relaxed">
                  ✦ {typeof insight === 'string' ? insight : insight.text}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-[#0B1B2B] border-[#C9A24A]/15 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-[#F5F1E8]/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A24A]/60" />
              CidaDELA Interior — Tela Cheia
            </h2>
            <Button variant="outline" size="sm" className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5" onClick={() => setFullscreen(false)}>
              <Minimize2 className="w-3 h-3" /> Sair
            </Button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
            <MandalaCidadela
              districts={districts}
              districtStates={journeyDistricts}
              mode="clinico"
              selectedId={selectedDistrict?.id}
              pathPoints={pathPoints}
              onDistrictClick={handleClick}
              className="w-full max-w-[700px] mx-auto"
            />
            <MandalaLegend mode="clinico" />
          </div>
        </DialogContent>
      </Dialog>

      {/* District Panel */}
      <DistrictPanel
        district={selectedDistrict}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        state={selectedDistrict ? getState(selectedDistrict.id) : 'inativo'}
        sessionCount={selectedDistrict ? getSessionCount(selectedDistrict.id) : 0}
        tools={selectedDistrict ? tools.filter((t: any) => t.district_id === selectedDistrict.id) : []}
        sessions={selectedDistrict ? sessions.filter((s: any) => s.district_id === selectedDistrict?.id) : []}
        clienteId={clienteId}
        isManuallyIntegrated={selectedDistrict ? !!manualChanges[selectedDistrict.id] : false}
        onStateChanged={loadData}
      />

      {/* Journey Timeline */}
      <JourneyTimeline
        open={showTimeline}
        onClose={() => setShowTimeline(false)}
        sessions={sessions}
        districts={districts}
        oracleCards={oracleCards}
        tools={tools}
      />

      {/* Replay da Jornada */}
      <ReplayJornada
        open={showReplay}
        onClose={() => setShowReplay(false)}
        sessions={sessions}
        districts={districts}
        journeyDistricts={journeyDistricts}
        tools={tools}
        oracleCards={oracleCards}
        stateChanges={stateChangesList}
      />

      {/* Relatório Narrativo */}
      <RelatorioNarrativo
        open={showNarrativo}
        onClose={() => setShowNarrativo(false)}
        clienteId={clienteId}
      />
    </div>
  );
}
