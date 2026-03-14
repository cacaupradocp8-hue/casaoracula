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
    <Card className="border-border/30 bg-card/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Agenda de Hoje
          </CardTitle>
          <span className="text-xs text-muted-foreground capitalize">{hoje}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Carregando...</p>
        ) : sessoes.length > 0 ? (
          sessoes.map(s => (
            <div
              key={s.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-primary min-w-[52px]">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-mono">{s.hora}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">{s.cliente}</p>
                {s.distrito && (
                  <p className="text-[10px] text-muted-foreground">{s.distrito}</p>
                )}
              </div>
              <Badge
                variant="outline"
                className="text-[10px] border-accent/40 text-accent shrink-0"
              >
                {s.tipo}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma sessão agendada para hoje</p>
        )}
      </CardContent>
    </Card>
  );
}
