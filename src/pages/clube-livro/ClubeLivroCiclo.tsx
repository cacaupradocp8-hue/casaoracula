// ============================================
// CLUBE DO LIVRO ORACULAR - Livro do Ciclo
// Modular: cada seção é um bloco independente
// ============================================

import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { useIntegracaoRecord } from '@/hooks/useIntegracaoOracular';
import { useIntegracao8020Record } from '@/hooks/useIntegracao8020';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { getPortaisDoLivro, JORNADA_COR } from '@/constants/clubeLivroPortais';
import { BookOpen, ChevronRight, Home, Stethoscope, DoorOpen, ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Blocos modulares independentes
import {
  CicloHeaderBlock,
  PorQueEsteLivroBlock,
  ComoLerBlock,
  FasesLeituraBlock,
  EscutaGuiadaBlock,
  EncontrosBlock,
  PortaisAssociadosBlock,
  IntegracoesBlock,
  UsoClinicalBlock,
  AulasEncontrosBlock,
  EscutaSimbolticaChat,
} from '@/components/clube-livro/blocks';

export default function ClubeLivroCiclo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, fases, escutas, encontros, aulas, isLoading } = useClubeCicloDetalhe(id);
  const { data: integracaoRecord } = useIntegracaoRecord(id);
  const { data: integracao8020Record } = useIntegracao8020Record(id);
  const { isProfessional } = useProfessionalStatus();
  const { user } = useAuth();
  const [showEscutaChat, setShowEscutaChat] = useState(false);

  // Fetch portas from DB for multipolar books
  const isMultipolar = (ciclo as any)?.is_multipolar === true;
  const { data: portasDB } = useQuery({
    queryKey: ['clube-livro-portas', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_portas')
        .select('*')
        .eq('ciclo_id', id!)
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id && isMultipolar,
  });

  const portalMinimoClin = ciclo?.portal_minimo_clinico || 'aluna_formacao';
  const canSeeClinical = isProfessional && user && canAccessFeature(user.portal, portalMinimoClin as any);
  const hasClinicalContent = ciclo?.orientacao_clinica_uso || ciclo?.orientacao_clinica_evitar;
  const integracaoConcluida = integracaoRecord?.status === 'concluida';
  const integracao8020Concluida = integracao8020Record?.status === 'concluida';

  const portaisConfig = ciclo ? getPortaisDoLivro(ciclo.titulo) : null;
  const jornadaCor = portaisConfig ? JORNADA_COR[portaisConfig.jornada] : null;

  const infograficoUrl = (ciclo as any)?.infografico_url;

  // For multipolar books, show all aulas/escutas on the ciclo page (porta-specific ones are on porta pages)
  const filteredAulas = aulas;
  const filteredEscutas = escutas;

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
            Círculos de Leitura Simbólica
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{ciclo.titulo}</span>
        </nav>

        {/* BLOCO 1: Header do Livro */}
        <div className="mb-8">
          <CicloHeaderBlock ciclo={ciclo} />
          
          {/* Botão Conversar com o Livro */}
          {ciclo.campo_simbolico && (
            <div className="mt-4 flex justify-center">
              <Button
                variant={showEscutaChat ? 'outline' : 'gold'}
                className="gap-2"
                onClick={() => setShowEscutaChat(!showEscutaChat)}
              >
                <MessageCircle className="w-4 h-4" />
                {showEscutaChat ? 'Fechar Escuta' : 'Conversar com o Livro'}
              </Button>
            </div>
          )}
        </div>

        {/* SALA DE ESCUTA SIMBÓLICA */}
        {showEscutaChat && ciclo.campo_simbolico && (
          <div className="mb-8">
            <EscutaSimbolticaChat
              campoSimbolico={ciclo.campo_simbolico}
              tituloLivro={ciclo.titulo}
              onClose={() => setShowEscutaChat(false)}
            />
          </div>
        )}

        {/* INFOGRÁFICO */}
        {infograficoUrl && (
          <div className="mb-8">
            <figure className="mx-auto max-w-2xl">
              <img
                src={infograficoUrl}
                alt={`Infográfico — ${ciclo.titulo}`}
                className="w-full rounded-lg border border-border/50 shadow-sm"
                loading="lazy"
              />
              <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
                Mapa de travessia deste livro
              </figcaption>
            </figure>
          </div>
        )}

        {/* SELEÇÃO DE PORTA — para livros multipolares */}
        {isMultipolar && portasDB && portasDB.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <DoorOpen className="w-3.5 h-3.5" />
              Escolha sua Porta de Travessia
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {portasDB.map((porta: any) => {
                const jornadaCorPorta = JORNADA_COR[porta.jornada] || null;
                return (
                  <Card
                    key={porta.id}
                    className="cursor-pointer transition-all group hover:border-primary/40"
                    onClick={() => navigate(`/clube-livro/${id}/porta/${porta.id}`)}
                  >
                    <CardContent className="py-3 flex items-center gap-3">
                      <span className={cn('text-lg leading-none shrink-0', jornadaCorPorta?.corLabel || 'text-primary')}>
                        {porta.icone || jornadaCorPorta?.simbolo || '◈'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium transition-colors text-foreground group-hover:text-primary">
                          {porta.titulo}
                        </p>
                        {porta.descricao && (
                          <p className="text-xs text-muted-foreground truncate">{porta.descricao}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

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

          {/* Tab: Leitura — composição de blocos independentes */}
          <TabsContent value="leitura" className="mt-6 space-y-6">
            {/* BLOCO: Aulas e Encontros */}
            <AulasEncontrosBlock
              aulas={filteredAulas || []}
              encontros={encontros || []}
              dataInicioCiclo={ciclo.data_inicio ?? undefined}
              intervaloLiberacaoDias={7}
              onAulaClick={(aulaId) => navigate(`/clube-livro/${id}/aula/${aulaId}`)}
              onEncontroClick={(encontroId) => navigate(`/clube-livro/${id}/encontros`)}
            />
            {/* BLOCO 2: Por que este livro (carrossel + áudio) */}
            {(ciclo.por_que_este_livro || ((ciclo as any).por_que_slides?.length > 0)) && (
              <PorQueEsteLivroBlock
                texto={ciclo.por_que_este_livro}
                slides={(ciclo as any).por_que_slides || []}
                audioUrl={(ciclo as any).por_que_audio_url}
              />
            )}

            {/* BLOCO 3: Como ler (carrossel + áudio) */}
            {(ciclo.como_ler || ((ciclo as any).como_ler_slides?.length > 0)) && (
              <ComoLerBlock
                texto={ciclo.como_ler}
                slides={(ciclo as any).como_ler_slides || []}
                audioUrl={(ciclo as any).como_ler_audio_url}
              />
            )}

            {/* BLOCO 4: Fases da Leitura */}
            <FasesLeituraBlock
              fases={fases || []}
              onFaseClick={(faseId) => navigate(`/clube-livro/${id}/fase/${faseId}`)}
            />

            {/* BLOCO 5: Escuta Guiada */}
            <EscutaGuiadaBlock
              escutas={filteredEscutas || []}
              onNavigate={() => navigate(`/clube-livro/${id}/escutas`)}
            />

            {/* BLOCO 6: Encontros */}
            <EncontrosBlock
              encontros={encontros || []}
              onNavigate={() => navigate(`/clube-livro/${id}/encontros`)}
            />

            {/* BLOCO 7: Portais Associados */}
            {portaisConfig && jornadaCor && (
              <PortaisAssociadosBlock
                portais={portaisConfig.portais}
                jornadaCor={jornadaCor}
                orientacaoCurta={portaisConfig.orientacaoCurta}
                onNavigate={(rota) => navigate(rota)}
              />
            )}

            {/* BLOCO 8: Integrações */}
            <IntegracoesBlock
              cicloId={id!}
              integracaoConcluida={integracaoConcluida}
              integracao8020Concluida={integracao8020Concluida}
              onNavigate={(path) => navigate(path)}
            />
          </TabsContent>

          {/* Tab: Uso Clínico — bloco independente */}
          {canSeeClinical && hasClinicalContent && (
            <TabsContent value="clinico" className="mt-6">
              {/* BLOCO 9: Uso Clínico */}
              <UsoClinicalBlock ciclo={ciclo} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}
