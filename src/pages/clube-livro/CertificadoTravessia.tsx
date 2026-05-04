// ============================================
// CÍRCULO DE LEITURA ORACULAR — Certificado de Travessia
// Gerado simbolicamente ao completar todas as integrações do ciclo
// ============================================

import { useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { useIntegracaoRecord } from '@/hooks/useIntegracaoOracular';
import { useIntegracao8020Record } from '@/hooks/useIntegracao8020';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen, ChevronRight, Home, Award, ArrowLeft, Download, Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function CertificadoTravessia() {
  const { id: cicloId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ciclo, isLoading } = useClubeCicloDetalhe(cicloId);
  const { data: integracaoRecord } = useIntegracaoRecord(cicloId);
  const { data: integracao8020Record } = useIntegracao8020Record(cicloId);
  const certificadoRef = useRef<HTMLDivElement>(null);

  const integracaoConcluida = integracaoRecord?.status === 'concluida';
  const integracao8020Concluida = integracao8020Record?.status === 'concluida';
  const travessiaCompleta = integracaoConcluida && integracao8020Concluida;

  const dataIntegracao = integracaoRecord?.updated_at
    ? new Date(integracaoRecord.updated_at)
    : new Date();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!ciclo) {
    return (
      <AppLayout>
        <ResponsiveContainer size="narrow" className="py-8 pb-20 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Livro não encontrado</h2>
          <Button variant="outline" onClick={() => navigate('/clube-livro')}>
            Voltar ao Círculo
          </Button>
        </ResponsiveContainer>
      </AppLayout>
    );
  }

  if (!travessiaCompleta) {
    return (
      <AppLayout>
        <ResponsiveContainer size="narrow" className="py-8 pb-20 text-center">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Travessia ainda em curso</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Complete a Integração Oracular e o Laboratório 80/20 para desbloquear
            seu certificado simbólico de travessia.
          </p>
          <Button variant="outline" onClick={() => navigate(`/clube-livro/${cicloId}`)}>
            Voltar ao Livro
          </Button>
        </ResponsiveContainer>
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
          <Link to={`/clube-livro/${cicloId}`} className="hover:text-foreground transition-colors">
            {ciclo.titulo}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Certificado</span>
        </nav>

        {/* Certificado Visual */}
        <div
          ref={certificadoRef}
          className="relative overflow-hidden rounded-2xl border-2 border-gold/30 bg-gradient-to-br from-card via-gold/5 to-card p-8 sm:p-12 text-center"
        >
          {/* Decoração simbólica */}
          <div className="absolute top-4 left-4 text-gold/10 text-6xl font-display select-none">◈</div>
          <div className="absolute bottom-4 right-4 text-gold/10 text-6xl font-display select-none">◎</div>

          {/* Conteúdo */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
                Casa Orácula
              </span>
              <Sparkles className="w-5 h-5 text-gold" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-display text-foreground">
                Certificado de Travessia
              </h1>
              <p className="text-sm text-muted-foreground">
                Círculo de Leitura Oracular
              </p>
            </div>

            <div className="w-16 h-px bg-gold/30 mx-auto" />

            {/* Capa do livro */}
            {ciclo.capa_url && (
              <div className="flex justify-center">
                <img
                  src={ciclo.capa_url}
                  alt={ciclo.titulo}
                  className="w-20 h-28 object-cover rounded-md shadow-lg border border-gold/20"
                />
              </div>
            )}

            <div className="space-y-2 max-w-md mx-auto">
              <p className="text-base text-muted-foreground">
                Atesta que
              </p>
              <p className="text-xl font-display text-foreground">
                {user?.name || user?.email || 'Aluna'}
              </p>
              <p className="text-sm text-muted-foreground">
                completou a travessia simbólica pelo livro
              </p>
              <p className="text-lg font-display text-gold italic">
                {ciclo.titulo}
              </p>
              {ciclo.autor_livro && (
                <p className="text-sm text-muted-foreground">
                  de {ciclo.autor_livro}
                </p>
              )}
            </div>

            <div className="w-16 h-px bg-gold/30 mx-auto" />

            {/* Carga horária */}
            {(() => {
              const ch = ((ciclo as any).carga_horaria_base || 20) + ((ciclo as any).carga_horaria_ajuste || 0);
              return (
                <p className="text-sm text-foreground font-medium">
                  Carga horária: {ch}h
                </p>
              );
            })()}

            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Componentes: Episódios de Escuta ✦ Laboratório 80/20 ✦ Integração Oracular ✦ Encontro ao Vivo</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Integrações concluídas: Oracular ✦ Laboratório 80/20
              </p>
              <p className="text-xs text-muted-foreground">
                {format(dataIntegracao, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            {/* Selo */}
            <div className="pt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-gold/30 bg-gold/10">
                <Award className="w-8 h-8 text-gold" />
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/clube-livro/${cicloId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Livro
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
