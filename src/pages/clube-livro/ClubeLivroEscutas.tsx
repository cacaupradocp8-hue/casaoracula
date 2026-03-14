// ============================================
// CLUBE DO LIVRO ORACULAR - Escuta Guiada
// ============================================

import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { useAudioProgress } from '@/hooks/useAudioProgress';
import { PlayerOracular } from '@/components/audio/PlayerOracular';
import { 
  BookOpen, ChevronRight, Home, Headphones, 
  Play, FileText, ArrowLeft, Clock, CheckCircle2
} from 'lucide-react';

export default function ClubeLivroEscutas() {
  const { id: cicloId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, escutas, fases, isLoading } = useClubeCicloDetalhe(cicloId);
  const escutaIds = (escutas || []).map(e => e.id);
  const { isCompleted } = useAudioProgress(escutaIds);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFaseTitulo = (faseId: string | undefined) => {
    if (!faseId || !fases) return null;
    return fases.find(f => f.id === faseId)?.titulo;
  };

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
          <span className="text-foreground">Escuta Guiada</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Headphones className="w-5 h-5 text-gold" />
            <h1 className="text-2xl font-display text-foreground">
              Escuta Guiada
            </h1>
          </div>
          <p className="text-muted-foreground">
            Áudios e textos reflexivos para acompanhar sua leitura.
          </p>
        </div>

        {/* Lista de Escutas */}
        {escutas && escutas.length > 0 ? (
          <div className="space-y-4">
            {escutas.map((escuta) => {
              const faseTitulo = getFaseTitulo(escuta.fase_id);
              
              return (
                <Card key={escuta.id} className="bg-card/50 hover:border-gold/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                          {escuta.tipo === 'audio' ? (
                            <Headphones className="w-5 h-5 text-gold" />
                          ) : (
                            <FileText className="w-5 h-5 text-gold" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base font-medium">
                            {escuta.titulo}
                          </CardTitle>
                          {escuta.descricao && (
                            <CardDescription className="text-sm line-clamp-1">
                              {escuta.descricao}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {faseTitulo && (
                          <Badge variant="outline" className="text-xs">
                            {faseTitulo}
                          </Badge>
                        )}
                        {isCompleted(escuta.id) && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Ouvido
                          </Badge>
                        )}
                        {escuta.tipo === 'audio' && escuta.duracao_segundos && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(escuta.duracao_segundos)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {escuta.tipo === 'audio' && escuta.audio_url ? (
                      <PlayerOracular
                        audioUrl={escuta.audio_url}
                        titulo={escuta.titulo}
                        hideInsight={false}
                      />
                    ) : escuta.tipo === 'texto' && escuta.texto_conteudo ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <p className="text-muted-foreground whitespace-pre-line">
                          {escuta.texto_conteudo}
                        </p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-8 text-center">
              <Headphones className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhum conteúdo de escuta disponível para este ciclo.
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
