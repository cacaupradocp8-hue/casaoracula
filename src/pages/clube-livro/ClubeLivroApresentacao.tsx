// ============================================
// CLUBE DO LIVRO ORACULAR - Tela de Apresentação
// Modular: cada seção é um bloco independente
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useClubeLivro, useRitualAceite } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { LockedForVisitor } from '@/components/shared/LockedForVisitor';
import { MandalaAnual } from '@/components/clube-livro/MandalaAnual';
import { BookOpen, ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
// Blocos modulares independentes
import {
  ManifestoBlock,
  CicloAtualCtaBlock,
  RegrasEticasBlock,
} from '@/components/clube-livro/blocks';

// Filtros removidos — mandala anual organiza por quadrantes simbólicos

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  const { ciclos, cicloAtual, loadingCiclos } = useClubeLivro();
  const { hasAccepted } = useRitualAceite(cicloAtual?.id);
  // Mandala anual não usa filtro por jornada

  const hasAccess = user && canAccessFeature(user.portal, 'aluna') && !isExpired;

  if (!hasAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <SectionHeader
            title="Círculo de Leitura Oracular"
            subtitle="Este espaço é exclusivo para alunas e assinantes."
            icon={<BookOpen className="w-5 h-5" />}
          />
          <LockedForVisitor />
        </div>
      </AppLayout>
    );
  }

  const handleEnterCycle = () => {
    if (!cicloAtual) return;
    if (cicloAtual.ritual_aceite_obrigatorio !== false && !hasAccepted) {
      navigate(`/clube-livro/${cicloAtual.id}/ritual`);
    } else {
      navigate(`/clube-livro/${cicloAtual.id}`);
    }
  };

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
          <Link to="/biblioteca" className="hover:text-foreground transition-colors">
            Biblioteca
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Círculo de Leitura Oracular</span>
        </nav>

        <SectionHeader
          title="Círculo de Leitura Oracular"
          subtitle="Território de leitura viva e atravessamento simbólico."
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* BLOCO 1: Manifesto */}
        <div className="mb-8">
          <ManifestoBlock manifesto={cicloAtual?.manifesto || ''} />
        </div>

        {/* BLOCO 2: Ciclo atual CTA */}
        {!loadingCiclos && cicloAtual && (
          <div className="mb-10">
            <CicloAtualCtaBlock ciclo={cicloAtual} onEnter={handleEnterCycle} />
          </div>
        )}

        {/* BLOCO 3: Mandala Anual */}
        {loadingCiclos ? (
          <div className="flex justify-center py-16">
            <div className="animate-pulse text-muted-foreground text-sm">
              Carregando mapa de jornadas…
            </div>
          </div>
        ) : (
          <MandalaAnual
            ciclos={ciclos || []}
            cicloAtualId={cicloAtual?.id}
          />
        )}

        {/* BLOCO 4: Regras Éticas */}
        <div className="mt-10">
          <RegrasEticasBlock />
        </div>
      </div>
    </AppLayout>
  );
}
