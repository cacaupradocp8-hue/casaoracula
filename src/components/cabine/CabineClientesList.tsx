import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClienteComStatus } from '@/pages/casa-maquinas/CabineTerapeutaPage';

interface Props {
  clientes: ClienteComStatus[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const STATUS_CONFIG = {
  ativo: { label: 'Ativa', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Clock },
  precisa_atencao: { label: 'Atenção', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: AlertTriangle },
  sem_historico: { label: 'Sem histórico', color: 'bg-muted text-muted-foreground border-border/30', icon: User },
};

export function CabineClientesList({ clientes, selectedId, onSelect }: Props) {
  const [search, setSearch] = useState('');

  const filtered = clientes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Sort: precisa_atencao first, then ativo, then sem_historico
  const sorted = [...filtered].sort((a, b) => {
    const order = { precisa_atencao: 0, ativo: 1, sem_historico: 2 };
    return (order[a.statusCabine] ?? 3) - (order[b.statusCabine] ?? 3);
  });

  return (
    <Card className="border-border/20 bg-card/40 backdrop-blur-sm overflow-hidden flex flex-col">
      <div className="p-3 border-b border-border/20">
        <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium mb-2">Clientes</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground/50" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="pl-8 h-8 text-xs bg-background/40 border-border/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sorted.map(c => {
          const cfg = STATUS_CONFIG[c.statusCabine];
          const Icon = cfg.icon;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm',
                selectedId === c.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted/20 border border-transparent'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground truncate">{c.nome}</span>
                <Icon className="w-3 h-3 shrink-0 text-muted-foreground/50" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0', cfg.color)}>
                  {cfg.label}
                </Badge>
                {c.lastSessionDate && (
                  <span className="text-[9px] text-muted-foreground/50">
                    {new Date(c.lastSessionDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-xs text-muted-foreground/40 text-center py-8 italic">Nenhuma cliente encontrada</p>
        )}
      </div>
    </Card>
  );
}
