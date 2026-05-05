import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Loader2, MapPin, Calendar, ExternalLink, ListOrdered, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { RotaEstrada } from '@/components/clube-livro/RotaEstrada';
import { RotaEntrada } from '@/components/clube-livro/RotaEntrada';
import { RotaImersao } from '@/components/clube-livro/RotaImersao';
import { RotaAplicacao } from '@/components/clube-livro/RotaAplicacao';
import { RotaLaboratorio } from '@/components/clube-livro/RotaLaboratorio';
import { MiniMandalaCidadela } from '@/components/casa-maquinas/MiniMandalaCidadela';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';
import { Laboratorio8020Card } from '@/components/clube/Laboratorio8020Card';
import { useAllBooks } from '@/hooks/useBooks';
import { FlaskConical } from 'lucide-react';
import { RotaExecutavelMes1 } from '@/components/clube-livro/RotaMês1';
import { RotaAtualHero } from '@/components/clube-livro/RotaAtualHero';

/**
 * ClubeHomePage — Rota Oracular
 * Experiência de navegação viva em formato de estrada.
 */
export function ClubeHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rotaData = useRotaOracular();
  const { data: allBooks = [] } = useAllBooks();
  
  const {
    estacaoAtual,
    estacoesPrevias,
    pontos,
    pontoAtual,
    progresso,
    encontro,
    concluirPonto,
    estacaoIncompleta,
    isLoading,
  } = rotaData || {
    estacaoAtual: null,
    estacoesPrevias: [],
    pontos: [],
    pontoAtual: undefined,
    progresso: 0,
    encontro: null,
    concluirPonto: { mutate: () => {} },
    estacaoIncompleta: false,
    isLoading: false,
  };

  const welcomeName = user?.name?.split(' ')[0] || 'Assinante';

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const matchedBook = allBooks.find(b => b.title === estacaoAtual?.livro_titulo);

  return (
    <AppLayout>
      <ResponsiveContainer size="full" className="py-8 md:py-12 px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 max-w-[1680px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
          
          {/* ============================================
              COLUNA PRINCIPAL (ESQUERDA) — 8/12
              Foco na Jornada e Hero
              ============================================ */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* INSIGHT DO PORTAL — Inspiracional */}
            <InsightPortalBlock />

            {/* HERO PREMIUM — ROTA ATUAL */}
            <RotaAtualHero
              estacao={estacaoAtual}
              pontos={pontos}
              pontoAtual={pontoAtual}
              progresso={progresso}
              welcomeName={welcomeName}
            />

            {/* Station incomplete notice */}
            {estacaoIncompleta && estacaoAtual && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-muted-foreground/75 italic py-4 border-y border-border/10"
              >
                Esta estação está sendo preparada. Em breve sua rota estará completa.
              </motion.p>
            )}

            {/* CAMADA 1: INICIAÇÃO (Destaque se no início) */}
            {(!pontoAtual || pontoAtual.ordem <= 10) && (
              <div className="space-y-8">
                {estacaoAtual?.livro_titulo?.includes("Mulheres que correm com os lobos") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-midnight/40 border border-gold/30 p-8 md:p-12 text-center space-y-8 shadow-2xl backdrop-blur-sm"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                    
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-gold/60">Manifesto de Abertura</h3>
                      
                      <div className="space-y-5 font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed italic max-w-2xl mx-auto">
                        <p>Existe uma parte da mulher que nunca aceitou totalmente a domesticação.</p>
                        <p>Mesmo silenciosa, ela continua chamando.</p>
                      </div>

                      <p className="text-sm font-medium text-gold/80 pt-2">
                        Esta estação é para aprender a escutar esse chamado.
                      </p>
                    </div>

                    <Button 
                      variant="gold" 
                      size="lg" 
                      className="w-full max-w-md mx-auto rounded-full py-7 font-bold text-lg shadow-gold group h-auto"
                      onClick={() => {
                        if (pontoAtual) {
                          navigate(pontoAtual.rota);
                        }
                      }}
                    >
                      Iniciar Travessia
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}
                <RotaEntrada />
              </div>
            )}

            {/* CAMADA 2: A ESTRADA (FLUXO SEQUENCIAL) */}
            {pontos.length > 0 && (
              <div className="space-y-16">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent pointer-events-none rounded-3xl" />
                  <RotaEstrada 
                    pontos={pontos} 
                    pontoAtual={pontoAtual} 
                    concluirPonto={(id) => concluirPonto.mutate(id)}
                    isConcluindo={concluirPonto.isPending}
                  />
                </div>

                {/* Passo Ativo em Destaque (Estilo Netflix) */}
                {pontoAtual && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-[10px] font-display uppercase tracking-[0.3em] text-gold/70">Seu Próximo Passo</h3>
                       {pontoAtual.ref_tipo && (
                         <Badge variant="outline" className="text-[9px] opacity-60 uppercase tracking-tighter border-gold/20">Tipo: {pontoAtual.ref_tipo}</Badge>
                       )}
                    </div>
                    <Card className="border-gold/30 bg-gold/5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden group">
                       <CardContent className="p-8 space-y-6">
                          <div className="flex items-start gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-3xl border border-gold/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                {pontoAtual.icone}
                             </div>
                             <div className="flex-1 space-y-1">
                                <h4 className="text-2xl md:text-3xl font-serif text-foreground/90">{pontoAtual.nome}</h4>
                                <p className="text-sm text-muted-foreground/70 tracking-wide">{pontoAtual.subtitulo || 'Atividade da jornada'}</p>
                             </div>
                          </div>

                          {pontoAtual.conteudo_inline?.texto && (
                            <div className="text-base text-foreground/80 leading-relaxed whitespace-pre-line border-l-2 border-gold/30 pl-6 py-2 italic bg-foreground/[0.02] rounded-r-lg">
                               {pontoAtual.conteudo_inline.texto}
                            </div>
                          )}

                          <Button 
                            variant="gold" 
                            className="w-full gap-3 font-bold h-14 text-lg rounded-xl shadow-lg hover:shadow-gold/20 transition-all"
                            onClick={() => navigate(pontoAtual.rota)}
                          >
                             Iniciar Agora
                             <ArrowRight className="w-5 h-5" />
                          </Button>
                       </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}

            {/* LABORATÓRIO 80/20 — MÓDULO OFICIAL (PROEMINENTE) */}
            {matchedBook && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <h3 className="text-[10px] font-display uppercase tracking-[0.4em] text-gold/60">Módulo Oficial do Clube</h3>
                </div>
                <Laboratorio8020Card
                  bookId={matchedBook.id}
                  bookTitle={matchedBook.title}
                />
              </motion.div>
            )}

            {/* RECURSOS ADICIONAIS (Mergulho Semanal) */}
            <div className="pt-8">
              <RotaImersao estacaoId={estacaoAtual?.id} />
            </div>

            {/* APLICAÇÕES (Ocultas se houver pontos na rota para focar no fluxo sequencial) */}
            {(!pontos || pontos.length === 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RotaAplicacao />
                <RotaLaboratorio
                  estacaoId={estacaoAtual?.id}
                  livroTitulo={estacaoAtual?.livro_titulo}
                />
              </div>
            )}
          </div>

          {/* ============================================
              COLUNA LATERAL (DIREITA) — 4/12
              Meta-info, Cidadela, Encontros, Histórico
              ============================================ */}
          <aside className="lg:col-span-4 space-y-10">
            
            {/* MINI CIDADELA — O Mapa da Alma */}
            {user?.id && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold px-1">
                  Sua Cartografia
                </h4>
                <div className="rounded-[2rem] border border-border/20 bg-card/40 p-1 backdrop-blur-sm overflow-hidden">
                  <MiniMandalaCidadela clienteId={user.id} />
                </div>
              </motion.div>
            )}

            {/* ENCONTRO AO VIVO */}
            {encontro && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-gold/30 bg-midnight/40 backdrop-blur-md overflow-hidden group">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold/60" />
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70 font-bold">
                          Círculo ao vivo
                        </p>
                      </div>
                      <Badge variant="outline" className="animate-pulse border-gold/40 text-gold text-[8px] uppercase">Próximo</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif text-foreground/90 leading-tight group-hover:text-gold transition-colors">{encontro.titulo}</h3>
                      {encontro.data_encontro && (
                        <div className="space-y-1">
                          <p className="text-sm text-foreground/80 font-medium">
                            {new Date(encontro.data_encontro).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Às {new Date(encontro.data_encontro).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} (Horário de Brasília)
                          </p>
                        </div>
                      )}
                    </div>

                    {encontro.link_ao_vivo && (
                      <Button
                        variant="gold"
                        size="sm"
                        className="w-full gap-2 font-bold shadow-md"
                        onClick={() => window.open(encontro.link_ao_vivo!, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Acessar Transmissão
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* LABORATÓRIO 80/20 QUICK ACCESS */}
            {matchedBook && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Laboratorio8020Modal
                  bookId={matchedBook.id}
                  bookTitle={matchedBook.title}
                  trigger={
                    <button className="w-full flex items-center justify-between p-5 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 text-gold">
                          <FlaskConical className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-gold/70 font-bold">Essência</p>
                          <p className="text-sm font-medium text-foreground/90">Laboratório 80/20</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gold/40 group-hover:translate-x-1 transition-transform" />
                    </button>
                  }
                />
              </motion.div>
            )}

            {/* ESTAÇÕES ANTERIORES (PORTAIS) */}
            {estacoesPrevias.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold px-1">
                  Portais Atravessados
                </h4>
                <div className="space-y-2">
                  {estacoesPrevias.slice(0, 3).map(est => (
                    <button
                      key={est.id}
                      onClick={() => navigate(`/clube-livro/porta/${est.id}`)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-border/10 hover:border-gold/30 bg-card/30 hover:bg-card/50 transition-all text-left group"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-gold/70 uppercase tracking-wider mb-0.5">
                          Estação {est.numero}
                        </p>
                        <p className="text-sm text-foreground/80 truncate font-serif italic">{est.livro_titulo}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-gold transition-colors shrink-0" />
                    </button>
                  ))}
                  
                  {estacoesPrevias.length > 3 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-gold"
                      onClick={() => navigate('/clube/rotas')}
                    >
                      Ver Histórico Completo
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </aside>
        </div>
      </ResponsiveContainer>
    </AppLayout>
  );
}
