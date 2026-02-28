// ============================================
// CÍRCULO DE LEITURA ORACULAR - Estrutura Interna do Livro (v2)
// 6 abas: Portal | Travessia | Converse | Lab 80/20 | Registros | Integração
// ============================================

import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useClubeCicloDetalhe, useClubeFasePerguntas } from '@/hooks/useClubeLivro';
import { useIntegracaoRecord, useSalvarIntegracao } from '@/hooks/useIntegracaoOracular';
import { useIntegracao8020Record } from '@/hooks/useIntegracao8020';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen, ChevronRight, Home, DoorOpen, Headphones, MessageCircle,
  Target, PenLine, Sparkles, Loader2, ArrowRight, Play, CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CicloHeaderBlock,
  PorQueEsteLivroBlock,
  ComoLerBlock,
  AulasEncontrosBlock,
  EscutaGuiadaBlock,
  EncontrosBlock,
  EscutaSimbolticaChat,
  FasesLeituraBlock,
} from '@/components/clube-livro/blocks';

export default function ClubeLivroCiclo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, fases, escutas, encontros, aulas, isLoading } = useClubeCicloDetalhe(id);
  const { data: integracaoRecord } = useIntegracaoRecord(id);
  const { data: integracao8020Record } = useIntegracao8020Record(id);
  const { user } = useAuth();

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
            Círculo de Leitura
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{ciclo.titulo}</span>
        </nav>

        {/* Header do Livro */}
        <div className="mb-6">
          <CicloHeaderBlock ciclo={ciclo} />
        </div>

        {/* ── 6 ABAS ── */}
        <Tabs defaultValue="portal" className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="portal" className="text-xs gap-1 py-2">
              <DoorOpen className="w-3.5 h-3.5 hidden sm:block" />
              Portal
            </TabsTrigger>
            <TabsTrigger value="travessia" className="text-xs gap-1 py-2">
              <Play className="w-3.5 h-3.5 hidden sm:block" />
              Travessia
            </TabsTrigger>
            <TabsTrigger value="converse" className="text-xs gap-1 py-2">
              <MessageCircle className="w-3.5 h-3.5 hidden sm:block" />
              Converse
            </TabsTrigger>
            <TabsTrigger value="lab8020" className="text-xs gap-1 py-2">
              <Target className="w-3.5 h-3.5 hidden sm:block" />
              Lab 80/20
            </TabsTrigger>
            <TabsTrigger value="registros" className="text-xs gap-1 py-2">
              <PenLine className="w-3.5 h-3.5 hidden sm:block" />
              Registros
            </TabsTrigger>
            <TabsTrigger value="integracao" className="text-xs gap-1 py-2">
              <Sparkles className="w-3.5 h-3.5 hidden sm:block" />
              Integração
            </TabsTrigger>
          </TabsList>

          {/* ── ABA 1: Portal do Livro ── */}
          <TabsContent value="portal" className="space-y-6">
            {/* Apresentação */}
            {(ciclo.por_que_este_livro || (ciclo as any).por_que_slides?.length > 0) && (
              <PorQueEsteLivroBlock
                texto={ciclo.por_que_este_livro}
                slides={(ciclo as any).por_que_slides || []}
                audioUrl={(ciclo as any).por_que_audio_url}
              />
            )}

            {/* Como Atravessar */}
            {(ciclo.como_ler || (ciclo as any).como_ler_slides?.length > 0) && (
              <ComoLerBlock
                texto={ciclo.como_ler}
                slides={(ciclo as any).como_ler_slides || []}
                audioUrl={(ciclo as any).como_ler_audio_url}
              />
            )}

            {/* Fallback quando não há conteúdo */}
            {!ciclo.por_que_este_livro && !ciclo.como_ler && (
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="py-8 text-center">
                  <DoorOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    O portal deste livro será aberto em breve.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── ABA 2: Travessia (Episódios) ── */}
          <TabsContent value="travessia" className="space-y-6">
            {/* Aulas / Episódios */}
            <AulasEncontrosBlock
              aulas={aulas || []}
              encontros={encontros || []}
              dataInicioCiclo={ciclo.data_inicio ?? undefined}
              intervaloLiberacaoDias={7}
              onAulaClick={(aulaId) => navigate(`/clube-livro/${id}/aula/${aulaId}`)}
              onEncontroClick={() => navigate(`/clube-livro/${id}/encontros`)}
            />

            {/* Escutas */}
            <EscutaGuiadaBlock
              escutas={escutas || []}
              onNavigate={() => navigate(`/clube-livro/${id}/escutas`)}
            />

            {/* Encontros ao vivo */}
            <EncontrosBlock
              encontros={encontros || []}
              onNavigate={() => navigate(`/clube-livro/${id}/encontros`)}
            />
          </TabsContent>

          {/* ── ABA 3: Converse com o Livro ── */}
          <TabsContent value="converse">
            {ciclo.campo_simbolico ? (
              <EscutaSimbolticaChat
                campoSimbolico={ciclo.campo_simbolico}
                tituloLivro={ciclo.titulo}
                onClose={() => {}}
              />
            ) : (
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="py-8 text-center">
                  <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    A escuta simbólica deste livro ainda não foi ativada.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── ABA 4: Laboratório 80/20 ── */}
          <TabsContent value="lab8020">
            <Card className={cn(
              'transition-all cursor-pointer hover:border-gold/40',
              integracao8020Concluida && 'border-gold/30 bg-gold/5'
            )}>
              <CardContent className="p-6 text-center" onClick={() => navigate(`/clube-livro/${id}/integracao-8020`)}>
                <Target className="w-10 h-10 text-gold mx-auto mb-3" />
                <h3 className="font-display text-lg text-foreground mb-2">
                  Laboratório de Integração 80/20
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Transforme o que leu em aplicação real — profissional, emocional e comportamental.
                </p>
                {integracao8020Concluida ? (
                  <div className="flex items-center justify-center gap-2 text-gold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Integração concluída
                  </div>
                ) : (
                  <Button className="bg-gold hover:bg-gold/90 text-primary-foreground gap-2">
                    Acessar Laboratório
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── ABA 5: Registros (Diário privado) ── */}
          <TabsContent value="registros" className="space-y-6">
            <FasesLeituraBlock
              fases={fases || []}
              onFaseClick={(faseId) => navigate(`/clube-livro/${id}/fase/${faseId}`)}
            />

            {(!fases || fases.length === 0) && (
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="py-8 text-center">
                  <PenLine className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Os registros desta travessia serão abertos conforme as fases avançam.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── ABA 6: Integração Final ── */}
          <TabsContent value="integracao">
            <Card className={cn(
              'transition-all cursor-pointer hover:border-gold/40',
              integracaoConcluida && 'border-gold/30 bg-gold/5'
            )}>
              <CardContent className="p-6 text-center" onClick={() => navigate(`/clube-livro/${id}/integracao`)}>
                <Sparkles className="w-10 h-10 text-gold mx-auto mb-3" />
                <h3 className="font-display text-lg text-foreground mb-2">
                  Integração Oracular
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Campo de síntese pessoal — movimentos, ritual e registro final desta travessia.
                </p>
                {integracaoConcluida ? (
                  <div className="flex items-center justify-center gap-2 text-gold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Integração concluída
                  </div>
                ) : (
                  <Button className="bg-gold hover:bg-gold/90 text-primary-foreground gap-2">
                    Iniciar Integração
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Marcar como concluído — summary */}
            {integracaoConcluida && integracao8020Concluida && (
              <Card className="mt-4 border-gold/40 bg-gradient-to-br from-gold/10 to-card">
                <CardContent className="p-5 text-center space-y-3">
                  <p className="text-sm text-gold font-medium">
                    ✦ Travessia completa — todas as integrações foram concluídas
                  </p>
                  <Button
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
                    onClick={() => navigate(`/clube-livro/${id}/certificado`)}
                  >
                    <Sparkles className="w-4 h-4" />
                    Ver Certificado de Travessia
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
