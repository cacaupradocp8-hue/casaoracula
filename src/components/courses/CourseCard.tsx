import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Play, Clock, BarChart3, Star } from 'lucide-react';
import { CourseWithProgress } from '@/types/course';
import { useCourseAccess } from '@/hooks/useCourseAccess';

interface CourseCardProps {
  course: CourseWithProgress;
  showProgress?: boolean;
}

export function CourseCard({ course, showProgress = true }: CourseCardProps) {
  const { hasAccess, getLockReason } = useCourseAccess();
  const hasUserAccess = hasAccess(course, course.enrollment);
  const lockReason = getLockReason(course, course.enrollment);

  const getPricingBadge = () => {
    switch (course.pricing_model) {
      case 'free':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Gratuito</Badge>;
      case 'one_time':
        return (
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {course.preco_promocional 
              ? `R$ ${course.preco_promocional}`
              : course.preco 
                ? `R$ ${course.preco}` 
                : 'Compra única'
            }
          </Badge>
        );
      case 'subscription':
        return <Badge variant="secondary" className="bg-accent/20 text-accent">Assinatura</Badge>;
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border/60 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/5 rounded-xl">
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden">
        {course.capa_url ? (
          <img 
            src={course.capa_url} 
            alt={course.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Overlay for locked content */}
        {!hasUserAccess && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        {/* Featured badge */}
        {course.destaque && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Star className="w-3 h-3" /> Destaque
            </Badge>
          </div>
        )}

        {/* Pricing badge */}
        <div className="absolute top-2 right-2">
          {getPricingBadge()}
        </div>
      </div>

      <CardHeader className="pb-2 pt-5 px-5">
        <h3 className="font-display text-xl font-semibold text-foreground line-clamp-2 leading-snug">
          {course.titulo}
        </h3>
        {course.subtitulo && (
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{course.subtitulo}</p>
        )}
      </CardHeader>

      <CardContent className="pb-2 px-5">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {course.descricao_publica || course.descricao}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {course.duracao_estimada && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duracao_estimada}
            </span>
          )}
          {course.nivel && (
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {course.nivel}
            </span>
          )}
          {course.totalLessons > 0 && (
            <span>{course.totalLessons} aulas</span>
          )}
        </div>

        {/* Progress bar for enrolled users */}
        {showProgress && hasUserAccess && course.enrollment && course.totalLessons > 0 && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{course.progressPercent}%</span>
            </div>
            <Progress value={course.progressPercent} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 pb-5 px-5">
        <Link to={`/cursos/${course.id}`} className="w-full">
          <Button 
            variant={hasUserAccess ? 'default' : 'outline'} 
            className="w-full"
          >
            {hasUserAccess 
              ? (course.enrollment ? 'Continuar' : 'Começar')
              : 'Ver Detalhes'
            }
          </Button>
        </Link>
      </CardFooter>

      {/* Lock reason tooltip */}
      {lockReason && (
        <div className="absolute bottom-full left-0 right-0 p-2 bg-popover text-popover-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {lockReason}
        </div>
      )}
    </Card>
  );
}
