// ============================================
// CÍRCULO DE LEITURA ORACULAR - Home Simplificada
// Modelo: Travessia Atual + Régua + Navegação mínima
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useClubeLivro, useRitualAceite } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { LockedForVisitor } from '@/components/shared/LockedForVisitor';
import { useCirculoProgressao } from '@/hooks/useCirculoProgressao';
import { ReguaSimbolica } from '@/components/clube-livro/ReguaSimbolica';
import { BookOpen, ChevronRight, Home, Map, Route, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSeasonForBook } from '@/hooks/useOracularSeasons';

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  const { cicloAtual, loadingCiclos } = useClubeLivro();
  const { hasAccepted } = useRitualAceite(cicloAtual?.id);
  const seasonAtual = useSeasonForBook(cicloAtual?.id);
  const { steps } = useCirculoProgressao(cicloAtual?.id);
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
          <span className="text-foreground">Círculo de Leitura Oracular</span>
        </nav>

        <SectionHeader
          title="Círculo de Leitura Oracular"
          subtitle="Território de leitura viva e atravessamento simbólico."
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-10"
        />

        {loadingCiclos ? (
          <div className="flex justify-center py-16">
            <div className="animate-pulse text-muted-foreground text-sm">Carregando…</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* ── 1. TRAVESSIA EM CURSO ── */}
            {cicloAtual ? (
              <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-card overflow-hidden">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-1">
                    Travessia em Curso
                  </p>
                  {seasonAtual && (
                    <Badge variant="outline" className="text-xs text-muted-foreground border-border/50 mb-3">
                      {seasonAtual.simbolo && <span className="mr-1">{seasonAtual.simbolo}</span>}
                      {seasonAtual.nome_estacao}
                      {seasonAtual.periodo && <span className="ml-1 text-muted-foreground/60">· {seasonAtual.periodo}</span>}
                    </Badge>
                  )}
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {cicloAtual.capa_url ? (
                      <img
                        src={cicloAtual.capa_url}
                        alt={cicloAtual.titulo}
                        className="w-28 h-40 object-cover rounded-md shadow-lg shrink-0"
                      />
                    ) : (
                      <div className="w-28 h-40 bg-muted rounded-md flex items-center justify-center shrink-0">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <h2 className="font-display text-xl text-foreground leading-snug">
                        {cicloAtual.titulo}
                      </h2>
                      {cicloAtual.autor_livro && (
                        <p className="text-sm text-muted-foreground italic">
                          {cicloAtual.autor_livro}
                        </p>
                      )}
                      {cicloAtual.manifesto && (
                        <p className="text-sm text-muted-foreground/80 line-clamp-2 max-w-md">
                          {cicloAtual.manifesto}
                        </p>
                      )}
                      <Button
                        onClick={handleEnterCycle}
                        className="mt-3 bg-gold hover:bg-gold/90 text-primary-foreground"
                      >
                        Entrar na Travessia
                      </Button>
                    </div>
                  </div>

                  {/* ── 2. RÉGUA SIMBÓLICA ── */}
                  <div className="mt-6 pt-4 border-t border-border/20">
                    <ReguaSimbolica
                      steps={steps}
                      activeTab=""
                      onTabChange={() => handleEnterCycle()}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-border/30">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Nenhuma travessia em curso neste momento.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* ── 3. NAVEGAÇÃO ESSENCIAL ── */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2"
                onClick={() => navigate('/clube-livro/ano-oracular')}
              >
                <Sparkles className="w-4 h-4" />
                Mapa do Ano Oracular
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2"
                onClick={() => navigate('/clube-livro/minha-travessia')}
              >
                <Route className="w-4 h-4" />
                Minha Travessia
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
