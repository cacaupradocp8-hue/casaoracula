import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useCityDistricts, useFoundingArchetypes, useClientCityState,
  useClientArchetypeState, useCityHistory, useToolDistricts,
  type CityDistrict, type FoundingArchetype
} from '@/hooks/useMapaVivoCidadela';
import CidadelaMapSVG, { type DistrictDisplayState } from '@/components/cidadela/CidadelaMapSVG';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Loader2, Eye, Crown, Moon, Sparkles, Clock,
  Shield, Flame, Compass, Flower2, TreePine, Heart, Sword,
  Scroll, Droplets, Search, Gem, MapPin, Wrench, ChevronRight
} from 'lucide-react';

// ── Icon map for districts ──────────────────────
const DISTRICT_ICONS: Record<string, React.ElementType> = {
  gate: MapPin, maze: Compass, tower: Shield, garden: Flower2,
  moon: Moon, mirror: Gem, fire: Flame, compass: Search,
  circle: Sparkles,
};

const ARCHETYPE_ICONS: Record<string, React.ElementType> = {
  shield: Shield, threads: Compass, eye: Eye, 'moon-dark': Moon,
  heart: Heart, water: Droplets, sword: Sword, leaf: TreePine,
  key: Search, crown: Crown, scroll: Scroll, tree: TreePine,
};

interface DistrictVisualState {
  visited: boolean;
  active: boolean;
  hasArchetype: boolean;
  eventCount: number;
}

interface MapaVivoCidadelaV2Props {
  /** When true, shows the therapist's own CidaDELA using their user ID */
  selfMode?: boolean;
  /** Override the ID to load data for (useful in selfMode) */
  overrideId?: string;
  /** Custom title */
  title?: string;
  /** Hide CasaMaquinasLayout wrapper */
  standalone?: boolean;
}

export default function MapaVivoCidadelaV2({
  selfMode = false,
  overrideId,
  title: customTitle,
  standalone = false,
}: MapaVivoCidadelaV2Props = {}) {
  const { clienteId: paramClienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();

  const targetId = overrideId || paramClienteId;

  const { data: districts = [], isLoading: loadingDistricts } = useCityDistricts();
  const { data: archetypes = [] } = useFoundingArchetypes();
  const { data: cityState } = useClientCityState(selfMode ? undefined : targetId);
  const { data: archState } = useClientArchetypeState(selfMode ? undefined : targetId);
  const { data: history = [] } = useCityHistory(selfMode ? undefined : targetId);
  const { data: toolDistricts = [] } = useToolDistricts();

  // Load self data from auto_mapeamento + cartografia_psiquica when in selfMode
  const { data: selfMapData } = useQuery({
    queryKey: ['self-cidadela-map', overrideId],
    queryFn: async () => {
      if (!overrideId) return null;
      const [{ data: mapa }, { data: carto }] = await Promise.all([
        supabase.from('auto_mapeamento').select('*').eq('user_id', overrideId).maybeSingle(),
        supabase.from('cartografia_psiquica').select('*').eq('user_id', overrideId).order('created_at', { ascending: false }).limit(1),
      ]);
      return { mapa, carto: (carto as any[])?.[0] || null };
    },
    enabled: selfMode && !!overrideId,
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente-nome', targetId],
    queryFn: async () => {
      if (!targetId) return null;
      const { data } = await supabase.from('clientes').select('id, nome').eq('id', targetId).single();
      return data;
    },
    enabled: !selfMode && !!targetId,
  });

  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Resolve archetype names
  const regente = archetypes.find(a => a.id === archState?.arquitipo_regente_id);
  const sombra = archetypes.find(a => a.id === archState?.arquitipo_sombra_id);
  const evolucao = archetypes.find(a => a.id === archState?.arquitipo_evolucao_id);

  const archetypeDistricts = useMemo(() => {
    const highlighted = new Set<string>();

    archetypes.forEach((archetype) => {
      const isCurrent = archetype.id === archState?.arquitipo_regente_id
        || archetype.id === archState?.arquitipo_sombra_id
        || archetype.id === archState?.arquitipo_evolucao_id;

      if (!isCurrent || !archetype.distrito_principal_id) return;

      const district = districts.find((item) => item.id === archetype.distrito_principal_id);
      if (district?.nome) highlighted.add(district.nome.toLowerCase());
    });

    return Array.from(highlighted).reduce<Record<string, boolean>>((acc, districtName) => {
      acc[districtName] = true;
      return acc;
    }, {});
  }, [archState?.arquitipo_evolucao_id, archState?.arquitipo_regente_id, archState?.arquitipo_sombra_id, archetypes, districts]);

  const eventCounts = useMemo(() => {
    return history.reduce<Record<string, number>>((acc, event) => {
      const districtName = event.distrito?.toLowerCase();
      if (!districtName) return acc;
      acc[districtName] = (acc[districtName] || 0) + 1;
      return acc;
    }, {});
  }, [history]);

  // Build visual states for each district
  const districtVisualStates = useMemo(() => {
    const states: Record<string, DistrictVisualState> = {};

    if (selfMode && selfMapData?.mapa) {
      // Self mode: derive states from auto_mapeamento distritos_json
      const distritos = (selfMapData.mapa.distritos_json || {}) as Record<string, { nome: string; estado: string; icon: string }>;
      const distMap: Record<string, string> = {};
      Object.values(distritos).forEach(d => { distMap[d.nome.toLowerCase()] = d.estado; });

      districts.forEach(d => {
        const estado = distMap[d.nome.toLowerCase()];
        states[d.id] = {
          visited: !!estado && estado !== 'potencial',
          active: estado === 'central' || estado === 'ativo',
          hasArchetype: false,
          eventCount: 0,
        };
      });
    } else {
      // Client mode: derive from city_state + history
      const visitedDistricts = new Set(history.map(h => h.distrito).filter(Boolean));

      districts.forEach(d => {
        const isActive = cityState?.distrito_id === d.id;
        const hasArch = archetypes.some(a => a.distrito_principal_id === d.id && 
          (a.id === archState?.arquitipo_regente_id || a.id === archState?.arquitipo_sombra_id));
        const eventCount = history.filter(h => h.distrito === d.nome).length;

        states[d.id] = {
          visited: visitedDistricts.has(d.nome) || isActive,
          active: isActive,
          hasArchetype: hasArch,
          eventCount,
        };
      });
    }
    return states;
  }, [districts, cityState, archState, archetypes, history, selfMode, selfMapData]);

  const districtDisplayStates = useMemo(() => {
    const states: Record<string, DistrictDisplayState> = {};

    if (selfMode && selfMapData?.mapa) {
      const distritos = (selfMapData.mapa.distritos_json || {}) as Record<string, { nome?: string; estado?: string }>;

      Object.values(distritos).forEach((district) => {
        const name = district.nome?.toLowerCase();
        if (!name) return;

        if (district.estado === 'central' || district.estado === 'ativo') {
          states[name] = 'ativo';
        } else if (district.estado === 'tensao') {
          states[name] = 'em_tensao';
        } else if (district.estado === 'integrado') {
          states[name] = 'integrado';
        }
      });

      return states;
    }

    districts.forEach((district) => {
      const visual = districtVisualStates[district.id];
      if (!visual) return;

      if (visual.active) {
        states[district.nome.toLowerCase()] = 'ativo';
      } else if (visual.visited) {
        states[district.nome.toLowerCase()] = 'integrado';
      }
    });

    if (cityState?.distrito_ativo) {
      states[cityState.distrito_ativo.toLowerCase()] = 'ativo';
    }

    return states;
  }, [cityState?.distrito_ativo, districtVisualStates, districts, selfMapData, selfMode]);

  // Tools for selected district
  const selectedTools = useMemo(() => {
    if (!selectedDistrict) return [];
    return toolDistricts
      .filter(td => td.district_id === selectedDistrict.id && td.tool)
      .map(td => td.tool!);
  }, [selectedDistrict, toolDistricts]);

  // Archetypes for selected district
  const selectedArchetypes = useMemo(() => {
    if (!selectedDistrict) return [];
    return archetypes.filter(a => a.distrito_principal_id === selectedDistrict.id);
  }, [selectedDistrict, archetypes]);

  // History for selected district
  const selectedHistory = useMemo(() => {
    if (!selectedDistrict) return [];
    return history.filter(h => h.distrito === selectedDistrict.nome);
  }, [selectedDistrict, history]);

  const handleDistrictClick = (d: CityDistrict) => {
    setSelectedDistrict(d);
    setPanelOpen(true);
  };

  const handleDistrictClickByName = (districtName: string) => {
    const district = districts.find((item) => item.nome.toLowerCase() === districtName.toLowerCase());
    if (!district) return;
    handleDistrictClick(district);
  };

  const displayTitle = customTitle || (selfMode ? 'Minha CidaDELA Interior' : `CidaDELA Interior — ${cliente?.nome || ''}`);
  const displaySubtitle = selfMode ? 'Mapa simbólico da sua identidade clínica' : 'Prontuário simbólico vivo';

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (standalone) {
      return <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">{children}</div>;
    }
    return <CasaMaquinasLayout title={displayTitle} subtitle={displaySubtitle}>{children}</CasaMaquinasLayout>;
  };

  if (loadingDistricts) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      </Wrapper>
    );
  }

  // Determine journey phase
  const visitedCount = Object.values(districtVisualStates).filter(s => s.visited).length;
  const phase = visitedCount === 0 ? 'Início' : visitedCount <= 3 ? 'Exploração' :
    visitedCount <= 6 ? 'Aprofundamento' : 'Integração';

  return (
    <Wrapper>
      {/* Ethical notice */}
      <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-[#C9A24A]/5 border border-[#C9A24A]/10 mb-4">
        <Eye className="w-4 h-4 text-[#C9A24A]/50 mt-0.5 shrink-0" />
        <p className="text-[10px] text-[#C9A24A]/50 italic">
          Ferramenta de leitura simbólica. Não substitui julgamento clínico.
        </p>
      </div>

      {/* Client Archetype Header */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <HeaderCard 
          label="Regente" icon={Crown} color="#D4B96E"
          value={regente?.nome || '—'} sub={regente?.titulo_simbolico}
        />
        <HeaderCard 
          label="Sombra" icon={Moon} color="#5C4B7A"
          value={sombra?.nome || '—'} sub={sombra?.titulo_simbolico}
        />
        <HeaderCard 
          label="Evolução" icon={Sparkles} color="#5B8E63"
          value={evolucao?.nome || '—'} sub={evolucao?.titulo_simbolico}
        />
        <HeaderCard 
          label="Distrito Ativo" icon={MapPin} color="#C9A24A"
          value={cityState?.distrito_ativo || '—'}
        />
        <HeaderCard 
          label="Fase" icon={Compass} color="#4F7C82"
          value={phase}
          sub={`${visitedCount}/${districts.length} explorados`}
        />
      </div>

      {/* Map + Actions */}
      <div className="flex items-center justify-between mb-3">
        <Button variant="outline" size="sm"
          className="border-[#C9A24A]/15 text-[#C9A24A]/70 text-xs h-8 gap-1.5"
          onClick={() => navigate(selfMode ? '/dashboard-membro' : `/casa-das-maquinas/clientes/${targetId}`)}>
          <ArrowLeft className="w-3 h-3" /> Voltar
        </Button>
        <Button variant="outline" size="sm"
          className="border-[#C9A24A]/15 text-[#C9A24A]/70 text-xs h-8 gap-1.5"
          onClick={() => setShowTimeline(!showTimeline)}>
          <Clock className="w-3 h-3" /> {showTimeline ? 'Ocultar' : 'Linha do tempo'}
        </Button>
      </div>

      {/* Mandala unificada da Casa das Máquinas */}
      <div className="rounded-2xl border border-[#C9A24A]/10 bg-[#0a0a14]/80 p-3 md:p-5">
        <CidadelaMapSVG
          districtStates={districtDisplayStates}
          activeDistrict={cityState?.distrito_ativo || null}
          archetypeDistricts={archetypeDistricts}
          eventCounts={eventCounts}
          onDistrictClick={handleDistrictClickByName}
          maxWidth={620}
        />
      </div>

      {/* Timeline */}
      {showTimeline && history.length > 0 && (
        <Card className="mt-6 border-[#C9A24A]/10 bg-[#0a0a14]/80">
          <CardContent className="p-4">
            <h3 className="text-xs font-semibold text-[#C9A24A]/60 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Trilha de Travessias
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {history.slice(0, 20).map(event => (
                <div key={event.id} className="flex items-start gap-3 text-[11px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24A]/40 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[#F5F1E8]/60 font-medium">{event.distrito}</span>
                    <span className="text-[#F5F1E8]/30 mx-1.5">·</span>
                    <span className="text-[#F5F1E8]/40">{event.evento}</span>
                    {event.detalhe && (
                      <p className="text-[#F5F1E8]/25 text-[10px] mt-0.5">{event.detalhe}</p>
                    )}
                  </div>
                  <span className="text-[#F5F1E8]/20 text-[9px] whitespace-nowrap">
                    {new Date(event.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* District Detail Panel */}
      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent className="bg-[#0B1020] border-l-[#C9A24A]/10 w-[380px] sm:w-[420px]">
          <SheetHeader>
            <SheetTitle className="text-[#F5F1E8]/90 flex items-center gap-2">
              {selectedDistrict && (
                <>
                  {(() => {
                    const Icon = DISTRICT_ICONS[selectedDistrict.icone || ''] || MapPin;
                    return <Icon className="w-5 h-5" style={{ color: selectedDistrict.cor_principal || '#C9A24A' }} />;
                  })()}
                  {selectedDistrict.nome}
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          {selectedDistrict && (
            <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-2">
              <div className="space-y-5">
                {/* Description */}
                <div>
                  <p className="text-[11px] text-[#F5F1E8]/50 leading-relaxed">
                    {selectedDistrict.descricao}
                  </p>
                </div>

                {/* Symbolic function */}
                {selectedDistrict.funcao_simbolica && (
                  <div className="p-3 rounded-lg bg-[#C9A24A]/5 border border-[#C9A24A]/10">
                    <p className="text-[10px] text-[#C9A24A]/60 uppercase tracking-wider mb-1">Função Simbólica</p>
                    <p className="text-[11px] text-[#F5F1E8]/60">{selectedDistrict.funcao_simbolica}</p>
                  </div>
                )}

                {/* When active */}
                {selectedDistrict.quando_ativo && (
                  <div className="p-3 rounded-lg bg-[#6b4ba1]/5 border border-[#6b4ba1]/10">
                    <p className="text-[10px] text-[#6b4ba1]/60 uppercase tracking-wider mb-1">Quando se ativa</p>
                    <p className="text-[11px] text-[#F5F1E8]/60">{selectedDistrict.quando_ativo}</p>
                  </div>
                )}

                <Separator className="bg-[#F5F1E8]/5" />

                {/* Associated tools */}
                {selectedTools.length > 0 && (
                  <div>
                    <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Wrench className="w-3 h-3" /> Ferramentas
                    </p>
                    <div className="space-y-1.5">
                      {selectedTools.map(tool => (
                        <button key={tool.id}
                          className="w-full flex items-center gap-2 p-2 rounded-md bg-[#F5F1E8]/3 hover:bg-[#F5F1E8]/6 transition text-left"
                          onClick={() => tool.rota && navigate(tool.rota)}>
                          <Wrench className="w-3 h-3 text-[#C9A24A]/50" />
                          <span className="text-[11px] text-[#F5F1E8]/60 flex-1">{tool.nome}</span>
                          <ChevronRight className="w-3 h-3 text-[#F5F1E8]/20" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked archetypes */}
                {selectedArchetypes.length > 0 && (
                  <div>
                    <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Crown className="w-3 h-3" /> Arquétipos
                    </p>
                    <div className="space-y-1.5">
                      {selectedArchetypes.map(arch => {
                        const Icon = ARCHETYPE_ICONS[arch.icone || ''] || Sparkles;
                        const isRegente = arch.id === archState?.arquitipo_regente_id;
                        return (
                          <div key={arch.id}
                            className="flex items-center gap-2 p-2 rounded-md bg-[#F5F1E8]/3">
                            <Icon className="w-3.5 h-3.5" style={{ color: arch.cor_principal || '#C9A24A' }} />
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] text-[#F5F1E8]/60">{arch.nome}</span>
                              {arch.titulo_simbolico && (
                                <p className="text-[9px] text-[#F5F1E8]/30">{arch.titulo_simbolico}</p>
                              )}
                            </div>
                            {isRegente && (
                              <Badge variant="outline" className="text-[8px] border-[#D4B96E]/30 text-[#D4B96E]/70">
                                Regente
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Separator className="bg-[#F5F1E8]/5" />

                {/* Client history in this district */}
                {selectedHistory.length > 0 ? (
                  <div>
                    <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Registros ({selectedHistory.length})
                    </p>
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                      {selectedHistory.map(h => (
                        <div key={h.id} className="flex items-start gap-2 text-[10px]">
                          <div className="w-1 h-1 rounded-full bg-[#C9A24A]/30 mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <span className="text-[#F5F1E8]/50">{h.evento}</span>
                            {h.detalhe && <p className="text-[#F5F1E8]/25 text-[9px]">{h.detalhe}</p>}
                          </div>
                          <span className="text-[#F5F1E8]/20 text-[9px]">
                            {new Date(h.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-[#F5F1E8]/25 italic text-center py-4">
                    Nenhum registro neste distrito
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
}

// ── Header Card ─────────────────────────────────
function HeaderCard({ label, icon: Icon, color, value, sub }: {
  label: string; icon: React.ElementType; color: string; value: string; sub?: string | null;
}) {
  return (
    <Card className="border-[rgba(245,241,232,0.05)] bg-[rgba(245,241,232,0.02)]">
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className="w-3 h-3" style={{ color }} />
          <span className="text-[9px] uppercase tracking-wider" style={{ color: `${color}99` }}>{label}</span>
        </div>
        <p className="text-[12px] text-[#F5F1E8]/80 font-medium truncate">{value}</p>
        {sub && <p className="text-[9px] text-[#F5F1E8]/30 truncate">{sub}</p>}
      </CardContent>
    </Card>
  );
}
