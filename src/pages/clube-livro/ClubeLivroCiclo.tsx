// ============================================
// CÍRCULO DE LEITURA ORACULAR - Estrutura Interna do Livro (v4)
// Estética imersiva + 6 abas com progressão obrigatória
// ============================================

import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { useIntegracaoRecord } from '@/hooks/useIntegracaoOracular';
import { useIntegracao8020Record } from '@/hooks/useIntegracao8020';
import { useCirculoProgressao } from '@/hooks/useCirculoProgressao';
import { ReguaSimbolica } from '@/components/clube-livro/ReguaSimbolica';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  BookOpen, ChevronRight, Home, DoorOpen, Play, MessageCircle,
  Target, PenLine, Sparkles, Loader2, ArrowRight, CheckCircle2, Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CicloHeaderBlock,
  PorQueEsteLivroBlock,
  ComoLerBlock,
  AulasEncontrosBlock,
  EscutaGuiadaBlock,
  EncontrosBlock,
  EscutaSimbolticaChat,
  FasesLeituraBlock,
} from '@/components/clube-livro/blocks';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

function LockedTabContent() {
  return (
    <motion.div {...fadeInUp}>
      <Card className="border-dashed border-border/20 bg-gradient-to-br from-mystic/[0.03] to-card">
        <CardContent className="py-14 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/70 italic max-w-sm mx-auto font-display">
            Permaneça na etapa anterior. A travessia ainda está em curso.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ClubeLivroCiclo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, fases, escutas, encontros, aulas, isLoading } = useClubeCicloDetalhe(id);
  const { data: integracaoRecord } = useIntegracaoRecord(id);
  const { data: integracao8020Record } = useIntegracao8020Record(id);
  const { user } = useAuth();
  const { steps, isTabUnlocked } = useCirculoProgressao(id);
  const [activeTab, setActiveTab] = useState('portal');

  const integracaoConcluida = integracaoRecord?.status === 'concluida';
  const integracao8020Concluida = integracao8020Record?.status === 'concluida';

  const handleTabChange = (tab: string) => {
    if (isTabUnlocked(tab)) {
      setActiveTab(tab);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!ciclo) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted/30 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-display text-foreground">Livro não encontrado</h2>
          <Button variant="outline" onClick={() => navigate('/app/clube')} className="gap-2">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Voltar ao Clube
          </Button>
        </div>
      </AppLayout>
    );
  }

  const TAB_CONFIG = [
    { key: 'portal', icon: DoorOpen, label: 'Portal' },
    { key: 'travessia', icon: Play, label: 'Travessia' },
    { key: 'converse', icon: MessageCircle, label: 'Converse' },
    { key: 'lab8020', icon: Target, label: 'Lab 80/20' },
    { key: 'registros', icon: PenLine, label: 'Registros' },
    { key: 'integracao', icon: Sparkles, label: 'Integração' },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* ── Hero Section com orbs ── */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
          
          {/* Breathing orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-mystic/10 via-gold/5 to-transparent blur-3xl animate-breathe pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-gold/5 blur-2xl animate-breathe-subtle pointer-events-none" />

          <div className="relative z-10 container mx-auto px-6 max-w-4xl">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-xs text-muted-foreground/60 mb-8 flex-wrap"
            >
              <Link to="/dashboard-membro" className="hover:text-foreground/80 transition-colors flex items-center gap-1">
                <Home className="w-3 h-3" /> Casa
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/app/clube" className="hover:text-foreground/80 transition-colors">
                Clube Oracular
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/70">{ciclo.titulo}</span>
            </motion.nav>

            {/* Header do Livro — Elevated */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <CicloHeaderBlock ciclo={ciclo} />
            </motion.div>
          </div>
        </section>

        {/* ── Content Area ── */}
        <div className="container mx-auto px-6 pb-28 max-w-4xl">
          {/* Régua Simbólica */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <ReguaSimbolica
              steps={steps}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </motion.div>

          {/* ── 6 ABAS ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
              <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto gap-1.5 bg-card/50 backdrop-blur-sm border border-border/15 p-1.5 rounded-xl shadow-sm">
                {TAB_CONFIG.map(tab => {
                  const locked = !isTabUnlocked(tab.key);
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.key}
                      value={tab.key}
                      disabled={locked}
                      className={cn(
                        'text-xs gap-1.5 py-2.5 rounded-lg relative transition-all duration-300',
                        locked && 'opacity-35 cursor-not-allowed',
                        !locked && 'data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-mystic/10 data-[state=active]:shadow-sm'
                      )}
                    >
                      {locked ? (
                        <Lock className="w-3 h-3 hidden sm:block" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 hidden sm:block" />
                      )}
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* ── ABA 1: Portal do Livro ── */}
              <TabsContent value="portal" className="space-y-6">
                <motion.div {...fadeInUp} className="space-y-6">
                  {(ciclo.por_que_este_livro || (ciclo as any).por_que_slides?.length > 0) && (
                    <PorQueEsteLivroBlock
                      texto={ciclo.por_que_este_livro}
                      slides={(ciclo as any).por_que_slides || []}
                      audioUrl={(ciclo as any).por_que_audio_url}
                    />
                  )}
                  {(ciclo.como_ler || (ciclo as any).como_ler_slides?.length > 0) && (
                    <ComoLerBlock
                      texto={ciclo.como_ler}
                      slides={(ciclo as any).como_ler_slides || []}
                      audioUrl={(ciclo as any).como_ler_audio_url}
                    />
                  )}
                  {!ciclo.por_que_este_livro && !ciclo.como_ler && (
                    <Card className="border-dashed border-border/20 bg-gradient-to-br from-primary/[0.03] to-card">
                      <CardContent className="py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-mystic/10 flex items-center justify-center mx-auto mb-3">
                          <DoorOpen className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-muted-foreground text-sm font-display italic">
                          O portal deste livro será aberto em breve.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              {/* ── ABA 2: Travessia (Episódios) ── */}
              <TabsContent value="travessia" className="space-y-6">
                {isTabUnlocked('travessia') ? (
                  <motion.div {...fadeInUp} className="space-y-6">
                    <AulasEncontrosBlock
                      aulas={aulas || []}
                      encontros={encontros || []}
                      dataInicioCiclo={ciclo.data_inicio ?? undefined}
                      intervaloLiberacaoDias={7}
                      onAulaClick={(aulaId) => navigate(`/clube-livro/${id}/aula/${aulaId}`)}
                      onEncontroClick={() => navigate(`/clube-livro/${id}/encontros`)}
                    />
                    <EscutaGuiadaBlock
                      escutas={escutas || []}
                      onNavigate={() => navigate(`/clube-livro/${id}/escutas`)}
                    />
                    <EncontrosBlock
                      encontros={encontros || []}
                      onNavigate={() => navigate(`/clube-livro/${id}/encontros`)}
                    />
                  </motion.div>
                ) : (
                  <LockedTabContent />
                )}
              </TabsContent>

              {/* ── ABA 3: Converse com o Livro ── */}
              <TabsContent value="converse">
                {isTabUnlocked('converse') ? (
                  <motion.div {...fadeInUp}>
                    {ciclo.campo_simbolico ? (
                      <EscutaSimbolticaChat
                        campoSimbolico={ciclo.campo_simbolico}
                        tituloLivro={ciclo.titulo}
                        onClose={() => {}}
                      />
                    ) : (
                      <Card className="border-dashed border-border/20 bg-gradient-to-br from-mystic/[0.03] to-card">
                        <CardContent className="py-12 text-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystic/15 to-primary/10 flex items-center justify-center mx-auto mb-3">
                            <MessageCircle className="w-5 h-5 text-mystic" />
                          </div>
                          <p className="text-muted-foreground text-sm font-display italic">
                            A escuta simbólica deste livro ainda não foi ativada.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ) : (
                  <LockedTabContent />
                )}
              </TabsContent>

              {/* ── ABA 4: Laboratório 80/20 ── */}
              <TabsContent value="lab8020">
                {isTabUnlocked('lab8020') ? (
                  <motion.div {...fadeInUp}>
                    <Card className={cn(
                      'transition-all duration-300 cursor-pointer border-border/15 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5',
                      integracao8020Concluida && 'border-gold/25 bg-gradient-to-br from-gold/[0.06] to-card'
                    )}>
                      <CardContent className="p-8 text-center" onClick={() => navigate(`/clube-livro/${id}/lab-8020`)}>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-primary/10 flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Target className="w-6 h-6 text-gold" />
                        </div>
                        <h3 className="font-display text-lg text-foreground mb-2">
                          Laboratório de Integração 80/20
                        </h3>
                        <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto leading-relaxed">
                          Transforme o que leu em aplicação real — profissional, emocional e comportamental.
                        </p>
                        {integracao8020Concluida ? (
                          <div className="flex items-center justify-center gap-2 text-gold text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Integração concluída
                          </div>
                        ) : (
                          <Button className="bg-gradient-to-r from-gold to-mystic hover:from-gold/90 hover:to-mystic/90 text-primary-foreground gap-2 shadow-sm">
                            Acessar Laboratório
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <LockedTabContent />
                )}
              </TabsContent>

              {/* ── ABA 5: Registros ── */}
              <TabsContent value="registros" className="space-y-6">
                {isTabUnlocked('registros') ? (
                  <motion.div {...fadeInUp} className="space-y-6">
                    <FasesLeituraBlock
                      fases={fases || []}
                      onFaseClick={(faseId) => navigate(`/clube-livro/${id}/fase/${faseId}`)}
                    />
                    {(!fases || fases.length === 0) && (
                      <Card className="border-dashed border-border/20 bg-gradient-to-br from-primary/[0.03] to-card">
                        <CardContent className="py-12 text-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-mystic/10 flex items-center justify-center mx-auto mb-3">
                            <PenLine className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-muted-foreground text-sm font-display italic">
                            Os registros desta travessia serão abertos conforme as fases avançam.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ) : (
                  <LockedTabContent />
                )}
              </TabsContent>

              {/* ── ABA 6: Integração Final ── */}
              <TabsContent value="integracao">
                {isTabUnlocked('integracao') ? (
                  <motion.div {...fadeInUp} className="space-y-6">
                    <Card className={cn(
                      'transition-all duration-300 cursor-pointer border-border/15 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5',
                      integracaoConcluida && 'border-gold/25 bg-gradient-to-br from-gold/[0.06] to-card'
                    )}>
                      <CardContent className="p-8 text-center" onClick={() => navigate(`/clube-livro/${id}/integracao`)}>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-mystic/15 flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Sparkles className="w-6 h-6 text-gold" />
                        </div>
                        <h3 className="font-display text-lg text-foreground mb-2">
                          Integração Oracular
                        </h3>
                        <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto leading-relaxed">
                          Campo de síntese pessoal — movimentos, ritual e registro final desta travessia.
                        </p>
                        {integracaoConcluida ? (
                          <div className="flex items-center justify-center gap-2 text-gold text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Integração concluída
                          </div>
                        ) : (
                          <Button className="bg-gradient-to-r from-gold to-mystic hover:from-gold/90 hover:to-mystic/90 text-primary-foreground gap-2 shadow-sm">
                            Iniciar Integração
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {integracaoConcluida && integracao8020Concluida && (
                      <Card className="border-gold/25 bg-gradient-to-br from-gold/[0.08] via-card to-mystic/[0.04] shadow-lg shadow-gold/5">
                        <CardContent className="p-6 text-center space-y-4">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
                            <Sparkles className="w-4 h-4 text-gold/60" />
                            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
                          </div>
                          <p className="text-sm text-gold font-display italic">
                            Travessia completa — todas as integrações foram concluídas
                          </p>
                          <Button
                            variant="outline"
                            className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
                            onClick={() => navigate(`/clube-livro/${id}/certificado`)}
                          >
                            <Sparkles className="w-4 h-4" />
                            Ver Certificado de Travessia
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ) : (
                  <LockedTabContent />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
