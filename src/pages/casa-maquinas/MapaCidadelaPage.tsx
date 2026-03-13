import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import type { MandalaDistrict, MandalaDistrictState } from '@/components/cidadela/MandalaCidadela';
import { DistrictPanel } from '@/components/casa-maquinas/DistrictPanel';
import { JourneyTimeline } from '@/components/casa-maquinas/JourneyTimeline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, ArrowLeft, Maximize2, Minimize2, Sparkles, Clock, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

export default function MapaCidadelaPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cliente, setCliente] = useState<any>(null);
  const [districts, setDistricts] = useState<MandalaDistrict[]>([]);
  const [journeyDistricts, setJourneyDistricts] = useState<MandalaDistrictState[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [oracleCards, setOracleCards] = useState<any[]>([]);
  const [manualChanges, setManualChanges] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const [selectedDistrict, setSelectedDistrict] = useState<MandalaDistrict | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showConnections, setShowConnections] = useState(true);

  useEffect(() => {
    if (clienteId) loadAll();
  }, [clienteId]);

  const loadAll = async () => {
    setLoading(true);
    const [clienteRes, distRes, toolsRes, sessRes] = await Promise.all([
      supabase.from('clientes').select('id, nome').eq('id', clienteId!).single(),
      supabase.from('districts').select('*').order('numero'),
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
      supabase.from('sessions').select('id, district_id, created_at, checkin_state, tool_id, oracle_card_id, insight, task').eq('client_id', clienteId!).order('created_at', { ascending: true }),
    ]);

    setCliente(clienteRes.data);
    setDistricts(distRes.data || []);
    setTools(toolsRes.data || []);
    setSessions(sessRes.data || []);

    // Oracle cards
    const cardIds = (sessRes.data || []).map((s: any) => s.oracle_card_id).filter(Boolean);
    if (cardIds.length > 0) {
      const { data: cards } = await supabase
        .from('cidadela_oracle_cards').select('id, name, family, district_id').in('id', cardIds);
      setOracleCards(cards || []);
    }

    // Journey districts
    const { data: journeys } = await supabase
      .from('journeys').select('id').eq('client_id', clienteId!).limit(1);

    if (journeys?.length) {
      const { data: jd } = await supabase
        .from('journey_districts').select('*').eq('journey_id', journeys[0].id);
      setJourneyDistricts((jd || []).map((j: any) => ({
        district_id: j.district_id,
        state: j.state,
        sessions_count: j.sessions_count,
        last_session_at: j.last_session_at,
      })));
    } else {
      // Create journey if none exists
      const { data: newJ } = await supabase
        .from('journeys').insert({ client_id: clienteId! }).select('id').single();
      if (newJ) {
        const allDists = distRes.data || [];
        const inserts = allDists.map(d => ({
          journey_id: newJ.id,
          district_id: d.id,
          state: 'inativo',
        }));
        if (inserts.length) {
          await supabase.from('journey_districts').insert(inserts);
          setJourneyDistricts(allDists.map(d => ({
            district_id: d.id,
            state: 'inativo' as const,
            sessions_count: 0,
            last_session_at: null,
          })));
        }
      }
    }

    // Manual state changes
    const { data: stateChanges } = await supabase
      .from('district_state_changes')
      .select('district_id, to_state')
      .eq('client_id', clienteId!)
      .eq('to_state', 'integrado');

    const manualMap: Record<string, boolean> = {};
    (stateChanges || []).forEach((sc: any) => { manualMap[sc.district_id] = true; });
    setManualChanges(manualMap);

    setLoading(false);
  };

  const getState = (id: string) => journeyDistricts.find(j => j.district_id === id)?.state || 'inativo';
  const getSessionCount = (id: string) => journeyDistricts.find(j => j.district_id === id)?.sessions_count || 0;

  // Path points
  const INNER_RING_NUMS = [1, 2, 3, 4, 5, 6];
  const cxM = 50, cyM = 50, innerR = 24, outerR = 40;
  const getPos = (num: number) => {
    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12];
    const idx = ring.indexOf(num);
    const count = ring.length;
    const r = isInner ? innerR : outerR;
    const angle = ((idx / count) * 360 - 90) * (Math.PI / 180);
    return { x: cxM + r * Math.cos(angle), y: cyM + r * Math.sin(angle) };
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

  const exploredCount = journeyDistricts.filter(jd => jd.state !== 'inativo').length;
  const integratedCount = journeyDistricts.filter(jd => jd.state === 'integrado').length;

  if (loading) {
    return (
      <CasaMaquinasLayout title="Mapa da CidaDELA">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title={`Mapa da CidaDELA Interior — ${cliente?.nome || ''}`} subtitle="Cartografia da psique interior">
      {/* Ethical notice */}
      <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-[#C9A24A]/5 border border-[#C9A24A]/10 mb-4">
        <Eye className="w-4 h-4 text-[#C9A24A]/50 mt-0.5 shrink-0" />
        <p className="text-[10px] text-[#C9A24A]/50 italic">
          Ferramenta de leitura simbólica. Não substitui julgamento clínico.
        </p>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
          onClick={() => navigate(`/casa-das-maquinas/clientes/${clienteId}`)}
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar ao Perfil
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[8px] border-[#C9A24A]/20 text-[#C9A24A]/60">{exploredCount} explorados</Badge>
            <Badge variant="outline" className="text-[8px] border-[#556B57]/20 text-[#556B57]">{integratedCount} integrados</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
            onClick={() => setShowConnections(!showConnections)}
          >
            {showConnections ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
            Caminhos
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
            onClick={() => setShowTimeline(true)}
          >
            <Clock className="w-3 h-3" /> Linha do tempo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 className="w-3 h-3" />
            Tela Cheia
          </Button>
        </div>
      </div>

      {/* Mandala */}
      <MandalaCidadela
        districts={districts}
        districtStates={journeyDistricts}
        mode="clinico"
        selectedId={selectedDistrict?.id}
        pathPoints={pathPoints}
        onDistrictClick={handleClick}
        showConnections={showConnections}
        className="w-full max-w-[600px] mx-auto"
      />
      <MandalaLegend mode="clinico" />

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-[#0B1B2B] border-[#C9A24A]/15 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-[#F5F1E8]/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A24A]/60" />
              CidaDELA Interior — {cliente?.nome}
            </h2>
            <Button variant="outline" size="sm" className="border-[#C9A24A]/15 text-[#C9A24A]/70 text-xs h-8 gap-1.5"
              onClick={() => setFullscreen(false)}>
              <Minimize2 className="w-3 h-3" />
              Sair
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
              showConnections={showConnections}
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
        clienteId={clienteId!}
        isManuallyIntegrated={selectedDistrict ? !!manualChanges[selectedDistrict.id] : false}
        onStateChanged={loadAll}
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
    </CasaMaquinasLayout>
  );
}
