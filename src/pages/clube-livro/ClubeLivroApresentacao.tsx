// ============================================
// CLUBE DO LIVRO ORACULAR - Tela de Apresentação
// Modular: cada seção é um bloco independente
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useClubeLivro, useRitualAceite } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { LockedForVisitor } from '@/components/shared/LockedForVisitor';
import { CalendarioJornadas } from '@/components/clube-livro/CalendarioJornadas';
import { BookOpen, ChevronRight, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { JornadaType, JORNADA_COR } from '@/constants/clubeLivroPortais';
// Blocos modulares independentes
import {
  ManifestoBlock,
  CicloAtualCtaBlock,
  RegrasEticasBlock,
} from '@/components/clube-livro/blocks';

const FILTROS_JORNADA: { chave: JornadaType; label: string }[] = [
  { chave: 'heroina', label: 'Heroína' },
  { chave: 'sombra', label: 'Sombra' },
  { chave: 'expressao', label: 'Expressão' },
  { chave: 'instinto', label: 'Instinto' },
  { chave: 'lideranca', label: 'Liderança' },
];

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  const { ciclos, cicloAtual, loadingCiclos } = useClubeLivro();
  const { hasAccepted } = useRitualAceite(cicloAtual?.id);
  const [filtroJornada, setFiltroJornada] = useState<JornadaType | null>(null);

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

        {/* Filtro por Jornada */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={filtroJornada === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFiltroJornada(null)}
          >
            Todas
          </Badge>
          {FILTROS_JORNADA.map((f) => {
            const cor = JORNADA_COR[f.chave];
            return (
              <Badge
                key={f.chave}
                variant="outline"
                className={cn(
                  'cursor-pointer transition-all',
                  filtroJornada === f.chave
                    ? `${cor?.corLabel} ${cor?.corBorda} bg-background`
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setFiltroJornada(filtroJornada === f.chave ? null : f.chave)}
              >
                {cor?.simbolo} {f.label}
              </Badge>
            );
          })}
        </div>

        {/* BLOCO 3: Calendário / Mapa de Travessia */}
        {loadingCiclos ? (
          <div className="flex justify-center py-16">
            <div className="animate-pulse text-muted-foreground text-sm">
              Carregando mapa de jornadas…
            </div>
          </div>
        ) : (
          <CalendarioJornadas
            ciclos={ciclos || []}
            cicloAtualId={cicloAtual?.id}
            filtroJornada={filtroJornada}
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
