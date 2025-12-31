import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AgenteStatus = 'ativo' | 'inativo';
type PortalType = 'visitante' | 'pre_iniciada' | 'iniciada' | 'admin';

interface Agente {
  id: string;
  nome: string;
  descricao: string;
  instrucoes_base: string;
  status: AgenteStatus;
  portal_minimo: PortalType;
}

interface FormState {
  nome: string;
  descricao: string;
  instrucoes_base: string;
  status: AgenteStatus;
  portal_minimo: PortalType;
}

export function AdminAgentesTab() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Agente | null>(null);
  const [form, setForm] = useState<FormState>({ nome: '', descricao: '', instrucoes_base: '', status: 'ativo', portal_minimo: 'pre_iniciada' });
  const { toast } = useToast();

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from('agentes').select('*').order('nome');
    setAgentes((data || []) as Agente[]);
    setIsLoading(false);
  };

  const openDialog = (a?: Agente) => {
    if (a) { setEditing(a); setForm({ nome: a.nome, descricao: a.descricao, instrucoes_base: a.instrucoes_base, status: a.status, portal_minimo: a.portal_minimo }); }
    else { setEditing(null); setForm({ nome: '', descricao: '', instrucoes_base: '', status: 'ativo', portal_minimo: 'pre_iniciada' }); }
    setDialogOpen(true);
  };

  const save = async () => {
    if (editing) await supabase.from('agentes').update(form).eq('id', editing.id);
    else await supabase.from('agentes').insert(form);
    toast({ title: 'Salvo!' });
    setDialogOpen(false);
    fetch();
  };

  const remove = async (id: string) => {
    await supabase.from('agentes').delete().eq('id', id);
    toast({ title: 'Excluído!' });
    fetch();
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => openDialog()} variant="gold"><Plus className="w-4 h-4 mr-2" /> Novo Agente</Button></div>
      <div className="grid gap-4 md:grid-cols-2">
        {agentes.map(a => (
          <Card key={a.id} className="glass">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center"><Bot className="w-5 h-5 text-gold" /></div>
                <div><CardTitle className="text-lg">{a.nome}</CardTitle><Badge variant={a.status === 'ativo' ? 'default' : 'secondary'}>{a.status}</Badge></div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openDialog(a)}><Edit className="w-4 h-4" /></Button>
                <AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir agente?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => remove(a.id)}>Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
              </div>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{a.descricao}</p></CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? 'Editar Agente' : 'Novo Agente'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome</Label><Input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} /></div>
            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} rows={2} /></div>
            <div><Label>Instruções Base (System Prompt)</Label><Textarea value={form.instrucoes_base} onChange={e => setForm(p => ({ ...p, instrucoes_base: e.target.value }))} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as AgenteStatus }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent></Select></div>
              <div><Label>Portal Mínimo</Label><Select value={form.portal_minimo} onValueChange={v => setForm(p => ({ ...p, portal_minimo: v as PortalType }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="visitante">Visitante</SelectItem><SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem><SelectItem value="iniciada">Iniciada</SelectItem></SelectContent></Select></div>
            </div>
            <Button onClick={save} variant="gold" className="w-full">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
