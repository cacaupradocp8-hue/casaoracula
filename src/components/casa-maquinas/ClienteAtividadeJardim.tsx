import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Eye, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  clienteId: string;
}

export function ClienteAtividadeJardim({ clienteId }: Props) {
  const [orientacoes, setOrientacoes] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [clienteId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load orientations for this client
      const { data: ors } = await (supabase as any)
        .from('co_orientacoes')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false })
        .limit(10);

      setOrientacoes(ors || []);

      // Load client's jardim entries (shared with therapist)
      const { data: cliente } = await supabase
        .from('clientes')
        .select('client_user_id')
        .eq('id', clienteId)
        .single();

      if (cliente?.client_user_id) {
        const { data: jardimData } = await supabase
          .from('co_jardins')
          .select('id')
          .eq('client_user_id', cliente.client_user_id)
          .limit(1)
          .maybeSingle();

        if (jardimData) {
          const { data: ents } = await supabase
            .from('co_jardim_entries')
            .select('*')
            .eq('jardim_id', jardimData.id)
            .eq('shared_with_therapist', true)
            .order('created_at', { ascending: false })
            .limit(5);

          setEntries(ents || []);
        }
      }
    } catch (err) {
      console.error('Error loading jardim activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const completed = orientacoes.filter(o => o.status === 'completed').length;
  const pending = orientacoes.filter(o => o.status === 'pending').length;
  const viewed = orientacoes.filter(o => o.status === 'viewed').length;
  const lastEntry = entries[0];

  if (loading) return null;
  if (orientacoes.length === 0 && entries.length === 0) return null;

  return (
    <Card className="border-emerald-500/20 bg-card/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs flex items-center gap-2">
          <Leaf className="w-3.5 h-3.5 text-emerald-500/60" />
          Atividade no Jardim
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary stats */}
        <div className="flex gap-2 flex-wrap">
          {completed > 0 && (
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 gap-1">
              <CheckCircle className="w-3 h-3" /> {completed} concluída{completed > 1 ? 's' : ''}
            </Badge>
          )}
          {viewed > 0 && (
            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400 gap-1">
              <Eye className="w-3 h-3" /> {viewed} vista{viewed > 1 ? 's' : ''}
            </Badge>
          )}
          {pending > 0 && (
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 gap-1">
              <Clock className="w-3 h-3" /> {pending} pendente{pending > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Client responses */}
        {orientacoes.filter(o => o.resposta_cliente).slice(0, 3).map(o => (
          <div key={o.id} className="p-2.5 rounded-lg bg-muted/20 border border-border/15">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageCircle className="w-3 h-3 text-primary/50" />
              <span className="text-[10px] text-muted-foreground">
                Resposta · {format(new Date(o.updated_at), "dd MMM", { locale: ptBR })}
              </span>
            </div>
            <p className="text-xs text-foreground/60 line-clamp-2">{o.resposta_cliente}</p>
          </div>
        ))}

        {/* Last jardim entry */}
        {lastEntry && (
          <div className="p-2.5 rounded-lg bg-emerald-950/15 border border-emerald-500/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Leaf className="w-3 h-3 text-emerald-500/50" />
              <span className="text-[10px] text-emerald-500/50">
                Registro · {format(new Date(lastEntry.created_at), "dd MMM · HH:mm", { locale: ptBR })}
              </span>
            </div>
            <p className="text-xs text-foreground/50 line-clamp-2">{lastEntry.content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
