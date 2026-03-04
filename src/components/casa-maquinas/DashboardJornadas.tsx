import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass } from 'lucide-react';

const mockJornadas = [
  { estado: 'crise', count: 2, cor: '#E85A5A' },
  { estado: 'travessia', count: 5, cor: '#C9A24A' },
  { estado: 'integração', count: 3, cor: '#556B57' },
];

export function DashboardJornadas() {
  const total = mockJornadas.reduce((sum, j) => sum + j.count, 0);

  return (
    <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-[#F5F1E8]/80 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#C9A24A]" />
          Jornadas em Curso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Bar */}
        <div className="flex rounded-full overflow-hidden h-2.5 bg-[#F5F1E8]/5">
          {mockJornadas.map(j => (
            <div
              key={j.estado}
              className="h-full transition-all"
              style={{
                width: `${(j.count / total) * 100}%`,
                backgroundColor: j.cor,
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          {mockJornadas.map(j => (
            <div key={j.estado} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: j.cor }} />
              <div>
                <span className="text-sm font-semibold text-[#F5F1E8]">{j.count}</span>
                <span className="text-[10px] text-[#F5F1E8]/40 ml-1 capitalize">{j.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
