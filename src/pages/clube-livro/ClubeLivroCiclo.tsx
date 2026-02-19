// ============================================
// CLUBE DO LIVRO ORACULAR - Livro do Ciclo
// Modular: cada seção é um bloco independente
// ============================================

import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { useIntegracaoRecord } from '@/hooks/useIntegracaoOracular';
import { useIntegracao8020Record } from '@/hooks/useIntegracao8020';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { getPortaisDoLivro, JORNADA_COR } from '@/constants/clubeLivroPortais';
import { BookOpen, ChevronRight, Home, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

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
} from '@/components/clube-livro/blocks';

export default function ClubeLivroCiclo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, fases, escutas, encontros, aulas, isLoading } = useClubeCicloDetalhe(id);
  const { data: integracaoRecord } = useIntegracaoRecord(id);
  const { data: integracao8020Record } = useIntegracao8020Record(id);
  const { isProfessional } = useProfessionalStatus();
  const { user } = useAuth();

  const portalMinimoClin = ciclo?.portal_minimo_clinico || 'aluna_formacao';
  const canSeeClinical = isProfessional && user && canAccessFeature(user.portal, portalMinimoClin as any);
  const hasClinicalContent = ciclo?.orientacao_clinica_uso || ciclo?.orientacao_clinica_evitar;
  const integracaoConcluida = integracaoRecord?.status === 'concluida';
  const integracao8020Concluida = integracao8020Record?.status === 'concluida';

  const portaisConfig = ciclo ? getPortaisDoLivro(ciclo.titulo) : null;
  const jornadaCor = portaisConfig ? JORNADA_COR[portaisConfig.jornada] : null;

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
            Clube do Livro
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{ciclo.titulo}</span>
        </nav>

        {/* BLOCO 1: Header do Livro */}
        <div className="mb-8">
          <CicloHeaderBlock ciclo={ciclo} />
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

          {/* Tab: Leitura — composição de blocos independentes */}
          <TabsContent value="leitura" className="mt-6 space-y-6">
            {/* BLOCO: Aulas e Encontros */}
            <AulasEncontrosBlock
              aulas={aulas || []}
              encontros={encontros || []}
              dataInicioCiclo={ciclo.data_inicio ?? undefined}
              intervaloLiberacaoDias={7}
              onAulaClick={(aulaId) => navigate(`/clube-livro/${id}/aula/${aulaId}`)}
              onEncontroClick={(encontroId) => navigate(`/clube-livro/${id}/encontros`)}
            />
            {/* BLOCO 2: Por que este livro */}
            {ciclo.por_que_este_livro && (
              <PorQueEsteLivroBlock texto={ciclo.por_que_este_livro} />
            )}

            {/* BLOCO 3: Como ler */}
            {ciclo.como_ler && (
              <ComoLerBlock texto={ciclo.como_ler} />
            )}

            {/* BLOCO 4: Fases da Leitura */}
            <FasesLeituraBlock
              fases={fases || []}
              onFaseClick={(faseId) => navigate(`/clube-livro/${id}/fase/${faseId}`)}
            />

            {/* BLOCO 5: Escuta Guiada */}
            <EscutaGuiadaBlock
              escutas={escutas || []}
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
