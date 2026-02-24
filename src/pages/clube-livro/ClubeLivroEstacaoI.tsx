// ============================================
// ESTAÇÃO I — Lê do banco de dados
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ChevronRight, Home, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { JourneyMediaDisplay } from '@/components/clube-livro/JourneyMediaDisplay';
import { BookCoverDisplay } from '@/components/clube-livro/BookCoverDisplay';
import { EstacaoAudioSection } from '@/components/audio/EstacaoAudioSection';
import { TravessiaEstacaoBlock } from '@/components/clube-livro/TravessiaEstacaoBlock';
import { ProgressIndicator } from '@/components/clube-livro/ProgressIndicator';
import { useEstacoes } from '@/hooks/useEstacoes';
import { useAllPortais } from '@/hooks/useClubeLivro';
import { useStationPortalProgress, STATUS_CONFIG } from '@/hooks/useProgress';

export default function ClubeLivroEstacaoI() {
  const navigate = useNavigate();
  const { data: estacoes, isLoading: le } = useEstacoes();
  const estacaoI = estacoes?.find(e => e.numero === 1);
  const { data: allData, isLoading: lp } = useAllPortais(estacaoI?.id);

  if (le || lp) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!estacaoI || !allData) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Estação não encontrada.</p>
        </div>
      </AppLayout>
    );
  }

  const { jornadas, portais } = allData;
  const portalIds = portais.map(p => p.id);
  const { data: portalProgress } = useStationPortalProgress(estacaoI?.id, portalIds);
  const progressList = portalProgress || [];
  const progressMap = new Map(progressList.map(pp => [pp.portal_id, pp]));

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
            Clube do Livro
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Estação I</span>
        </nav>

        {/* Layout: Capa à esquerda + Info da Estação à direita */}
        <Card className="overflow-hidden mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Capa à esquerda */}
              <div className="shrink-0 w-36 sm:w-44 aspect-[2/3] self-center sm:self-start">
                <BookCoverDisplay
                  capaUrl={estacaoI.livro_capa_url}
                  titulo={estacaoI.livro_titulo}
                  autor={estacaoI.livro_autor}
                  navLinks={[
                    ...jornadas.map(j => ({
                      label: j.nome,
                      icon: j.icone || '📖',
                      to: `/clube-livro/portal/${portais.find(p => p.jornada_id === j.id)?.slug || ''}`,
                    })),
                    { label: 'Álbum de Áudio', icon: '🎧', to: `/clube-livro/estacao/1/audio` },
                    { label: '80-20', icon: '🎯', to: `/clube-livro/estacao/1/80-20` },
                    { label: 'Fale com o Livro', icon: '💬', to: `/clube-livro/estacao/1/fale-com-livro` },
                    { label: 'Romper', icon: '🔥', to: `/clube-livro/estacao/1/romper` },
                    { label: 'Jardim da Psique', icon: '🌸', to: `/jardim-psique` },
                    { label: 'Jardim do Ofício', icon: '⚔️', to: `/jardim-oficio` },
                  ]}
                  layout="compact"
                />
              </div>

              {/* Info da Estação à direita */}
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-2xl mb-1">{estacaoI.fase_lunar}</span>
                <h1 className="text-lg font-bold text-foreground">{estacaoI.titulo}</h1>
                <p className="text-sm text-muted-foreground mt-1">{estacaoI.subtitulo}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-foreground">{estacaoI.livro_titulo}</p>
                  {estacaoI.livro_autor && (
                    <p className="text-xs text-muted-foreground">{estacaoI.livro_autor}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
