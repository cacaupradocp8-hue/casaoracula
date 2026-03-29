import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientCityState, useClientArchetypeState, useFoundingArchetypes, useCityHistory } from '@/hooks/useMapaVivoCidadela';
import CidadelaMapSVG, { type DistrictDisplayState } from '@/components/cidadela/CidadelaMapSVG';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Crown, Moon, Sparkles, Maximize2 } from 'lucide-react';

interface Props {
  clienteId: string;
}

export function MiniMandalaCidadela({ clienteId }: Props) {
  const navigate = useNavigate();
  const { data: cityState } = useClientCityState(clienteId);
  const { data: archState } = useClientArchetypeState(clienteId);
  const { data: archetypes = [] } = useFoundingArchetypes();
  const { data: history = [] } = useCityHistory(clienteId);

  const regente = archetypes.find(a => a.id === archState?.arquitipo_regente_id);
  const sombra = archetypes.find(a => a.id === archState?.arquitipo_sombra_id);

  const districtStates = useMemo(() => {
    const states: Record<string, DistrictDisplayState> = {};
    const visitedDistricts = new Set(history.map(h => h.distrito?.toLowerCase()).filter(Boolean));

    visitedDistricts.forEach(d => {
      if (d) states[d] = 'integrado';
    });

    if (cityState?.distrito_ativo) {
      states[cityState.distrito_ativo.toLowerCase()] = 'ativo';
    }

    return states;
  }, [cityState, history]);

  const visitedCount = new Set(history.map(h => h.distrito).filter(Boolean)).size;

  return (
    <div className="rounded-xl border border-border/20 bg-card/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" /> CidaDELA Interior
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] text-primary/70 gap-1"
          onClick={() => navigate(`/casa-das-maquinas/mapa-vivo/${clienteId}`)}
        >
          <Maximize2 className="w-3 h-3" /> Abrir Mapa
        </Button>
      </div>

      <div className="flex items-start gap-4">
        {/* Mini Mandala */}
        <div className="w-[180px] shrink-0">
          <CidadelaMapSVG
            districtStates={districtStates}
            activeDistrict={cityState?.distrito_ativo || null}
            maxWidth={180}
            forceCircular
          />
        </div>

        {/* Summary Info */}
        <div className="flex-1 space-y-2.5 min-w-0 pt-2">
          {cityState?.distrito_ativo && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-primary shrink-0" />
              <span className="text-xs text-foreground/80 truncate">
                Distrito ativo: <strong>{cityState.distrito_ativo}</strong>
              </span>
            </div>
          )}
          {regente && (
            <div className="flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-primary/70 shrink-0" />
              <span className="text-xs text-foreground/60 truncate">
                Regente: {regente.nome}
              </span>
            </div>
          )}
          {sombra && (
            <div className="flex items-center gap-1.5">
              <Moon className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-foreground/60 truncate">
                Sombra: {sombra.nome}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">
              {visitedCount} distritos explorados · {history.length} eventos
            </span>
          </div>
          {visitedCount === 0 && (
            <Badge variant="outline" className="text-[10px] text-muted-foreground/60">
              Jornada não iniciada
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
