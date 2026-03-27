import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MandalaCidadela, type MandalaDistrict, type MandalaDistrictState } from './MandalaCidadela';
import { MandalaMobile } from './MandalaMobile';
import { DistrictDetailSheet } from './DistrictDetailSheet';
import { useIsMobile } from '@/hooks/use-mobile';

export type DistrictDisplayState = 'nao_explorado' | 'ativo' | 'em_tensao' | 'integrado';

interface Props {
  districtStates?: Record<string, DistrictDisplayState>;
  activeDistrict?: string | null;
  onDistrictClick?: (districtName: string) => void;
  maxWidth?: number;
  archetypeDistricts?: Record<string, boolean>;
  eventCounts?: Record<string, number>;
  /** Force the circular SVG mandala even on mobile */
  forceCircular?: boolean;
}

const DISTRICT_NUMBER_BY_NAME: Record<string, number> = {
  'portao da chegada': 1,
  torres: 2,
  'torres da psique': 2,
  portas: 3,
  'jardim dos arquetipos': 4,
  'bosque dos arquetipos': 4,
  'praca do abalo': 5,
  'casa dos sonhos': 6,
  'espelho dos vinculos': 7,
  forja: 8,
  'a forja': 8,
  'conselho interior': 9,
  labirinto: 10,
  'labirinto narrativo': 10,
  'praca da integracao': 11,
  'praca do ser': 11,
  'coracao da cidadela': 11,
  'portal de renascimento': 12,
};

function normalizeDistrictName(name: string | null | undefined) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function resolveDistrictNumber(name: string | null | undefined) {
  return DISTRICT_NUMBER_BY_NAME[normalizeDistrictName(name)] ?? null;
}

function mapState(state: DistrictDisplayState | undefined): MandalaDistrictState['state'] {
  if (state === 'integrado') return 'integrado';
  if (state === 'ativo' || state === 'em_tensao') return 'ativo';
  return 'inativo';
}

export default function CidadelaMapSVG({
  districtStates = {},
  activeDistrict,
  onDistrictClick,
  maxWidth = 620,
  archetypeDistricts: _archetypeDistricts = {},
  eventCounts: _eventCounts = {},
  forceCircular = false,
}: Props) {
  const isMobile = useIsMobile();
  const useCircular = forceCircular || !isMobile;
  const [selectedDistrict, setSelectedDistrict] = useState<MandalaDistrict | null>(null);

  const { data: districts = [], isLoading } = useQuery({
    queryKey: ['cidadela-map-svg-sacred-districts'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('districts')
        .select('id, numero, nome, descricao, icone, cor')
        .order('numero');

      if (error) throw error;
      return (data || []) as MandalaDistrict[];
    },
    staleTime: 1000 * 60 * 10,
  });

  const mappedStates = useMemo<MandalaDistrictState[]>(() => {
    const statesByNumber = new Map<number, MandalaDistrictState['state']>();

    Object.entries(districtStates).forEach(([name, state]) => {
      const districtNumber = resolveDistrictNumber(name);
      if (!districtNumber) return;
      statesByNumber.set(districtNumber, mapState(state));
    });

    const activeNumber = resolveDistrictNumber(activeDistrict);
    if (activeNumber) {
      statesByNumber.set(activeNumber, 'ativo');
    }

    return districts.map((district) => ({
      district_id: district.id,
      state: statesByNumber.get(district.numero) ?? 'inativo',
      sessions_count: 0,
      last_session_at: null,
    }));
  }, [activeDistrict, districtStates, districts]);

  const selectedState = selectedDistrict
    ? mappedStates.find((state) => state.district_id === selectedDistrict.id)
    : undefined;

  const handleDistrictClick = (district: MandalaDistrict) => {
    if (onDistrictClick) {
      onDistrictClick(district.nome);
      return;
    }

    setSelectedDistrict(district);
  };

  return (
    <div className="relative mx-auto w-full overflow-hidden" style={{ maxWidth }}>
      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border/10 bg-card/20 text-xs text-muted-foreground/50">
          Preparando mandala...
        </div>
      ) : isMobile ? (
        <MandalaMobile
          districts={districts}
          districtStates={mappedStates}
          mode="explorar"
          selectedId={selectedDistrict?.id ?? null}
          onDistrictClick={handleDistrictClick}
        />
      ) : (
        <MandalaCidadela
          districts={districts}
          districtStates={mappedStates}
          mode="explorar"
          selectedId={selectedDistrict?.id ?? null}
          onDistrictClick={handleDistrictClick}
          className="w-full"
          showConnections
        />
      )}

      {!onDistrictClick && (
        <DistrictDetailSheet
          district={selectedDistrict}
          districtState={selectedState}
          open={!!selectedDistrict}
          onClose={() => setSelectedDistrict(null)}
        />
      )}
    </div>
  );
}
