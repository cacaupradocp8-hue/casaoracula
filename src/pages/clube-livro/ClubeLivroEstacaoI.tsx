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

        <SectionHeader
          title={estacaoI.titulo}
          subtitle={estacaoI.subtitulo}
          icon={<span className="text-xl">{estacaoI.fase_lunar}</span>}
          className="mb-4"
        />

        {/* Capa do Livro — âncora visual */}
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
            { label: 'Jardim da Psique', icon: '🌸', to: `/jardim-psique` },
            { label: 'Jardim do Ofício', icon: '⚔️', to: `/jardim-oficio` },
          ]}
        />

      </div>
    </AppLayout>
  );
}
