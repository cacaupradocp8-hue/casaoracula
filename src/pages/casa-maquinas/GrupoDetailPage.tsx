import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { CidadelaMapGroup } from '@/components/casa-maquinas/CidadelaMapGroup';

export default function GrupoDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add member dialog
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  
  // Add encounter dialog
  const [addEncounterOpen, setAddEncounterOpen] = useState(false);
  const [encounterTheme, setEncounterTheme] = useState('');
  const [encounterArchetype, setEncounterArchetype] = useState('');
  const [encounterNotes, setEncounterNotes] = useState('');

  useEffect(() => {
    if (user && groupId) loadAll();
  }, [user, groupId]);

  const loadAll = async () => {
    const [gRes, mRes, eRes, cRes, dRes] = await Promise.all([
      supabase.from('therapy_groups').select('*').eq('id', groupId!).single(),
      supabase.from('group_members').select('*, client:clientes(id, nome)').eq('group_id', groupId!),
      supabase.from('group_encounters').select('*').eq('group_id', groupId!).order('date', { ascending: false }),
      supabase.from('clientes').select('id, nome').eq('terapeuta_id', user!.id).order('nome'),
      supabase.from('districts').select('id, nome'),
    ]);
    setGroup(gRes.data);
    setMembers(mRes.data || []);
    setEncounters(eRes.data || []);
    setClients(cRes.data || []);
    setDistricts(dRes.data || []);
    setLoading(false);
  };

  const handleAddMember = async () => {
    if (!selectedClientId) return;
    const { error } = await supabase.from('group_members').insert({ group_id: groupId!, client_id: selectedClientId });
    if (error) {
      if (error.code === '23505') toast.error('Cliente já está no grupo');
      else toast.error('Erro ao adicionar');
    } else {
      toast.success('Participante adicionada');
      setAddMemberOpen(false);
      setSelectedClientId('');
      loadAll();
    }
  };

  const handleAddEncounter = async () => {
    const { error } = await supabase.from('group_encounters').insert({
      group_id: groupId!,
      theme: encounterTheme || null,
      archetype_worked: encounterArchetype || null,
      notes: encounterNotes || null,
    });
    if (error) toast.error('Erro ao registrar');
    else {
      toast.success('Encontro registrado');
      setAddEncounterOpen(false);
      setEncounterTheme('');
      setEncounterArchetype('');
      setEncounterNotes('');
      loadAll();
    }
  };

  if (loading) {
    return <CasaMaquinasLayout title="Grupo"><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div></CasaMaquinasLayout>;
  }

  if (!group) {
    return <CasaMaquinasLayout title="Grupo não encontrado"><p className="text-center text-[#F5F1E8]/40 py-20">Grupo não encontrado</p></CasaMaquinasLayout>;
  }

  // District distribution for collective map
  const memberIds = members.map(m => m.client_id);

  return (
    <CasaMaquinasLayout title={group.name} subtitle={group.theme || 'Grupo terapêutico'}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participantes */}
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-[#F5F1E8]/80 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C9A24A]" /> Participantes ({members.length})
              </CardTitle>
              <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-[#C9A24A] hover:bg-[#C9A24A]/10 gap-1">
                    <Plus className="w-3 h-3" /> Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0B1B2B] border-[#C9A24A]/20">
                  <DialogHeader><DialogTitle className="text-[#F5F1E8]">Adicionar Participante</DialogTitle></DialogHeader>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {clients.filter(c => !memberIds.includes(c.id)).map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddMember} disabled={!selectedClientId} className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">Adicionar</Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {members.length === 0 ? (
              <p className="text-xs text-[#F5F1E8]/30 text-center py-4">Nenhuma participante</p>
            ) : members.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg bg-[#F5F1E8]/[0.03]">
                <div className="w-7 h-7 rounded-full bg-[#C9A24A]/10 flex items-center justify-center">
                  <span className="text-[10px] text-[#C9A24A] font-bold">{(m.client?.nome || '?')[0]}</span>
                </div>
                <span className="text-sm text-[#F5F1E8]">{m.client?.nome || 'Cliente'}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Encontros */}
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-[#F5F1E8]/80 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A24A]" /> Encontros ({encounters.length})
              </CardTitle>
              <Dialog open={addEncounterOpen} onOpenChange={setAddEncounterOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-[#C9A24A] hover:bg-[#C9A24A]/10 gap-1">
                    <Plus className="w-3 h-3" /> Registrar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0B1B2B] border-[#C9A24A]/20">
                  <DialogHeader><DialogTitle className="text-[#F5F1E8]">Registrar Encontro</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label className="text-[#F5F1E8]/70">Tema</Label><Input value={encounterTheme} onChange={e => setEncounterTheme(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" /></div>
                    <div><Label className="text-[#F5F1E8]/70">Arquétipo/Porta trabalhada</Label><Input value={encounterArchetype} onChange={e => setEncounterArchetype(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" /></div>
                    <div><Label className="text-[#F5F1E8]/70">Notas</Label><Textarea value={encounterNotes} onChange={e => setEncounterNotes(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" /></div>
                    <Button onClick={handleAddEncounter} className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">Registrar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {encounters.length === 0 ? (
              <p className="text-xs text-[#F5F1E8]/30 text-center py-4">Nenhum encontro registrado</p>
            ) : encounters.map(e => (
              <div key={e.id} className="p-3 rounded-lg bg-[#F5F1E8]/[0.03]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#F5F1E8]">
                    {new Date(e.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </span>
                  {e.archetype_worked && <Badge variant="outline" className="text-[8px] border-[#556B57]/30 text-[#556B57]">{e.archetype_worked}</Badge>}
                </div>
                {e.theme && <p className="text-[11px] text-[#F5F1E8]/50">{e.theme}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </CasaMaquinasLayout>
  );
}
