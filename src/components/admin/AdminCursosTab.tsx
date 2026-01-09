import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  Layers,
  BookOpen,
  Users,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Course, CourseModule, CourseLesson, CourseEnrollment, PricingModel, ContentType } from '@/types/course';

export function AdminCursosTab() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cursos');

  // Course form state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  
  // Module form state
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Lesson form state
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, modulesRes, lessonsRes, enrollmentsRes] = await Promise.all([
        supabase.from('courses').select('*').order('ordem'),
        supabase.from('course_modules').select('*').order('ordem'),
        supabase.from('course_lessons').select('*').order('ordem'),
        supabase.from('course_enrollments').select('*').order('created_at', { ascending: false })
      ]);

      if (coursesRes.data) setCourses(coursesRes.data as Course[]);
      if (modulesRes.data) setModules(modulesRes.data as CourseModule[]);
      if (lessonsRes.data) setLessons(lessonsRes.data as CourseLesson[]);
      if (enrollmentsRes.data) setEnrollments(enrollmentsRes.data as CourseEnrollment[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Course CRUD
  const handleSaveCourse = async (formData: FormData) => {
    const courseData = {
      titulo: formData.get('titulo') as string,
      subtitulo: formData.get('subtitulo') as string || null,
      descricao: formData.get('descricao') as string,
      descricao_publica: formData.get('descricao_publica') as string || null,
      capa_url: formData.get('capa_url') as string || null,
      video_preview_url: formData.get('video_preview_url') as string || null,
      pricing_model: formData.get('pricing_model') as PricingModel,
      preco: formData.get('preco') ? parseFloat(formData.get('preco') as string) : null,
      preco_promocional: formData.get('preco_promocional') ? parseFloat(formData.get('preco_promocional') as string) : null,
      portal_minimo: formData.get('portal_minimo') as Course['portal_minimo'],
      publicado: formData.get('publicado') === 'true',
      destaque: formData.get('destaque') === 'true',
      duracao_estimada: formData.get('duracao_estimada') as string || null,
      nivel: formData.get('nivel') as string || null,
    };

    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);
        if (error) throw error;
        toast({ title: 'Curso atualizado!' });
      } else {
        const { error } = await supabase.from('courses').insert(courseData);
        if (error) throw error;
        toast({ title: 'Curso criado!' });
      }
      fetchData();
      setCourseDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      toast({ title: 'Erro ao salvar curso', variant: 'destructive' });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso? Todos os módulos e aulas serão excluídos.')) return;
    
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Curso excluído!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({ title: 'Erro ao excluir curso', variant: 'destructive' });
    }
  };

  // Module CRUD
  const handleSaveModule = async (formData: FormData) => {
    const moduleData = {
      course_id: formData.get('course_id') as string,
      titulo: formData.get('titulo') as string,
      descricao: formData.get('descricao') as string || '',
      ordem: parseInt(formData.get('ordem') as string) || 0,
      publicado: formData.get('publicado') === 'true',
      disponivel_em: formData.get('disponivel_em') as string || null,
      dias_apos_matricula: formData.get('dias_apos_matricula') ? parseInt(formData.get('dias_apos_matricula') as string) : null,
    };

    try {
      if (editingModule) {
        const { error } = await supabase
          .from('course_modules')
          .update(moduleData)
          .eq('id', editingModule.id);
        if (error) throw error;
        toast({ title: 'Módulo atualizado!' });
      } else {
        const { error } = await supabase.from('course_modules').insert(moduleData);
        if (error) throw error;
        toast({ title: 'Módulo criado!' });
      }
      fetchData();
      setModuleDialogOpen(false);
      setEditingModule(null);
    } catch (error) {
      console.error('Error saving module:', error);
      toast({ title: 'Erro ao salvar módulo', variant: 'destructive' });
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo? Todas as aulas serão excluídas.')) return;
    
    try {
      const { error } = await supabase.from('course_modules').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Módulo excluído!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({ title: 'Erro ao excluir módulo', variant: 'destructive' });
    }
  };

  // Lesson CRUD
  const handleSaveLesson = async (formData: FormData) => {
    const lessonData = {
      module_id: formData.get('module_id') as string,
      titulo: formData.get('titulo') as string,
      descricao_curta: formData.get('descricao_curta') as string || '',
      content_type: formData.get('content_type') as ContentType,
      texto_aula: formData.get('texto_aula') as string || null,
      video_url: formData.get('video_url') as string || null,
      audio_url: formData.get('audio_url') as string || null,
      pdf_url: formData.get('pdf_url') as string || null,
      materiais_url: formData.get('materiais_url') as string || null,
      duracao_minutos: formData.get('duracao_minutos') ? parseInt(formData.get('duracao_minutos') as string) : null,
      ordem: parseInt(formData.get('ordem') as string) || 0,
      publicado: formData.get('publicado') === 'true',
      is_preview: formData.get('is_preview') === 'true',
    };

    try {
      if (editingLesson) {
        const { error } = await supabase
          .from('course_lessons')
          .update(lessonData)
          .eq('id', editingLesson.id);
        if (error) throw error;
        toast({ title: 'Aula atualizada!' });
      } else {
        const { error } = await supabase.from('course_lessons').insert(lessonData);
        if (error) throw error;
        toast({ title: 'Aula criada!' });
      }
      fetchData();
      setLessonDialogOpen(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({ title: 'Erro ao salvar aula', variant: 'destructive' });
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return;
    
    try {
      const { error } = await supabase.from('course_lessons').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Aula excluída!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({ title: 'Erro ao excluir aula', variant: 'destructive' });
    }
  };

  const getCourseModules = (courseId: string) => modules.filter(m => m.course_id === courseId);
  const getModuleLessons = (moduleId: string) => lessons.filter(l => l.module_id === moduleId);
  const getCourseEnrollments = (courseId: string) => enrollments.filter(e => e.course_id === courseId);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Layers className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-sm text-muted-foreground">Cursos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{lessons.length}</p>
                <p className="text-sm text-muted-foreground">Aulas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{enrollments.filter(e => e.ativo).length}</p>
                <p className="text-sm text-muted-foreground">Matrículas Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{courses.filter(c => c.publicado).length}</p>
                <p className="text-sm text-muted-foreground">Publicados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cursos">Cursos</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          <TabsTrigger value="aulas">Aulas</TabsTrigger>
          <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="cursos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gerenciar Cursos</h3>
            <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCourse(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Curso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{editingCourse ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <form onSubmit={e => { e.preventDefault(); handleSaveCourse(new FormData(e.currentTarget)); }} className="space-y-4 p-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="titulo">Título *</Label>
                        <Input id="titulo" name="titulo" defaultValue={editingCourse?.titulo} required />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="subtitulo">Subtítulo</Label>
                        <Input id="subtitulo" name="subtitulo" defaultValue={editingCourse?.subtitulo || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="descricao">Descrição Interna *</Label>
                        <Textarea id="descricao" name="descricao" defaultValue={editingCourse?.descricao} required />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="descricao_publica">Descrição Pública (Vitrine)</Label>
                        <Textarea id="descricao_publica" name="descricao_publica" defaultValue={editingCourse?.descricao_publica || ''} />
                      </div>
                      <div>
                        <Label htmlFor="capa_url">URL da Capa</Label>
                        <Input id="capa_url" name="capa_url" defaultValue={editingCourse?.capa_url || ''} />
                      </div>
                      <div>
                        <Label htmlFor="video_preview_url">URL do Vídeo Preview</Label>
                        <Input id="video_preview_url" name="video_preview_url" defaultValue={editingCourse?.video_preview_url || ''} />
                      </div>
                      <div>
                        <Label htmlFor="pricing_model">Modelo de Preço</Label>
                        <Select name="pricing_model" defaultValue={editingCourse?.pricing_model || 'free'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Gratuito</SelectItem>
                            <SelectItem value="one_time">Compra Única</SelectItem>
                            <SelectItem value="subscription">Assinatura</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="portal_minimo">Portal Mínimo</Label>
                        <Select name="portal_minimo" defaultValue={editingCourse?.portal_minimo || 'visitante'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitante">Visitante</SelectItem>
                            <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                            <SelectItem value="iniciada">Iniciada</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preco">Preço (R$)</Label>
                        <Input id="preco" name="preco" type="number" step="0.01" defaultValue={editingCourse?.preco || ''} />
                      </div>
                      <div>
                        <Label htmlFor="preco_promocional">Preço Promocional (R$)</Label>
                        <Input id="preco_promocional" name="preco_promocional" type="number" step="0.01" defaultValue={editingCourse?.preco_promocional || ''} />
                      </div>
                      <div>
                        <Label htmlFor="duracao_estimada">Duração Estimada</Label>
                        <Input id="duracao_estimada" name="duracao_estimada" placeholder="Ex: 8 horas" defaultValue={editingCourse?.duracao_estimada || ''} />
                      </div>
                      <div>
                        <Label htmlFor="nivel">Nível</Label>
                        <Input id="nivel" name="nivel" placeholder="Ex: Iniciante" defaultValue={editingCourse?.nivel || ''} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="publicado" name="publicado" defaultChecked={editingCourse?.publicado ?? false} value="true" />
                        <Label htmlFor="publicado">Publicado</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="destaque" name="destaque" defaultChecked={editingCourse?.destaque ?? false} value="true" />
                        <Label htmlFor="destaque">Destaque</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setCourseDialogOpen(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Módulos</TableHead>
                <TableHead>Matrículas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(course => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {course.capa_url && (
                        <img src={course.capa_url} alt="" className="w-12 h-8 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{course.titulo}</p>
                        <p className="text-xs text-muted-foreground">{course.subtitulo}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.pricing_model === 'free' ? (
                      <Badge variant="secondary">Gratuito</Badge>
                    ) : course.pricing_model === 'subscription' ? (
                      <Badge variant="outline">Assinatura</Badge>
                    ) : (
                      <span>R$ {course.preco?.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>{getCourseModules(course.id).length}</TableCell>
                  <TableCell>{getCourseEnrollments(course.id).length}</TableCell>
                  <TableCell>
                    {course.publicado ? (
                      <Badge className="bg-green-500/20 text-green-400">Publicado</Badge>
                    ) : (
                      <Badge variant="secondary">Rascunho</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => { setEditingCourse(course); setCourseDialogOpen(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modulos" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Gerenciar Módulos</h3>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrar por curso..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cursos</SelectItem>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.titulo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingModule(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Módulo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingModule ? 'Editar Módulo' : 'Novo Módulo'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={e => { e.preventDefault(); handleSaveModule(new FormData(e.currentTarget)); }} className="space-y-4">
                  <div>
                    <Label htmlFor="course_id">Curso *</Label>
                    <Select name="course_id" defaultValue={editingModule?.course_id || selectedCourseId || ''} required>
                      <SelectTrigger><SelectValue placeholder="Selecione o curso" /></SelectTrigger>
                      <SelectContent>
                        {courses.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.titulo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input id="titulo" name="titulo" defaultValue={editingModule?.titulo} required />
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea id="descricao" name="descricao" defaultValue={editingModule?.descricao || ''} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ordem">Ordem</Label>
                      <Input id="ordem" name="ordem" type="number" defaultValue={editingModule?.ordem || 0} />
                    </div>
                    <div>
                      <Label htmlFor="dias_apos_matricula">Liberar após X dias</Label>
                      <Input id="dias_apos_matricula" name="dias_apos_matricula" type="number" defaultValue={editingModule?.dias_apos_matricula || ''} placeholder="Opcional" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="publicado" name="publicado" defaultChecked={editingModule?.publicado ?? true} value="true" />
                    <Label htmlFor="publicado">Publicado</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Módulo</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Aulas</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules
                .filter(m => !selectedCourseId || selectedCourseId === 'all' || m.course_id === selectedCourseId)
                .map(module => {
                  const course = courses.find(c => c.id === module.course_id);
                  return (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">{module.titulo}</TableCell>
                      <TableCell>{course?.titulo || '-'}</TableCell>
                      <TableCell>{getModuleLessons(module.id).length}</TableCell>
                      <TableCell>{module.ordem}</TableCell>
                      <TableCell>
                        {module.publicado ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => { setEditingModule(module); setModuleDialogOpen(true); }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDeleteModule(module.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="aulas" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Gerenciar Aulas</h3>
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Filtrar por módulo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os módulos</SelectItem>
                  {modules.map(m => {
                    const course = courses.find(c => c.id === m.course_id);
                    return (
                      <SelectItem key={m.id} value={m.id}>
                        {course?.titulo} → {m.titulo}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingLesson(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Aula
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{editingLesson ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <form onSubmit={e => { e.preventDefault(); handleSaveLesson(new FormData(e.currentTarget)); }} className="space-y-4 p-1">
                    <div>
                      <Label htmlFor="module_id">Módulo *</Label>
                      <Select name="module_id" defaultValue={editingLesson?.module_id || selectedModuleId || ''} required>
                        <SelectTrigger><SelectValue placeholder="Selecione o módulo" /></SelectTrigger>
                        <SelectContent>
                          {modules.map(m => {
                            const course = courses.find(c => c.id === m.course_id);
                            return (
                              <SelectItem key={m.id} value={m.id}>
                                {course?.titulo} → {m.titulo}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="titulo">Título *</Label>
                        <Input id="titulo" name="titulo" defaultValue={editingLesson?.titulo} required />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="descricao_curta">Descrição Curta</Label>
                        <Input id="descricao_curta" name="descricao_curta" defaultValue={editingLesson?.descricao_curta || ''} />
                      </div>
                      <div>
                        <Label htmlFor="content_type">Tipo de Conteúdo</Label>
                        <Select name="content_type" defaultValue={editingLesson?.content_type || 'mixed'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Vídeo</SelectItem>
                            <SelectItem value="audio">Áudio</SelectItem>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="file">Arquivo</SelectItem>
                            <SelectItem value="mixed">Misto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duracao_minutos">Duração (minutos)</Label>
                        <Input id="duracao_minutos" name="duracao_minutos" type="number" defaultValue={editingLesson?.duracao_minutos || ''} />
                      </div>
                      <div>
                        <Label htmlFor="video_url">URL do Vídeo</Label>
                        <Input id="video_url" name="video_url" defaultValue={editingLesson?.video_url || ''} />
                      </div>
                      <div>
                        <Label htmlFor="audio_url">URL do Áudio</Label>
                        <Input id="audio_url" name="audio_url" defaultValue={editingLesson?.audio_url || ''} />
                      </div>
                      <div>
                        <Label htmlFor="pdf_url">URL do PDF</Label>
                        <Input id="pdf_url" name="pdf_url" defaultValue={editingLesson?.pdf_url || ''} />
                      </div>
                      <div>
                        <Label htmlFor="materiais_url">URL dos Materiais</Label>
                        <Input id="materiais_url" name="materiais_url" defaultValue={editingLesson?.materiais_url || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="texto_aula">Conteúdo de Texto (HTML/Markdown)</Label>
                        <Textarea id="texto_aula" name="texto_aula" rows={6} defaultValue={editingLesson?.texto_aula || ''} />
                      </div>
                      <div>
                        <Label htmlFor="ordem">Ordem</Label>
                        <Input id="ordem" name="ordem" type="number" defaultValue={editingLesson?.ordem || 0} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="publicado" name="publicado" defaultChecked={editingLesson?.publicado ?? true} value="true" />
                          <Label htmlFor="publicado">Publicado</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="is_preview" name="is_preview" defaultChecked={editingLesson?.is_preview ?? false} value="true" />
                          <Label htmlFor="is_preview">Preview Gratuito</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aula</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons
                .filter(l => !selectedModuleId || selectedModuleId === 'all' || l.module_id === selectedModuleId)
                .map(lesson => {
                  const module = modules.find(m => m.id === lesson.module_id);
                  return (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lesson.titulo}</p>
                          {lesson.is_preview && (
                            <Badge variant="outline" className="text-xs mt-1">Preview</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{module?.titulo || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{lesson.content_type}</Badge>
                      </TableCell>
                      <TableCell>{lesson.duracao_minutos ? `${lesson.duracao_minutos} min` : '-'}</TableCell>
                      <TableCell>
                        {lesson.publicado ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => { setEditingLesson(lesson); setLessonDialogOpen(true); }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Enrollments Tab */}
        <TabsContent value="matriculas" className="space-y-4">
          <h3 className="text-lg font-semibold">Matrículas de Cursos</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Provedor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map(enrollment => {
                const course = courses.find(c => c.id === enrollment.course_id);
                return (
                  <TableRow key={enrollment.id}>
                    <TableCell>{course?.titulo || enrollment.course_id}</TableCell>
                    <TableCell className="font-mono text-xs">{enrollment.user_id.slice(0, 8)}...</TableCell>
                    <TableCell>{new Date(enrollment.data_inicio).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      {enrollment.data_fim 
                        ? new Date(enrollment.data_fim).toLocaleDateString('pt-BR')
                        : <Badge variant="outline">Vitalício</Badge>
                      }
                    </TableCell>
                    <TableCell>{enrollment.payment_provider || 'manual'}</TableCell>
                    <TableCell>
                      {enrollment.ativo ? (
                        <Badge className="bg-green-500/20 text-green-400">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
