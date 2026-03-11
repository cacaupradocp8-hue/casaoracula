import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JornadaCount {
  estado: string;
  count: number;
  cor: string;
}

export function DashboardJornadas() {
  const { user } = useAuth();
  const [jornadas, setJornadas] = useState<JornadaCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadJornadas();
  }, [user]);

  const loadJornadas = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('clientes')
      .select('status')
      .eq('terapeuta_id', user.id);

    if (!error && data) {
      const counts: Record<string, number> = { ativo: 0, pausado: 0, encerrado: 0 };
      data.forEach((c: any) => {
        const s = c.status || 'ativo';
        counts[s] = (counts[s] || 0) + 1;
      });

      setJornadas([
        { estado: 'Ativo', count: counts.ativo, cor: '#556B57' },
        { estado: 'Pausado', count: counts.pausado, cor: '#C9A24A' },
        { estado: 'Encerrado', count: counts.encerrado, cor: '#E85A5A' },
      ]);
    }
    setLoading(false);
  };

  const total = jornadas.reduce((sum, j) => sum + j.count, 0);

  return (
    <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-[#F5F1E8]/80 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#C9A24A]" />
          Status das Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-[#C9A24A]" />
          </div>
        ) : total === 0 ? (
          <p className="text-sm text-[#F5F1E8]/30 text-center py-4">Nenhuma cliente cadastrada</p>
        ) : (
          <>
            {/* Bar */}
            <div className="flex rounded-full overflow-hidden h-2.5 bg-[#F5F1E8]/5">
              {jornadas.map(j => (
                j.count > 0 && (
                  <div
                    key={j.estado}
                    className="h-full transition-all"
                    style={{
                      width: `${(j.count / total) * 100}%`,
                      backgroundColor: j.cor,
                    }}
                  />
                )
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between">
              {jornadas.map(j => (
                <div key={j.estado} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: j.cor }} />
                  <div>
                    <span className="text-sm font-semibold text-[#F5F1E8]">{j.count}</span>
                    <span className="text-[10px] text-[#F5F1E8]/40 ml-1">{j.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
