import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface TravessiaFamily {
  id: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  ordem: number;
  ativa: boolean;
}

export function AdminFamiliasTab() {
  const [families, setFamilies] = useState<TravessiaFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<TravessiaFamily | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    icone: 'Sparkles',
    ativa: true,
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const { data, error } = await supabase
        .from('travessia_familias')
        .select('*')
        .order('ordem');

      if (error) throw error;
      setFamilies(data || []);
    } catch (error) {
      console.error('Error fetching families:', error);
      toast.error('Erro ao carregar famílias');
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingFamily(null);
    setFormData({ nome: '', descricao: '', icone: 'Sparkles', ativa: true });
    setDialogOpen(true);
  };

  const openEditDialog = (family: TravessiaFamily) => {
    setEditingFamily(family);
    setFormData({
      nome: family.nome,
      descricao: family.descricao || '',
      icone: family.icone || 'Sparkles',
      ativa: family.ativa,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      if (editingFamily) {
        const { error } = await supabase
          .from('travessia_familias')
          .update({
            nome: formData.nome,
            descricao: formData.descricao || null,
            icone: formData.icone || null,
            ativa: formData.ativa,
          })
          .eq('id', editingFamily.id);

        if (error) throw error;
        toast.success('Família atualizada');
      } else {
        const maxOrdem = Math.max(0, ...families.map(f => f.ordem));
        const { error } = await supabase
          .from('travessia_familias')
          .insert({
            nome: formData.nome,
            descricao: formData.descricao || null,
            icone: formData.icone || null,
            ativa: formData.ativa,
            ordem: maxOrdem + 1,
          });

        if (error) throw error;
        toast.success('Família criada');
      }

      setDialogOpen(false);
      fetchFamilies();
    } catch (error) {
      console.error('Error saving family:', error);
      toast.error('Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta família?')) return;

    try {
      const { error } = await supabase
        .from('travessia_familias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Família excluída');
      fetchFamilies();
    } catch (error) {
      console.error('Error deleting family:', error);
      toast.error('Erro ao excluir');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = families.findIndex(f => f.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === families.length - 1)
    ) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const currentFamily = families[index];
    const swapFamily = families[swapIndex];

    try {
      await supabase
        .from('travessia_familias')
        .update({ ordem: swapFamily.ordem })
        .eq('id', currentFamily.id);

      await supabase
        .from('travessia_familias')
        .update({ ordem: currentFamily.ordem })
        .eq('id', swapFamily.id);

      fetchFamilies();
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Erro ao reordenar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Famílias Simbólicas</h2>
          <p className="text-sm text-muted-foreground">
            Organize as ferramentas por famílias temáticas
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Família
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Descrição</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {families.map((family, index) => (
              <TableRow key={family.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleReorder(family.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleReorder(family.id, 'down')}
                      disabled={index === families.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span className="font-medium">{family.nome}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-muted-foreground text-sm line-clamp-2">
                    {family.descricao || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded ${
                    family.ativa 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {family.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(family)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(family.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {families.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma família criada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFamily ? 'Editar Família' : 'Nova Família Simbólica'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Família</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Travessias da Ruptura & Desorganização"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva quando as ferramentas desta família são chamadas..."
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ativa">Família Ativa</Label>
              <Switch
                id="ativa"
                checked={formData.ativa}
                onCheckedChange={(checked) => setFormData({ ...formData, ativa: checked })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingFamily ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
