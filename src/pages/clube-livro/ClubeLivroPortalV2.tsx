// ============================================
// PORTAL — Página com 8 Blocos de Conteúdo
// ============================================

import { useParams, Link, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home, ChevronRight, Lightbulb, Brain, User, Briefcase, Flower2, Sword, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPortal, getJornada, ESTACAO_PILOTO } from '@/data/clubeLivroData';
import { GuardiaIntegracao8020Chat } from '@/components/clube-livro/GuardiaIntegracao8020Chat';
import { EscutaSimbolticaChat } from '@/components/clube-livro/blocks/EscutaSimbolticaChat';

const BLOCOS_CONFIG = [
  { key: 'textoSimbolico', label: 'Texto Simbólico', icon: Lightbulb, cor: 'text-amber-400' },
  { key: 'essencia8020', label: 'Essência 80/20', icon: FlaskConical, cor: 'text-emerald-400' },
  { key: 'raizPsiquica', label: 'Raiz Psíquica', icon: Brain, cor: 'text-violet-400' },
  { key: 'aplicacaoPessoal', label: 'Aplicação Pessoal', icon: User, cor: 'text-sky-400' },
  { key: 'aplicacaoProfissional', label: 'Aplicação Profissional', icon: Briefcase, cor: 'text-teal-400' },
  { key: 'jardimPsique', label: 'Jardim da Psique', icon: Flower2, cor: 'text-pink-400' },
  { key: 'jardimHeroina', label: 'Jardim da Heroína', icon: Sword, cor: 'text-orange-400' },
  { key: 'laboratorio8020', label: 'Laboratório 80/20', icon: FlaskConical, cor: 'text-emerald-400' },
] as const;

export default function ClubeLivroPortalV2() {
  const { portalSlug } = useParams<{ portalSlug: string }>();
  const portal = getPortal(portalSlug || '');

  if (!portal) return <Navigate to="/clube-livro/estacao" replace />;

  const jornada = getJornada(portal.jornadaSlug);

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

        <SectionHeader
          title={`${portal.icone} ${portal.nome}`}
          subtitle={portal.subtitulo}
          className="mb-2"
        />

        {jornada && (
          <p className="text-xs text-muted-foreground mb-8">
            {jornada.icone} {jornada.nome} · {jornada.subtitulo}
          </p>
        )}

        {/* 8 Blocos de conteúdo */}
        <div className="space-y-4">
          {BLOCOS_CONFIG.map((bloco, i) => {
            const Icon = bloco.icon;
            const conteudo = portal.conteudo[bloco.key as keyof typeof portal.conteudo];

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
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {conteudo}
                    </p>
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
            campoSimbolico={portal.conteudo.textoSimbolico}
            tituloLivro={ESTACAO_PILOTO.livroTitulo}
          />

          <GuardiaIntegracao8020Chat
            cicloTitulo={ESTACAO_PILOTO.livroTitulo}
          />
        </div>
      </div>
    </AppLayout>
  );
}
