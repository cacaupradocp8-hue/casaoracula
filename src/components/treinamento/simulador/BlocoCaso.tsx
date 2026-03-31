import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, MessageSquare, User } from 'lucide-react';
import { TrainingCase } from './types';

interface Props {
  caso: TrainingCase;
  onNext: () => void;
}

const NIVEL_LABEL: Record<string, string> = {
  guiado: 'Guiado',
  semi_guiado: 'Semi-guiado',
  livre: 'Livre',
};

export function BlocoCaso({ caso, onNext }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <User className="w-3.5 h-3.5" />
        <span>Cliente fictícia</span>
        <Badge variant="outline" className="text-[10px]">{NIVEL_LABEL[caso.nivel] || caso.nivel}</Badge>
      </div>

      {/* Caso texto */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground italic leading-relaxed">
              "{caso.caso_texto}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sinais */}
      {caso.signals && caso.signals.length > 0 && (
        <Card className="border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sinais observados</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {caso.signals.map(s => (
                <Badge key={s.id} variant="secondary" className="text-xs bg-muted/50 text-foreground/70">
                  {s.sinal}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tema */}
      {caso.tema && (
        <p className="text-xs text-muted-foreground leading-relaxed px-1">
          {caso.tema}
        </p>
      )}

      <Button onClick={onNext} className="w-full">
        Iniciar leitura <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
