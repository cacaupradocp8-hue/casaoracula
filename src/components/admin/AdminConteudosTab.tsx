import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, BookOpen, Video } from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type PortalType = Database['public']['Enums']['portal_type'];

interface Travessia {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  portal_minimo: PortalType;
}

interface Aula {
  id: string;
  travessia_id: string;
  titulo: string;
  descricao_curta: string;
  ordem: number;
  video_embed_url: string | null;
  materiais_url: string | null;
  portal_minimo: PortalType;
}

const PORTAL_LABELS: Record<PortalType, string> = {
  visitante: 'Visitante',
  pre_iniciada: 'Pré-Iniciada',
  iniciada: 'Iniciada ORÁCULA',
  admin: 'Admin',
};

export function AdminConteudosTab() {
  const [travessias, setTravessias] = useState<Travessia[]>([]);
  const [aulas, setAulas] = useState<Record<string, Aula[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTravessia, setExpandedTravessia] = useState<string | null>(null);

  // Travessia dialog state
  const [travessiaDialogOpen, setTravessiaDialogOpen] = useState(false);
  const [editingTravessia, setEditingTravessia] = useState<Travessia | null>(null);
  const [travessiaForm, setTravessiaForm] = useState({
    titulo: '',
    descricao: '',
    ordem: 0,
    portal_minimo: 'visitante' as PortalType,
  });

  // Aula dialog state
  const [aulaDialogOpen, setAulaDialogOpen] = useState(false);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const [aulaForm, setAulaForm] = useState({
    travessia_id: '',
    titulo: '',
    descricao_curta: '',
    ordem: 0,
    video_embed_url: '',
    materiais_url: '',
    portal_minimo: 'visitante' as PortalType,
  });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'travessia' | 'aula'; id: string } | null>(null);

  useEffect(() => {
    fetchTravessias();
  }, []);

  const fetchTravessias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('conteudo_travessias')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar travessias');
      console.error(error);
    } else {
      setTravessias(data || []);
    }
    setLoading(false);
  };

  const fetchAulas = async (travessiaId: string) => {
    const { data, error } = await supabase
      .from('conteudo_aulas')
      .select('*')
      .eq('travessia_id', travessiaId)
      .order('ordem', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar aulas');
      console.error(error);
    } else {
      setAulas((prev) => ({ ...prev, [travessiaId]: data || [] }));
    }
  };

  const handleExpandTravessia = (travessiaId: string) => {
    if (expandedTravessia === travessiaId) {
      setExpandedTravessia(null);
    } else {
      setExpandedTravessia(travessiaId);
      if (!aulas[travessiaId]) {
        fetchAulas(travessiaId);
      }
    }
  };

  // Travessia CRUD
  const openTravessiaDialog = (travessia?: Travessia) => {
    if (travessia) {
      setEditingTravessia(travessia);
      setTravessiaForm({
        titulo: travessia.titulo,
        descricao: travessia.descricao,
        ordem: travessia.ordem,
        portal_minimo: travessia.portal_minimo,
      });
    } else {
      setEditingTravessia(null);
      setTravessiaForm({
        titulo: '',
        descricao: '',
        ordem: travessias.length,
        portal_minimo: 'visitante',
      });
    }
    setTravessiaDialogOpen(true);
  };

  const saveTravessia = async () => {
    if (!travessiaForm.titulo.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (editingTravessia) {
      const { error } = await supabase
        .from('conteudo_travessias')
        .update(travessiaForm)
        .eq('id', editingTravessia.id);

      if (error) {
        toast.error('Erro ao atualizar travessia');
        console.error(error);
      } else {
        toast.success('Travessia atualizada');
        fetchTravessias();
      }
    } else {
      const { error } = await supabase
        .from('conteudo_travessias')
        .insert(travessiaForm);

      if (error) {
        toast.error('Erro ao criar travessia');
        console.error(error);
      } else {
        toast.success('Travessia criada');
        fetchTravessias();
      }
    }
    setTravessiaDialogOpen(false);
  };

  // Aula CRUD
  const openAulaDialog = (travessiaId: string, aula?: Aula) => {
    if (aula) {
      setEditingAula(aula);
      setAulaForm({
        travessia_id: aula.travessia_id,
        titulo: aula.titulo,
        descricao_curta: aula.descricao_curta,
        ordem: aula.ordem,
        video_embed_url: aula.video_embed_url || '',
        materiais_url: aula.materiais_url || '',
        portal_minimo: aula.portal_minimo,
      });
    } else {
      setEditingAula(null);
      const currentAulas = aulas[travessiaId] || [];
      setAulaForm({
        travessia_id: travessiaId,
        titulo: '',
        descricao_curta: '',
        ordem: currentAulas.length,
        video_embed_url: '',
        materiais_url: '',
        portal_minimo: 'visitante',
      });
    }
    setAulaDialogOpen(true);
  };

  const saveAula = async () => {
    if (!aulaForm.titulo.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    const dataToSave = {
      ...aulaForm,
      video_embed_url: aulaForm.video_embed_url || null,
      materiais_url: aulaForm.materiais_url || null,
    };

    if (editingAula) {
      const { error } = await supabase
        .from('conteudo_aulas')
        .update(dataToSave)
        .eq('id', editingAula.id);

      if (error) {
        toast.error('Erro ao atualizar aula');
        console.error(error);
      } else {
        toast.success('Aula atualizada');
        fetchAulas(aulaForm.travessia_id);
      }
    } else {
      const { error } = await supabase
        .from('conteudo_aulas')
        .insert(dataToSave);

      if (error) {
        toast.error('Erro ao criar aula');
        console.error(error);
      } else {
        toast.success('Aula criada');
        fetchAulas(aulaForm.travessia_id);
      }
    }
    setAulaDialogOpen(false);
  };

  // Delete
  const openDeleteDialog = (type: 'travessia' | 'aula', id: string) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'travessia') {
      const { error } = await supabase
        .from('conteudo_travessias')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) {
        toast.error('Erro ao excluir travessia');
        console.error(error);
      } else {
        toast.success('Travessia excluída');
        fetchTravessias();
      }
    } else {
      const aula = Object.values(aulas).flat().find((a) => a.id === deleteTarget.id);
      const { error } = await supabase
        .from('conteudo_aulas')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) {
        toast.error('Erro ao excluir aula');
        console.error(error);
      } else {
        toast.success('Aula excluída');
        if (aula) fetchAulas(aula.travessia_id);
      }
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Carregando...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Travessias Formativas</h3>
        <Button onClick={() => openTravessiaDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Travessia
        </Button>
      </div>

      {travessias.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma travessia cadastrada. Clique em "Nova Travessia" para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {travessias.map((travessia) => (
            <Card key={travessia.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => handleExpandTravessia(travessia.id)}
                  >
                    {expandedTravessia === travessia.id ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">{travessia.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Ordem: {travessia.ordem} | Portal: {PORTAL_LABELS[travessia.portal_minimo]}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openTravessiaDialog(travessia)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog('travessia', travessia.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedTravessia === travessia.id && (
                <CardContent className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-sm">Aulas</h4>
                    <Button size="sm" variant="outline" onClick={() => openAulaDialog(travessia.id)} className="gap-1">
                      <Plus className="w-3 h-3" />
                      Nova Aula
                    </Button>
                  </div>

                  {!aulas[travessia.id] || aulas[travessia.id].length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma aula cadastrada nesta travessia.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Ordem</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Portal</TableHead>
                          <TableHead className="w-16">Vídeo</TableHead>
                          <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aulas[travessia.id].map((aula) => (
                          <TableRow key={aula.id}>
                            <TableCell>{aula.ordem}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{aula.titulo}</p>
                                {aula.descricao_curta && (
                                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                                    {aula.descricao_curta}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{PORTAL_LABELS[aula.portal_minimo]}</TableCell>
                            <TableCell>
                              {aula.video_embed_url ? (
                                <Video className="w-4 h-4 text-primary" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openAulaDialog(travessia.id, aula)}>
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => openDeleteDialog('aula', aula.id)}>
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Travessia Dialog */}
      <Dialog open={travessiaDialogOpen} onOpenChange={setTravessiaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTravessia ? 'Editar Travessia' : 'Nova Travessia'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={travessiaForm.titulo}
                onChange={(e) => setTravessiaForm({ ...travessiaForm, titulo: e.target.value })}
                placeholder="Ex: Introdução ao Método"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={travessiaForm.descricao}
                onChange={(e) => setTravessiaForm({ ...travessiaForm, descricao: e.target.value })}
                placeholder="Descreva a travessia..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ordem</label>
                <Input
                  type="number"
                  value={travessiaForm.ordem}
                  onChange={(e) => setTravessiaForm({ ...travessiaForm, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Portal Mínimo</label>
                <Select
                  value={travessiaForm.portal_minimo}
                  onValueChange={(value: PortalType) => setTravessiaForm({ ...travessiaForm, portal_minimo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitante">Visitante</SelectItem>
                    <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                    <SelectItem value="iniciada">Iniciada ORÁCULA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTravessiaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveTravessia}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Aula Dialog */}
      <Dialog open={aulaDialogOpen} onOpenChange={setAulaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAula ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={aulaForm.titulo}
                onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
                placeholder="Ex: Aula 1 - Fundamentos"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição Curta</label>
              <Textarea
                value={aulaForm.descricao_curta}
                onChange={(e) => setAulaForm({ ...aulaForm, descricao_curta: e.target.value })}
                placeholder="Breve descrição da aula..."
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL do Vídeo (embed)</label>
              <Input
                value={aulaForm.video_embed_url}
                onChange={(e) => setAulaForm({ ...aulaForm, video_embed_url: e.target.value })}
                placeholder="https://youtube.com/embed/..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL dos Materiais</label>
              <Input
                value={aulaForm.materiais_url}
                onChange={(e) => setAulaForm({ ...aulaForm, materiais_url: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ordem</label>
                <Input
                  type="number"
                  value={aulaForm.ordem}
                  onChange={(e) => setAulaForm({ ...aulaForm, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Portal Mínimo</label>
                <Select
                  value={aulaForm.portal_minimo}
                  onValueChange={(value: PortalType) => setAulaForm({ ...aulaForm, portal_minimo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitante">Visitante</SelectItem>
                    <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                    <SelectItem value="iniciada">Iniciada ORÁCULA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAulaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveAula}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'travessia'
                ? 'Excluir esta travessia também excluirá todas as aulas associadas. Esta ação não pode ser desfeita.'
                : 'Excluir esta aula? Esta ação não pode ser desfeita.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
