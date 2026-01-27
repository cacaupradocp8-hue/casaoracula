// ============================================
// CLUBE DO LIVRO ORACULAR - Livro do Ciclo
// ============================================

import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { 
  BookOpen, ChevronRight, Home, Sparkles, 
  BookMarked, Headphones, Video, MessageCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClubeLivroCiclo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, fases, escutas, encontros, isLoading } = useClubeCicloDetalhe(id);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-48 bg-muted rounded" />
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
          <h2 className="text-xl font-display mb-2">Ciclo não encontrado</h2>
          <p className="text-muted-foreground mb-4">Este livro não está disponível.</p>
          <Button variant="outline" onClick={() => navigate('/clube-livro')}>
            Voltar ao Clube
          </Button>
        </div>
      </AppLayout>
    );
  }

  const hasEscutas = escutas && escutas.length > 0;
  const hasEncontros = encontros && encontros.length > 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Clube do Livro
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{ciclo.titulo}</span>
        </nav>

        {/* Header do Livro */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Capa */}
          {ciclo.capa_url ? (
            <div className="w-32 md:w-40 shrink-0 mx-auto md:mx-0">
              <img
                src={ciclo.capa_url}
                alt={ciclo.titulo}
                className="w-full rounded-lg shadow-lg border border-border/50"
              />
            </div>
          ) : (
            <div className="w-32 md:w-40 h-48 shrink-0 mx-auto md:mx-0 bg-muted rounded-lg flex items-center justify-center border border-border/50">
              <BookMarked className="w-12 h-12 text-muted-foreground" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <Badge variant="secondary" className="mb-2">
              Ciclo Atual
            </Badge>
            <h1 className="text-2xl md:text-3xl font-display text-foreground mb-1">
              {ciclo.titulo}
            </h1>
            {ciclo.subtitulo && (
              <p className="text-muted-foreground mb-2">{ciclo.subtitulo}</p>
            )}
            {ciclo.autor_livro && (
              <p className="text-sm text-gold">{ciclo.autor_livro}</p>
            )}
          </div>
        </div>

        {/* Por que este livro */}
        {ciclo.por_que_este_livro && (
          <Card className="mb-6 bg-card/50 border-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-gold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Por que este livro está aqui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {ciclo.por_que_este_livro}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Como ler */}
        {ciclo.como_ler && (
          <Card className="mb-8 bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Como ler este livro na Casa Orácula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {ciclo.como_ler}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Fases do Livro */}
        {fases && fases.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-gold" />
              Fases da Leitura
            </h2>
            <div className="space-y-3">
              {fases.map((fase, index) => (
                <Card
                  key={fase.id}
                  className={cn(
                    'cursor-pointer transition-all hover:border-gold/50',
                    'group'
                  )}
                  onClick={() => navigate(`/clube-livro/${id}/fase/${fase.id}`)}
                >
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">
                          {fase.titulo}
                        </h3>
                        {fase.descricao && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {fase.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Escuta Guiada */}
        {hasEscutas && (
          <section className="mb-8">
            <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-gold" />
              Escuta Guiada
            </h2>
            <Card className="bg-muted/30">
              <CardContent className="py-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate(`/clube-livro/${id}/escutas`)}
                >
                  <span className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    {escutas.length} {escutas.length === 1 ? 'áudio/texto' : 'áudios/textos'} disponíveis
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Encontros */}
        {hasEncontros && (
          <section>
            <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-gold" />
              Encontros do Círculo
            </h2>
            <Card className="bg-muted/30">
              <CardContent className="py-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate(`/clube-livro/${id}/encontros`)}
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {encontros.length} {encontros.length === 1 ? 'encontro' : 'encontros'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
