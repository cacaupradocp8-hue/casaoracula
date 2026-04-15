import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Users, CircleDot, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ClienteComStatus } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { CabineOperationMode } from './CabineModeSelector';
import type { TherapeuticGroup } from '@/hooks/useTherapeuticGroups';
import type { CirculoSagrado } from '@/hooks/useCirculosSagrados';

interface Props {
  operationMode: CabineOperationMode;
  onChangeMode: (mode: CabineOperationMode) => void;
  clientes: ClienteComStatus[];
  groups: TherapeuticGroup[];
  circulos: CirculoSagrado[];
  onSelectCliente: (id: string) => void;
  onSelectGroup: (id: string) => void;
  onSelectCirculo: (id: string) => void;
}

const STATUS_STYLE: Record<string, { label: string; dot: string }> = {
  ativo: { label: 'Ativa', dot: 'bg-emerald-400' },
  precisa_atencao: { label: 'Atenção', dot: 'bg-amber-400' },
  sem_historico: { label: 'Nova', dot: 'bg-muted-foreground/40' },
};

const MODES: { key: CabineOperationMode; label: string; icon: typeof User; desc: string }[] = [
  { key: 'individual', label: 'Individual', icon: User, desc: 'Sessão clínica individual' },
  { key: 'grupo', label: 'Grupo Terapêutico', icon: Users, desc: 'Condução de grupo' },
  { key: 'circulo', label: 'Círculo de Mulheres', icon: CircleDot, desc: 'Condução simbólica coletiva' },
];

export function CabinePortalAbertura({
  operationMode,
  onChangeMode,
  clientes,
  groups,
  circulos,
  onSelectCliente,
  onSelectGroup,
  onSelectCirculo,
}: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = clientes
    .filter(c => c.nome.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const order = { precisa_atencao: 0, ativo: 1, sem_historico: 2 };
      return (order[a.statusCabine] ?? 3) - (order[b.statusCabine] ?? 3);
    });

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
          Cabine da Terapeuta
        </h1>
        <p className="text-sm text-muted-foreground/60 mt-1.5">
          Selecione o modo e quem você vai atender
        </p>
      </div>

      {/* Mode selector — large pills */}
      <div className="flex items-center gap-2 mb-8">
        {MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChangeMode(key)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
              operationMode === key
                ? 'bg-primary/15 text-primary border border-primary/30 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]'
                : 'text-muted-foreground/50 hover:text-muted-foreground/80 border border-transparent hover:border-border/20',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="w-full max-w-lg">
        {/* INDIVIDUAL MODE */}
        {operationMode === 'individual' && (
          <div className="space-y-2">
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground/40" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar cliente..."
                className="pl-10 h-10 text-sm bg-card/60 border-border/20 rounded-xl"
              />
            </div>

            <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
              {filtered.map(c => {
                const st = STATUS_STYLE[c.statusCabine];
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCliente(c.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-card/60 border border-transparent hover:border-border/20 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary/70" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-foreground truncate">{c.nome}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={cn('w-1.5 h-1.5 rounded-full', st?.dot)} />
                        <span className="text-[10px] text-muted-foreground/50">{st?.label}</span>
                        {!c.has_initial_cartography && (
                          <span className="text-[9px] text-amber-400/70 flex items-center gap-0.5 ml-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Sem diagnóstico
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-xs text-muted-foreground/40 text-center py-8 italic">
                  Nenhuma cliente encontrada
                </p>
              )}
            </div>
          </div>
        )}

        {/* GROUP MODE */}
        {operationMode === 'grupo' && (
          <div className="space-y-1 max-h-[40vh] overflow-y-auto">
            {groups.length === 0 && (
              <p className="text-xs text-muted-foreground/40 text-center py-8 italic">
                Nenhum grupo ativo
              </p>
            )}
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => onSelectGroup(g.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-card/60 border border-transparent hover:border-border/20 group"
              >
                <div className="w-9 h-9 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-primary/70" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-foreground truncate">{g.nome}</p>
                  <p className="text-[10px] text-muted-foreground/50">{g.participants_count || 0} participantes</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* CIRCLE MODE */}
        {operationMode === 'circulo' && (
          <div className="space-y-1 max-h-[40vh] overflow-y-auto">
            {circulos.length === 0 && (
              <p className="text-xs text-muted-foreground/40 text-center py-8 italic">
                Nenhum círculo ativo
              </p>
            )}
            {circulos.map(c => (
              <button
                key={c.id}
                onClick={() => onSelectCirculo(c.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-card/60 border border-transparent hover:border-border/20 group"
              >
                <div className="w-9 h-9 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                  <CircleDot className="w-4 h-4 text-primary/70" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-foreground truncate">{c.nome_circulo}</p>
                  <p className="text-[10px] text-muted-foreground/50">{c.ritual_base || 'Círculo sagrado'}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
