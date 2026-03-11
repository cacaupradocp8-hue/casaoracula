import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DISTRICT_COLORS: Record<string, string> = {
  'distrito': '#C9A24A',
  'torre': '#E85A5A',
  'arquetipo': '#556B57',
  'carta_oraculo': '#8B5CF6',
  'intervencao': '#3B82F6',
};

interface PatternData {
  name: string;
  count: number;
  type: string;
}

export function DashboardDistrictChart() {
  const { user } = useAuth();
  const [data, setData] = useState<PatternData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadDistrictData();
  }, [user]);

  const loadDistrictData = async () => {
    if (!user) return;

    // Get client IDs for this therapist
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

    // Get pattern stats for districts
    const { data: patterns, error } = await supabase
      .from('client_pattern_stats')
      .select('pattern_name, pattern_type, occurrence_count')
      .in('client_id', clientIds)
      .eq('pattern_type', 'district')
      .order('occurrence_count', { ascending: false })
      .limit(8);

    if (!error && patterns) {
      // Aggregate by pattern_name
      const aggregated: Record<string, number> = {};
      patterns.forEach((p: any) => {
        aggregated[p.pattern_name] = (aggregated[p.pattern_name] || 0) + p.occurrence_count;
      });

      setData(
        Object.entries(aggregated)
          .map(([name, count]) => ({ name, count, type: 'distrito' }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
      );
    }
    setLoading(false);
  };

  return (
    <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-[#F5F1E8]/80 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C9A24A]" />
          Distritos Mais Visitados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-4 h-4 animate-spin text-[#C9A24A]" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-[#F5F1E8]/30 text-center py-8">
            Dados simbólicos aparecerão conforme as sessões avançarem
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: '#F5F1E8', fontSize: 11, opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1B2B',
                  border: '1px solid rgba(201,162,74,0.2)',
                  borderRadius: 8,
                  color: '#F5F1E8',
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value} visitas`, 'Frequência']}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {data.map((_, index) => (
                  <Cell key={index} fill={index === 0 ? '#C9A24A' : '#C9A24A80'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
