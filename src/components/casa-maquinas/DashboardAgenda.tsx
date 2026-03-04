import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockSessoes = [
  { id: '1', cliente: 'Helena M.', hora: '09:00', distrito: 'Torres', tipo: 'Retorno' },
  { id: '2', cliente: 'Isabela R.', hora: '11:00', distrito: 'Labirinto', tipo: 'Primeira vez' },
  { id: '3', cliente: 'Marina S.', hora: '14:30', distrito: 'Jardim dos Arquétipos', tipo: 'Retorno' },
];

export function DashboardAgenda() {
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[#F5F1E8]/80 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C9A24A]" />
            Agenda de Hoje
          </CardTitle>
          <span className="text-xs text-[#F5F1E8]/40 capitalize">{hoje}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockSessoes.map(s => (
          <div
            key={s.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F1E8]/[0.03] hover:bg-[#F5F1E8]/[0.06] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-[#C9A24A] min-w-[52px]">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-mono">{s.hora}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#F5F1E8] font-medium truncate">{s.cliente}</p>
              <p className="text-[10px] text-[#F5F1E8]/40">{s.distrito}</p>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] border-[#556B57]/40 text-[#556B57] shrink-0"
            >
              {s.tipo}
            </Badge>
          </div>
        ))}
        {mockSessoes.length === 0 && (
          <p className="text-sm text-[#F5F1E8]/30 text-center py-4">Nenhuma sessão agendada</p>
        )}
      </CardContent>
    </Card>
  );
}
