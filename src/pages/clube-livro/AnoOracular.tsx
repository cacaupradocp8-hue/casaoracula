import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOracularSeasons, useSeasonBooks } from '@/hooks/useOracularSeasons';
import { Home, ChevronRight, BookOpen, Sparkles } from 'lucide-react';

export default function AnoOracular() {
  const { data: seasons, isLoading: loadingSeasons } = useOracularSeasons();
  const { data: seasonBooks, isLoading: loadingBooks } = useSeasonBooks();

  const isLoading = loadingSeasons || loadingBooks;

  const getBooksForSeason = (seasonId: string) => {
    if (!seasonBooks) return { eixo: [], satelites: [] };
    const related = seasonBooks.filter(sb => sb.season_id === seasonId);
    return {
      eixo: related.filter(sb => sb.tipo === 'eixo'),
      satelites: related.filter(sb => sb.tipo === 'satelite'),
    };
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Círculo de Leitura
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Ano Oracular 2026</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
              Mapa do Ano
            </span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display text-foreground">
            Ano Oracular 2026
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Este não é um cronograma. É um mapa de consciência. Cada estação carrega um foco de travessia 
            e um campo de aplicação profissional. Os livros se organizam como eixo e satélites — 
            sem pressa, sem obrigação, sem ordem fixa.
          </p>
        </div>

        {/* Estações */}
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-muted rounded-xl" />)}
          </div>
        ) : seasons && seasons.length > 0 ? (
          <div className="space-y-6">
            {seasons.map((season) => {
              const { eixo, satelites } = getBooksForSeason(season.id);
              return (
                <Card key={season.id} className="bg-card/50 border-gold/15 overflow-hidden">
                  <CardContent className="p-6">
                    {/* Cabeçalho da estação */}
                    <div className="flex items-start gap-3 mb-4">
                      {season.simbolo && (
                        <span className="text-2xl text-gold leading-none mt-0.5">{season.simbolo}</span>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-display text-lg text-foreground">{season.nome_estacao}</h2>
                          {season.periodo && (
                            <Badge variant="outline" className="text-xs text-muted-foreground border-border/50">
                              {season.periodo}
                            </Badge>
                          )}
                          {season.status === 'ativa' && (
                            <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px]">Ativa</Badge>
                          )}
                          {season.status === 'concluida' && (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground/60">Concluída</Badge>
                          )}
                        </div>
                        {season.foco_travessia && (
                          <p className="text-sm text-muted-foreground mt-1">{season.foco_travessia}</p>
                        )}
                      </div>
                    </div>

                    {/* Aplicação profissional */}
                    {season.aplicacao_profissional && (
                      <div className="bg-muted/30 rounded-lg p-3 mb-4">
                        <p className="text-xs uppercase tracking-widest text-gold/70 mb-1">Aplicação Profissional</p>
                        <p className="text-sm text-muted-foreground">{season.aplicacao_profissional}</p>
                      </div>
                    )}

                    {/* Livros */}
                    {(eixo.length > 0 || satelites.length > 0) && (
                      <div className="space-y-3">
                        {/* Livro-eixo */}
                        {eixo.map(sb => sb.ciclo && (
                          <Link
                            key={sb.id}
                            to={`/clube-livro/${sb.ciclo.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
                          >
                            {sb.ciclo.capa_url ? (
                              <img src={sb.ciclo.capa_url} alt="" className="w-10 h-14 object-cover rounded" />
                            ) : (
                              <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px]">Eixo</Badge>
                              </div>
                              <p className="text-sm font-medium text-foreground truncate">{sb.ciclo.titulo}</p>
                              {sb.ciclo.autor_livro && (
                                <p className="text-xs text-muted-foreground">{sb.ciclo.autor_livro}</p>
                              )}
                            </div>
                          </Link>
                        ))}

                        {/* Livros-satélite */}
                        {satelites.length > 0 && (
                          <div className="space-y-1.5">
                            {satelites.map(sb => sb.ciclo && (
                              <Link
                                key={sb.id}
                                to={`/clube-livro/${sb.ciclo.id}`}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                              >
                                {sb.ciclo.capa_url ? (
                                  <img src={sb.ciclo.capa_url} alt="" className="w-8 h-11 object-cover rounded" />
                                ) : (
                                  <div className="w-8 h-11 bg-muted rounded flex items-center justify-center">
                                    <BookOpen className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground truncate">{sb.ciclo.titulo}</p>
                                  {sb.ciclo.autor_livro && (
                                    <p className="text-xs text-muted-foreground">{sb.ciclo.autor_livro}</p>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-[10px] text-muted-foreground shrink-0">Satélite</Badge>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {eixo.length === 0 && satelites.length === 0 && (
                      <p className="text-xs text-muted-foreground/60 italic">Nenhum livro vinculado a esta estação.</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/20 border-dashed">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">As estações do ano ainda não foram configuradas.</p>
            </CardContent>
          </Card>
        )}

        {/* Nota de fechamento */}
        <div className="mt-10 text-center">
          <div className="w-12 h-px bg-gold/30 mx-auto mb-4" />
          <p className="text-xs text-muted-foreground/60 italic max-w-md mx-auto">
            O Clube não trabalha com urgência. Trabalha com formação de pensamento simbólico maduro.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
