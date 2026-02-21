import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Play, Clock, BarChart3, Star } from 'lucide-react';
import { CourseWithProgress } from '@/types/course';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { motion } from 'framer-motion';

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
        return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">Gratuito</Badge>;
      case 'one_time':
        return (
          <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/20">
            {course.preco_promocional 
              ? `R$ ${course.preco_promocional}`
              : course.preco 
                ? `R$ ${course.preco}` 
                : 'Compra única'
            }
          </Badge>
        );
      case 'subscription':
        return <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">Assinatura</Badge>;
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border/40 hover:border-gold/20 transition-all duration-500 shadow-none hover:shadow-xl hover:shadow-gold/5 rounded-xl">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {course.capa_url ? (
          <img 
            src={course.capa_url} 
            alt={course.titulo}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gold/10 via-primary/15 to-secondary/20 flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

        {/* Overlay for locked content */}
        {!hasUserAccess && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Featured badge */}
        {course.destaque && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gold/90 text-background gap-1 text-xs font-medium">
              <Star className="w-3 h-3" /> Destaque
            </Badge>
          </div>
        )}

        {/* Pricing badge */}
        <div className="absolute top-3 right-3">
          {getPricingBadge()}
        </div>
      </div>

      <CardHeader className="pb-2 pt-5 px-5">
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground line-clamp-2 leading-[1.3]">
          {course.titulo}
        </h3>
        {course.subtitulo && (
          <p className="text-sm text-foreground/50 line-clamp-1 mt-1.5 leading-relaxed">{course.subtitulo}</p>
        )}
      </CardHeader>

      <CardContent className="pb-2 px-5">
        <p className="text-sm text-foreground/60 line-clamp-2 mb-4 leading-[1.7] tracking-[0.01em]">
          {course.descricao_publica || course.descricao}
        </p>

        <div className="flex items-center gap-4 text-xs text-foreground/40">
          {course.duracao_estimada && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {course.duracao_estimada}
            </span>
          )}
          {course.nivel && (
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              {course.nivel}
            </span>
          )}
          {course.totalLessons > 0 && (
            <span>{course.totalLessons} aulas</span>
          )}
        </div>

        {/* Progress bar for enrolled users */}
        {showProgress && hasUserAccess && course.enrollment && course.totalLessons > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-foreground/50">
              <span>Progresso</span>
              <span className="font-medium text-foreground/70">{course.progressPercent}%</span>
            </div>
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold/60 transition-all duration-500"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 pb-5 px-5">
        <Link to={`/cursos/${course.id}`} className="w-full">
          <Button 
            variant={hasUserAccess ? 'gold' : 'outline'} 
            className="w-full"
          >
            {hasUserAccess 
              ? (course.enrollment ? 'Continuar' : 'Começar')
              : 'Ver Detalhes'
            }
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
