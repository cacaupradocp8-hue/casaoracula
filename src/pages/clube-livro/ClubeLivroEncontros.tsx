// ============================================
// CLUBE DO LIVRO ORACULAR - Encontros do Círculo
// ============================================

import { Link, useParams, useNavigate } from 'react-router-dom';
import { format, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { 
  BookOpen, ChevronRight, Home, Video, 
  Calendar, Play, ExternalLink, ArrowLeft, Clock
} from 'lucide-react';

export default function ClubeLivroEncontros() {
  const { id: cicloId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, encontros, isLoading } = useClubeCicloDetalhe(cicloId);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!ciclo) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Livro não encontrado</h2>
          <Button variant="outline" onClick={() => navigate('/clube-livro')}>
            Voltar ao Clube
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Círculos de Leitura Simbólica
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/${cicloId}`} className="hover:text-foreground transition-colors">
            {ciclo.titulo}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Encontros</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-gold" />
            <h1 className="text-2xl font-display text-foreground">
              Encontros do Círculo
            </h1>
          </div>
          <p className="text-muted-foreground">
            Encontros ao vivo e replays para aprofundamento coletivo.
          </p>
        </div>

        {/* Lista de Encontros */}
        {encontros && encontros.length > 0 ? (
          <div className="space-y-4">
            {encontros.map((encontro) => {
              const dataEncontro = encontro.data_encontro ? new Date(encontro.data_encontro) : null;
              const isUpcoming = dataEncontro && isFuture(dataEncontro);
              const isPastEvent = dataEncontro && isPast(dataEncontro);
              const hasReplay = !!encontro.replay_url;
              const hasLiveLink = !!encontro.link_ao_vivo;
              
              return (
                <Card key={encontro.id} className="bg-card/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg font-display">
                          {encontro.titulo}
                        </CardTitle>
                        {encontro.descricao && (
                          <CardDescription className="mt-1">
                            {encontro.descricao}
                          </CardDescription>
                        )}
                      </div>
                      {dataEncontro && (
                        <Badge 
                          variant={isUpcoming ? 'default' : 'secondary'}
                          className={isUpcoming ? 'bg-gold text-primary-foreground' : ''}
                        >
                          {isUpcoming ? 'Próximo' : 'Realizado'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Data */}
                    {dataEncontro && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(dataEncontro, "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    )}

                    {/* Orientação */}
                    {encontro.orientacao_encontro && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                          Orientação para o encontro
                        </p>
                        <p className="text-sm text-foreground whitespace-pre-line">
                          {encontro.orientacao_encontro}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      {isUpcoming && hasLiveLink && (
                        <Button
                          size="sm"
                          className="bg-gold hover:bg-gold/90"
                          onClick={() => window.open(encontro.link_ao_vivo!, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Entrar ao Vivo
                        </Button>
                      )}
                      {isPastEvent && hasReplay && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(encontro.replay_url!, '_blank')}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Assistir Replay
                        </Button>
                      )}
                      {isPastEvent && !hasReplay && (
                        <p className="text-xs text-muted-foreground">
                          Replay não disponível
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-8 text-center">
              <Video className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhum encontro agendado para este ciclo.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Back */}
        <div className="mt-8 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => navigate(`/clube-livro/${cicloId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Livro
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
