import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BookOpenCheck, Home, ChevronRight, AlertTriangle, ChevronRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContoClinical {
  id: string;
  slug: string;
  titulo: string;
  origem_cultural: string | null;
  ordem: number;
}

export default function BibliotecaClinica() {
  // Fetch clinical tales
  const { data: contos, isLoading, error } = useQuery({
    queryKey: ['contos-clinicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contos_clinicos')
        .select('id, slug, titulo, origem_cultural, ordem')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ContoClinical[];
    },
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/narroterapia" className="hover:text-foreground transition-colors">
            Narroterapia Oracular™
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Biblioteca Clínica</span>
        </nav>

        <SectionHeader
          title="Biblioteca de Narroterapia Oracular™"
          subtitle="12 contos clínicos oficiais para uso terapêutico"
          icon={<BookOpenCheck className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Ethical Notice */}
        <Alert className="mb-6 border-gold/50 bg-gold/10">
          <AlertTriangle className="w-4 h-4 text-gold" />
          <AlertDescription className="text-gold-light">
            Conteúdo exclusivo para facilitadoras certificadas. Uso clínico requer supervisão.
          </AlertDescription>
        </Alert>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="text-center py-12 border-destructive/50">
            <CardContent>
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <p className="text-destructive">Erro ao carregar contos clínicos</p>
            </CardContent>
          </Card>
        ) : !contos || contos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpenCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum conto clínico cadastrado ainda
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                A administradora pode adicionar contos em Admin → Narroterapia
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {contos.map((conto, index) => (
              <Link 
                key={conto.id} 
                to={`/narroterapia/clinica/${conto.slug}`}
              >
                <Card className="group hover:shadow-md hover:border-gold/50 transition-all">
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-base font-display group-hover:text-gold transition-colors">
                            {conto.titulo}
                          </CardTitle>
                          {conto.origem_cultural && (
                            <CardDescription className="text-xs mt-0.5">
                              {conto.origem_cultural}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Info Note */}
        <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Os 12 contos clínicos são a base da Narroterapia Oracular™.
            <br />
            Cada conto possui orientações específicas de uso terapêutico.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
