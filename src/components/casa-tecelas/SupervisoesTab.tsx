import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, Video, ExternalLink } from 'lucide-react';
import { useTecelaData } from '@/hooks/useTecela';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SupervisaoEvento {
  id: string;
  titulo: string;
  descricao: string | null;
  tema: string | null;
  data_evento: string;
  link_ao_vivo: string | null;
  link_replay: string | null;
  status: string;
  created_at: string;
}

export function SupervisoesTab({ isAdmin }: { isAdmin: boolean }) {
  const { user } = useAuth();
  const { data: eventos, isLoading, refresh } = useTecelaData<SupervisaoEvento>('tecela_supervisoes');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', tema: '', data_evento: '', link_ao_vivo: '' });

  const handleCreate = async () => {
    if (!user || !form.titulo.trim() || !form.data_evento) return;
    await (supabase.from('tecela_supervisoes' as any) as any).insert({
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      tema: form.tema.trim() || null,
      data_evento: form.data_evento,
      link_ao_vivo: form.link_ao_vivo.trim() || null,
      created_by: user.id,
    });
    toast.success('Supervisão agendada');
    setOpen(false);
    setForm({ titulo: '', descricao: '', tema: '', data_evento: '', link_ao_vivo: '' });
    refresh();
  };

  const now = new Date();
  const upcoming = eventos.filter(e => new Date(e.data_evento) >= now).sort((a, b) => new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime());
  const past = eventos.filter(e => new Date(e.data_evento) < now).sort((a, b) => new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime());

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Carregando supervisões...</div>;

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Agenda de supervisões e replays</p>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" size="sm"><Plus className="h-4 w-4 mr-1" /> Agendar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Agendar Supervisão</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Título" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
                <Input placeholder="Tema" value={form.tema} onChange={e => setForm(f => ({ ...f, tema: e.target.value }))} />
                <Textarea placeholder="Descrição (opcional)" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
                <Input type="datetime-local" value={form.data_evento} onChange={e => setForm(f => ({ ...f, data_evento: e.target.value }))} />
                <Input placeholder="Link ao vivo (opcional)" value={form.link_ao_vivo} onChange={e => setForm(f => ({ ...f, link_ao_vivo: e.target.value }))} />
                <Button onClick={handleCreate} className="w-full" variant="gold">Agendar</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gold flex items-center gap-2"><Calendar className="h-4 w-4" /> Próximas</h3>
          {upcoming.map(ev => (
            <Card key={ev.id} className="border-gold/20 bg-gold/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base flex-1">{ev.titulo}</CardTitle>
                  {ev.tema && <Badge variant="secondary" className="text-xs">{ev.tema}</Badge>}
                </div>
                <p className="text-sm text-gold">{format(new Date(ev.data_evento), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</p>
              </CardHeader>
              {(ev.descricao || ev.link_ao_vivo) && (
                <CardContent className="space-y-2">
                  {ev.descricao && <p className="text-sm text-muted-foreground">{ev.descricao}</p>}
                  {ev.link_ao_vivo && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={ev.link_ao_vivo} target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4 mr-1" /> Entrar ao vivo</a>
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Video className="h-4 w-4" /> Replays</h3>
          {past.map(ev => (
            <Card key={ev.id} className="border-border/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm flex-1 text-muted-foreground">{ev.titulo}</CardTitle>
                  <span className="text-xs text-muted-foreground">{format(new Date(ev.data_evento), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
              </CardHeader>
              {ev.link_replay && (
                <CardContent>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={ev.link_replay} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-1" /> Assistir replay</a>
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {eventos.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma supervisão agendada.</p>}
    </div>
  );
}
