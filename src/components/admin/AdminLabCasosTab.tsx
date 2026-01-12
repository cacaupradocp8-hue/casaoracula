import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  BookOpen
} from 'lucide-react';

interface LabCaso {
  id: string;
  titulo: string;
  tema: string;
  nivel: string;
  contexto: string | null;
  perguntas: string[];
  hipoteses: string | null;
  ferramentas_sugeridas: string[];
  status: string;
  created_at: string;
}

export function AdminLabCasosTab() {
  const { toast } = useToast();
  const [casos, setCasos] = useState<LabCaso[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCaso, setEditingCaso] = useState<LabCaso | null>(null);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState('iniciante');
  const [contexto, setContexto] = useState('');
  const [perguntasText, setPerguntasText] = useState('');
  const [hipoteses, setHipoteses] = useState('');
  const [ferramentasText, setFerramentasText] = useState('');
  const [status, setStatus] = useState('rascunho');

  useEffect(() => {
    fetchCasos();
  }, []);

  const fetchCasos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lab_casos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar casos:', error);
      toast({ title: 'Erro ao carregar casos', variant: 'destructive' });
    } else {
      setCasos((data || []).map(c => ({
        ...c,
        perguntas: Array.isArray(c.perguntas) ? (c.perguntas as string[]) : [],
        ferramentas_sugeridas: Array.isArray(c.ferramentas_sugeridas) ? (c.ferramentas_sugeridas as string[]) : [],
      })));
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitulo('');
    setTema('');
    setNivel('iniciante');
    setContexto('');
    setPerguntasText('');
    setHipoteses('');
    setFerramentasText('');
    setStatus('rascunho');
    setEditingCaso(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (caso: LabCaso) => {
    setEditingCaso(caso);
    setTitulo(caso.titulo);
    setTema(caso.tema);
    setNivel(caso.nivel);
    setContexto(caso.contexto || '');
    setPerguntasText(caso.perguntas.join('\n'));
    setHipoteses(caso.hipoteses || '');
    setFerramentasText(caso.ferramentas_sugeridas.join('\n'));
    setStatus(caso.status);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!titulo.trim() || !tema.trim()) {
      toast({ title: 'Título e tema são obrigatórios', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const perguntasArray = perguntasText.split('\n').map(p => p.trim()).filter(Boolean);
    const ferramentasArray = ferramentasText.split('\n').map(f => f.trim()).filter(Boolean);

    const payload = {
      titulo: titulo.trim(),
      tema: tema.trim(),
      nivel,
      contexto: contexto.trim() || null,
      perguntas: perguntasArray,
      hipoteses: hipoteses.trim() || null,
      ferramentas_sugeridas: ferramentasArray,
      status,
    };

    if (editingCaso) {
      const { error } = await supabase
        .from('lab_casos')
        .update(payload)
        .eq('id', editingCaso.id);

      if (error) {
        toast({ title: 'Erro ao atualizar caso', variant: 'destructive' });
      } else {
        toast({ title: 'Caso atualizado!' });
        setDialogOpen(false);
        fetchCasos();
      }
    } else {
      const { error } = await supabase
        .from('lab_casos')
        .insert(payload);

      if (error) {
        toast({ title: 'Erro ao criar caso', variant: 'destructive' });
      } else {
        toast({ title: 'Caso criado!' });
        setDialogOpen(false);
        fetchCasos();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este caso?')) return;

    const { error } = await supabase
      .from('lab_casos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Caso excluído!' });
      fetchCasos();
    }
  };

  const toggleStatus = async (caso: LabCaso) => {
    const newStatus = caso.status === 'publicado' ? 'rascunho' : 'publicado';
    const { error } = await supabase
      .from('lab_casos')
      .update({ status: newStatus })
      .eq('id', caso.id);

    if (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } else {
      toast({ title: newStatus === 'publicado' ? 'Caso publicado!' : 'Caso despublicado!' });
      fetchCasos();
    }
  };

  const getNivelBadge = (nivel: string) => {
    switch (nivel) {
      case 'iniciante':
        return <Badge variant="secondary" className="bg-green-600/20 text-green-400">Iniciante</Badge>;
      case 'intermediario':
        return <Badge variant="secondary" className="bg-amber-600/20 text-amber-400">Intermediário</Badge>;
      case 'avancado':
        return <Badge variant="secondary" className="bg-red-600/20 text-red-400">Avançado</Badge>;
      default:
        return <Badge variant="outline">{nivel}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Laboratório de Leitura
          </CardTitle>
          <Button variant="gold" onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Caso
          </Button>
        </CardHeader>
        <CardContent>
          {casos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum caso cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {casos.map((caso) => (
                  <TableRow key={caso.id}>
                    <TableCell className="font-medium">{caso.titulo}</TableCell>
                    <TableCell>{caso.tema}</TableCell>
                    <TableCell>{getNivelBadge(caso.nivel)}</TableCell>
                    <TableCell>
                      <Badge variant={caso.status === 'publicado' ? 'default' : 'outline'}>
                        {caso.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStatus(caso)}
                        title={caso.status === 'publicado' ? 'Despublicar' : 'Publicar'}
                      >
                        {caso.status === 'publicado' ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(caso)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(caso.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setDialogOpen(false); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCaso ? 'Editar Caso' : 'Novo Caso'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: O Fio Invisível"
                />
              </div>
              <div className="space-y-2">
                <Label>Tema *</Label>
                <Input
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex: Codependência"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nível</Label>
                <Select value={nivel} onValueChange={setNivel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contexto do Caso</Label>
              <Textarea
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Descreva o contexto clínico fictício..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Perguntas de Condução (uma por linha)</Label>
              <Textarea
                value={perguntasText}
                onChange={(e) => setPerguntasText(e.target.value)}
                placeholder="Como esse padrão se manifesta?&#10;Quais medos surgem?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Hipóteses Simbólicas</Label>
              <Textarea
                value={hipoteses}
                onChange={(e) => setHipoteses(e.target.value)}
                placeholder="Hipóteses para reflexão..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Ferramentas Sugeridas (uma por linha)</Label>
              <Textarea
                value={ferramentasText}
                onChange={(e) => setFerramentasText(e.target.value)}
                placeholder="Eneagrama&#10;Big5"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
