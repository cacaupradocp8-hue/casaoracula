// ============================================
// CLUBE DO LIVRO ORACULAR - Livro do Ciclo
// ============================================

import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { useIntegracaoRecord } from '@/hooks/useIntegracaoOracular';
import { useIntegracao8020Record } from '@/hooks/useIntegracao8020';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { 
  BookOpen, ChevronRight, Home, Sparkles, 
  BookMarked, Headphones, Video, MessageCircle,
  ArrowRight, Stethoscope, AlertTriangle, CheckCircle, XCircle,
  Star, CheckCircle2, Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Phase type icons/labels
const FASE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  chamado: { label: 'Chamado', color: 'bg-blue-500/20 text-blue-400' },
  ruptura: { label: 'Ruptura', color: 'bg-red-500/20 text-red-400' },
  reorganizacao: { label: 'Reorganização', color: 'bg-amber-500/20 text-amber-400' },
  integracao: { label: 'Integração', color: 'bg-green-500/20 text-green-400' },
};

export default function ClubeLivroCiclo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, fases, escutas, encontros, isLoading } = useClubeCicloDetalhe(id);
  const { data: integracaoRecord } = useIntegracaoRecord(id);
  const { data: integracao8020Record } = useIntegracao8020Record(id);
  const { isProfessional } = useProfessionalStatus();
  const { user } = useAuth();
  
  // Check if user can see clinical tab
  const portalMinimoClin = ciclo?.portal_minimo_clinico || 'aluna_formacao';
  const canSeeClinical = isProfessional && user && canAccessFeature(user.portal, portalMinimoClin as any);
  const hasClinicalContent = ciclo?.orientacao_clinica_uso || ciclo?.orientacao_clinica_evitar;
  const integracaoConcluida = integracaoRecord?.status === 'concluida';
  const integracao8020Concluida = integracao8020Record?.status === 'concluida';


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
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              {ciclo.ativo && (
                <Badge variant="secondary">Ciclo Atual</Badge>
              )}
              {ciclo.tema_simbolico && (
                <Badge variant="outline" className="text-gold border-gold/30">
                  {ciclo.tema_simbolico}
                </Badge>
              )}
            </div>
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

        {/* Tabs: Leitura / Uso Clínico */}
        <Tabs defaultValue="leitura" className="mb-8">
          <TabsList className={cn(canSeeClinical && hasClinicalContent ? 'grid grid-cols-2' : 'hidden')}>
            <TabsTrigger value="leitura" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Leitura
            </TabsTrigger>
            {canSeeClinical && hasClinicalContent && (
              <TabsTrigger value="clinico" className="gap-2">
                <Stethoscope className="w-4 h-4" />
                Uso Clínico
              </TabsTrigger>
            )}
          </TabsList>

          {/* Tab: Leitura */}
          <TabsContent value="leitura" className="mt-6 space-y-6">
            {/* Por que este livro */}
            {ciclo.por_que_este_livro && (
              <Card className="bg-card/50 border-gold/20">
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
              <Card className="bg-muted/30">
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
              <section>
                <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-gold" />
                  Fases da Leitura
                </h2>
                <div className="space-y-3">
                  {fases.map((fase, index) => {
                    const typeConfig = fase.tipo_fase ? FASE_TYPE_CONFIG[fase.tipo_fase] : null;
                    
                    return (
                      <Card
                        key={fase.id}
                        className="cursor-pointer transition-all hover:border-gold/50 group"
                        onClick={() => navigate(`/clube-livro/${id}/fase/${fase.id}`)}
                      >
                        <CardContent className="py-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">
                                  {fase.titulo}
                                </h3>
                                {typeConfig && (
                                  <Badge variant="outline" className={cn('text-xs', typeConfig.color)}>
                                    {typeConfig.label}
                                  </Badge>
                                )}
                              </div>
                              {(fase.descricao || fase.orientacao_curta) && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {fase.orientacao_curta || fase.descricao}
                                </p>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Escuta Guiada */}
            {hasEscutas && (
              <section>
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

            {/* === INTEGRAÇÃO ORACULAR === */}
            <section>
              <Card
                className={cn(
                  'cursor-pointer transition-all border group',
                  integracaoConcluida
                    ? 'border-gold/40 bg-gold/5 hover:bg-gold/10'
                    : 'border-gold/20 bg-gradient-to-br from-card to-gold/5 hover:border-gold/40'
                )}
                onClick={() => navigate(`/clube-livro/${id}/integracao`)}
              >
                <CardContent className="py-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      {integracaoConcluida ? (
                        <CheckCircle2 className="w-5 h-5 text-gold" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-gold" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Integração Oracular</p>
                      <p className="text-xs text-muted-foreground">
                        {integracaoConcluida
                          ? 'Integração concluída — ver registro'
                          : 'Transforme a leitura em experiência prática'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {integracaoConcluida && (
                      <Badge variant="outline" className="text-xs border-gold/40 text-gold hidden sm:flex">
                        Concluída ✦
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      className={cn(
                        'gap-2 text-xs',
                        integracaoConcluida
                          ? 'bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40'
                          : 'bg-gold hover:bg-gold/90 text-primary-foreground'
                      )}
                      onClick={(e) => { e.stopPropagation(); navigate(`/clube-livro/${id}/integracao`); }}
                    >
                      <Star className="w-3 h-3" />
                      {integracaoConcluida ? 'Ver registro' : 'Integrar conteúdo'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card Integração 80/20 */}
              <Card
                className={cn(
                  'cursor-pointer transition-all border group mt-3',
                  integracao8020Concluida
                    ? 'border-gold/40 bg-gold/5 hover:bg-gold/10'
                    : 'border-border/40 hover:border-gold/30'
                )}
                onClick={() => navigate(`/clube-livro/${id}/integracao-8020`)}
              >
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {integracao8020Concluida ? (
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                      ) : (
                        <Target className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Integração 80/20</p>
                      <p className="text-xs text-muted-foreground">
                        {integracao8020Concluida
                          ? 'Integração concluída — ver aplicação'
                          : 'Traduzir o livro em aplicação profissional e pessoal'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {integracao8020Concluida && (
                      <Badge variant="outline" className="text-xs border-gold/40 text-gold hidden sm:flex">
                        Concluída ✦
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant={integracao8020Concluida ? 'outline' : 'secondary'}
                      className="gap-2 text-xs"
                      onClick={(e) => { e.stopPropagation(); navigate(`/clube-livro/${id}/integracao-8020`); }}
                    >
                      <Target className="w-3 h-3" />
                      {integracao8020Concluida ? 'Ver aplicação' : 'Fazer integração'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-3 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-gold gap-1"
                  onClick={() => navigate(`/clube-livro/${id}/meu-caminho`)}
                >
                  <Star className="w-3 h-3" />
                  Ver Meu Caminho no Clube
                </Button>
              </div>
            </section>

          </TabsContent>


          {/* Tab: Uso Clínico (Profissional) */}
          {canSeeClinical && hasClinicalContent && (
            <TabsContent value="clinico" className="mt-6 space-y-6">
              {/* Aviso Ético Fixo */}
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="py-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-500 mb-1">
                      Orientação para uso clínico supervisionado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Este livro não interpreta a cliente. Ele afina a escuta da facilitadora.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quando usar */}
              {ciclo.orientacao_clinica_uso && (
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-widest text-green-500 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Quando usar este livro com clientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                      {ciclo.orientacao_clinica_uso}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quando evitar */}
              {ciclo.orientacao_clinica_evitar && (
                <Card className="bg-red-500/5 border-red-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-widest text-red-500 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Quando evitar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                      {ciclo.orientacao_clinica_evitar}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Riscos de projeção */}
              {ciclo.orientacao_clinica_riscos && (
                <Card className="bg-amber-500/5 border-amber-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-widest text-amber-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Riscos de projeção da terapeuta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                      {ciclo.orientacao_clinica_riscos}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Cliente indicado / contraindicado */}
              <div className="grid gap-4 md:grid-cols-2">
                {ciclo.orientacao_clinica_indicado && (
                  <Card className="bg-card/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                        Cliente indicado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {ciclo.orientacao_clinica_indicado}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {ciclo.orientacao_clinica_contraindicado && (
                  <Card className="bg-card/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                        Cliente contraindicado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {ciclo.orientacao_clinica_contraindicado}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}
