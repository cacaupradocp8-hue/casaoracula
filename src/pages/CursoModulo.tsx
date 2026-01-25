import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PedagogicalModuleView } from '@/components/courses/PedagogicalModuleView';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { PedagogicalModuleData } from '@/types/pedagogical-module';

export default function CursoModulo() {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();
  const { course, enrollment, isLoading: courseLoading } = useCourseDetail(courseId);
  const { hasAccess } = useCourseAccess();
  
  const [module, setModule] = useState<PedagogicalModuleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      if (!moduleId) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('course_modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (error) throw error;
        
        // Parse JSONB fields
        const moduleData: PedagogicalModuleData = {
          ...data,
          subtitulo: (data as any).subtitulo || null,
          formato_pedagogico: (data as any).formato_pedagogico || false,
          video_principal_url: (data as any).video_principal_url || null,
          video_principal_titulo: (data as any).video_principal_titulo || null,
          video_principal_duracao: (data as any).video_principal_duracao || null,
          cards_leitura: Array.isArray((data as any).cards_leitura) ? (data as any).cards_leitura : [],
          ferramenta_pratica: (data as any).ferramenta_pratica || null,
          estudos_caso: Array.isArray((data as any).estudos_caso) ? (data as any).estudos_caso : [],
          check_maturidade: Array.isArray((data as any).check_maturidade) ? (data as any).check_maturidade : [],
        };
        
        setModule(moduleData);
      } catch (error) {
        console.error('Error fetching module:', error);
        navigate(`/cursos/${courseId}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [moduleId, courseId, navigate]);

  if (courseLoading || isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="aspect-video rounded-lg mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!module || !course) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-display font-semibold mb-4">Módulo não encontrado</h1>
          <Button onClick={() => navigate(`/cursos/${courseId}`)}>
            Voltar ao Curso
          </Button>
        </div>
      </AppLayout>
    );
  }

  const userHasAccess = hasAccess(course, enrollment);

  if (!userHasAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center p-8">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display font-semibold mb-2">
              Conteúdo Bloqueado
            </h1>
            <p className="text-muted-foreground mb-6">
              Você precisa ter acesso ao curso para visualizar este módulo.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate(`/cursos/${courseId}`)} className="w-full">
                Ver Detalhes do Curso
              </Button>
              <Button variant="outline" onClick={() => navigate('/cursos')} className="w-full">
                Explorar Cursos
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <PedagogicalModuleView
          module={module}
          courseId={courseId!}
          onBack={() => navigate(`/cursos/${courseId}`)}
        />
      </div>
    </AppLayout>
  );
}
