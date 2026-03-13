import { useMemo } from 'react';
import type { MandalaDistrict, MandalaDistrictState, MandalaMode, MandalaCollectiveData } from './MandalaCidadela';

const STATE_COLORS = {
  inativo: { bg: 'bg-muted/30', border: 'border-muted/40', text: 'text-muted-foreground/50', dot: 'bg-muted-foreground/30' },
  ativo: { bg: 'bg-primary/10', border: 'border-primary/40', text: 'text-primary', dot: 'bg-primary' },
  integrado: { bg: 'bg-accent/10', border: 'border-primary/50', text: 'text-accent-foreground', dot: 'bg-[#556B57]' },
};

const STATE_LABELS = {
  inativo: 'Não explorado',
  ativo: 'Ativo',
  integrado: 'Integrado',
};

interface Props {
  districts: MandalaDistrict[];
  districtStates?: MandalaDistrictState[];
  collectiveData?: MandalaCollectiveData[];
  mode: MandalaMode;
  selectedId?: string | null;
  onDistrictClick?: (district: MandalaDistrict) => void;
}

export function MandalaMobile({
  districts,
  districtStates = [],
  collectiveData = [],
  mode,
  selectedId,
  onDistrictClick,
}: Props) {
  const innerDistricts = useMemo(() => districts.filter(d => d.numero <= 6), [districts]);
  const outerDistricts = useMemo(() => districts.filter(d => d.numero > 6), [districts]);

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' => {
    return (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  };

  const getSessionCount = (id: string) => {
    return districtStates.find(s => s.district_id === id)?.sessions_count || 0;
  };

  const getCollective = (id: string) => {
    return collectiveData.find(c => c.district_id === id);
  };

  const renderDistrict = (d: MandalaDistrict) => {
    const state = getState(d.id);
    const colors = STATE_COLORS[state];
    const isSelected = selectedId === d.id;
    const sessCount = getSessionCount(d.id);
    const collective = getCollective(d.id);

    return (
      <button
        key={d.id}
        onClick={() => onDistrictClick?.(d)}
        className={`
          flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full
          ${colors.bg} ${colors.border}
          ${isSelected ? 'ring-2 ring-primary shadow-md' : ''}
          ${onDistrictClick ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}
        `}
      >
        {/* State dot */}
        <div className={`w-3 h-3 rounded-full shrink-0 ${colors.dot}`} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium truncate ${colors.text}`}>
              {d.nome}
            </span>
            {state === 'integrado' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#556B57]/20 text-[#556B57] shrink-0">
                ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground/60">
              {STATE_LABELS[state]}
            </span>
            {mode === 'clinico' && sessCount > 0 && (
              <span className="text-[10px] text-primary/60">
                {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
              </span>
            )}
            {mode === 'coletivo' && collective && collective.client_count > 0 && (
              <span className="text-[10px] text-primary/60">
                {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
              </span>
            )}
          </div>
        </div>

        {/* District number */}
        <span className="text-[10px] text-muted-foreground/40 shrink-0">
          #{d.numero}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Center label */}
      <div className="text-center py-3 rounded-lg border border-primary/15 bg-primary/5">
        <span className="text-xs font-medium text-primary/70">
          {mode === 'clinico' ? 'Praça da Integração' : 'Praça do Ser'}
        </span>
      </div>

      {/* Inner ring */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-2 px-1">
          Anel Interior
        </p>
        <div className="grid grid-cols-1 gap-2">
          {innerDistricts.map(renderDistrict)}
        </div>
      </div>

      {/* Outer ring */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-2 px-1">
          Anel Exterior
        </p>
        <div className="grid grid-cols-1 gap-2">
          {outerDistricts.map(renderDistrict)}
        </div>
      </div>
    </div>
  );
}
