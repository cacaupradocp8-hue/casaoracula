import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Evento {
  id: string; nome: string; descricao: string | null; data_evento: string;
  link: string | null; tipo: string; participantes_count: number; participating?: boolean;
}

const TIPO_STYLES: Record<string, string> = {
  webinar: 'bg-blue-500/15 text-blue-400',
  encontro: 'bg-emerald-500/15 text-emerald-400',
  workshop: 'bg-amber-500/15 text-amber-400',
  supervisao: 'bg-purple-500/15 text-purple-400',
};

export function CommunityEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('community_events').select('*').eq('ativo', true).order('data_evento');
    if (!data) { setLoading(false); return; }
    let participatingIds: string[] = [];
    if (user) {
      const { data: parts } = await supabase.from('community_event_participants').select('event_id').eq('user_id', user.id);
      participatingIds = parts?.map(p => p.event_id) || [];
    }
    setEvents(data.map(e => ({ ...e, participating: participatingIds.includes(e.id) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const toggleParticipation = async (event: Evento) => {
    if (!user) return;
    if (event.participating) {
      await supabase.from('community_event_participants').delete().eq('event_id', event.id).eq('user_id', user.id);
    } else {
      await supabase.from('community_event_participants').insert({ event_id: event.id, user_id: user.id });
    }
    load();
    toast.success(event.participating ? 'Participação cancelada' : 'Participação confirmada!');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-10 h-10 mx-auto text-primary/40 mb-3" />
        <p className="text-muted-foreground">Nenhum evento agendado.</p>
        <p className="text-xs text-muted-foreground/50 mt-1">Eventos serão publicados pela equipe.</p>
      </div>
    );
  }

  const now = new Date();
  const upcoming = events.filter(e => new Date(e.data_evento) >= now);
  const past = events.filter(e => new Date(e.data_evento) < now);

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Próximos Eventos</h3>
          {upcoming.map(e => (
            <Card key={e.id} className="bg-[#0F2438] border-primary/10">
              <CardContent className="py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.nome}</p>
                    <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(e.data_evento), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge className={TIPO_STYLES[e.tipo] || 'bg-muted text-muted-foreground'}>{e.tipo}</Badge>
                </div>
                {e.descricao && <p className="text-xs text-muted-foreground">{e.descricao}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" onClick={() => toggleParticipation(e)}
                    variant={e.participating ? 'outline' : 'default'}
                    className={e.participating ? 'border-emerald-500/30 text-emerald-400' : 'bg-primary text-primary-foreground'}>
                    {e.participating && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {e.participating ? 'Participando' : 'Participar'}
                  </Button>
                  {e.link && (
                    <Button size="sm" variant="ghost" asChild className="text-muted-foreground">
                      <a href={e.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3 h-3 mr-1" /> Link</a>
                    </Button>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">{e.participantes_count} participantes</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Eventos Passados</h3>
          {past.map(e => (
            <Card key={e.id} className="bg-[#0F2438] border-muted/10 opacity-60">
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{e.nome}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(e.data_evento), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <Badge className={TIPO_STYLES[e.tipo] || ''} variant="outline">{e.tipo}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
