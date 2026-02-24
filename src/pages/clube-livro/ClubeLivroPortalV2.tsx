// ============================================
// PORTAL — Página com 8 Blocos (lê do banco)
// ============================================

import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home, ChevronRight, Lightbulb, Brain, User, Briefcase, Flower2, Sword, FlaskConical, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { usePortalBySlug, useJornadas, type ClubePortal } from '@/hooks/useClubeLivro';
import { useEstacoes } from '@/hooks/useEstacoes';
import { useAuth } from '@/contexts/AuthContext';
import { GuardiaIntegracao8020Chat } from '@/components/clube-livro/GuardiaIntegracao8020Chat';
import { EscutaSimbolticaChat } from '@/components/clube-livro/blocks/EscutaSimbolticaChat';
import { useUpdatePortalProgress } from '@/hooks/useProgress';
import { ProgressIndicator } from '@/components/clube-livro/ProgressIndicator';
import { useStationPortalProgress } from '@/hooks/useProgress';

const BLOCOS_CONFIG: { key: keyof Pick<ClubePortal, 'texto_simbolico' | 'essencia_8020' | 'raiz_psiquica' | 'aplicacao_pessoal' | 'aplicacao_profissional' | 'jardim_psique' | 'jardim_heroina' | 'laboratorio_8020'>; label: string; icon: React.ElementType; cor: string }[] = [
  { key: 'texto_simbolico', label: 'Texto Simbólico', icon: Lightbulb, cor: 'text-amber-400' },
  { key: 'essencia_8020', label: 'Essência 80/20', icon: FlaskConical, cor: 'text-emerald-400' },
  { key: 'raiz_psiquica', label: 'Raiz Psíquica', icon: Brain, cor: 'text-violet-400' },
  { key: 'aplicacao_pessoal', label: 'Aplicação Pessoal', icon: User, cor: 'text-sky-400' },
  { key: 'aplicacao_profissional', label: 'Aplicação Profissional', icon: Briefcase, cor: 'text-teal-400' },
  { key: 'jardim_psique', label: 'Jardim da Psique', icon: Flower2, cor: 'text-pink-400' },
  { key: 'jardim_heroina', label: 'Jardim do Ofício', icon: Sword, cor: 'text-orange-400' },
  { key: 'laboratorio_8020', label: 'Laboratório 80/20', icon: FlaskConical, cor: 'text-emerald-400' },
];

function RenderContent({ html }: { html: string | null }) {
  if (!html) return <p className="text-sm text-muted-foreground italic">Sem conteúdo.</p>;

  // Check if content has HTML tags
  const hasHtml = /<[a-z][\s\S]*>/i.test(html);

  if (!hasHtml) {
    return <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{html}</p>;
  }

  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'span'],
    ALLOWED_ATTR: ['class'],
  });

  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export default function ClubeLivroPortalV2() {
  const { portalSlug } = useParams<{ portalSlug: string }>();
  const { data: portal, isLoading } = usePortalBySlug(portalSlug);
  const { data: estacoes } = useEstacoes();
  const estacaoI = estacoes?.find(e => e.numero === 1);
  const { user } = useAuth();
  const updateProgress = useUpdatePortalProgress();
  const { data: portalProgress } = useStationPortalProgress(estacaoI?.id, portal ? [portal.id] : []);
  const currentState = portalProgress?.[0]?.state || 'nao_iniciado';

  // Mark portal as em_andamento on first visit
  useEffect(() => {
    if (portal?.id && user?.id && currentState === 'nao_iniciado') {
      updateProgress.mutate({ portal_id: portal.id, state: 'em_andamento' });
    }
  }, [portal?.id, user?.id, currentState]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!portal) return <Navigate to="/clube-livro/estacao" replace />;

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
            Clube
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro/estacao" className="hover:text-foreground transition-colors">
            Estação I
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{portal.nome}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title={`${portal.icone} ${portal.nome}`}
            subtitle={portal.subtitulo || ''}
          />
          <ProgressIndicator status={currentState as any} size="md" />
        </div>

        {/* 8 Blocos de conteúdo */}
        <div className="space-y-4">
          {BLOCOS_CONFIG.map((bloco, i) => {
            const Icon = bloco.icon;
            const conteudo = portal[bloco.key];

            return (
              <motion.div
                key={bloco.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${bloco.cor}`} />
                      {bloco.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RenderContent html={conteudo} />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Módulos de IA preservados */}
        <Separator className="my-8" />

        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-foreground">Converse com o Livro</h3>

          <EscutaSimbolticaChat
            campoSimbolico={portal.texto_simbolico || ''}
            tituloLivro={estacaoI?.livro_titulo || 'Mulheres que Correm com os Lobos'}
          />

          <GuardiaIntegracao8020Chat
            cicloTitulo={estacaoI?.livro_titulo || 'Mulheres que Correm com os Lobos'}
          />
        </div>
      </div>
    </AppLayout>
  );
}
