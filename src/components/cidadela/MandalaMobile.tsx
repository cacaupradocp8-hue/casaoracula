import { useMemo } from 'react';
import type { MandalaDistrict, MandalaDistrictState, MandalaMode, MandalaCollectiveData } from './MandalaCidadela';

const STATE_COLORS = {
  inativo: { bg: 'rgba(245,241,232,0.03)', border: 'rgba(245,241,232,0.08)', text: 'rgba(245,241,232,0.35)', dot: 'rgba(245,241,232,0.2)' },
  ativo: { bg: 'rgba(201,162,74,0.08)', border: 'rgba(201,162,74,0.25)', text: '#C9A24A', dot: '#C9A24A' },
  integrado: { bg: 'rgba(74,158,107,0.08)', border: 'rgba(74,158,107,0.25)', text: '#7dd9a0', dot: '#6bc48f' },
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

export function MandalaMobile({ districts, districtStates = [], collectiveData = [], mode, selectedId, onDistrictClick }: Props) {
  const centerDistrict = useMemo(() => districts.find(d => d.numero === 11), [districts]);
  const entryDistrict = useMemo(() => districts.find(d => d.numero === 1), [districts]);
  const innerDistricts = useMemo(() => districts.filter(d => [2, 3, 4, 6].includes(d.numero)), [districts]);
  const outerDistricts = useMemo(() => districts.filter(d => [5, 7, 8, 9, 10, 12].includes(d.numero)), [districts]);

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' =>
    (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  const getSessionCount = (id: string) =>
    districtStates.find(s => s.district_id === id)?.sessions_count || 0;
  const getCollective = (id: string) =>
    collectiveData.find(c => c.district_id === id);

  const stats = useMemo(() => {
    const active = districtStates.filter(s => s.state === 'ativo').length;
    const integrated = districtStates.filter(s => s.state === 'integrado').length;
    return { active, integrated, explored: active + integrated, total: districts.length };
  }, [districtStates, districts]);

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
        className="flex items-center gap-3 p-3.5 rounded-xl transition-all text-left w-full"
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          boxShadow: isSelected ? '0 0 12px rgba(201,162,74,0.15)' : 'none',
          transform: isSelected ? 'scale(1.01)' : 'none',
        }}
      >
        <div className="relative shrink-0">
          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: colors.dot, opacity: state === 'inativo' ? 0.4 : 1 }} />
          {state === 'integrado' && (
            <div className="absolute inset-0 w-3.5 h-3.5 rounded-full animate-ping" style={{ backgroundColor: 'rgba(74,158,107,0.25)' }} />
          )}
          {state === 'ativo' && (
            <div className="absolute inset-0 w-3.5 h-3.5 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(201,162,74,0.2)' }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate" style={{ color: colors.text }}>
              {d.nome}
            </span>
            {state === 'integrado' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(74,158,107,0.2)', color: '#7dd9a0' }}>✓</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px]" style={{ color: 'rgba(245,241,232,0.3)' }}>{STATE_LABELS[state]}</span>
            {mode === 'clinico' && sessCount > 0 && (
              <span className="text-[10px]" style={{ color: 'rgba(201,162,74,0.5)' }}>
                {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
              </span>
            )}
            {mode === 'coletivo' && collective && collective.client_count > 0 && (
              <span className="text-[10px]" style={{ color: 'rgba(201,162,74,0.5)' }}>
                {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
              </span>
            )}
          </div>
        </div>

        <span className="text-[10px] shrink-0" style={{ color: 'rgba(245,241,232,0.2)' }}>#{d.numero}</span>
      </button>
    );
  };

  return (
    <div className="space-y-4 max-w-[420px] mx-auto">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-3.5 py-3 rounded-xl"
        style={{ background: 'rgba(201,162,74,0.04)', border: '1px solid rgba(201,162,74,0.1)' }}>
        <span className="text-xs font-medium" style={{ color: 'rgba(201,162,74,0.6)' }}>
          {mode === 'clinico' ? 'Praça da Integração' : 'Praça do Ser'}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C9A24A' }} />
            <span className="text-[10px]" style={{ color: 'rgba(201,162,74,0.5)' }}>{stats.active}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b8a4d8' }} />
            <span className="text-[10px]" style={{ color: 'rgba(184,164,216,0.6)' }}>{stats.integrated}</span>
          </div>
          <span className="text-[10px]" style={{ color: 'rgba(245,241,232,0.2)' }}>{stats.explored}/{stats.total}</span>
        </div>
      </div>

      {/* Center */}
      {(centerDistrict || entryDistrict) && (
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-2 px-1" style={{ color: 'rgba(201,162,74,0.35)' }}>Centro da CidaDELA</p>
          <div className="grid grid-cols-1 gap-2">
            {centerDistrict && renderDistrict(centerDistrict)}
            {entryDistrict && renderDistrict(entryDistrict)}
          </div>
        </div>
      )}

      {/* Inner */}
      <div>
        <p className="text-[10px] uppercase tracking-wider mb-2 px-1" style={{ color: 'rgba(201,162,74,0.3)' }}>Primeiro Anel</p>
        <div className="grid grid-cols-1 gap-2">{innerDistricts.map(renderDistrict)}</div>
      </div>

      {/* Outer */}
      <div>
        <p className="text-[10px] uppercase tracking-wider mb-2 px-1" style={{ color: 'rgba(107,75,161,0.35)' }}>Segundo Anel</p>
        <div className="grid grid-cols-1 gap-2">{outerDistricts.map(renderDistrict)}</div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(245,241,232,0.2)' }} />
          <span className="text-[9px]" style={{ color: 'rgba(245,241,232,0.3)' }}>Não explorado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C9A24A' }} />
          <span className="text-[9px]" style={{ color: 'rgba(201,162,74,0.5)' }}>Ativo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b8a4d8' }} />
          <span className="text-[9px]" style={{ color: 'rgba(184,164,216,0.5)' }}>Integrado</span>
        </div>
      </div>

      <p className="text-[9px] text-center italic" style={{ color: 'rgba(245,241,232,0.2)' }}>
        {mode === 'clinico' ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.' : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
