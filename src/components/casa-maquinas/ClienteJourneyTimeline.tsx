import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckCircle2, MessageSquare, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TimelineItem {
  id: string;
  type: 'sessao' | 'gesto';
  date: string;
  title: string;
  description: string | null;
  status?: string;
}

export function ClienteJourneyTimeline({ clienteId }: { clienteId: string }) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      // Load sessions
      const { data: sessoes } = await supabase
        .from('sessoes_casa_maquinas')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('data_sessao', { ascending: false })
        .limit(5);

      // Load gestures
      const { data: gestos } = await supabase
        .from('gestos_integracao')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false })
        .limit(5);

      const combined: TimelineItem[] = [
        ...(sessoes || []).map(s => ({
          id: s.id,
          type: 'sessao' as const,
          date: s.data_sessao,
          title: 'Sessão Terapêutica',
          description: s.nota_breve,
        })),
        ...(gestos || []).map(g => ({
          id: g.id,
          type: 'gesto' as const,
          date: g.created_at,
          title: 'Gesto de Integração',
          description: g.gesto_texto,
          status: g.status,
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setItems(combined);
      setLoading(false);
    }

    loadTimeline();
  }, [clienteId]);

  if (loading) {
    return <Skeleton className="w-full h-[300px] border-border/30" />;
  }

  if (items.length === 0) {
    return (
      <Card className="border-border/30 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Target className="w-10 h-10 mb-2 opacity-20" />
          <p className="text-sm">A jornada simbólica ainda não começou.</p>
          <p className="text-xs">Registre a primeira sessão para iniciar a linha do tempo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/30">
      {items.map((item, idx) => (
        <div key={item.id} className="relative">
          <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 border-background shadow-sm ${
            item.type === 'sessao' ? 'bg-primary' : 'bg-accent'
          }`} />
          
          <div className="bg-card/40 border border-border/20 rounded-lg p-3 hover:border-primary/20 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                {item.type === 'sessao' ? <MessageSquare className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                {new Date(item.date).toLocaleDateString('pt-BR')}
              </span>
              {item.status && (
                <Badge variant="outline" className="text-[8px] h-4 px-1.5 border border-border/30">
                  {item.status}
                </Badge>
              )}
            </div>
            <h4 className="text-xs font-semibold">{item.title}</h4>
            {item.description && (
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 italic leading-relaxed">
                "{item.description}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
