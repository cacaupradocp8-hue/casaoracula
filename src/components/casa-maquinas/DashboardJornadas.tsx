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
        { estado: 'Ativo', count: counts.ativo, cor: '#4A7C59' },
        { estado: 'Pausado', count: counts.pausado, cor: '#DAA520' },
        { estado: 'Encerrado', count: counts.encerrado, cor: '#C70039' },
      ]);
    }
    setLoading(false);
  };

  const total = jornadas.reduce((sum, j) => sum + j.count, 0);

  return (
    <Card className="border-border/30 bg-card/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" />
          Status das Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        ) : total === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma cliente cadastrada</p>
        ) : (
          <>
            <div className="flex rounded-full overflow-hidden h-2.5 bg-secondary/50">
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

            <div className="flex items-center justify-between">
              {jornadas.map(j => (
                <div key={j.estado} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: j.cor }} />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{j.count}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{j.estado}</span>
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
