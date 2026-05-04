import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, Lock, Loader2, BookOpen, Play, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature, PortalType } from '@/types/portal';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

interface Portal {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string;
  capa_url: string | null;
  portal_minimo: string;
  sala_id: string | null;
}

interface Sala {
  id: string;
  nome_exibicao: string;
}

interface Aula {
  id: string;
  titulo: string;
  descricao_curta: string;
  ordem: number;
  portal_minimo: string;
}

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  icone: string | null;
  rota: string;
  ativa: boolean;
}

interface AulaProgress {
  aula_id: string;
}

export default function PortalDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [portal, setPortal] = useState<Portal | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [completedAulas, setCompletedAulas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, user]);

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Fetch portal info (conteudo_travessias)
      const { data: portalData, error: portalError } = await supabase
        .from('conteudo_travessias')
        .select('*')
        .eq('id', id)
        .eq('publicado', true)
        .maybeSingle();

      if (portalError || !portalData) {
        navigate('/dashboard');
        return;
      }
      setPortal(portalData);

      // Fetch sala info if exists
      if (portalData.sala_id) {
        const { data: salaData } = await supabase
          .from('salas')
          .select('id, nome_exibicao')
          .eq('id', portalData.sala_id)
          .maybeSingle();
        
        setSala(salaData);
      }

      // Fetch aulas (conteudo_aulas) for this portal
      const { data: aulasData, error: aulasError } = await supabase
        .from('conteudo_aulas')
        .select('id, titulo, descricao_curta, ordem, portal_minimo')
        .eq('travessia_id', id)
        .eq('publicado', true)
        .order('ordem');

      if (aulasError) {
        console.error('Error fetching aulas:', aulasError);
      } else {
        setAulas(aulasData || []);
      }

      // Fetch ferramentas linked to this portal
      const { data: ferramentasData, error: ferramentasError } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, icone, rota, ativa')
        .eq('portal_id', id)
        .eq('ativa', true)
        .order('ordem');

      if (ferramentasError) {
        console.error('Error fetching ferramentas:', ferramentasError);
      } else {
        setFerramentas(ferramentasData || []);
      }

      // Fetch user progress
      if (user) {
        const { data: progressData } = await supabase
          .from('user_aula_progress')
          .select('aula_id')
          .eq('user_id', user.id);

        if (progressData) {
          setCompletedAulas(progressData.map((p) => p.aula_id));
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessAula = (aula: Aula) => {
    if (!user) return false;
    return canAccessFeature(user.portal, aula.portal_minimo as PortalType);
  };

  const isAulaCompleted = (aulaId: string) => completedAulas.includes(aulaId);

  const progressPercentage = aulas.length > 0 
    ? Math.round((completedAulas.filter(id => aulas.some(a => a.id === id)).length / aulas.length) * 100)
    : 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!portal) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Portal não encontrado.</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4 mx-auto block">
            Voltar às Salas
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ResponsiveContainer className="py-8 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-gold transition-colors"
          >
            Salas
          </button>
          {sala && (
            <>
              <span>/</span>
              <button 
                onClick={() => navigate(`/salas/${sala.id}`)}
                className="hover:text-gold transition-colors"
              >
                {sala.nome_exibicao}
              </button>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{portal.titulo}</span>
        </div>

        {/* Portal Header */}
        <div className="mb-8">
          {portal.capa_url && (
            <div className="h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <img 
                src={portal.capa_url} 
                alt={portal.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <SectionHeader
            title={portal.titulo}
            subtitle={portal.subtitulo || portal.descricao}
            icon={<BookOpen className="w-5 h-5" />}
            className="mb-4"
          />

          {/* Progress Bar */}
          {aulas.length > 0 && (
            <div className="max-w-md">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso</span>
                <span>{progressPercentage}% concluído</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </div>

        {/* Ferramentas do Portal */}
        {ferramentas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Ferramentas
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {ferramentas.map((ferramenta) => (
                <Card
                  key={ferramenta.id}
                  className="group transition-all duration-300 hover:shadow-gold cursor-pointer"
                  onClick={() => navigate(ferramenta.rota)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium group-hover:text-gold transition-colors">
                        {ferramenta.ferramenta_nome}
                      </h3>
                      {ferramenta.ferramenta_descricao && (
                        <p className="text-sm text-muted-foreground truncate">
                          {ferramenta.ferramenta_descricao}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Aulas/Travessias List */}
        {aulas.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Aulas</h2>
            {aulas.map((aula, index) => {
              const isAccessible = canAccessAula(aula);
              const isCompleted = isAulaCompleted(aula.id);
              
              return (
                <Card
                  key={aula.id}
                  className={cn(
                    'group transition-all duration-300',
                    isAccessible && 'hover:shadow-gold cursor-pointer',
                    !isAccessible && 'opacity-60',
                    isCompleted && 'border-gold/30'
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Index/Status */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      isCompleted ? 'bg-gold/20 text-gold' : 
                      isAccessible ? 'bg-secondary text-foreground' : 
                      'bg-muted text-muted-foreground'
                    )}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : !isAccessible ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'font-medium truncate',
                        isAccessible && 'group-hover:text-gold transition-colors'
                      )}>
                        {aula.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {aula.descricao_curta}
                      </p>
                    </div>

                    {/* Action */}
                    {isAccessible && (
                      <Link to={`/aulas/${aula.id}`}>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <Play className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : ferramentas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum conteúdo disponível neste portal ainda.</p>
          </div>
        ) : null}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => sala ? navigate(`/salas/${sala.id}`) : navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {sala ? 'Voltar à Sala' : 'Voltar às Salas'}
          </Button>
          
          {aulas.length > 0 && (
            <Link to={`/aulas/${aulas[0].id}`}>
              <Button variant="gold" className="gap-2">
                {progressPercentage > 0 ? 'Continuar' : 'Começar'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </ResponsiveContainer>
    </AppLayout>
  );
}
