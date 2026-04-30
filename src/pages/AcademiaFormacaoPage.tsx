import { useState, useEffect, useMemo } from 'react';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  GraduationCap, BookOpen, Search, Play, ArrowLeft, Upload,
  Loader2, CheckCircle2, Clock, Lock, Award, FileText, Download
} from 'lucide-react';

// Types
interface Course {
  id: string; titulo: string; descricao: string; descricao_publica: string | null;
  subtitulo: string | null; capa_url: string | null; nivel: string | null;
  tipo_curso: string; preco: number | null; requisitos: string | null;
  duracao_estimada: string | null; publicado: boolean; tags: string[] | null;
  portal_minimo: string; pricing_model: string;
}

interface Enrollment {
  id: string; course_id: string; ativo: boolean; data_inicio: string;
}

interface Module {
  id: string; titulo: string; descricao: string | null; ordem: number;
  publicado: boolean; course_id: string;
}

interface Lesson {
  id: string; titulo: string; descricao: string | null; ordem: number;
  module_id: string; video_url: string | null; audio_url: string | null;
  conteudo: string | null; publicado: boolean;
}

interface LessonProgress {
  lesson_id: string; completed: boolean;
}

interface Projeto {
  id: string; course_id: string; titulo: string; descricao: string | null;
  arquivo_url: string | null; status: string; feedback: string | null;
}

// Main Page
export default function AcademiaFormacaoPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterNivel, setFilterNivel] = useState('all');

  // Course detail state
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Projeto dialog
  const [projetoOpen, setProjetoOpen] = useState(false);
  const [projetoForm, setProjetoForm] = useState({ titulo: '', descricao: '' });
  const [savingProjeto, setSavingProjeto] = useState(false);

  const loadData = async () => {
    const { data: coursesData } = await supabase
      .from('courses')
      .select('*')
      .eq('publicado', true)
      .order('ordem');
    setCourses((coursesData as unknown as Course[]) || []);

    if (user) {
      const { data: enrollData } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', true);
      setEnrollments((enrollData as unknown as Enrollment[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user]);

  const enrolledCourseIds = useMemo(() => new Set(enrollments.map(e => e.course_id)), [enrollments]);

  const meusCursos = useMemo(() =>
    courses.filter(c => enrolledCourseIds.has(c.id)),
    [courses, enrolledCourseIds]
  );

  const catalogFiltered = useMemo(() =>
    courses.filter(c => {
      if (filterTipo !== 'all' && (c.tipo_curso || 'formacao') !== filterTipo) return false;
      if (filterNivel !== 'all' && c.nivel !== filterNivel) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!c.titulo.toLowerCase().includes(s) && !c.descricao?.toLowerCase().includes(s)) return false;
      }
      return true;
    }),
    [courses, filterTipo, filterNivel, search]
  );

  const openCourse = async (course: Course) => {
    setSelectedCourse(course);
    setLoadingDetail(true);

    const [modulesRes, progressRes, projetoRes] = await Promise.all([
      supabase.from('course_modules').select('*').eq('course_id', course.id).eq('publicado', true).order('ordem'),
      user ? supabase.from('course_lesson_progress').select('lesson_id, completed').eq('user_id', user.id) : Promise.resolve({ data: [] }),
      user ? supabase.from('projetos_mestria').select('*').eq('user_id', user.id).eq('course_id', course.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);

    const mods = (modulesRes.data as unknown as Module[]) || [];
    setModules(mods);
    setProgress((progressRes.data as unknown as LessonProgress[]) || []);
    setProjeto((projetoRes.data as unknown as Projeto) || null);

    if (mods.length > 0) {
      const modIds = mods.map(m => m.id);
      const { data: lessonsData } = await supabase
        .from('course_lessons')
        .select('*')
        .in('module_id', modIds)
        .eq('publicado', true)
        .order('ordem');
      setLessons((lessonsData as unknown as Lesson[]) || []);
    } else {
      setLessons([]);
    }
    setLoadingDetail(false);
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;
    await supabase.from('course_lesson_progress').upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setProgress(prev => {
      const existing = prev.find(p => p.lesson_id === lessonId);
      if (existing) return prev.map(p => p.lesson_id === lessonId ? { ...p, completed: true } : p);
      return [...prev, { lesson_id: lessonId, completed: true }];
    });
    toast.success('Aula concluída!');
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return;
    const { error } = await supabase.from('course_enrollments').insert({
      user_id: user.id,
      course_id: courseId,
      data_inicio: new Date().toISOString(),
    });
    if (error) toast.error('Erro ao se inscrever');
    else { toast.success('Inscrição realizada!'); loadData(); }
  };

  const submitProjeto = async () => {
    if (!user || !selectedCourse) return;
    setSavingProjeto(true);
    const { error } = await supabase.from('projetos_mestria').upsert({
      user_id: user.id,
      course_id: selectedCourse.id,
      titulo: projetoForm.titulo.trim(),
      descricao: projetoForm.descricao.trim() || null,
      status: 'pendente',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,course_id' });
    setSavingProjeto(false);
    if (error) toast.error('Erro ao enviar');
    else {
      toast.success('Projeto submetido!');
      setProjetoOpen(false);
      openCourse(selectedCourse);
    }
  };

  const getCourseProgress = (courseId: string): number => {
    const courseLessons = lessons.filter(l => {
      const mod = modules.find(m => m.id === l.module_id);
      return mod?.course_id === courseId;
    });
    if (courseLessons.length === 0) return 0;
    const completed = courseLessons.filter(l => progress.some(p => p.lesson_id === l.id && p.completed)).length;
    return Math.round((completed / courseLessons.length) * 100);
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Academia Orácula" subtitle="Carregando...">
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </CasaMaquinasLayout>
    );
  }

  // Course Detail View
  if (selectedCourse) {
    const isEnrolled = enrolledCourseIds.has(selectedCourse.id);
    const courseProgress = getCourseProgress(selectedCourse.id);
    const isPortal = (selectedCourse.tipo_curso || 'formacao') === 'portal';

    return (
      <CasaMaquinasLayout title={selectedCourse.titulo} subtitle={selectedCourse.subtitulo || ''}>
        <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)} className="text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>

        {loadingDetail ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            <Card className="bg-[#0F2438] border-primary/15">
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/15 text-primary">{selectedCourse.tipo_curso || 'formação'}</Badge>
                  {selectedCourse.nivel && <Badge variant="outline">{selectedCourse.nivel}</Badge>}
                  {selectedCourse.duracao_estimada && <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{selectedCourse.duracao_estimada}</Badge>}
                </div>
                <p className="text-sm text-foreground/70">{selectedCourse.descricao_publica || selectedCourse.descricao}</p>
                {selectedCourse.requisitos && (
                  <div className="p-3 rounded-lg bg-background border border-primary/10">
                    <p className="text-xs text-primary font-medium mb-1">Requisitos</p>
                    <p className="text-sm text-muted-foreground">{selectedCourse.requisitos}</p>
                  </div>
                )}
                {isEnrolled ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="text-primary font-medium">{courseProgress}%</span>
                    </div>
                    <Progress value={courseProgress} className="h-2" />
                  </div>
                ) : (
                  <Button onClick={() => enrollInCourse(selectedCourse.id)} className="bg-primary text-primary-foreground">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {selectedCourse.preco ? `Inscrever-se — R$${selectedCourse.preco}` : 'Inscrever-se Gratuitamente'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Modules & Lessons */}
            {isEnrolled && modules.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Módulos e Aulas
                </h3>
                {modules.map(mod => {
                  const modLessons = lessons.filter(l => l.module_id === mod.id);
                  return (
                    <Card key={mod.id} className="bg-[#0F2438] border-primary/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-foreground">{mod.titulo}</CardTitle>
                        {mod.descricao && <CardDescription className="text-xs">{mod.descricao}</CardDescription>}
                      </CardHeader>
                      <CardContent className="pt-0 space-y-1">
                        {modLessons.map(lesson => {
                          const done = progress.some(p => p.lesson_id === lesson.id && p.completed);
                          return (
                            <div key={lesson.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-background/50 transition-colors">
                              <div className="flex items-center gap-2 min-w-0">
                                {done ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Play className="w-4 h-4 text-muted-foreground shrink-0" />
                                )}
                                <span className={`text-sm truncate ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                  {lesson.titulo}
                                </span>
                              </div>
                              {!done && (
                                <Button size="sm" variant="ghost" onClick={() => markLessonComplete(lesson.id)} className="text-xs text-primary shrink-0">
                                  Concluir
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Projeto de Mestria (Portal only) */}
            {isEnrolled && isPortal && (
              <Card className="bg-[#0F2438] border-primary/15">
                <CardHeader>
                  <CardTitle className="text-sm text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" /> Projeto de Mestria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {projeto ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{projeto.titulo}</p>
                        <Badge className={
                          projeto.status === 'aprovado' ? 'bg-emerald-500/15 text-emerald-400' :
                          projeto.status === 'reprovado' ? 'bg-red-500/15 text-red-400' :
                          projeto.status === 'em revisão' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-amber-500/15 text-amber-400'
                        }>{projeto.status}</Badge>
                      </div>
                      {projeto.descricao && <p className="text-xs text-muted-foreground">{projeto.descricao}</p>}
                      {projeto.feedback && (
                        <div className="p-3 rounded-lg bg-background border border-primary/10">
                          <p className="text-xs text-primary font-medium mb-1">Feedback</p>
                          <p className="text-sm text-foreground/70">{projeto.feedback}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-sm text-muted-foreground">Submeta seu projeto de mestria para avaliação.</p>
                      <Button onClick={() => setProjetoOpen(true)} className="bg-primary text-primary-foreground">
                        <Upload className="w-4 h-4 mr-2" /> Enviar Projeto
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Certificate */}
            {isEnrolled && courseProgress === 100 && (
              <Card className="bg-[#0F2438] border-emerald-500/20">
                <CardContent className="py-6 text-center space-y-3">
                  <Award className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">Curso Concluído!</h3>
                  <p className="text-sm text-muted-foreground">Parabéns pela conclusão. Seu certificado está disponível.</p>
                  <Button variant="outline" className="border-primary/30 text-primary">
                    <Download className="w-4 h-4 mr-2" /> Ver Certificado
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Projeto Dialog */}
        <Dialog open={projetoOpen} onOpenChange={setProjetoOpen}>
          <DialogContent className="bg-[#0B1B2B] border-primary/20">
            <DialogHeader><DialogTitle className="text-foreground">Enviar Projeto de Mestria</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input value={projetoForm.titulo} onChange={e => setProjetoForm(f => ({ ...f, titulo: e.target.value }))}
                placeholder="Título do projeto" className="bg-background border-primary/10" maxLength={200} />
              <Textarea value={projetoForm.descricao} onChange={e => setProjetoForm(f => ({ ...f, descricao: e.target.value }))}
                placeholder="Descrição do projeto e metodologia..." className="min-h-[100px] bg-background border-primary/10" maxLength={3000} />
              <Button onClick={submitProjeto} disabled={savingProjeto || !projetoForm.titulo.trim()} className="w-full bg-primary text-primary-foreground">
                {savingProjeto ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                Submeter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CasaMaquinasLayout>
    );
  }

  // Main View with tabs
  return (
    <CasaMaquinasLayout
      title="Academia Orácula"
      subtitle="Formação estruturada, Portais de Especialização e Cursos do Método"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button 
          variant="outline" 
          className="h-auto py-6 flex-col gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all group"
          onClick={() => window.location.href = '/sala-de-treinamento'}
        >
          <Zap className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Sala de Treinamento</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prática Clínica</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-6 flex-col gap-2 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all group"
          onClick={() => window.location.href = '/sala-de-treinamento'}
        >
          <Sparkles className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Câmara de Simulação</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Estudos de Caso</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-6 flex-col gap-2 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all group"
          onClick={() => window.location.href = '/formacao-metodo/forum'}
        >
          <BookOpen className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Fórum da Comunidade</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trocas e Dúvidas</p>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-6 flex-col gap-2 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all group"
          onClick={() => window.location.href = '/formacao-metodo/avaliacoes'}
        >
          <Award className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Certificações</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Nível de Mestria</p>
          </div>
        </Button>
      </div>

      <Tabs defaultValue="meus" className="space-y-6">
        <TabsList className="grid grid-cols-2 gap-2 h-auto bg-transparent p-0 max-w-md">
          <TabsTrigger value="meus" className="flex items-center gap-2 px-4 py-3 rounded-lg border border-primary/20 data-[state=active]:bg-primary/15 data-[state=active]:border-primary/50 data-[state=active]:text-primary text-muted-foreground">
            <GraduationCap className="w-4 h-4" /> Meus Cursos
          </TabsTrigger>
          <TabsTrigger value="catalogo" className="flex items-center gap-2 px-4 py-3 rounded-lg border border-primary/20 data-[state=active]:bg-primary/15 data-[state=active]:border-primary/50 data-[state=active]:text-primary text-muted-foreground">
            <BookOpen className="w-4 h-4" /> Catálogo
          </TabsTrigger>
        </TabsList>

        {/* Meus Cursos */}
        <TabsContent value="meus">
          {meusCursos.length === 0 ? (
            <Card className="bg-[#0F2438] border-primary/20 text-center py-12">
              <CardContent>
                <GraduationCap className="w-10 h-10 mx-auto text-primary/40 mb-3" />
                <p className="text-muted-foreground">Você ainda não está inscrita em nenhum curso.</p>
                <p className="text-xs text-muted-foreground/50 mt-1">Explore o catálogo para começar sua jornada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {meusCursos.map(course => (
                <CourseCard key={course.id} course={course} enrolled onClick={() => openCourse(course)} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Catálogo */}
        <TabsContent value="catalogo">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar cursos..." className="pl-9 bg-background border-primary/10" />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[160px] bg-background border-primary/10">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="formacao">Formação</SelectItem>
                  <SelectItem value="portal">Portal</SelectItem>
                  <SelectItem value="livre">Curso Livre</SelectItem>
                  <SelectItem value="travessia">Travessia</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterNivel} onValueChange={setFilterNivel}>
                <SelectTrigger className="w-[160px] bg-background border-primary/10">
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                  <SelectItem value="especializacao">Especialização</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {catalogFiltered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum curso encontrado.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {catalogFiltered.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrolled={enrolledCourseIds.has(course.id)}
                    onClick={() => openCourse(course)}
                    onEnroll={() => enrollInCourse(course.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}

// Course Card Component
function CourseCard({ course, enrolled, onClick, onEnroll }: {
  course: Course; enrolled: boolean; onClick: () => void; onEnroll?: () => void;
}) {
  const TIPO_STYLES: Record<string, string> = {
    formacao: 'bg-primary/15 text-primary',
    portal: 'bg-purple-500/15 text-purple-400',
    livre: 'bg-emerald-500/15 text-emerald-400',
    travessia: 'bg-amber-500/15 text-amber-400',
  };

  return (
    <Card className="bg-[#0F2438] border-primary/10 hover:border-primary/30 transition-all group">
      {course.capa_url && (
        <div className="h-32 overflow-hidden rounded-t-lg">
          <img src={course.capa_url} alt={course.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base text-foreground">{course.titulo}</CardTitle>
          <Badge className={TIPO_STYLES[course.tipo_curso || 'formacao'] || ''}>{course.tipo_curso || 'formação'}</Badge>
        </div>
        {course.subtitulo && <CardDescription className="text-xs">{course.subtitulo}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{course.descricao_publica || course.descricao}</p>
        <div className="flex flex-wrap gap-2">
          {course.nivel && <Badge variant="outline" className="text-xs">{course.nivel}</Badge>}
          {course.duracao_estimada && <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" />{course.duracao_estimada}</Badge>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onClick} className="bg-primary text-primary-foreground flex-1">
            {enrolled ? <><Play className="w-3 h-3 mr-1" /> Continuar</> : 'Ver Detalhes'}
          </Button>
          {!enrolled && onEnroll && (
            <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); onEnroll(); }} className="border-primary/30 text-primary">
              {course.preco ? `R$${course.preco}` : 'Grátis'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
