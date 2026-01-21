import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Trophy,
  Sparkles,
  Home,
  ChevronRight
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { CourseWithProgress } from '@/types/course';

export default function Cursos() {
  const { user } = useAuth();
  const { courses, isLoading } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeTab) {
      case 'meus':
        return course.enrollment !== null;
      case 'gratuitos':
        return course.pricing_model === 'free';
      case 'destaque':
        return course.destaque;
      default:
        return true;
    }
  });

  // Separate featured courses for hero section
  const featuredCourses = courses.filter(c => c.destaque && c.publicado).slice(0, 3);
  const enrolledCourses = courses.filter(c => c.enrollment !== null);
  const inProgressCourses = enrolledCourses.filter(c => c.progressPercent > 0 && c.progressPercent < 100);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Cursos</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <SectionHeader
            title="Área de Membros"
            subtitle="Cursos e formações para sua jornada de desenvolvimento"
            icon={<GraduationCap className="w-5 h-5" />}
            className="mb-6"
          />
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Continue Learning Section */}
        {user && inProgressCourses.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Continue de onde parou</h2>
            </div>
            <CourseGrid 
              courses={inProgressCourses.slice(0, 3)} 
              isLoading={false}
              showProgress
            />
          </section>
        )}

        {/* Featured Courses */}
        {featuredCourses.length > 0 && activeTab === 'todos' && !searchTerm && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Cursos em Destaque</h2>
            </div>
            <CourseGrid 
              courses={featuredCourses as CourseWithProgress[]} 
              isLoading={false}
            />
          </section>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1">
            <TabsTrigger value="todos" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Todos os Cursos
            </TabsTrigger>
            {user && (
              <TabsTrigger value="meus" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Meus Cursos
                {enrolledCourses.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                    {enrolledCourses.length}
                  </span>
                )}
              </TabsTrigger>
            )}
            <TabsTrigger value="gratuitos" className="gap-2">
              <Trophy className="w-4 h-4" />
              Gratuitos
            </TabsTrigger>
            <TabsTrigger value="destaque" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Destaques
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <CourseGrid 
              courses={filteredCourses as CourseWithProgress[]}
              isLoading={isLoading}
              emptyMessage={
                activeTab === 'meus' 
                  ? 'Você ainda não está matriculado em nenhum curso.'
                  : 'Nenhum curso encontrado.'
              }
            />
          </TabsContent>
        </Tabs>

        {/* CTA for non-logged users */}
        {!user && (
          <div className="mt-12 text-center p-8 rounded-lg bg-card border border-border">
            <h3 className="font-display text-2xl font-semibold mb-2">
              Comece sua jornada hoje
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie sua conta gratuita para acessar cursos e acompanhar seu progresso.
            </p>
            <Link to="/auth">
              <Button size="lg">Criar Conta Gratuita</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
