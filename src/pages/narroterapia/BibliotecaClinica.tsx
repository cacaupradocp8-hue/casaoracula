import { Link, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BookOpenCheck, Home, ChevronRight, AlertTriangle, ChevronRightIcon, DoorOpen, Filter, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ContoClinical {
  id: string;
  slug: string;
  titulo: string;
  origem_cultural: string | null;
  porta_psiquica: string | null;
  ordem: number;
}

export default function BibliotecaClinica() {
  const [searchParams, setSearchParams] = useSearchParams();
  const portaFiltro = searchParams.get('porta');

  // Fetch clinical tales with optional filter
  const { data: contos, isLoading, error } = useQuery({
    queryKey: ['contos-clinicos', portaFiltro],
    queryFn: async () => {
      let query = supabase
        .from('contos_clinicos')
        .select('id, slug, titulo, origem_cultural, porta_psiquica, ordem')
        .eq('ativo', true);

      if (portaFiltro) {
        query = query.eq('porta_psiquica', portaFiltro);
      }

      const { data, error } = await query.order('ordem', { ascending: true });

      if (error) throw error;
      return data as ContoClinical[];
    },
  });

  const clearFilter = () => {
    setSearchParams({});
  };

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
          <span className="text-foreground">Câmara de Narração</span>
        </nav>

        <SectionHeader
          title="Câmara de Narração Oracular™"
          subtitle="12 contos clínicos organizados por Porta Psíquica"
          icon={<BookOpenCheck className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Ethical Notice */}
        <Alert className="mb-6 border-gold/50 bg-gold/5">
          <AlertTriangle className="w-4 h-4 text-gold" />
          <AlertDescription className="text-gold-light text-sm">
            Escuta simbólica. Não interpretar.
          </AlertDescription>
        </Alert>

        {/* Filter indicator */}
        {portaFiltro && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-gold/10 border border-gold/30">
            <Filter className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold">Filtrando por: <strong>{portaFiltro}</strong></span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="ml-auto h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              <span className="ml-1">Limpar</span>
            </Button>
          </div>
        )}

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
                          <div className="flex items-center gap-3 mt-1">
                            {conto.porta_psiquica && (
                              <div className="flex items-center gap-1 text-xs text-gold/80">
                                <DoorOpen className="w-3 h-3" />
                                {conto.porta_psiquica}
                              </div>
                            )}
                            {conto.origem_cultural && (
                              <CardDescription className="text-xs">
                                {conto.origem_cultural}
                              </CardDescription>
                            )}
                          </div>
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
