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
  Users,
  Sparkles
} from 'lucide-react';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useAuth } from '@/contexts/AuthContext';
import { CourseLesson } from '@/types/course';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { motion } from 'framer-motion';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

export default function CursoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    course, modules, enrollment, progress, isLoading,
    totalLessons, completedLessons, progressPercent
  } = useCourseDetail(id);
  const { hasAccess, getLockReason } = useCourseAccess();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="aspect-video rounded-xl mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-6 w-3/4" />
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
          <h1 className="font-display text-2xl font-semibold mb-4">Curso não encontrado</h1>
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
        if (userHasAccess || lesson.is_preview) return lesson;
      }
    }
    return null;
  };

  const firstLesson = getFirstAccessibleLesson();
  const handleStartCourse = () => { if (firstLesson) navigate(`/cursos/${course.id}/aula/${firstLesson.id}`); };

  return (
    <AppLayout>
      <ResponsiveContainer size="wide" className="py-8 pb-20">
        {/* Back Button */}
        <Link 
          to="/cursos" 
          className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar aos cursos
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-14">
          <div className="lg:col-span-2 space-y-6">
            {/* Cover */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border/30"
            >
              {course.video_preview_url ? (
                <iframe src={course.video_preview_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : course.capa_url ? (
                <img src={course.capa_url} alt={course.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/10 via-primary/15 to-secondary/20">
                  <Play className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>

            {/* Title and Description */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                {course.destaque && (
                  <Badge className="bg-gold/20 text-gold border-gold/20 gap-1">
                    <Star className="w-3 h-3" /> Destaque
                  </Badge>
                )}
                {course.nivel && <Badge variant="secondary">{course.nivel}</Badge>}
                {course.tags?.map(tag => <Badge key={tag} variant="outline" className="border-border/40">{tag}</Badge>)}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-[1.2] tracking-tight">
                {course.titulo}
              </h1>

              {course.subtitulo && (
                <p className="text-lg md:text-xl text-foreground/50 leading-relaxed">{course.subtitulo}</p>
              )}

              <div className="flex flex-wrap items-center gap-5 text-sm text-foreground/40">
                {course.duracao_estimada && (
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.duracao_estimada}</span>
                )}
                <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" />{totalLessons} aulas</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{modules.length} módulos</span>
              </div>

              <p className="text-foreground/60 text-base leading-[1.8] tracking-[0.01em] max-w-[750px]">
                {course.descricao_publica || course.descricao}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="space-y-2">
                  {course.pricing_model === 'free' ? (
                    <div className="text-2xl font-bold text-emerald-400">Gratuito</div>
                  ) : course.pricing_model === 'one_time' ? (
                    <div className="space-y-1">
                      {course.preco_promocional ? (
                        <>
                          <div className="text-3xl font-bold text-gold">R$ {course.preco_promocional.toFixed(2)}</div>
                          <div className="text-sm text-foreground/40 line-through">R$ {course.preco?.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-gold">R$ {course.preco?.toFixed(2) || 'Sob consulta'}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-primary">Incluído na Assinatura</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollment && userHasAccess && totalLessons > 0 && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/50">Seu progresso</span>
                      <span className="font-medium text-foreground/80">{progressPercent}%</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold/60" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p className="text-xs text-foreground/40">{completedLessons} de {totalLessons} aulas concluídas</p>
                  </div>
                )}

                {userHasAccess ? (
                  <Button variant="gold" className="w-full shadow-lg shadow-gold/10" size="lg" onClick={handleStartCourse}>
                    {enrollment && progressPercent > 0 ? 'Continuar Curso' : 'Começar Curso'}
                  </Button>
                ) : user ? (
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" disabled><Lock className="w-4 h-4 mr-2" />Adquirir Curso</Button>
                    <p className="text-xs text-foreground/40 text-center">{lockReason}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/auth" className="block"><Button className="w-full" size="lg">Fazer Login para Acessar</Button></Link>
                    <p className="text-xs text-foreground/40 text-center">Crie sua conta ou faça login para acessar</p>
                  </div>
                )}

                <div className="pt-4 border-t border-border/30 space-y-2.5 text-sm">
                  {["Acesso vitalício", "Certificado de conclusão", "Materiais de apoio"].map(feat => (
                    <div key={feat} className="flex items-center gap-2.5 text-foreground/50">
                      <Check className="w-4 h-4 text-emerald-400/70" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-5 h-5 text-gold/60" />
            <h2 className="font-display text-2xl font-semibold text-foreground">Conteúdo do Curso</h2>
          </div>
          
          <Accordion type="multiple" className="space-y-3">
            {modules.map((module, moduleIndex) => (
              <AccordionItem 
                key={module.id} 
                value={module.id}
                className="border border-border/40 rounded-xl overflow-hidden bg-card/50"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 text-xs text-foreground/40 uppercase tracking-wider">
                      <span>Módulo {moduleIndex + 1}</span>
                      <span>•</span>
                      <span>{module.lessons.length} aulas</span>
                    </div>
                    <h3 className="font-display font-semibold mt-1.5 text-foreground/90 text-base leading-snug">{module.titulo}</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  {module.descricao && (
                    <p className="text-sm text-foreground/50 mb-4 leading-[1.7]">{module.descricao}</p>
                  )}
                  <div className="space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isAccessible = userHasAccess || lesson.is_preview;
                      const isCompleted = isLessonCompleted(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          to={isAccessible ? `/cursos/${course.id}/aula/${lesson.id}` : '#'}
                          onClick={e => !isAccessible && e.preventDefault()}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isAccessible ? 'hover:bg-muted/50 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-xs font-medium">
                            {isCompleted ? <Check className="w-4 h-4 text-emerald-400" /> : lessonIndex + 1}
                          </span>
                          <span className="flex-shrink-0 text-foreground/40">
                            {!isAccessible ? <Lock className="w-4 h-4" /> : getLessonIcon(lesson)}
                          </span>
                          <span className="flex-1 text-sm text-foreground/80 leading-snug">{lesson.titulo}</span>
                          {lesson.is_preview && !userHasAccess && (
                            <Badge variant="outline" className="text-xs border-gold/30 text-gold">Preview</Badge>
                          )}
                          {lesson.duracao_minutos && (
                            <span className="text-xs text-foreground/30">{lesson.duracao_minutos} min</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {course && (
            <ModularPageRenderer contextType="course" contextId={course.id} fallback={null} blockSpacing="lg" className="mt-8" />
          )}
        </section>
      </ResponsiveContainer>
    </AppLayout>
  );
}
