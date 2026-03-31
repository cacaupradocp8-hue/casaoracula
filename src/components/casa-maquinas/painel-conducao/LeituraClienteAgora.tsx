import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit3 } from 'lucide-react';

interface Props {
  distritoEstrutural: string | null;
  distritoEmergente: string;
  onDistritoEmergenteChange: (v: string) => void;
  sensacaoCentral: string;
  onSensacaoCentralChange: (v: string) => void;
  posturaSugerida: string;
  onPosturaSugeridaChange: (v: string) => void;
}

export function LeituraClienteAgora({
  distritoEstrutural,
  distritoEmergente,
  onDistritoEmergenteChange,
  sensacaoCentral,
  onSensacaoCentralChange,
  posturaSugerida,
  onPosturaSugeridaChange,
}: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <Card className="border-primary/20 bg-primary/5 mb-4">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary/60" />
            <h3 className="text-xs font-semibold text-foreground">Leitura da cliente agora</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] text-muted-foreground hover:text-foreground gap-1"
            onClick={() => setEditing(!editing)}
          >
            <Edit3 className="w-3 h-3" />
            {editing ? 'Concluir' : 'Editar'}
          </Button>
        </div>

        {/* Aviso ético obrigatório */}
        <p className="text-[9px] text-muted-foreground/60 italic leading-relaxed">
          Leitura sugerida a partir dos sinais atuais. A condução permanece com a terapeuta.
        </p>

        {/* Distritos em dois níveis */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Distrito estrutural</p>
            <Badge variant="secondary" className="text-[10px]">
              {distritoEstrutural || 'Não identificado'}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-primary/50">Distrito emergente</p>
            {editing ? (
              <input
                value={distritoEmergente}
                onChange={e => onDistritoEmergenteChange(e.target.value)}
                className="w-full text-xs bg-background/60 border border-border/30 rounded px-2 py-1 text-foreground"
                placeholder="Selecione ou escreva..."
              />
            ) : (
              <Badge variant="default" className="text-[10px] bg-primary/20 text-primary">
                {distritoEmergente || 'A definir'}
              </Badge>
            )}
          </div>
        </div>

        {/* Sensação central */}
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Sensação central</p>
          {editing ? (
            <input
              value={sensacaoCentral}
              onChange={e => onSensacaoCentralChange(e.target.value)}
              className="w-full text-xs bg-background/60 border border-border/30 rounded px-2 py-1 text-foreground"
              placeholder="Ex: aperto no peito, medo difuso..."
            />
          ) : (
            <p className="text-xs text-foreground/80">{sensacaoCentral || '—'}</p>
          )}
        </div>

        {/* Postura sugerida */}
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Postura sugerida</p>
          {editing ? (
            <Textarea
              value={posturaSugerida}
              onChange={e => onPosturaSugeridaChange(e.target.value)}
              className="text-xs bg-background/60 border-border/30 min-h-[50px]"
              placeholder="Ex: Sustentar silêncio, acolher sem interpretar..."
            />
          ) : (
            <p className="text-xs text-foreground/80">{posturaSugerida || '—'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
