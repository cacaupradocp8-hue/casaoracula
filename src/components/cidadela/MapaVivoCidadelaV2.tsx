import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useCityDistricts, useFoundingArchetypes, useClientCityState,
  useClientArchetypeState, useCityHistory, useToolDistricts,
  type CityDistrict, type FoundingArchetype
} from '@/hooks/useMapaVivoCidadela';
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

// ── SVG Layout positions for 9 districts + center ──
const CX = 300, CY = 300;
const POSITIONS: Record<number, { x: number; y: number; r: number }> = {
  9: { x: CX, y: CY, r: 42 },           // Praça (center)
  1: { x: CX, y: CY - 200, r: 34 },     // Portão (top)
  2: { x: CX - 170, y: CY - 100, r: 34 }, // Labirinto
  3: { x: CX + 170, y: CY - 100, r: 34 }, // Torres
  4: { x: CX - 200, y: CY + 40, r: 34 },  // Jardim
  5: { x: CX + 200, y: CY + 40, r: 34 },  // Casa dos Sonhos
  6: { x: CX - 140, y: CY + 160, r: 34 }, // Espelho
  7: { x: CX + 140, y: CY + 160, r: 34 }, // Forja
  8: { x: CX, y: CY + 210, r: 34 },      // Conselho
};

// ── Connection paths between districts ──
const CONNECTIONS = [
  [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7],
  [6, 8], [7, 8], [2, 9], [3, 9], [4, 9], [5, 9],
  [6, 9], [7, 9], [8, 9], [1, 9],
];

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

  // Build visual states for each district
  const districtStates = useMemo(() => {
    const states: Record<string, DistrictVisualState> = {};
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
    return states;
  }, [districts, cityState, archState, archetypes, history]);

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

  if (loadingDistricts) {
    return (
      <CasaMaquinasLayout title="Mapa da CidaDELA">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  // Determine journey phase
  const visitedCount = Object.values(districtStates).filter(s => s.visited).length;
  const phase = visitedCount === 0 ? 'Início' : visitedCount <= 3 ? 'Exploração' :
    visitedCount <= 6 ? 'Aprofundamento' : 'Integração';

  return (
    <CasaMaquinasLayout title={`CidaDELA Interior — ${cliente?.nome || ''}`} subtitle="Prontuário simbólico vivo">
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

      {/* SVG Map */}
      <div className="relative mx-auto" style={{ maxWidth: 620 }}>
        <svg viewBox="0 0 600 520" className="w-full" style={{ filter: 'drop-shadow(0 0 40px rgba(201,162,74,0.08))' }}>
          <defs>
            <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#0a0a14" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect width="600" height="520" fill="url(#bg-glow)" rx="16" />

          {/* Connection lines */}
          {CONNECTIONS.map(([a, b], i) => {
            const pa = POSITIONS[a];
            const pb = POSITIONS[b];
            if (!pa || !pb) return null;
            const da = districts[a - 1];
            const db = districts[b - 1];
            const aState = da ? districtStates[da.id] : null;
            const bState = db ? districtStates[db.id] : null;
            const bothVisited = aState?.visited && bState?.visited;
            return (
              <line key={i}
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={bothVisited ? 'rgba(201,162,74,0.25)' : 'rgba(245,241,232,0.06)'}
                strokeWidth={bothVisited ? 1.5 : 0.8}
                strokeDasharray={bothVisited ? '' : '4 4'}
              />
            );
          })}

          {/* Districts */}
          {districts.map((d, idx) => {
            const pos = POSITIONS[d.ordem || (idx + 1)];
            if (!pos) return null;
            const state = districtStates[d.id];
            const isActive = state?.active;
            const isVisited = state?.visited;
            const hasArch = state?.hasArchetype;
            const Icon = DISTRICT_ICONS[d.icone || ''] || MapPin;

            const fillColor = isActive ? `${d.cor_principal || '#C9A24A'}22`
              : isVisited ? `${d.cor_principal || '#888'}11`
              : 'rgba(245,241,232,0.02)';
            const strokeColor = isActive ? (d.cor_principal || '#C9A24A')
              : isVisited ? `${d.cor_principal || '#888'}88`
              : 'rgba(245,241,232,0.1)';
            const textOpacity = isActive ? 1 : isVisited ? 0.7 : 0.3;

            return (
              <g key={d.id}
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleDistrictClick(d)}
                style={{ filter: isActive ? 'url(#softGlow)' : '' }}
              >
                {/* Outer ring for active */}
                {isActive && (
                  <circle cx={pos.x} cy={pos.y} r={pos.r + 6}
                    fill="none" stroke={d.cor_principal || '#C9A24A'}
                    strokeWidth="1" opacity="0.4"
                    strokeDasharray="3 3">
                    <animateTransform attributeName="transform" type="rotate"
                      from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`}
                      dur="20s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Main circle */}
                <circle cx={pos.x} cy={pos.y} r={pos.r}
                  fill={fillColor} stroke={strokeColor}
                  strokeWidth={isActive ? 2 : 1}
                />

                {/* Archetype marker */}
                {hasArch && (
                  <circle cx={pos.x + pos.r - 6} cy={pos.y - pos.r + 6} r="5"
                    fill="#D4B96E" stroke="#0a0a14" strokeWidth="1.5" />
                )}

                {/* District name */}
                <text x={pos.x} y={pos.y + pos.r + 16}
                  textAnchor="middle"
                  fill={`rgba(245,241,232,${textOpacity})`}
                  fontSize="10" fontFamily="Inter, sans-serif"
                  fontWeight={isActive ? '600' : '400'}>
                  {d.nome}
                </text>

                {/* Event count badge */}
                {(state?.eventCount || 0) > 0 && (
                  <>
                    <circle cx={pos.x - pos.r + 8} cy={pos.y - pos.r + 8} r="8"
                      fill="rgba(201,162,74,0.2)" stroke="rgba(201,162,74,0.4)" strokeWidth="0.5" />
                    <text x={pos.x - pos.r + 8} y={pos.y - pos.r + 11}
                      textAnchor="middle" fill="#C9A24A" fontSize="8" fontWeight="600">
                      {state?.eventCount}
                    </text>
                  </>
                )}

                {/* Icon placeholder via foreignObject */}
                <foreignObject x={pos.x - 10} y={pos.y - 10} width="20" height="20">
                  <div className="flex items-center justify-center w-full h-full">
                    <Icon className="w-4 h-4" style={{ color: strokeColor }} />
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Center breathing animation */}
          {districts.find(d => d.ordem === 9) && (
            <circle cx={CX} cy={CY} r={48}
              fill="none" stroke="rgba(212,185,110,0.15)" strokeWidth="1">
              <animate attributeName="r" values="48;54;48" dur="9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.3;0.15" dur="9s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
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
    </CasaMaquinasLayout>
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
