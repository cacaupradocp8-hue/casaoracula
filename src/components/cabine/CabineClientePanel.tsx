import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, User, UserPlus, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClienteComStatus } from '@/pages/casa-maquinas/CabineTerapeutaPage';

interface Props {
  clientes: ClienteComStatus[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const STATUS_LABEL: Record<string, { label: string; class: string }> = {
  ativo: { label: 'Ativa', class: 'border-emerald-500/30 text-emerald-400' },
  precisa_atencao: { label: 'Atenção', class: 'border-amber-500/30 text-amber-400' },
  sem_historico: { label: 'Nova', class: 'border-border/30 text-muted-foreground' },
};

export function CabineClientePanel({ clientes, selectedId, onSelect }: Props) {
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState('');

  const selected = clientes.find(c => c.id === selectedId) ?? null;

  const filtered = clientes
    .filter(c => c.nome.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const order = { precisa_atencao: 0, ativo: 1, sem_historico: 2 };
      return (order[a.statusCabine] ?? 3) - (order[b.statusCabine] ?? 3);
    });

  return (
    <Card className="border-border/20 bg-card/40 backdrop-blur-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border/15">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-medium mb-2">
          Cliente
        </p>

        {/* Actions */}
        <div className="flex gap-1.5 mb-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[10px] border-border/20 text-muted-foreground hover:text-foreground gap-1"
            onClick={() => navigate('/casa-das-maquinas/clientes')}
          >
            <UserPlus className="w-3 h-3" />
            Nova cliente
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[10px] border-border/20 text-muted-foreground hover:text-foreground gap-1"
            onClick={() => setShowList(!showList)}
          >
            <RefreshCw className="w-3 h-3" />
            {showList ? 'Fechar' : 'Trocar'}
          </Button>
        </div>
      </div>

      {/* Selected client info */}
      {selected && !showList && (
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-display font-semibold text-foreground truncate">
                {selected.nome}
              </p>
              <Badge
                variant="outline"
                className={cn('text-[9px] mt-0.5', STATUS_LABEL[selected.statusCabine]?.class)}
              >
                {STATUS_LABEL[selected.statusCabine]?.label || selected.status}
              </Badge>
            </div>
          </div>

          {selected.lastSessionDate && (
            <p className="text-[10px] text-muted-foreground/50">
              Último atendimento: {new Date(selected.lastSessionDate).toLocaleDateString('pt-BR')}
            </p>
          )}

          {/* Cartography status */}
          {!selected.has_initial_cartography && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400/60 shrink-0" />
                <p className="text-[11px] text-foreground/70 font-medium">
                  Diagnóstico inicial pendente
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                Sessão clínica requer Cartografia Psíquica.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-7 text-[10px] border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                onClick={() => navigate(`/ferramenta/cartografia-psiquica-oracula?clienteId=${selected.id}&fromCabine=true`)}
              >
                Iniciar Diagnóstico Inicial
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Client list (for switching or initial selection) */}
      {(showList || !selected) && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-3 pb-2 pt-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground/50" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar cliente..."
                className="pl-8 h-7 text-xs bg-background/40 border-border/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 max-h-[50vh]">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => { onSelect(c.id); setShowList(false); setSearch(''); }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg transition-all text-xs',
                  selectedId === c.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted/20 border border-transparent'
                )}
              >
                <span className="font-medium text-foreground truncate block">{c.nome}</span>
                <Badge variant="outline" className={cn('text-[8px] mt-0.5', STATUS_LABEL[c.statusCabine]?.class)}>
                  {STATUS_LABEL[c.statusCabine]?.label}
                </Badge>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-[10px] text-muted-foreground/40 text-center py-6 italic">
                Nenhuma cliente
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
