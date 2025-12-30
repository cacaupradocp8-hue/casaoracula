import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, BookOpen, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Travessia {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  closing_ritual: string;
}

interface Lesson {
  id: string;
  travessia_id: string;
  order_number: number;
  title: string;
  description: string;
  video_url: string | null;
  content: string;
}

export function AdminTravessiasTab() {
  const { toast } = useToast();
  const [travessias, setTravessias] = useState<Travessia[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTravessia, setExpandedTravessia] = useState<string | null>(null);
  
  // Dialog states
  const [travessiaDialogOpen, setTravessiaDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [editingTravessia, setEditingTravessia] = useState<Travessia | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [currentTravessiaId, setCurrentTravessiaId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'travessia' | 'lesson'; id: string } | null>(null);
  
  const [travessiaForm, setTravessiaForm] = useState({
    number: 1,
    title: '',
    subtitle: '',
    description: '',
    closing_ritual: '',
  });
  
  const [lessonForm, setLessonForm] = useState({
    order_number: 1,
    title: '',
    description: '',
    video_url: '',
    content: '',
  });

  useEffect(() => {
    fetchTravessias();
  }, []);

  const fetchTravessias = async () => {
    try {
      const { data, error } = await supabase
        .from('travessias')
        .select('*')
        .order('number');

      if (error) throw error;
      setTravessias(data || []);
    } catch (error) {
      console.error('Error fetching travessias:', error);
      toast({
        title: 'Erro ao carregar travessias',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (travessiaId: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('travessia_id', travessiaId)
        .order('order_number');

      if (error) throw error;
      setLessons(prev => ({ ...prev, [travessiaId]: data || [] }));
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleExpandTravessia = (id: string) => {
    if (expandedTravessia === id) {
      setExpandedTravessia(null);
    } else {
      setExpandedTravessia(id);
      if (!lessons[id]) {
        fetchLessons(id);
      }
    }
  };

  const openTravessiaDialog = (travessia?: Travessia) => {
    if (travessia) {
      setEditingTravessia(travessia);
      setTravessiaForm({
        number: travessia.number,
        title: travessia.title,
        subtitle: travessia.subtitle,
        description: travessia.description,
        closing_ritual: travessia.closing_ritual,
      });
    } else {
      setEditingTravessia(null);
      const nextNumber = travessias.length + 1;
      setTravessiaForm({
        number: nextNumber > 4 ? 4 : nextNumber,
        title: '',
        subtitle: '',
        description: '',
        closing_ritual: '',
      });
    }
    setTravessiaDialogOpen(true);
  };

  const openLessonDialog = (travessiaId: string, lesson?: Lesson) => {
    setCurrentTravessiaId(travessiaId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        order_number: lesson.order_number,
        title: lesson.title,
        description: lesson.description,
        video_url: lesson.video_url || '',
        content: lesson.content,
      });
    } else {
      setEditingLesson(null);
      const currentLessons = lessons[travessiaId] || [];
      setLessonForm({
        order_number: currentLessons.length + 1,
        title: '',
        description: '',
        video_url: '',
        content: '',
      });
    }
    setLessonDialogOpen(true);
  };

  const saveTravessia = async () => {
    try {
      if (editingTravessia) {
        const { error } = await supabase
          .from('travessias')
          .update(travessiaForm)
          .eq('id', editingTravessia.id);

        if (error) throw error;
        toast({ title: 'Travessia atualizada!' });
      } else {
        const { error } = await supabase
          .from('travessias')
          .insert([travessiaForm]);

        if (error) throw error;
        toast({ title: 'Travessia criada!' });
      }

      setTravessiaDialogOpen(false);
      fetchTravessias();
    } catch (error) {
      console.error('Error saving travessia:', error);
      toast({
        title: 'Erro ao salvar travessia',
        variant: 'destructive',
      });
    }
  };

  const saveLesson = async () => {
    if (!currentTravessiaId) return;

    try {
      const lessonData = {
        ...lessonForm,
        travessia_id: currentTravessiaId,
        video_url: lessonForm.video_url || null,
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', editingLesson.id);

        if (error) throw error;
        toast({ title: 'Aula atualizada!' });
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([lessonData]);

        if (error) throw error;
        toast({ title: 'Aula criada!' });
      }

      setLessonDialogOpen(false);
      fetchLessons(currentTravessiaId);
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: 'Erro ao salvar aula',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'travessia') {
        const { error } = await supabase
          .from('travessias')
          .delete()
          .eq('id', deleteTarget.id);

        if (error) throw error;
        toast({ title: 'Travessia excluída!' });
        fetchTravessias();
      } else {
        const { error } = await supabase
          .from('lessons')
          .delete()
          .eq('id', deleteTarget.id);

        if (error) throw error;
        toast({ title: 'Aula excluída!' });
        if (currentTravessiaId) {
          fetchLessons(currentTravessiaId);
        }
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Erro ao excluir',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Gerencie as 4 Travessias formativas e suas aulas
        </p>
        <Button onClick={() => openTravessiaDialog()} disabled={travessias.length >= 4}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Travessia
        </Button>
      </div>

      {travessias.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Nenhuma travessia cadastrada</p>
            <Button onClick={() => openTravessiaDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar primeira Travessia
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {travessias.map((travessia) => (
            <Card key={travessia.id}>
              <CardHeader className="cursor-pointer" onClick={() => handleExpandTravessia(travessia.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {travessia.number}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{travessia.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{travessia.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTravessiaDialog(travessia);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ type: 'travessia', id: travessia.id });
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedTravessia === travessia.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedTravessia === travessia.id && (
                <CardContent className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">{travessia.description}</p>
                  <p className="text-sm mb-6">
                    <strong>Rito de Fechamento:</strong> {travessia.closing_ritual}
                  </p>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Aulas</h4>
                      <Button size="sm" onClick={() => openLessonDialog(travessia.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Aula
                      </Button>
                    </div>

                    {lessons[travessia.id]?.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma aula cadastrada nesta travessia
                      </p>
                    )}

                    <div className="space-y-2">
                      {lessons[travessia.id]?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground">
                              {lesson.order_number}.
                            </span>
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentTravessiaId(travessia.id);
                                openLessonDialog(travessia.id, lesson);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentTravessiaId(travessia.id);
                                setDeleteTarget({ type: 'lesson', id: lesson.id });
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Travessia Dialog */}
      <Dialog open={travessiaDialogOpen} onOpenChange={setTravessiaDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTravessia ? 'Editar Travessia' : 'Nova Travessia'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Número</Label>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  value={travessiaForm.number}
                  onChange={(e) => setTravessiaForm(prev => ({ ...prev, number: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="col-span-3">
                <Label>Título</Label>
                <Input
                  value={travessiaForm.title}
                  onChange={(e) => setTravessiaForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: O Mundo sem Símbolos"
                />
              </div>
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={travessiaForm.subtitle}
                onChange={(e) => setTravessiaForm(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Ex: Despertar para a ausência"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={travessiaForm.description}
                onChange={(e) => setTravessiaForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da travessia..."
                rows={3}
              />
            </div>
            <div>
              <Label>Rito de Fechamento</Label>
              <Textarea
                value={travessiaForm.closing_ritual}
                onChange={(e) => setTravessiaForm(prev => ({ ...prev, closing_ritual: e.target.value }))}
                placeholder="Descrição do ritual de fechamento..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTravessiaDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveTravessia}>
              {editingTravessia ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Editar Aula' : 'Nova Aula'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  min={1}
                  value={lessonForm.order_number}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, order_number: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="col-span-3">
                <Label>Título</Label>
                <Input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título da aula"
                />
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={lessonForm.description}
                onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Breve descrição da aula..."
                rows={2}
              />
            </div>
            <div>
              <Label>URL do Vídeo (opcional)</Label>
              <Input
                value={lessonForm.video_url}
                onChange={(e) => setLessonForm(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://youtube.com/embed/..."
              />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea
                value={lessonForm.content}
                onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Conteúdo completo da aula..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveLesson}>
              {editingLesson ? 'Salvar' : 'Criar'}
            </Button>
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
                ? 'Isso excluirá a travessia e todas as suas aulas. Esta ação não pode ser desfeita.'
                : 'Isso excluirá a aula. Esta ação não pode ser desfeita.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
