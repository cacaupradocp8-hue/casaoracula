import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Loader2, MapPin, Calendar, ExternalLink, ListOrdered } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
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
      <div className="container mx-auto px-4 py-8 max-w-lg space-y-10">

        {/* ============================================
            HERO PREMIUM — ROTA ATUAL (Netflix + Apple + Jung)
            ============================================ */}
        <RotaAtualHero
          estacao={estacaoAtual}
          pontos={pontos}
          pontoAtual={pontoAtual}
          progresso={progresso}
          welcomeName={welcomeName}
        />

        {/* Atalho Laboratório 80/20 (mantido como utilidade) */}
        {matchedBook && (
          <div className="flex justify-center -mt-4">
            <Laboratorio8020Modal
              bookId={matchedBook.id}
              bookTitle={matchedBook.title}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-[10px] gap-1.5 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-bold"
                >
                  <FlaskConical className="w-3 h-3" />
                  Ver Laboratório 80/20
                </Button>
              }
            />
          </div>
        )}

        {/* Station incomplete notice */}
        {estacaoIncompleta && estacaoAtual && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-muted-foreground/40 italic"
          >
            Esta estação está sendo preparada. Em breve sua rota estará completa.
          </motion.p>
        )}

        {/* ============================================
            3. CAMADA 1: INICIAÇÃO (Destaque se no início)
            ============================================ */}
        {(!pontoAtual || pontoAtual.ordem <= 10) && (
          <div className="space-y-6">
            {estacaoAtual?.livro_titulo?.includes("Mulheres que correm com os lobos") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-[#0F0D15] border border-primary/20 p-8 text-center space-y-6 shadow-2xl"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60">Manifesto de Abertura</h3>
                  
                  <div className="space-y-4 font-serif text-lg md:text-xl text-foreground/90 leading-relaxed italic">
                    <p>Existe uma parte da mulher que nunca aceitou totalmente a domesticação.</p>
                    <p>Mesmo silenciosa, ela continua chamando.</p>
                    <p>Às vezes como cansaço.</p>
                    <p>Às vezes como tristeza.</p>
                    <p>Às vezes como desejo de sumir… ou de começar de novo.</p>
                  </div>

                  <p className="text-sm font-medium text-primary pt-2">
                    Esta estação é para aprender a escutar esse chamado.
                  </p>
                </div>

                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full rounded-full py-7 font-bold text-lg shadow-gold group"
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

        {/* ============================================
            4. CAMADA 2: A ESTRADA (FLUXO SEQUENCIAL)
            ============================================ */}
        {pontos.length > 0 && (
          <div className="space-y-12">
            <RotaEstrada 
              pontos={pontos} 
              pontoAtual={pontoAtual} 
              concluirPonto={(id) => concluirPonto.mutate(id)}
              isConcluindo={concluirPonto.isPending}
            />

            {/* Passo Ativo em Destaque (Estilo Netflix) */}
            {pontoAtual && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-display uppercase tracking-widest text-primary">Seu Próximo Passo</h3>
                   {pontoAtual.ref_tipo && (
                     <Badge variant="outline" className="text-[8px] opacity-40 uppercase tracking-tighter">Tipo: {pontoAtual.ref_tipo}</Badge>
                   )}
                </div>
                <Card className="border-gold/30 bg-gold/5 shadow-[0_0_30px_rgba(201,169,110,0.05)]">
                   <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl border border-gold/20">
                            {pontoAtual.icone}
                         </div>
                         <div className="flex-1">
                            <h4 className="text-xl font-serif text-foreground">{pontoAtual.nome}</h4>
                            <p className="text-xs text-muted-foreground">{pontoAtual.subtitulo || 'Atividade da jornada'}</p>
                         </div>
                      </div>

                      {pontoAtual.conteudo_inline?.texto && (
                        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line border-l-2 border-primary/20 pl-4 py-1 italic">
                           {pontoAtual.conteudo_inline.texto}
                        </div>
                      )}

                      <Button 
                        variant="gold" 
                        className="w-full gap-2 font-bold h-12"
                        onClick={() => navigate(pontoAtual.rota)}
                      >
                         Iniciar Agora
                         <ArrowRight className="w-4 h-4" />
                      </Button>
                   </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================
            5. APOIO E RECURSOS (Mergulho Semanal)
            ============================================ */}
        <RotaImersao estacaoId={estacaoAtual?.id} />

        {/* 6. APLICAÇÕES (Ocultas se houver pontos na rota para focar no fluxo sequencial) */}
        {(!pontos || pontos.length === 0) && (
          <>
            <RotaAplicacao />
            <RotaLaboratorio
              estacaoId={estacaoAtual?.id}
              livroTitulo={estacaoAtual?.livro_titulo}
            />
          </>
        )}

        {/* ============================================
            5. MINI CIDADELA
            ============================================ */}
        {user?.id && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium text-center">
              Seu mapa agora
            </p>
            <MiniMandalaCidadela clienteId={user.id} />
          </motion.div>
        )}

        {/* ============================================
            6. ENCONTRO AO VIVO
            ============================================ */}
        {encontro && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-primary/10 bg-card/30">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary/60" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">
                    Encontro ao vivo
                  </p>
                </div>
                <h3 className="text-sm font-medium text-foreground">{encontro.titulo}</h3>
                {encontro.data_encontro && (
                  <p className="text-xs text-muted-foreground/60">
                    {new Date(encontro.data_encontro).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                    {' · '}
                    {new Date(encontro.data_encontro).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                {encontro.link_ao_vivo && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
                    onClick={() => window.open(encontro.link_ao_vivo!, '_blank')}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Entrar no encontro
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ============================================
            Estações anteriores (discreto)
            ============================================ */}
        {estacoesPrevias.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3 pt-4"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 font-medium text-center">
              Portais anteriores
            </p>
            <div className="space-y-1.5">
              {estacoesPrevias.map(est => (
                <button
                  key={est.id}
                  onClick={() => navigate(`/clube-livro/porta/${est.id}`)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border/10 hover:border-primary/15 bg-card/10 hover:bg-card/20 transition-all text-left"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground/70 truncate">
                      Estação {est.numero} — {est.titulo}
                    </p>
                    <p className="text-[10px] text-muted-foreground/40 truncate">{est.livro_titulo}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
