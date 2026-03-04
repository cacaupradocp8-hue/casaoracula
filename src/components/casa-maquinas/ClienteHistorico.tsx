import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wrench, Lightbulb, Loader2 } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  checkin_state: string | null;
  insight: string | null;
  task: string | null;
  notes: string | null;
  district?: { nome: string } | null;
  tool?: { nome: string } | null;
}

export function ClienteHistorico({ clienteId }: { clienteId: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [clienteId]);

  const loadSessions = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*, district:districts(nome), tool:tools(nome)')
      .eq('client_id', clienteId)
      .order('date', { ascending: false });

    setSessions(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-[#C9A24A]" /></div>;
  }

  if (sessions.length === 0) {
    return <p className="text-center text-[#F5F1E8]/30 py-10">Nenhuma sessão registrada</p>;
  }

  return (
    <div className="space-y-3">
      {sessions.map(s => (
        <Card key={s.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-[#F5F1E8]">
                {new Date(s.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              {s.checkin_state && (
                <Badge variant="outline" className="text-[10px] border-[#C9A24A]/20 text-[#C9A24A]">
                  {s.checkin_state}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mb-2 text-[10px] text-[#F5F1E8]/40">
              {s.district && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{s.district.nome}
                </span>
              )}
              {s.tool && (
                <span className="flex items-center gap-1">
                  <Wrench className="w-3 h-3" />{s.tool.nome}
                </span>
              )}
            </div>
            {s.insight && (
              <div className="flex items-start gap-2 mt-2">
                <Lightbulb className="w-3 h-3 text-[#C9A24A] mt-0.5 shrink-0" />
                <p className="text-xs text-[#F5F1E8]/60">{s.insight}</p>
              </div>
            )}
            {s.task && (
              <p className="text-xs text-[#556B57] mt-1 ml-5">Tarefa: {s.task}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
