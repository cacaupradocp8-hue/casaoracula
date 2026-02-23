// ============================================
// CLUBE DO LIVRO ORACULAR — Página de Entrada
// Redesign: legibilidade, silêncio visual, ordem
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEstacoes } from '@/hooks/useEstacoes';
import { useAllPortais } from '@/hooks/useClubeLivro';
import { useStationProgress, useStationPortalProgress, deriveStationStatus, STATUS_CONFIG } from '@/hooks/useProgress';
import { ProgressIndicator } from '@/components/clube-livro/ProgressIndicator';

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: estacoes } = useEstacoes();
  const estacaoI = estacoes?.find(e => e.numero === 1);
  const { data: allData } = useAllPortais(estacaoI?.id);

  const isVisitor = !user || user.portal === 'visitante';
  const jornadas = allData?.jornadas || [];
  const portais = allData?.portais || [];
  const portalIds = portais.map(p => p.id);
  const { data: portalProgress } = useStationPortalProgress(estacaoI?.id, portalIds);

  // Derive station status from portal progress
  const stationStatus = deriveStationStatus(portalProgress || [], portais.length);

  // Find next suggested portal (first non-integrado)
  const progressMap = new Map((portalProgress || []).map(pp => [pp.portal_id, pp]));
  const nextPortal = portais.find(p => {
    const pp = progressMap.get(p.id);
    return !pp || pp.state !== 'integrado';
  }) || portais[0];

  return (
    <AppLayout>
      <div className="min-h-[80dvh] flex flex-col justify-center">
        <div className="container mx-auto px-6 py-12 pb-20 max-w-[620px]">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
            <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Casa
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Clube do Livro</span>
          </nav>

          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
              Clube do Livro Oracular
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Leitura como travessia. Aplicação como responsabilidade.
            </p>
          </motion.div>

          {/* Bloco: Onde você está */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-14"
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Onde você está
            </h2>
            <div className="space-y-5">
              {/* Estação */}
              <div className="border-l-2 border-primary/40 pl-5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-muted-foreground">Estação atual</p>
                  <ProgressIndicator status={stationStatus} />
                </div>
                <p className="text-base font-medium text-foreground">
                  {estacaoI?.fase_lunar} {estacaoI?.titulo || 'Estação I'}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {estacaoI?.livro_titulo} — {estacaoI?.livro_autor}
                </p>
              </div>

              {/* Jornadas */}
              <div className="border-l-2 border-muted pl-5">
                <p className="text-sm text-muted-foreground mb-1">Jornadas disponíveis</p>
                {jornadas.map(j => (
                  <p key={j.id} className="text-base text-foreground">
                    {j.icone} {j.nome}
                  </p>
                ))}
                {jornadas.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">Carregando…</p>
                )}
              </div>

              {/* Próximo portal */}
              {nextPortal && (
                <div className="border-l-2 border-muted pl-5">
                  <p className="text-sm text-muted-foreground mb-1">Próximo portal sugerido</p>
                  <p className="text-base font-medium text-foreground">
                    {nextPortal.icone} {nextPortal.nome}
                  </p>
                  <p className="text-sm text-muted-foreground">{nextPortal.subtitulo}</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Bloco: Como funciona */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-14"
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Como funciona
            </h2>
            <div className="space-y-3">
              <p className="text-base text-foreground leading-relaxed">Você atravessa ciclos de leitura.</p>
              <p className="text-base text-foreground leading-relaxed">Cada leitura vira prática.</p>
              <p className="text-base text-foreground leading-relaxed">O avanço acontece por integração.</p>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              className="w-full h-14 text-base gap-2"
              onClick={() => navigate('/clube-livro/estacao')}
            >
              Entrar na Estação Atual
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {isVisitor && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-muted-foreground mt-8"
            >
              Visitantes podem ver a página institucional.
              <br />Para acessar Jornadas e Portais, é necessário ser assinante.
            </motion.p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
