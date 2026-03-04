import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pin, MessageCircle } from 'lucide-react';
import { useTecelaData } from '@/hooks/useTecela';
import { ComentariosSection } from './ComentariosSection';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Trama {
  id: string;
  title: string;
  district_id: string | null;
  objective: string | null;
  prompt: string | null;
  month: string;
  created_by: string;
  pinned: boolean;
  created_at: string;
}

export function TramasTab({ canCreate, isAdmin }: { canCreate: boolean; isAdmin: boolean }) {
  const { user } = useAuth();
  const { data: tramas, isLoading, refresh } = useTecelaData<Trama>('tecela_tramas');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', objective: '', prompt: '', month: new Date().toISOString().slice(0, 7) });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!user || !form.title.trim()) return;
    await (supabase.from('tecela_tramas' as any) as any).insert({
      title: form.title.trim(),
      objective: form.objective.trim() || null,
      prompt: form.prompt.trim() || null,
      month: form.month,
      created_by: user.id,
    });
    toast.success('Trama criada');
    setOpen(false);
    setForm({ title: '', objective: '', prompt: '', month: new Date().toISOString().slice(0, 7) });
    refresh();
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Carregando tramas...</div>;

  const pinned = tramas.filter(t => t.pinned);
  const regular = tramas.filter(t => !t.pinned);

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Feed temático mensal — tramas guiadas para reflexão profissional</p>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Trama</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova Trama do Mês</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Título da trama" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                <Input placeholder="Objetivo" value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} />
                <Textarea placeholder="Prompt / pergunta condutora" value={form.prompt} onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))} />
                <Input type="month" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} />
                <Button onClick={handleCreate} className="w-full" variant="gold">Criar Trama</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {[...pinned, ...regular].map(trama => (
        <Card key={trama.id} className={`border-border/50 ${trama.pinned ? 'border-gold/30 bg-gold/5' : ''}`}>
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedId(expandedId === trama.id ? null : trama.id)}>
            <div className="flex items-center gap-2">
              {trama.pinned && <Pin className="h-4 w-4 text-gold" />}
              <CardTitle className="text-base">{trama.title}</CardTitle>
              <Badge variant="secondary" className="text-xs ml-auto">{trama.month}</Badge>
            </div>
            {trama.objective && <p className="text-sm text-muted-foreground">{trama.objective}</p>}
          </CardHeader>
          {expandedId === trama.id && (
            <CardContent className="space-y-4">
              {trama.prompt && (
                <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
                  <p className="text-sm italic text-foreground">"{trama.prompt}"</p>
                </div>
              )}
              <ComentariosSection refType="trama" refId={trama.id} />
            </CardContent>
          )}
        </Card>
      ))}
      {tramas.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma trama criada ainda.</p>}
    </div>
  );
}
