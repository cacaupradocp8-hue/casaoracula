import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QaVinculoSummaryProps {
  therapistName?: string;
  clientName?: string;
  therapistId?: string;
  clientId?: string;
  clientUserId?: string;
  vinculoAtivo: boolean;
  jardinsCount: number;
  entriesCount: number;
  sessoesCount: number;
  sessoesSharedCount: number;
  entriesSharedWithTherapist: number;
  entriesVisibleToClient: number;
}

export function QaVinculoSummary({
  therapistName, clientName, therapistId, clientId, clientUserId,
  vinculoAtivo, jardinsCount, entriesCount, sessoesCount,
  sessoesSharedCount, entriesSharedWithTherapist, entriesVisibleToClient,
}: QaVinculoSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Resumo do Vínculo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Terapeuta</p>
            <p className="font-medium">{therapistName || '—'}</p>
            <p className="text-xs text-muted-foreground font-mono">{therapistId?.slice(0, 8) || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Cliente</p>
            <p className="font-medium">{clientName || '—'}</p>
            <p className="text-xs text-muted-foreground font-mono">{clientId?.slice(0, 8)}</p>
            {clientUserId && <p className="text-xs text-muted-foreground font-mono">uid: {clientUserId.slice(0, 8)}</p>}
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Vínculo</p>
            <Badge variant={vinculoAtivo ? 'default' : 'destructive'}>
              {vinculoAtivo ? 'Ativo' : 'Inativo/Inexistente'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Jardins" value={jardinsCount} />
            <Stat label="Entries" value={entriesCount} />
            <Stat label="Sessões" value={sessoesCount} />
            <Stat label="Sessões comp." value={sessoesSharedCount} />
            <Stat label="Entries → T" value={entriesSharedWithTherapist} />
            <Stat label="Entries → C" value={entriesVisibleToClient} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  );
}
