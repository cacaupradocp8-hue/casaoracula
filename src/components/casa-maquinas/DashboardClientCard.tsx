import { MapPin, Castle, ChevronRight, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClientCardProps {
  nome: string;
  ultimaSessao: string;
  distritoAtual: string;
  torrePredominante: string;
  estado: 'crise' | 'travessia' | 'integração';
  onOpenCity?: () => void;
  onStartSession?: () => void;
  onViewHistory?: () => void;
}

const estadoCores: Record<string, string> = {
  crise: 'bg-destructive/15 text-destructive border-destructive/30',
  travessia: 'bg-primary/15 text-primary border-primary/30',
  'integração': 'bg-accent/15 text-accent border-accent/30',
};

export function DashboardClientCard({
  nome,
  ultimaSessao,
  distritoAtual,
  torrePredominante,
  estado,
  onOpenCity,
  onStartSession,
  onViewHistory,
}: ClientCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border/30 bg-card/70 backdrop-blur-sm hover:border-primary/30 transition-all group hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-display font-semibold text-foreground">{nome}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Última sessão: {ultimaSessao}</p>
        </div>
        <Badge variant="outline" className={`text-[10px] ${estadoCores[estado]}`}>
          {estado}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3 text-primary/60" />
          {distritoAtual || '—'}
        </div>
        <span className="text-foreground/20">·</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Castle className="w-3 h-3 text-primary/60" />
          {torrePredominante || '—'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onOpenCity}
          className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 flex-1"
        >
          Abrir Cidade
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onStartSession}
          className="h-7 text-xs border-border/40 text-foreground/60 hover:text-foreground hover:bg-primary/10"
        >
          Cabine
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewHistory}
          className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30"
        >
          <History className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
