import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Lock, Globe, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Group {
  id: string; nome: string; descricao: string | null; privado: boolean;
  membros_count: number; criador_id: string; joined?: boolean;
}

export function CommunityGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '', privado: false });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('community_groups').select('*').eq('ativo', true).order('membros_count', { ascending: false });
    if (!data) { setLoading(false); return; }
    let joinedIds: string[] = [];
    if (user) {
      const { data: members } = await supabase.from('community_group_members').select('group_id').eq('user_id', user.id);
      joinedIds = members?.map(m => m.group_id) || [];
    }
    setGroups(data.map(g => ({ ...g, joined: joinedIds.includes(g.id) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const createGroup = async () => {
    if (!user || !form.nome.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from('community_groups').insert({
      nome: form.nome.trim(), descricao: form.descricao.trim() || null,
      privado: form.privado, criador_id: user.id,
    }).select().single();
    if (!error && data) {
      await supabase.from('community_group_members').insert({ group_id: data.id, user_id: user.id, role: 'admin' });
    }
    setSaving(false);
    if (error) toast.error('Erro ao criar grupo');
    else { toast.success('Grupo criado!'); setForm({ nome: '', descricao: '', privado: false }); setDialogOpen(false); load(); }
  };

  const toggleJoin = async (group: Group) => {
    if (!user) return;
    if (group.joined) {
      await supabase.from('community_group_members').delete().eq('group_id', group.id).eq('user_id', user.id);
      await supabase.from('community_groups').update({ membros_count: Math.max(0, group.membros_count - 1) }).eq('id', group.id);
    } else {
      await supabase.from('community_group_members').insert({ group_id: group.id, user_id: user.id });
      await supabase.from('community_groups').update({ membros_count: group.membros_count + 1 }).eq('id', group.id);
    }
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <p className="text-sm text-muted-foreground">Participe de grupos temáticos ou crie o seu.</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground shrink-0"><Plus className="w-3 h-3 mr-1" /> Criar Grupo</Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0B1B2B] border-primary/20">
            <DialogHeader><DialogTitle className="text-foreground">Novo Grupo</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome do grupo" className="bg-background border-primary/10" maxLength={100} />
              <Textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição (opcional)" className="min-h-[60px] bg-background border-primary/10" maxLength={500} />
              <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer">
                <input type="checkbox" checked={form.privado} onChange={e => setForm(f => ({ ...f, privado: e.target.checked }))} className="rounded" />
                Grupo privado
              </label>
              <Button onClick={createGroup} disabled={saving || !form.nome.trim()} className="w-full bg-primary text-primary-foreground">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null} Criar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Nenhum grupo criado ainda.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {groups.map(g => (
            <Card key={g.id} className="bg-[#0F2438] border-primary/10">
              <CardContent className="py-4 space-y-3">
                <div className="flex items-center gap-2">
                  {g.privado ? <Lock className="w-4 h-4 text-muted-foreground" /> : <Globe className="w-4 h-4 text-emerald-400" />}
                  <p className="text-sm font-medium text-foreground">{g.nome}</p>
                </div>
                {g.descricao && <p className="text-xs text-muted-foreground">{g.descricao}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> {g.membros_count}</span>
                  <Button size="sm" variant={g.joined ? 'outline' : 'default'} onClick={() => toggleJoin(g)}
                    className={g.joined ? 'border-primary/30 text-primary' : 'bg-primary text-primary-foreground'}>
                    {g.joined ? 'Sair' : 'Participar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
