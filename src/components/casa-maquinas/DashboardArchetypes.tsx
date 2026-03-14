import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ArchetypeItem {
  name: string;
  count: number;
}

export function DashboardArchetypes() {
  const { user } = useAuth();
  const [archetypes, setArchetypes] = useState<ArchetypeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadArchetypes();
  }, [user]);

  const loadArchetypes = async () => {
    if (!user) return;

    const { data: clients } = await supabase
      .from('clientes')
      .select('id')
      .eq('terapeuta_id', user.id)
      .eq('status', 'ativo');

    if (!clients || clients.length === 0) {
      setLoading(false);
      return;
    }

    const clientIds = clients.map(c => c.id);

    const { data: patterns, error } = await supabase
      .from('client_pattern_stats')
      .select('pattern_name, occurrence_count')
      .in('client_id', clientIds)
      .eq('pattern_type', 'archetype')
      .order('occurrence_count', { ascending: false })
      .limit(20);

    if (!error && patterns) {
      const aggregated: Record<string, number> = {};
      patterns.forEach((p: any) => {
        aggregated[p.pattern_name] = (aggregated[p.pattern_name] || 0) + p.occurrence_count;
      });

      setArchetypes(
        Object.entries(aggregated)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );
    }
    setLoading(false);
  };

  const maxCount = archetypes.length > 0 ? archetypes[0].count : 1;

  return (
    <Card className="border-border/30 bg-card/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Arquétipos Emergentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        ) : archetypes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Arquétipos aparecerão com o uso das ferramentas
          </p>
        ) : (
          <div className="space-y-3">
            {archetypes.map((a, i) => (
              <div key={a.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/70">{a.name}</span>
                  <span className="text-xs text-muted-foreground">{a.count}×</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(a.count / maxCount) * 100}%`,
                      backgroundColor: i === 0 ? '#DAA520' : i === 1 ? '#4A7C59' : '#DAA52060',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
