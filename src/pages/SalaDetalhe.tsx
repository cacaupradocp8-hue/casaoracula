import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Lock, Loader2, BookOpen, DoorOpen, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature, PortalType } from '@/types/portal';
import { cn } from '@/lib/utils';

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
}

interface Sala {
  id: string;
  nome_exibicao: string;
  texto_entrada: string;
}

interface Portal {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string;
  capa_url: string | null;
  portal_minimo: PortalType;
  ordem: number;
}

export default function SalaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [sala, setSala] = useState<Sala | null>(null);
  const [portais, setPortais] = useState<Portal[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Fetch sala info
      const { data: salaData, error: salaError } = await supabase
        .from('salas')
        .select('id, nome_exibicao, texto_entrada')
        .eq('id', id)
        .eq('ativa', true)
        .maybeSingle();

      if (salaError || !salaData) {
        navigate('/dashboard');
        return;
      }
      setSala(salaData);

      // Fetch portais (conteudo_travessias) for this sala
      const { data: portaisData, error: portaisError } = await supabase
        .from('conteudo_travessias')
        .select('*')
        .eq('sala_id', id)
        .eq('publicado', true)
        .order('ordem');

      if (portaisError) {
        console.error('Error fetching portais:', portaisError);
      } else {
        setPortais(portaisData || []);
      }

      // Fetch quizzes for this sala
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('id, titulo, descricao')
        .eq('sala_id', id)
        .eq('ativo', true);

      if (quizzesData) {
        setQuizzes(quizzesData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessPortal = (portal: Portal) => {
    if (!user) return false;
    return canAccessFeature(user.portal, portal.portal_minimo);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!sala) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Sala não encontrada.</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4 mx-auto block">
            Voltar às Salas
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-gold transition-colors"
          >
            Salas
          </button>
          <span>/</span>
          <span className="text-foreground">{sala.nome_exibicao}</span>
        </div>

        <SectionHeader
          title={sala.nome_exibicao}
          subtitle={sala.texto_entrada}
          icon={<DoorOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Quiz Disponível
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="glass hover:border-gold/50 cursor-pointer transition-all"
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.titulo}</CardTitle>
                    {quiz.descricao && (
                      <CardDescription>{quiz.descricao}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button variant="gold" size="sm">
                      Iniciar Quiz
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Portais Grid */}
        {portais.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portais.map((portal) => {
              const isAccessible = canAccessPortal(portal);
              
              return (
                <Card
                  key={portal.id}
                  className={cn(
                    'group transition-all duration-300 overflow-hidden',
                    isAccessible && 'hover:shadow-gold cursor-pointer',
                    !isAccessible && 'opacity-60'
                  )}
                >
                  {portal.capa_url && (
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={portal.capa_url} 
                        alt={portal.titulo}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isAccessible ? 'bg-gold/20 text-gold' : 'bg-muted text-muted-foreground'
                      )}>
                        {isAccessible ? (
                          <BookOpen className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Portal {portal.ordem}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className={cn(
                      'text-lg mb-1',
                      isAccessible && 'group-hover:text-gold transition-colors'
                    )}>
                      {portal.titulo}
                    </CardTitle>
                    {portal.subtitulo && (
                      <p className="text-sm text-gold mb-2">{portal.subtitulo}</p>
                    )}
                    <CardDescription className="text-sm line-clamp-2">
                      {portal.descricao}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-4">
                      {isAccessible ? (
                        <Link to={`/portal/${portal.id}`} className="w-full">
                          <Button variant="gold" className="w-full gap-2">
                            Entrar
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Requer Portal {portal.portal_minimo}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum portal disponível nesta sala ainda.</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar às Salas
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
