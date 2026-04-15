import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/dal/dbClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type ModalType = 'cliente' | 'grupo' | 'circulo' | null;

interface Props {
  open: ModalType;
  onClose: () => void;
  onClienteCreated: (id: string) => void;
  onGroupCreated: (id: string) => void;
  onCirculoCreated: (id: string) => void;
}

export function CabineCreateModals({ open, onClose, onClienteCreated, onGroupCreated, onCirculoCreated }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  // Cliente fields
  const [clienteNome, setClienteNome] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');

  // Grupo fields
  const [grupoNome, setGrupoNome] = useState('');
  const [grupoDescricao, setGrupoDescricao] = useState('');

  // Circulo fields
  const [circuloNome, setCirculoNome] = useState('');
  const [circuloRitual, setCirculoRitual] = useState('');

  const reset = () => {
    setClienteNome('');
    setClienteEmail('');
    setGrupoNome('');
    setGrupoDescricao('');
    setCirculoNome('');
    setCirculoRitual('');
    setSaving(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreateCliente = async () => {
    if (!user || !clienteNome.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('clientes')
      .insert({
        terapeuta_id: user.id,
        nome: clienteNome.trim(),
        email: clienteEmail.trim() || null,
      })
      .select('id')
      .single();

    if (error) {
      toast.error('Erro ao criar cliente');
      setSaving(false);
      return;
    }
    toast.success(`${clienteNome.trim()} adicionada`);
    handleClose();
    onClienteCreated(data.id);
  };

  const handleCreateGrupo = async () => {
    if (!user || !grupoNome.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('therapeutic_groups')
      .insert({
        therapist_id: user.id,
        nome: grupoNome.trim(),
        descricao: grupoDescricao.trim() || null,
      })
      .select('id')
      .single();

    if (error) {
      toast.error('Erro ao criar grupo');
      setSaving(false);
      return;
    }
    toast.success(`Grupo "${grupoNome.trim()}" criado`);
    handleClose();
    onGroupCreated(data.id);
  };

  const handleCreateCirculo = async () => {
    if (!user || !circuloNome.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('circulos_sagrados')
      .insert({
        facilitadora_id: user.id,
        nome_circulo: circuloNome.trim(),
        ritual_base: circuloRitual.trim() || 'Círculo sagrado',
        data_hora: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      toast.error('Erro ao criar círculo');
      setSaving(false);
      return;
    }
    toast.success(`Círculo "${circuloNome.trim()}" criado`);
    handleClose();
    onCirculoCreated(data.id);
  };

  return (
    <>
      {/* CLIENTE */}
      <Dialog open={open === 'cliente'} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Nova Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome *</Label>
              <Input
                value={clienteNome}
                onChange={e => setClienteNome(e.target.value)}
                placeholder="Nome da cliente"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">E-mail (opcional)</Label>
              <Input
                value={clienteEmail}
                onChange={e => setClienteEmail(e.target.value)}
                placeholder="email@exemplo.com"
                type="email"
              />
            </div>
            <Button
              onClick={handleCreateCliente}
              disabled={saving || !clienteNome.trim()}
              className="w-full"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Criar e abrir cabine
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* GRUPO */}
      <Dialog open={open === 'grupo'} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Novo Grupo Terapêutico</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome do grupo *</Label>
              <Input
                value={grupoNome}
                onChange={e => setGrupoNome(e.target.value)}
                placeholder="Nome do grupo"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Descrição (opcional)</Label>
              <Textarea
                value={grupoDescricao}
                onChange={e => setGrupoDescricao(e.target.value)}
                placeholder="Objetivo ou descrição breve"
                rows={3}
              />
            </div>
            <Button
              onClick={handleCreateGrupo}
              disabled={saving || !grupoNome.trim()}
              className="w-full"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Criar e abrir cabine
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CÍRCULO */}
      <Dialog open={open === 'circulo'} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Novo Círculo de Mulheres</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome do círculo *</Label>
              <Input
                value={circuloNome}
                onChange={e => setCirculoNome(e.target.value)}
                placeholder="Nome do círculo"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Ritual base (opcional)</Label>
              <Input
                value={circuloRitual}
                onChange={e => setCirculoRitual(e.target.value)}
                placeholder="Ex: Círculo de abertura, Ritual da lua..."
              />
            </div>
            <Button
              onClick={handleCreateCirculo}
              disabled={saving || !circuloNome.trim()}
              className="w-full"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Criar e abrir cabine
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
