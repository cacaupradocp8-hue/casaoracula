import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, XCircle } from 'lucide-react';
import type { ConsistencyAlert } from '@/hooks/useQaJardimData';

interface Props {
  alerts: ConsistencyAlert[];
}

export function QaConsistencyAlerts({ alerts }: Props) {
  if (!alerts.length) return (
    <Card>
      <CardContent className="py-6 text-center text-muted-foreground text-sm">
        ✅ Nenhum alerta de consistência encontrado
      </CardContent>
    </Card>
  );

  const errors = alerts.filter(a => a.type === 'error');
  const warnings = alerts.filter(a => a.type === 'warning');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Alertas de Consistência ({errors.length} erros, {warnings.length} avisos)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {errors.map((a, i) => (
          <Alert key={`e-${i}`} variant="destructive" className="py-2">
            <XCircle className="h-4 w-4" />
            <AlertTitle className="text-xs font-medium">Erro</AlertTitle>
            <AlertDescription className="text-xs">{a.message}</AlertDescription>
          </Alert>
        ))}
        {warnings.map((a, i) => (
          <Alert key={`w-${i}`} className="py-2 border-yellow-500/50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-xs font-medium">Aviso</AlertTitle>
            <AlertDescription className="text-xs">{a.message}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
