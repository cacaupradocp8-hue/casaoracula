import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Sparkles, Maximize2, Minimize2, PlayCircle, FileText } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DistrictPanel } from './DistrictPanel';
import { JourneyTimeline } from './JourneyTimeline';
import { ReplayJornada } from './ReplayJornada';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import { MandalaMobile } from '@/components/cidadela/MandalaMobile';
import { useIsMobile } from '@/hooks/use-mobile';
import type { MandalaDistrict, MandalaDistrictState } from '@/components/cidadela/MandalaCidadela';

export function CidadelaMap({ clienteId }: { clienteId: string }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [districts, setDistricts] = useState<MandalaDistrict[]>([]);
  const [journeyDistricts, setJourneyDistricts] = useState<MandalaDistrictState[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [oracleCards, setOracleCards] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<MandalaDistrict | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manualChanges, setManualChanges] = useState<Record<string, boolean>>({});
  const [stateChangesList, setStateChangesList] = useState<any[]>([]);

  useEffect(() => { loadData(); }, [clienteId]);

  const loadData = async () => {
    const [distRes, toolsRes, sessRes] = await Promise.all([
      supabase.from('districts').select('*').order('numero'),
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
      supabase.from('sessions').select('id, district_id, created_at, checkin_state, tool_id, oracle_card_id, insight, task').eq('client_id', clienteId).order('created_at', { ascending: true }),
    ]);

    setDistricts(distRes.data || []);
    setTools(toolsRes.data || []);
    setSessions(sessRes.data || []);

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

  // Build path points for the mandala
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
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>;
  }

  const mapContent = (maxW: string) => (
    <>
      {isMobile ? (
        <MandalaMobile
          districts={districts}
          districtStates={journeyDistricts}
          mode="clinico"
          selectedId={selectedDistrict?.id}
          onDistrictClick={handleClick}
        />
      ) : (
        <>
          <MandalaCidadela
            districts={districts}
            districtStates={journeyDistricts}
            mode="clinico"
            selectedId={selectedDistrict?.id}
            pathPoints={pathPoints}
            onDistrictClick={handleClick}
            showConnections={true}
            className={`w-full ${maxW} mx-auto`}
          />
          <MandalaLegend mode="clinico" />
        </>
      )}
    </>
  );

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A24A]/60" />
          <h3 className="text-sm font-medium text-[#F5F1E8]/70">Mapa Evolutivo da CidaDELA Interior</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-8 gap-1.5" onClick={() => setFullscreen(true)}>
            <Maximize2 className="w-3 h-3" /> Tela Cheia
          </Button>
          <Button variant="outline" size="sm" className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-8 gap-1.5" onClick={() => setShowTimeline(true)}>
            <Clock className="w-3 h-3" /> Linha do tempo
          </Button>
          {sessions.length >= 2 && (
            <Button variant="outline" size="sm" className="border-[#6366F1]/20 text-[#6366F1]/70 hover:text-[#6366F1] hover:border-[#6366F1]/30 text-xs h-8 gap-1.5" onClick={() => setShowReplay(true)}>
              <PlayCircle className="w-3 h-3" /> Replay
            </Button>
          )}
        </div>
      </div>

      {mapContent('max-w-[520px]')}

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
            {mapContent('max-w-[700px]')}
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
    </div>
  );
}
