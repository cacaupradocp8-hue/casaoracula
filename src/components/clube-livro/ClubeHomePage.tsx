import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Loader2, MapPin, Calendar, ExternalLink, ListOrdered, Quote, Zap, Sparkles } from 'lucide-react';
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
import { RotaExecutavelMes1 } from '@/components/clube-livro/RotaMês1';

/**
 * ClubeHomePage — Rota Oracular
 * Experiência de navegação viva em formato de estrada.
 */
export function ClubeHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rotaData = useRotaOracular();
  
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

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-lg space-y-10">

        {/* ============================================
            1. TOPO — VOCÊ ESTÁ AQUI
            ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1.5"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/50 font-medium">
            Você está aqui
          </p>
          <h1 className="font-display text-2xl md:text-3xl text-foreground">
            Olá, <span className="text-primary">{welcomeName}</span>
          </h1>
          {estacaoAtual && (
            <p className="text-xs text-muted-foreground/60">
              {estacaoAtual.titulo} · {estacaoAtual.livro_titulo}
            </p>
          )}
        </motion.div>

        {/* ============================================
            2. HEADER SIMBÓLICO — O CICLO ATUAL
            ============================================ */}
        {estacaoAtual && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-32 rounded-lg bg-card border border-primary/10 shadow-2xl overflow-hidden relative group">
                {estacaoAtual.livro_capa_url ? (
                  <img src={estacaoAtual.livro_capa_url} alt={estacaoAtual.livro_titulo} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <BookOpen className="w-8 h-8 text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
              
              <div className="space-y-1">
                <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] border-primary/20 text-primary/60 px-3">
                  Estação {estacaoAtual.numero}
                </Badge>
                <h2 className="font-serif text-2xl text-foreground">
                  {estacaoAtual.livro_titulo}
                </h2>
                {estacaoAtual.livro_autor && (
                  <p className="text-xs text-muted-foreground/60 italic">{estacaoAtual.livro_autor}</p>
                )}
              </div>

              {/* Barra de progresso minimalista */}
              <div className="w-full max-w-[200px] space-y-1.5 mx-auto">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[8px] text-muted-foreground/40 uppercase tracking-widest font-bold">Progresso</span>
                  <span className="text-[8px] text-primary/50 font-bold">{Math.round(progresso)}%</span>
                </div>
                <Progress value={progresso} className="h-1 bg-primary/10" />
              </div>
            </div>

            {/* Symbolic essence */}
            {estacaoAtual.essencia_nucleo && (
              <p className="text-xs text-muted-foreground/50 text-center italic leading-relaxed max-w-sm mx-auto px-4">
                "{estacaoAtual.essencia_nucleo}"
              </p>
            )}
          </motion.div>
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
            3. A ESTRADA (FLUXO SEQUENCIAL PRINCIPAL)
            ============================================ */}
        {pontos.length > 0 ? (
          <div className="space-y-12">
            <RotaEstrada 
              pontos={pontos} 
              pontoAtual={pontoAtual} 
              concluirPonto={(id) => concluirPonto.mutate(id)}
              isConcluindo={concluirPonto.isPending}
            />

            {/* Passo Ativo em Destaque */}
            {pontoAtual && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-display uppercase tracking-widest text-primary/70">Seu Próximo Passo</h3>
                   {pontoAtual.ref_tipo && (
                     <Badge variant="outline" className="text-[8px] opacity-40 uppercase tracking-tighter border-primary/20">Tipo: {pontoAtual.ref_tipo}</Badge>
                   )}
                </div>
                <Card className="border-gold/30 bg-gold/5 shadow-[0_0_40px_rgba(201,169,110,0.08)] overflow-hidden">
                   {pontoAtual.image_url && (
                     <div className="w-full aspect-video border-b border-gold/10 overflow-hidden relative">
                       <img src={pontoAtual.image_url} alt={pontoAtual.nome} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <div className="absolute bottom-3 left-4 flex gap-2">
                         {pontoAtual.porta && <Badge variant="outline" className="text-[8px] bg-black/40 backdrop-blur-md border-gold/40 text-gold">{pontoAtual.porta}</Badge>}
                         {pontoAtual.campo && <Badge variant="outline" className="text-[8px] bg-black/40 backdrop-blur-md border-primary/40 text-primary">{pontoAtual.campo}</Badge>}
                       </div>
                     </div>
                   )}
                   <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl border border-gold/20 shadow-inner">
                            {pontoAtual.icone}
                         </div>
                         <div className="flex-1">
                            <h4 className="text-xl font-serif text-foreground leading-tight tracking-tight">{pontoAtual.nome}</h4>
                            <p className="text-[11px] text-muted-foreground/60 italic mt-0.5">{pontoAtual.subtitulo || 'Atividade da jornada'}</p>
                         </div>
                      </div>

                      {pontoAtual.frase_guia && (
                        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line border-l-2 border-primary/20 pl-4 py-1.5 italic bg-primary/5 rounded-r-lg">
                           <Quote className="w-3.5 h-3.5 text-gold/30 mb-1" />
                           {pontoAtual.frase_guia}
                        </div>
                      )}

                      {/* Cartografia Sync (Icons mode) */}
                      {!pontoAtual.image_url && (pontoAtual.porta || pontoAtual.campo || pontoAtual.torre) && (
                        <div className="flex flex-wrap gap-2 pt-1">
                           {pontoAtual.porta && <Badge variant="outline" className="text-[9px] bg-background/40 border-gold/20 text-gold/60">{pontoAtual.porta}</Badge>}
                           {pontoAtual.campo && <Badge variant="outline" className="text-[9px] bg-background/40 border-primary/20 text-primary/60">{pontoAtual.campo}</Badge>}
                           {pontoAtual.torre && <Badge variant="outline" className="text-[9px] bg-background/40 border-emerald-500/20 text-emerald-500/60">{pontoAtual.torre}</Badge>}
                        </div>
                      )}

                      <Button 
                        variant="gold" 
                        className="w-full gap-2 font-bold h-12 mt-2"
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
        ) : (
          /* Se não houver pontos (Iniciação), mostra Entrada */
          <RotaEntrada />
        )}

        {/* ============================================
            4. FERRAMENTAS E APOIO
            ============================================ */}
        <RotaImersao estacaoId={estacaoAtual?.id} />
        
        <div className="grid grid-cols-1 gap-12">
          <RotaLaboratorio
            estacaoId={estacaoAtual?.id}
            livroTitulo={estacaoAtual?.livro_titulo}
          />
          <RotaAplicacao />
        </div>

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
