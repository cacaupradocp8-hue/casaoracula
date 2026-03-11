import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SessaoAgenda {
  id: string;
  cliente: string;
  hora: string;
  distrito: string;
  tipo: string;
}

export function DashboardAgenda() {
  const { user } = useAuth();
  const [sessoes, setSessoes] = useState<SessaoAgenda[]>([]);
  const [loading, setLoading] = useState(true);

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useEffect(() => {
    if (!user) return;
    loadSessoes();
  }, [user]);

  const loadSessoes = async () => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('sessoes_casa_maquinas')
      .select('id, data_sessao, nota_breve, cliente_id, clientes(nome)')
      .eq('owner_id', user.id)
      .eq('data_sessao', todayStr)
      .order('created_at', { ascending: true })
      .limit(5);

    if (!error && data) {
      setSessoes(
        data.map((s: any) => ({
          id: s.id,
          cliente: s.clientes?.nome || 'Cliente',
          hora: new Date(s.created_at || s.data_sessao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          distrito: '',
          tipo: 'Sessão',
        }))
      );
    }
    setLoading(false);
  };

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
        {loading ? (
          <p className="text-sm text-[#F5F1E8]/30 text-center py-4">Carregando...</p>
        ) : sessoes.length > 0 ? (
          sessoes.map(s => (
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
                {s.distrito && (
                  <p className="text-[10px] text-[#F5F1E8]/40">{s.distrito}</p>
                )}
              </div>
              <Badge
                variant="outline"
                className="text-[10px] border-[#556B57]/40 text-[#556B57] shrink-0"
              >
                {s.tipo}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#F5F1E8]/30 text-center py-4">Nenhuma sessão agendada para hoje</p>
        )}
      </CardContent>
    </Card>
  );
}
