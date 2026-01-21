import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  GraduationCap,
  Lightbulb, 
  HelpCircle, 
  Compass,
  Wrench,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Loader2,
  Home
} from 'lucide-react';

type NivelCaso = 'iniciante' | 'intermediario' | 'avancado';

interface LabCaso {
  id: string;
  titulo: string;
  tema: string;
  nivel: string;
  contexto: string | null;
  perguntas: string[];
  hipoteses: string | null;
  ferramentas_sugeridas: string[];
}

export default function LaboratorioLeitura() {
  const { toast } = useToast();
  const [casos, setCasos] = useState<LabCaso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaso, setSelectedCaso] = useState<LabCaso | null>(null);
  const [filterNivel, setFilterNivel] = useState<NivelCaso | 'todos'>('todos');

  useEffect(() => {
    fetchCasos();
  }, []);

  const fetchCasos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lab_casos')
      .select('*')
      .eq('status', 'publicado')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar casos:', error);
      toast({ title: 'Erro ao carregar casos', variant: 'destructive' });
    } else {
      setCasos((data || []).map(c => ({
        ...c,
        perguntas: Array.isArray(c.perguntas) ? (c.perguntas as string[]) : [],
        ferramentas_sugeridas: Array.isArray(c.ferramentas_sugeridas) ? (c.ferramentas_sugeridas as string[]) : [],
      })));
    }
    setLoading(false);
  };

  const getNivelBadge = (nivel: string) => {
    switch (nivel) {
      case 'iniciante':
        return <Badge variant="secondary" className="bg-green-600/20 text-green-400">Iniciante</Badge>;
      case 'intermediario':
        return <Badge variant="secondary" className="bg-amber-600/20 text-amber-400">Intermediário</Badge>;
      case 'avancado':
        return <Badge variant="secondary" className="bg-red-600/20 text-red-400">Avançado</Badge>;
      default:
        return <Badge variant="outline">{nivel}</Badge>;
    }
  };

  const filteredCasos = filterNivel === 'todos' 
    ? casos 
    : casos.filter(c => c.nivel === filterNivel);

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/ferramentas" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Ferramentas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Laboratório de Leitura</span>
        </nav>

        <SectionHeader
          title="Laboratório de Leitura"
          subtitle="Casos-modelo para estudo e prática — sem vínculo com clientes reais"
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Aviso Educativo */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-amber-500">Aviso:</strong> Esta é uma área educativa. Os casos apresentados são fictícios e 
                servem apenas para estudo e prática de leitura simbólica. Nenhum dado é salvo em prontuário.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={filterNivel === 'todos' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('todos')}
          >
            Todos
          </Button>
          <Button 
            variant={filterNivel === 'iniciante' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('iniciante')}
          >
            <GraduationCap className="w-4 h-4 mr-1" />
            Iniciante
          </Button>
          <Button 
            variant={filterNivel === 'intermediario' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('intermediario')}
          >
            Intermediário
          </Button>
          <Button 
            variant={filterNivel === 'avancado' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('avancado')}
          >
            Avançado
          </Button>
        </div>

        {/* Lista de Casos */}
        {casos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum caso disponível</h3>
              <p className="text-muted-foreground text-sm">
                Em breve novos casos serão publicados para estudo.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCasos.map((caso) => (
              <Card 
                key={caso.id} 
                className="group hover:shadow-gold transition-shadow cursor-pointer"
                onClick={() => setSelectedCaso(caso)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-display flex items-center gap-2">
                        {caso.titulo}
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {caso.tema}
                      </CardDescription>
                    </div>
                    {getNivelBadge(caso.nivel)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {caso.contexto}
                  </p>
                  {caso.ferramentas_sugeridas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {caso.ferramentas_sugeridas.map((ferramenta, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <Wrench className="w-3 h-3 mr-1" />
                          {ferramenta}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Detalhe do Caso */}
        <Dialog open={!!selectedCaso} onOpenChange={(open) => !open && setSelectedCaso(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCaso && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {getNivelBadge(selectedCaso.nivel)}
                  </div>
                  <DialogTitle className="font-display text-2xl">
                    {selectedCaso.titulo}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedCaso.tema}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Contexto */}
                  {selectedCaso.contexto && (
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gold" />
                          Contexto do Caso
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {selectedCaso.contexto}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Perguntas de Condução */}
                  {selectedCaso.perguntas.length > 0 && (
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-blue-500" />
                          Perguntas de Condução
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedCaso.perguntas.map((pergunta, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <ArrowRight className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                              <span>{pergunta}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hipóteses Simbólicas */}
                  {selectedCaso.hipoteses && (
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Hipóteses Simbólicas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedCaso.hipoteses}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ferramentas Sugeridas */}
                  {selectedCaso.ferramentas_sugeridas.length > 0 && (
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-green-500" />
                          Ferramentas Sugeridas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedCaso.ferramentas_sugeridas.map((ferramenta, i) => (
                            <Badge key={i} variant="secondary" className="text-sm">
                              {ferramenta}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          💡 Experimente aplicar mentalmente essas ferramentas ao caso e observe quais insights surgem.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
