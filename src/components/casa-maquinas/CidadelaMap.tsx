import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Loader2, Sparkles } from 'lucide-react';

interface District {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  posicao_relogio: string;
}

interface JourneyDistrict {
  district_id: string;
  state: string;
  sessions_count: number;
  last_session_at: string | null;
}

interface DistrictTool {
  id: string;
  nome: string;
  rota: string;
  tipo: string;
}

const stateColors: Record<string, { bg: string; border: string; text: string }> = {
  inativo: { bg: 'rgba(245,241,232,0.05)', border: 'rgba(245,241,232,0.1)', text: 'rgba(245,241,232,0.3)' },
  ativo: { bg: 'rgba(201,162,74,0.15)', border: 'rgba(201,162,74,0.4)', text: '#C9A24A' },
  integrado: { bg: 'rgba(85,107,87,0.2)', border: 'rgba(85,107,87,0.5)', text: '#556B57' },
};

export function CidadelaMap({ clienteId }: { clienteId: string }) {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<District[]>([]);
  const [journeyDistricts, setJourneyDistricts] = useState<JourneyDistrict[]>([]);
  const [tools, setTools] = useState<DistrictTool[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [clienteId]);

  const loadData = async () => {
    const [distRes, toolsRes] = await Promise.all([
      supabase.from('districts').select('*').order('numero'),
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
    ]);

    setDistricts(distRes.data || []);
    setTools(toolsRes.data || []);

    // Load journey districts
    const { data: journeys } = await supabase
      .from('journeys')
      .select('id')
      .eq('client_id', clienteId)
      .limit(1);

    if (journeys && journeys.length > 0) {
      const { data: jd } = await supabase
        .from('journey_districts')
        .select('*')
        .eq('journey_id', journeys[0].id);
      setJourneyDistricts(jd || []);
    }

    setLoading(false);
  };

  const getDistrictState = (districtId: string) => {
    const jd = journeyDistricts.find(j => j.district_id === districtId);
    return jd?.state || 'inativo';
  };

  const getDistrictSessions = (districtId: string) => {
    const jd = journeyDistricts.find(j => j.district_id === districtId);
    return jd?.sessions_count || 0;
  };

  const handleDistrictClick = (district: District) => {
    setSelectedDistrict(district);
    setSheetOpen(true);
  };

  const districtTools = (districtId: string) =>
    tools.filter(t => t.district_id === districtId);

  // Visited districts in chronological order for the luminous path
  const visitedDistricts = journeyDistricts
    .filter(jd => jd.state !== 'inativo' && jd.last_session_at)
    .sort((a, b) => new Date(a.last_session_at!).getTime() - new Date(b.last_session_at!).getTime());

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
      </div>
    );
  }

  // Calculate positions for circular layout
  const centerX = 50;
  const centerY = 50;
  const radius = 38;

  return (
    <div className="relative">
      {/* Circular Map */}
      <div className="relative w-full max-w-[600px] mx-auto" style={{ aspectRatio: '1/1' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(201,162,74,0.1))' }}>
          {/* Outer circle */}
          <circle cx={centerX} cy={centerY} r={radius + 2} fill="none" stroke="rgba(201,162,74,0.1)" strokeWidth="0.3" />
          <circle cx={centerX} cy={centerY} r={radius - 2} fill="none" stroke="rgba(201,162,74,0.05)" strokeWidth="0.2" strokeDasharray="1 1" />

          {/* Luminous path connecting visited districts */}
          {visitedDistricts.length > 1 && visitedDistricts.map((jd, i) => {
            if (i === 0) return null;
            const prevDist = districts.find(d => d.id === visitedDistricts[i - 1].district_id);
            const currDist = districts.find(d => d.id === jd.district_id);
            if (!prevDist || !currDist) return null;
            const prevAngle = ((prevDist.numero - 1) * 30 - 90) * (Math.PI / 180);
            const currAngle = ((currDist.numero - 1) * 30 - 90) * (Math.PI / 180);
            return (
              <line
                key={`path-${i}`}
                x1={centerX + radius * Math.cos(prevAngle)}
                y1={centerY + radius * Math.sin(prevAngle)}
                x2={centerX + radius * Math.cos(currAngle)}
                y2={centerY + radius * Math.sin(currAngle)}
                stroke="#C9A24A"
                strokeWidth="0.4"
                strokeOpacity="0.5"
                strokeDasharray="1 0.5"
              />
            );
          })}
        </svg>

        {/* Center - Praça do Ser */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '18%',
            height: '18%',
          }}
        >
          <div className="w-full h-full rounded-full bg-[#C9A24A]/10 border border-[#C9A24A]/20 flex flex-col items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C9A24A] mb-0.5" />
            <span className="text-[7px] text-[#C9A24A] font-medium">Praça do Ser</span>
          </div>
        </div>

        {/* District nodes */}
        {districts.map(d => {
          const angle = ((d.numero - 1) * 30 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const state = getDistrictState(d.id);
          const colors = stateColors[state];
          const sessions = getDistrictSessions(d.id);

          return (
            <button
              key={d.id}
              onClick={() => handleDistrictClick(d)}
              className="absolute flex flex-col items-center group transition-transform hover:scale-110"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: '14%',
              }}
            >
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border-2"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                }}
              >
                <span className="text-[10px] font-bold" style={{ color: colors.text }}>
                  {d.numero}
                </span>
              </div>
              <span className="text-[7px] sm:text-[8px] text-[#F5F1E8]/50 mt-1 text-center leading-tight group-hover:text-[#F5F1E8]/80 transition-colors whitespace-nowrap max-w-[60px] truncate">
                {d.nome}
              </span>
              {sessions > 0 && (
                <span className="text-[6px] text-[#C9A24A]/60">{sessions}s</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {Object.entries(stateColors).map(([state, colors]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: colors.bg, borderColor: colors.border }} />
            <span className="text-[10px] text-[#F5F1E8]/40 capitalize">{state}</span>
          </div>
        ))}
      </div>

      {/* District Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="bg-[#0B1B2B] border-l border-[#C9A24A]/10 w-full sm:max-w-md">
          {selectedDistrict && (
            <div>
              <SheetHeader>
                <SheetTitle className="text-[#F5F1E8] flex items-center gap-2">
                  <span className="text-lg">{selectedDistrict.nome}</span>
                  <Badge variant="outline" className="text-[10px] capitalize" style={{
                    borderColor: stateColors[getDistrictState(selectedDistrict.id)].border,
                    color: stateColors[getDistrictState(selectedDistrict.id)].text,
                  }}>
                    {getDistrictState(selectedDistrict.id)}
                  </Badge>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <p className="text-sm text-[#F5F1E8]/60">{selectedDistrict.descricao}</p>

                {/* Tools */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#C9A24A]/60 mb-2">Ferramentas</h4>
                  <div className="space-y-2">
                    {districtTools(selectedDistrict.id).map(tool => (
                      <Button
                        key={tool.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-[#F5F1E8]/70 hover:text-[#F5F1E8] hover:bg-[#C9A24A]/10 text-xs"
                        onClick={() => navigate(tool.rota)}
                      >
                        {tool.nome}
                        {tool.tipo === 'placeholder' && (
                          <Badge variant="outline" className="ml-auto text-[8px] border-[#F5F1E8]/10 text-[#F5F1E8]/30">em breve</Badge>
                        )}
                      </Button>
                    ))}
                    {districtTools(selectedDistrict.id).length === 0 && (
                      <p className="text-xs text-[#F5F1E8]/30">Nenhuma ferramenta associada</p>
                    )}
                  </div>
                </div>

                {/* Sessions count */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#C9A24A]/60 mb-2">Sessões neste distrito</h4>
                  <p className="text-2xl font-bold text-[#F5F1E8]">
                    {getDistrictSessions(selectedDistrict.id)}
                  </p>
                </div>

                {/* CTA */}
                <Button
                  className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]"
                  onClick={() => navigate(`/casa-das-maquinas/sessoes?clienteId=${clienteId}&districtId=${selectedDistrict.id}`)}
                >
                  Iniciar Sessão neste Distrito
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
