import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Play, 
  Lock, 
  Clock, 
  BarChart3, 
  Check, 
  ChevronLeft,
  PlayCircle,
  FileText,
  Headphones,
  Star,
  Users
} from 'lucide-react';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useAuth } from '@/contexts/AuthContext';
import { CourseLesson } from '@/types/course';

export default function CursoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    course, 
    modules, 
    enrollment, 
    progress, 
    isLoading,
    totalLessons,
    completedLessons,
    progressPercent
  } = useCourseDetail(id);
  const { hasAccess, getLockReason } = useCourseAccess();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="aspect-video rounded-lg mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!course) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-display font-semibold mb-4">Curso não encontrado</h1>
          <Button onClick={() => navigate('/cursos')}>Voltar aos Cursos</Button>
        </div>
      </AppLayout>
    );
  }

  const userHasAccess = hasAccess(course, enrollment);
  const lockReason = getLockReason(course, enrollment);

  const getLessonIcon = (lesson: CourseLesson) => {
    switch (lesson.content_type) {
      case 'video': return <PlayCircle className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <PlayCircle className="w-4 h-4" />;
    }
  };

  const isLessonCompleted = (lessonId: string) => progress.get(lessonId)?.completed ?? false;

  const getFirstAccessibleLesson = () => {
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (userHasAccess || lesson.is_preview) {
          return lesson;
        }
      }
    }
    return null;
  };

  const firstLesson = getFirstAccessibleLesson();

  const handleStartCourse = () => {
    if (firstLesson) {
      navigate(`/cursos/${course.id}/aula/${firstLesson.id}`);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Back Button */}
        <Link 
          to="/cursos" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar aos cursos
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image / Video Preview */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-card">
              {course.video_preview_url ? (
                <iframe
                  src={course.video_preview_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : course.capa_url ? (
                <img 
                  src={course.capa_url} 
                  alt={course.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                  <Play className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Title and Description */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {course.destaque && (
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <Star className="w-3 h-3" /> Destaque
                  </Badge>
                )}
                {course.nivel && (
                  <Badge variant="secondary">{course.nivel}</Badge>
                )}
                {course.tags?.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              <h1 className="font-display text-4xl font-bold text-foreground">
                {course.titulo}
              </h1>

              {course.subtitulo && (
                <p className="text-xl text-muted-foreground">{course.subtitulo}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {course.duracao_estimada && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duracao_estimada}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  {totalLessons} aulas
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {modules.length} módulos
                </span>
              </div>

              <div className="prose prose-invert max-w-none">
                <p>{course.descricao_publica || course.descricao}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Pricing / CTA */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                {/* Pricing */}
                <div className="space-y-2">
                  {course.pricing_model === 'free' ? (
                    <div className="text-2xl font-bold text-green-400">Gratuito</div>
                  ) : course.pricing_model === 'one_time' ? (
                    <div className="space-y-1">
                      {course.preco_promocional ? (
                        <>
                          <div className="text-3xl font-bold text-primary">
                            R$ {course.preco_promocional.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground line-through">
                            R$ {course.preco?.toFixed(2)}
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-primary">
                          R$ {course.preco?.toFixed(2) || 'Sob consulta'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-accent">
                      Incluído na Assinatura
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress for enrolled users */}
                {enrollment && userHasAccess && totalLessons > 0 && (
                  <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between text-sm">
                      <span>Seu progresso</span>
                      <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {completedLessons} de {totalLessons} aulas concluídas
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                {userHasAccess ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleStartCourse}
                  >
                    {enrollment && progressPercent > 0 ? 'Continuar Curso' : 'Começar Curso'}
                  </Button>
                ) : user ? (
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Adquirir Curso
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      {lockReason}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/auth" className="block">
                      <Button className="w-full" size="lg">
                        Fazer Login para Acessar
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground text-center">
                      Crie sua conta ou faça login para acessar este curso
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Acesso vitalício</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Certificado de conclusão</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Materiais de apoio</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-6">Conteúdo do Curso</h2>
          
          <Accordion type="multiple" className="space-y-2">
            {modules.map((module, moduleIndex) => (
              <AccordionItem 
                key={module.id} 
                value={module.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Módulo {moduleIndex + 1}</span>
                      <span>•</span>
                      <span>{module.lessons.length} aulas</span>
                    </div>
                    <h3 className="font-medium mt-1">{module.titulo}</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {module.descricao && (
                    <p className="text-sm text-muted-foreground mb-4">{module.descricao}</p>
                  )}
                  <div className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isAccessible = userHasAccess || lesson.is_preview;
                      const isCompleted = isLessonCompleted(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          to={isAccessible ? `/cursos/${course.id}/aula/${lesson.id}` : '#'}
                          onClick={e => !isAccessible && e.preventDefault()}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isAccessible 
                              ? 'hover:bg-muted cursor-pointer' 
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              lessonIndex + 1
                            )}
                          </span>
                          <span className="flex-shrink-0">
                            {!isAccessible ? (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              getLessonIcon(lesson)
                            )}
                          </span>
                          <span className="flex-1">{lesson.titulo}</span>
                          {lesson.is_preview && !userHasAccess && (
                            <Badge variant="outline" className="text-xs">Preview</Badge>
                          )}
                          {lesson.duracao_minutos && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.duracao_minutos} min
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </AppLayout>
  );
}
