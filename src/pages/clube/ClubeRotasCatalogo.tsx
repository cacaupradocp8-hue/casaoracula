import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, Compass, ArrowRight, Sparkles, Play, MapPin, BookOpen, Leaf, MessageSquare } from 'lucide-react';
import { useTodasRotas, type EstacaoCatalogo, type EstacaoStatusUI } from '@/hooks/useTodasRotas';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { VozTag } from '@/components/voz/VozTag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function ClubeRotasCatalogo() {
  const navigate = useNavigate();
  const { isAdmin } = useEffectivePortal();
  const { data: estacoes, isLoading } = useTodasRotas({ isAdmin });
  const { estado: cidadelaEstado, isLoading: loadingCidadela } = useCidadelaEstado();
  const [bloqueada, setBloqueada] = useState<EstacaoCatalogo | null>(null);

  const temCidadela = !!(cidadelaEstado && (cidadelaEstado.distrito_atual || (cidadelaEstado.distritos_ativados?.length ?? 0) > 0));

  const travessiaAtiva = useMemo(() => {
    if (!estacoes) return null;
    return estacoes.find((e) => e.status === 'in_progress') || 
           estacoes.find((e) => e.status === 'available') || 
           estacoes[0];
  }, [estacoes]);

  const proximasEstacoes = useMemo(() => {
    if (!estacoes) return [];
    return estacoes.filter(e => e.status !== 'completed');
  }, [estacoes]);

  const concluidas = useMemo(() => {
    if (!estacoes) return [];
    return estacoes.filter(e => e.status === 'completed');
  }, [estacoes]);

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Cabeçalho Simples */}
      <header className="border-b border-gold/10 bg-midnight/30 backdrop-blur-sm sticky top-0 z-50">
        <ResponsiveContainer size="wide" className="py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-gold/40" />
                <span className="text-[8px] tracking-[0.3em] uppercase text-gold/60">
                  Espaço da Terapeuta
                </span>
              </div>
              <h1 className="font-display text-xl md:text-2xl text-foreground">
                Rotas da <span className="text-primary italic">Casa Orácula</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <VozTag size="sm" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-foreground/50 hover:text-foreground"
                onClick={() => navigate('/dashboard')}
              >
                Voltar
              </Button>
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      <main className="pb-20">
        <ResponsiveContainer size="wide" className="py-8 md:py-12 space-y-12 md:space-y-20">
          
          {/* 2. Minha Travessia Ativa */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold/60" />
              <h2 className="font-display text-lg md:text-xl text-foreground/90 uppercase tracking-widest">
                Sua Travessia Ativa
              </h2>
            </div>

            {isLoading ? (
              <Skeleton className="w-full h-[300px] rounded-3xl" />
            ) : travessiaAtiva ? (
              <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-midnight group">
                <div className="absolute inset-0">
                  {travessiaAtiva.livro_imagem_banner_url || travessiaAtiva.banner_url ? (
                    <img 
                      src={travessiaAtiva.livro_imagem_banner_url || travessiaAtiva.banner_url || ''} 
                      alt="" 
                      className="w-full h-full object-cover opacity-25"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/5 via-transparent to-primary/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/80 to-transparent" />
                </div>

                <div className="relative p-6 md:p-10 flex flex-col md:flex-row gap-8 items-end md:items-center">
                  <div className="w-32 md:w-44 shrink-0 shadow-2xl rounded-lg overflow-hidden border border-gold/10 group-hover:scale-105 transition-transform duration-500">
                    {travessiaAtiva.livro_capa_url ? (
                      <img src={travessiaAtiva.livro_capa_url} alt={travessiaAtiva.livro_titulo} className="w-full aspect-[2/3] object-cover" />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-foreground/10 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-foreground/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] tracking-[0.4em] uppercase text-gold">
                          Estação {travessiaAtiva.numero}
                        </span>
                        {travessiaAtiva.status === 'in_progress' && (
                          <span className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-[9px] text-gold uppercase tracking-wider">
                            Em curso
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
                        {travessiaAtiva.livro_titulo}
                      </h3>
                      {travessiaAtiva.livro_autor && (
                        <p className="font-serif italic text-lg text-foreground/60">
                          {travessiaAtiva.livro_autor}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-2">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-foreground/40">Progresso</p>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                            <div 
                              className="h-full bg-gold transition-all duration-1000" 
                              style={{ width: `${travessiaAtiva.progresso_pct}%` }} 
                            />
                          </div>
                          <span className="text-xs font-medium text-gold">{travessiaAtiva.progresso_pct}%</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="lg" 
                        variant="gold" 
                        className="rounded-full px-8 gap-2 group/btn"
                        onClick={() => travessiaAtiva.primeiro_slug && navigate(`/clube/rota/${travessiaAtiva.primeiro_slug}`)}
                      >
                        {travessiaAtiva.status === 'in_progress' ? 'Continuar Travessia' : 'Iniciar Travessia'}
                        <Play className="w-4 h-4 fill-current transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 rounded-3xl border border-dashed border-foreground/10 text-center space-y-4">
                <p className="font-serif italic text-foreground/50">Nenhuma travessia disponível no momento.</p>
              </div>
            )}
          </section>

          {/* 3. Mapa da Cidadela */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-gold/60" />
                <h2 className="font-display text-lg md:text-xl text-foreground/90 uppercase tracking-widest">
                  Sua Cidadela
                </h2>
              </div>
              <div className="space-y-4">
                <p className="font-serif italic text-lg text-foreground/70 leading-relaxed">
                  {temCidadela 
                    ? "Sua cartografia interna está ativa. Cada passo nas rotas expande o território da sua consciência."
                    : "Toda jornada começa pela sua cartografia interna. Crie seu mapa para orientar sua travessia."}
                </p>
                <Button 
                  variant="outline" 
                  className="rounded-full border-gold/30 hover:bg-gold/5 gap-2"
                  onClick={() => navigate(temCidadela ? '/cidadela/revelacao' : '/ferramenta/cartografia-psiquica-oracula')}
                  disabled={loadingCidadela}
                >
                  {temCidadela ? "Ver Mapa da Cidadela" : "Criar minha Cidadela"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-7 h-48 md:h-64 rounded-3xl bg-foreground/[0.02] border border-foreground/5 overflow-hidden relative group cursor-pointer"
                 onClick={() => navigate(temCidadela ? '/cidadela/revelacao' : '/ferramenta/cartografia-psiquica-oracula')}>
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                <MapPin className="w-20 h-20 text-gold/20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-primary/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="px-4 py-1.5 rounded-full border border-gold/20 bg-midnight/80 backdrop-blur-sm text-[10px] tracking-widest uppercase text-gold shadow-xl">
                    {temCidadela ? "Explorar Território" : "Iniciar Cartografia"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Abas Secundárias */}
          <section className="space-y-8 pt-8 border-t border-foreground/5">
            <Tabs defaultValue="estacoes" className="w-full">
              <TabsList className="w-full justify-start gap-4 md:gap-8 bg-transparent border-b border-foreground/5 rounded-none h-auto p-0 pb-px">
                <TabsTrigger 
                  value="estacoes" 
                  className="bg-transparent border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-foreground rounded-none px-0 pb-4 text-xs md:text-sm tracking-widest uppercase font-medium text-foreground/40 transition-all"
                >
                  Catálogo de Rotas
                </TabsTrigger>
                <TabsTrigger 
                  value="praticas" 
                  className="bg-transparent border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-foreground rounded-none px-0 pb-4 text-xs md:text-sm tracking-widest uppercase font-medium text-foreground/40 transition-all"
                >
                  Práticas e Recursos
                </TabsTrigger>
                <TabsTrigger 
                  value="concluidas" 
                  className="bg-transparent border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-foreground rounded-none px-0 pb-4 text-xs md:text-sm tracking-widest uppercase font-medium text-foreground/40 transition-all"
                >
                  Concluídas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="estacoes" className="pt-8 md:pt-12 outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {proximasEstacoes.map((estacao, idx) => (
                    <RotaCard
                      key={estacao.id}
                      estacao={estacao}
                      index={idx}
                      onClickLocked={() => setBloqueada(estacao)}
                      onOpen={() => {
                        if (estacao.primeiro_slug) {
                          navigate(`/clube/rota/${estacao.primeiro_slug}`);
                        }
                      }}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="praticas" className="pt-8 md:pt-12 outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <RecursoCard 
                    title="Jardim da Psique"
                    description="Diário simbólico para registrar sonhos, oráculos e impressões da jornada."
                    icon={<Leaf className="w-5 h-5" />}
                    onClick={() => navigate('/jardim-da-psique')}
                  />
                  <RecursoCard 
                    title="Abertura do Campo"
                    description="Áudio de condução primordial para sintonizar sua percepção antes da travessia."
                    icon={<Play className="w-5 h-5" />}
                    onClick={() => {
                      const s1 = estacoes?.find(e => e.numero === 1);
                      if (s1?.primeiro_slug) navigate(`/clube/rota/${s1.primeiro_slug}`);
                    }}
                  />
                  <RecursoCard 
                    title="Entrar no Espelho do Conto"
                    description="IA treinada na obra regente para aprofundar sentidos e tirar dúvidas simbólicas."
                    icon={<MessageSquare className="w-5 h-5" />}
                    onClick={() => {
                      const current = estacoes?.find(e => e.status === 'in_progress') || estacoes?.[0];
                      if (current?.primeiro_slug) {
                        navigate(`/clube/rota/${current.primeiro_slug}#converse-com-o-livro`);
                      }
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="concluidas" className="pt-8 md:pt-12 outline-none">
                {concluidas.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <p className="font-serif italic text-foreground/40">Você ainda não concluiu nenhuma travessia.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {concluidas.map((estacao, idx) => (
                      <RotaCard
                        key={estacao.id}
                        estacao={estacao}
                        index={idx}
                        onClickLocked={() => {}}
                        onOpen={() => {
                          if (estacao.primeiro_slug) {
                            navigate(`/clube/rota/${estacao.primeiro_slug}`);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>

        </ResponsiveContainer>
      </main>

      {/* Modal estação bloqueada */}
      <Dialog open={!!bloqueada} onOpenChange={(o) => !o && setBloqueada(null)}>
        <DialogContent className="bg-midnight border-gold/20">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-2">
              <Lock className="w-5 h-5 text-gold" />
            </div>
            <DialogTitle className="font-display text-2xl text-center text-foreground">
              Esta rota ainda não se abriu
            </DialogTitle>
            <DialogDescription className="font-serif italic text-center text-foreground/60 pt-2">
              Conclua a estação anterior para que esta travessia se revele. Cada passo prepara
              o terreno do próximo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-3">
            <Button
              variant="outline"
              className="border-gold/40 hover:bg-gold/10 rounded-full"
              onClick={() => setBloqueada(null)}
            >
              Voltar ao mapa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RotaCard({ estacao, index, onOpen, onClickLocked }: { estacao: EstacaoCatalogo, index: number, onOpen: () => void, onClickLocked: () => void }) {
  const locked = estacao.status === 'locked';
  const completed = estacao.status === 'completed';
  const inProgress = estacao.status === 'in_progress';
  const cover = estacao.livro_capa_url || estacao.banner_url || estacao.livro_imagem_banner_url;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      whileHover={{ y: -4 }}
      onClick={() => locked ? onClickLocked() : onOpen()}
      className={cn(
        'group relative text-left w-full overflow-hidden rounded-2xl border transition-all duration-500',
        'aspect-[4/5] flex flex-col',
        locked
          ? 'border-foreground/10 bg-foreground/[0.02]'
          : 'border-gold/15 bg-midnight hover:border-gold/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]',
      )}
    >
      {/* Cover */}
      <div className="absolute inset-0">
        {cover ? (
          <img
            src={cover}
            alt={estacao.livro_titulo}
            className={cn(
              'w-full h-full object-cover transition-all duration-700',
              locked ? 'opacity-20 blur-[4px] grayscale' : 'opacity-40 group-hover:opacity-55 group-hover:scale-105',
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-midnight via-midnight to-[hsl(206_70%_18%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/80 to-transparent" />
      </div>

      <div className="relative p-5 flex items-start justify-between">
        <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/50">
          Estação {estacao.numero}
        </span>
        {completed ? (
          <Check className="w-3.5 h-3.5 text-gold" />
        ) : locked ? (
          <Lock className="w-3.5 h-3.5 text-foreground/30" />
        ) : inProgress ? (
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
        ) : null}
      </div>

      <div className="flex-1" />

      <div className="relative p-5 space-y-2">
        <h3 className={cn(
          'font-display text-xl leading-tight',
          locked ? 'text-foreground/40' : 'text-foreground'
        )}>
          {estacao.livro_titulo}
        </h3>
        
        {!locked && (
          <div className="flex items-center gap-2 pt-1">
             <div className="flex-1 h-0.5 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-gold/60" style={{ width: `${estacao.progresso_pct}%` }} />
             </div>
             <span className="text-[9px] text-foreground/50">{estacao.progresso_pct}%</span>
          </div>
        )}

        <div className="pt-2 flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase font-bold text-gold/60 group-hover:text-gold transition-colors">
          {locked ? 'Bloqueada' : completed ? 'Revisitar' : inProgress ? 'Continuar' : 'Iniciar'}
          {!locked && <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />}
        </div>
      </div>
    </motion.button>
  );
}

function RecursoCard({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-gold/20 text-left transition-all space-y-4"
    >
      <div className="w-10 h-10 rounded-xl bg-foreground/5 text-foreground/40 group-hover:bg-gold/10 group-hover:text-gold/60 flex items-center justify-center transition-colors">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-base text-foreground/90">{title}</h3>
        <p className="text-[11px] leading-relaxed text-foreground/50 italic font-serif">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase font-bold text-gold/60 group-hover:text-gold transition-colors">
        Acessar <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  );
}
