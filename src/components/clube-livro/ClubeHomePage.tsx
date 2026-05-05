import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Sparkles, Map, Compass, Calendar, ExternalLink, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { RotaEstrada } from '@/components/clube-livro/RotaEstrada';
import { MiniMandalaCidadela } from '@/components/casa-maquinas/MiniMandalaCidadela';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';
import { Laboratorio8020Card } from '@/components/clube/Laboratorio8020Card';
import { useAllBooks } from '@/hooks/useBooks';
import { InsightPortalBlock, SymbolicCarouselBlock } from '@/components/clube-livro/blocks';
import { useClubeRoutes, useClubeStations } from '@/hooks/useClubeV3';
import { StationRoad } from '@/components/clube-v3/StationRoad';

export function ClubeHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rotaData = useRotaOracular();
  const { data: allBooks = [] } = useAllBooks();
  
  // V3 Data for progress tracking
  const { data: routes } = useClubeRoutes();
  const currentRoute = routes?.[0];
  const { data: stationsV3 } = useClubeStations(currentRoute?.id);

  const {
    estacaoAtual,
    pontos,
    pontoAtual,
    progresso,
    encontro,
    isLoading,
  } = rotaData || {
    estacaoAtual: null,
    pontos: [],
    pontoAtual: undefined,
    progresso: 0,
    encontro: null,
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
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* INSIGHT DO PORTAL */}
            <InsightPortalBlock />

            {/* CARROSSEL DA ROTA — Mantido como elemento visual de sementes */}
            {estacaoAtual && (
              <SymbolicCarouselBlock 
                title="Sementes da Estação"
                icon={<Sparkles className="w-4 h-4" />}
                estacaoId={estacaoAtual.id}
                className="mb-12 border-gold/20"
              />
            )}

            {/* ESTRADA DA ALUNA (V3) — O guia e orientação centralizado */}
            <div className="space-y-8 bg-midnight/20 rounded-[3rem] p-8 border border-gold/10">
              <div className="flex items-center gap-4 px-4">
                <Compass className="w-5 h-5 text-gold" />
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gold/60">Sua Estrada das Estações</h2>
              </div>
              
              {stationsV3 && stationsV3.length > 0 ? (
                <StationRoad stations={stationsV3} />
              ) : (
                <div className="text-center py-12 border border-dashed border-border/10 rounded-3xl">
                  <p className="text-muted-foreground/50 italic text-sm">Nenhuma estação publicada na rota.</p>
                </div>
              )}
            </div>

            {/* LABORATÓRIO 80/20 (Mantido como conteúdo proeminente) */}
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
          </div>

          {/* COLUNA LATERAL — Mantida conforme layout original */}
          <aside className="lg:col-span-4 space-y-10">
            {/* MINI CIDADELA */}
            {user?.id && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
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

            {/* QUICK ACCESS */}
            {matchedBook && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
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
          </aside>
        </div>
      </ResponsiveContainer>
    </AppLayout>
  );
}


