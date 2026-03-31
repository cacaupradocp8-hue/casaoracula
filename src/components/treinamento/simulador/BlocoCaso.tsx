import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, MessageSquare, User } from 'lucide-react';
import { CasoSimulado } from './types';

interface Props {
  caso: CasoSimulado;
  onNext: () => void;
}

export function BlocoCaso({ caso, onNext }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <User className="w-3.5 h-3.5" />
        <span>Cliente fictícia</span>
        <Badge variant="outline" className="text-[10px] capitalize">{caso.nivel}</Badge>
      </div>

      {/* Fala inicial */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground italic leading-relaxed">
              "{caso.fala_inicial}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sinais */}
      <Card className="border-border/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sinais observados</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {caso.sinais.map((s, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-muted/50 text-foreground/70">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contexto */}
      <p className="text-xs text-muted-foreground leading-relaxed px-1">
        {caso.contexto_breve}
      </p>

      <Button onClick={onNext} className="w-full">
        Iniciar leitura <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
