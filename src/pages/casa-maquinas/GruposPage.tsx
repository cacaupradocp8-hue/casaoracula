import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function GruposPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) loadGroups();
  }, [user]);

  const loadGroups = async () => {
    const { data } = await supabase
      .from('therapy_groups')
      .select('*, group_members(count)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setGroups(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('therapy_groups').insert({
      name: newName.trim(),
      theme: newTheme || null,
      user_id: user!.id,
    });
    if (error) toast.error('Erro ao criar grupo');
    else { toast.success('Grupo criado'); setDialogOpen(false); setNewName(''); setNewTheme(''); loadGroups(); }
    setSaving(false);
  };

  return (
    <CasaMaquinasLayout title="Grupos" subtitle="Grupos terapêuticos e círculos">
      <div className="flex justify-end mb-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] gap-2">
              <Plus className="w-4 h-4" />Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0B1B2B] border-[#C9A24A]/20">
            <DialogHeader><DialogTitle className="text-[#F5F1E8]">Novo Grupo</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label className="text-[#F5F1E8]/70">Nome</Label><Input value={newName} onChange={e => setNewName(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" /></div>
              <div><Label className="text-[#F5F1E8]/70">Tema do Círculo</Label><Textarea value={newTheme} onChange={e => setNewTheme(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" /></div>
              <Button onClick={handleCreate} disabled={saving || !newName.trim()} className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Grupo'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 text-[#F5F1E8]/40">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>Nenhum grupo criado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(g => (
            <Card key={g.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-[#F5F1E8] mb-1">{g.name}</h3>
                {g.theme && <p className="text-xs text-[#F5F1E8]/40 mb-2">{g.theme}</p>}
                <span className="text-[10px] text-[#C9A24A]">
                  {g.group_members?.[0]?.count || 0} participantes
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CasaMaquinasLayout>
  );
}
