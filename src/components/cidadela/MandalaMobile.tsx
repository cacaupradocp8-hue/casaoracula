import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { MandalaDistrict, MandalaDistrictState, MandalaMode, MandalaCollectiveData } from './MandalaCidadela';

const STATE_COLORS = {
  inativo: { bg: 'bg-muted/30', border: 'border-muted/40', text: 'text-muted-foreground/50', dot: 'bg-muted-foreground/30' },
  ativo: { bg: 'bg-primary/10', border: 'border-primary/40', text: 'text-primary', dot: 'bg-primary animate-pulse' },
  integrado: { bg: 'bg-[#556B57]/10', border: 'border-[#556B57]/40', text: 'text-[#556B57]', dot: 'bg-[#556B57]' },
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
  const centerDistrict = useMemo(() => districts.find(d => d.numero === 11), [districts]);
  const entryDistrict = useMemo(() => districts.find(d => d.numero === 1), [districts]);
  const innerDistricts = useMemo(() => districts.filter(d => [2, 3, 4, 6].includes(d.numero)), [districts]);
  const outerDistricts = useMemo(() => districts.filter(d => [5, 7, 8, 9, 10, 12].includes(d.numero)), [districts]);

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' => {
    return (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  };

  const getSessionCount = (id: string) => {
    return districtStates.find(s => s.district_id === id)?.sessions_count || 0;
  };

  const getCollective = (id: string) => {
    return collectiveData.find(c => c.district_id === id);
  };

  // Summary stats
  const stats = useMemo(() => {
    const active = districtStates.filter(s => s.state === 'ativo').length;
    const integrated = districtStates.filter(s => s.state === 'integrado').length;
    const total = districts.length;
    const explored = active + integrated;
    return { active, integrated, total, explored };
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
        className={`
          flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full
          ${colors.bg} ${colors.border}
          ${isSelected ? 'ring-2 ring-primary shadow-md scale-[1.01]' : ''}
          ${onDistrictClick ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}
        `}
      >
        {/* State dot with glow for integrado */}
        <div className="relative shrink-0">
          <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
          {state === 'integrado' && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#556B57]/30 animate-ping" />
          )}
        </div>

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
      {/* Summary stats bar */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-primary/10 bg-primary/5">
        <span className="text-xs font-medium text-primary/70">
          {mode === 'clinico' ? 'Praça da Integração' : 'Praça do Ser'}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] text-primary/60">{stats.active}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#556B57]" />
            <span className="text-[10px] text-[#556B57]">{stats.integrated}</span>
          </div>
          <span className="text-[10px] text-muted-foreground/40">
            {stats.explored}/{stats.total}
          </span>
        </div>
      </div>

      {/* Center + Entry */}
      {(centerDistrict || entryDistrict) && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-2 px-1">
            Centro da CidaDELA
          </p>
          <div className="grid grid-cols-1 gap-2">
            {centerDistrict && renderDistrict(centerDistrict)}
            {entryDistrict && renderDistrict(entryDistrict)}
          </div>
        </div>
      )}

      {/* Inner ring */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-2 px-1">
          Primeiro Anel — Torres, Portas, Arquétipos, Sonhos
        </p>
        <div className="grid grid-cols-1 gap-2">
          {innerDistricts.map(renderDistrict)}
        </div>
      </div>

      {/* Outer ring */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-2 px-1">
          Segundo Anel — Labirinto, Forja, Espelho, Conselho, Abalo, Renascimento
        </p>
        <div className="grid grid-cols-1 gap-2">
          {outerDistricts.map(renderDistrict)}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <span className="text-[9px] text-muted-foreground/40">Não explorado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[9px] text-primary/60">Ativo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#556B57]" />
          <span className="text-[9px] text-[#556B57]">Integrado</span>
        </div>
      </div>

      <p className="text-[9px] text-muted-foreground/30 text-center italic">
        {mode === 'clinico'
          ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.'
          : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
