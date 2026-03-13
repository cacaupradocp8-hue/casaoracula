import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { useClubeConteudoSemanal, useClubeReflexoes, useClubeEngajamento, useClubeProximoEncontro } from '@/hooks/useClubeOracular';
import { useAuth } from '@/contexts/AuthContext';
import { ClubeBannerCicloAtual } from '@/components/clube-oracular/ClubeBannerCicloAtual';
import { ClubeConteudoSemanal } from '@/components/clube-oracular/ClubeConteudoSemanal';
import { ClubeProximoEncontro } from '@/components/clube-oracular/ClubeProximoEncontro';
import { ClubeProgressoTravessia } from '@/components/clube-oracular/ClubeProgressoTravessia';
import { ClubeBlocoProgressao } from '@/components/clube-oracular/ClubeBlocoProgressao';
import { BookOpen, Loader2 } from 'lucide-react';

export default function ClubeOracular() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cicloAtual, loadingCiclos } = useClubeLivro();
  const { data: conteudoSemanal } = useClubeConteudoSemanal(cicloAtual?.id);
  const { reflexoes, salvarReflexao } = useClubeReflexoes(cicloAtual?.id);
  const { engajamento } = useClubeEngajamento(cicloAtual?.id);
  const { data: proximoEncontro } = useClubeProximoEncontro(cicloAtual?.id);

  if (loadingCiclos) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium">
              Clube de Leitura Oracular
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Sua Jornada Começa Aqui
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Território de leitura viva, reflexão e atravessamento simbólico.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Banner do Ciclo Atual */}
            <ClubeBannerCicloAtual
              ciclo={cicloAtual}
              onAcessar={() => cicloAtual && navigate(`/clube-livro/${cicloAtual.id}`)}
            />

            {/* Conteúdo Semanal */}
            <ClubeConteudoSemanal
              conteudo={conteudoSemanal}
              onSalvarReflexao={(texto) =>
                salvarReflexao.mutate({ texto, conteudoSemanalId: conteudoSemanal?.id })
              }
              salvando={salvarReflexao.isPending}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Próximo Encontro */}
            <ClubeProximoEncontro encontro={proximoEncontro} />

            {/* Progresso */}
            <ClubeProgressoTravessia
              progresso={engajamento?.progresso ?? 0}
              totalTerritorios={4}
              explorados={Math.round((engajamento?.progresso ?? 0) * 4)}
            />

            {/* Bloco de Progressão */}
            <ClubeBlocoProgressao
              portal={user?.portal}
              engajamento={engajamento?.nivel ?? 'baixo'}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
