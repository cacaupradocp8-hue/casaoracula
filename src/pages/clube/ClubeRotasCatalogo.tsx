import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, Compass, ArrowRight, Sparkles, Play, MapPin } from 'lucide-react';
import { useTodasRotas, type EstacaoCatalogo, type EstacaoStatusUI } from '@/hooks/useTodasRotas';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { VozTag } from '@/components/voz/VozTag';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Filtro = 'todas' | 'em_curso' | 'concluidas' | 'proximas';

export default function ClubeRotasCatalogo() {
  const navigate = useNavigate();
  const { isAdmin } = useEffectivePortal();
  const { data: estacoes, isLoading } = useTodasRotas({ isAdmin });
  const { estado: cidadelaEstado, isLoading: loadingCidadela } = useCidadelaEstado();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [bloqueada, setBloqueada] = useState<EstacaoCatalogo | null>(null);

  const temCidadela = !!(cidadelaEstado && (cidadelaEstado.distrito_atual || (cidadelaEstado.distritos_ativados?.length ?? 0) > 0));

  const estacaoEmCurso = useMemo(
    () => estacoes?.find((e) => e.status === 'in_progress') ?? null,
    [estacoes],
  );
  const proximaDisponivel = useMemo(
    () => estacoes?.find((e) => e.status === 'available' || e.status === 'in_progress') ?? null,
    [estacoes],
  );

  const filtradas = useMemo(() => {
    if (!estacoes) return [];
    switch (filtro) {
      case 'em_curso':
        return estacoes.filter((e) => e.status === 'in_progress');
      case 'concluidas':
        return estacoes.filter((e) => e.status === 'completed');
      case 'proximas':
        return estacoes.filter((e) => e.status === 'locked' || e.status === 'available');
      default:
        return estacoes;
    }
  }, [estacoes, filtro]);

  const filtros: { id: Filtro; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'em_curso', label: 'Em curso' },
    { id: 'concluidas', label: 'Concluídas' },
    { id: 'proximas', label: 'Próximas' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-20 w-[520px] h-[520px] bg-gold/[0.06] rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 -left-20 w-[460px] h-[460px] bg-[hsl(206_70%_30%/0.18)] rounded-full blur-[140px]" />
        </div>
        <ResponsiveContainer size="wide" className="relative py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5 max-w-3xl"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-gold/40" />
                <span className="text-[9px] tracking-[0.4em] uppercase text-gold/70">
                  Bem-vinda às Rotas da Casa Orácula
                </span>
              </div>
              <VozTag size="sm" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-foreground leading-[1.05]">
              A jornada não cabe em um livro só.
            </h1>
            <p className="font-serif italic text-base md:text-lg text-foreground/65 max-w-xl">
              Este espaço não é sobre acumular conteúdo. É sobre atravessar experiências.
            </p>
          </motion.div>

          {/* Bloco de boas-vindas: Cidadela + Continuar + Iniciar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Cidadela */}
            <div className="rounded-2xl border border-gold/15 bg-foreground/[0.02] p-5 flex flex-col justify-between min-h-[160px]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gold/70">
                  <Compass className="w-4 h-4" />
                  <span className="text-[9px] tracking-[0.3em] uppercase">Sua Cidadela</span>
                </div>
                {temCidadela ? (
                  <p className="font-display text-lg text-foreground/90 leading-tight">
                    Mapa criado.
                  </p>
                ) : (
                  <p className="font-display text-lg text-foreground/90 leading-tight">
                    Toda jornada começa pela sua cartografia interna.
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant={temCidadela ? 'outline' : 'gold'}
                className="mt-4 self-start gap-2"
                onClick={() =>
                  navigate(temCidadela ? '/cidadela/revelacao' : '/ferramenta/cartografia-psiquica-oracula')
                }
                disabled={loadingCidadela}
              >
                {temCidadela ? 'Acessar minha Cidadela' : 'Criar minha Cidadela'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Continuar */}
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 flex flex-col justify-between min-h-[160px]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gold/70">
                  <Play className="w-4 h-4" />
                  <span className="text-[9px] tracking-[0.3em] uppercase">Continuar</span>
                </div>
                {estacaoEmCurso ? (
                  <>
                    <p className="font-display text-lg text-foreground/90 leading-tight line-clamp-2">
                      {estacaoEmCurso.livro_titulo}
                    </p>
                    <p className="text-[11px] text-foreground/50">
                      Estação {estacaoEmCurso.numero} · {estacaoEmCurso.progresso_pct}%
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-foreground/55 italic font-serif">
                    Nenhuma travessia em curso.
                  </p>
                )}
              </div>
              {estacaoEmCurso && estacaoEmCurso.primeiro_slug && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 self-start gap-2"
                  onClick={() => navigate(`/clube/rota/${estacaoEmCurso.primeiro_slug}`)}
                >
                  Continuar de onde parei
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {/* Iniciar */}
            <div className="rounded-2xl border border-gold/15 bg-gradient-to-br from-gold/[0.06] to-transparent p-5 flex flex-col justify-between min-h-[160px]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gold/70">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[9px] tracking-[0.3em] uppercase">Iniciar</span>
                </div>
                {proximaDisponivel ? (
                  <>
                    <p className="font-display text-lg text-foreground/90 leading-tight line-clamp-2">
                      {proximaDisponivel.livro_titulo}
                    </p>
                    <p className="text-[11px] text-foreground/50">
                      Estação {proximaDisponivel.numero}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-foreground/55 italic font-serif">
                    Você completou todas as estações disponíveis.
                  </p>
                )}
              </div>
              {proximaDisponivel && proximaDisponivel.primeiro_slug && (
                <Button
                  size="sm"
                  variant="gold"
                  className="mt-4 self-start gap-2"
                  onClick={() => navigate(`/clube/rota/${proximaDisponivel.primeiro_slug}`)}
                >
                  Iniciar minha jornada
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </motion.div>
        </ResponsiveContainer>
      </section>

      {/* Sua Primeira Travessia - Novo Bloco de Boas-vindas */}
      <ResponsiveContainer size="wide" className="pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold/60" />
            <h2 className="font-display text-xl md:text-2xl text-foreground/90 italic">
              Sua Primeira Travessia
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card: Rota dos Lobos */}
            <BoasVindasCard
              title="Rota dos Lobos"
              description="Comece por aqui: a travessia primordial sobre instinto e voz."
              icon={<Compass className="w-5 h-5" />}
              onClick={() => {
                const s1 = estacoes?.find(e => e.numero === 1);
                if (s1?.primeiro_slug) navigate(`/clube/rota/${s1.primeiro_slug}`);
              }}
              label="Iniciar"
              highlight
            />

            {/* Card: Abertura do Campo */}
            <BoasVindasCard
              title="Abertura do Campo"
              description="Ouça a primeira condução para sintonizar sua percepção."
              icon={<Play className="w-5 h-5" />}
              onClick={() => {
                const s1 = estacoes?.find(e => e.numero === 1);
                if (s1?.primeiro_slug) navigate(`/clube/rota/${s1.primeiro_slug}`);
              }}
              label="Ouvir"
            />

            {/* Card: Jardim da Psique */}
            <BoasVindasCard
              title="Jardim da Psique"
              description="Registre suas impressões e sementes simbólicas da jornada."
              icon={<MapPin className="w-5 h-5" />}
              onClick={() => navigate('/jardim-psique')}
              label="Registrar"
            />

            {/* Card: Converse com o Livro */}
            <BoasVindasCard
              title="Converse com o Livro"
              description="Tire dúvidas e aprofunde o sentido simbólico da obra regente."
              icon={<Sparkles className="w-5 h-5" />}
              onClick={() => {
                const current = estacaoEmCurso || estacoes?.find(e => e.numero === 1);
                if (current?.primeiro_slug) {
                  navigate(`/clube/rota/${current.primeiro_slug}#converse-com-o-livro`);
                  setTimeout(() => {
                    const el = document.getElementById('converse-com-o-livro');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 500);
                }
              }}
              label="Conversar"
            />
          </div>
        </motion.div>
      </ResponsiveContainer>

      {/* Filtros */}
      <ResponsiveContainer size="wide" className="pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-xs tracking-wide border transition-all',
                filtro === f.id
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-foreground/10 text-foreground/75 hover:border-foreground/25 hover:text-foreground/80',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </ResponsiveContainer>

      {/* Grid */}
      <section className="py-10 md:py-14">
        <ResponsiveContainer size="wide">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <p className="text-center text-foreground/70 py-20 font-serif italic">
            Nenhuma estação por aqui ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtradas.map((estacao, idx) => (
              <RotaCard
                key={estacao.id}
                estacao={estacao}
                index={idx}
                onClickLocked={() => setBloqueada(estacao)}
                onOpen={() => {
                  if (estacao.primeiro_slug) {
                    navigate(`/clube/rota/${estacao.primeiro_slug}`);
                  } else {
                    navigate('/clube');
                  }
                }}
              />
            ))}
          </div>
        )}
        </ResponsiveContainer>
      </section>

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
              className="border-gold/40 hover:bg-gold/10"
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

interface RotaCardProps {
  estacao: EstacaoCatalogo;
  index: number;
  onOpen: () => void;
  onClickLocked: () => void;
}

function RotaCard({ estacao, index, onOpen, onClickLocked }: RotaCardProps) {
  const locked = estacao.status === 'locked';
  const completed = estacao.status === 'completed';
  const inProgress = estacao.status === 'in_progress';
  const cover = estacao.livro_capa_url || estacao.banner_url || estacao.livro_imagem_banner_url;

  const handleClick = () => {
    if (locked) onClickLocked();
    else onOpen();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className={cn(
        'group relative text-left w-full overflow-hidden rounded-2xl border transition-all duration-500',
        'aspect-[4/5] flex flex-col',
        locked
          ? 'border-foreground/10 bg-foreground/[0.02]'
          : 'border-gold/15 bg-midnight hover:border-gold/40 hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]',
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
              locked ? 'opacity-25 blur-[6px] scale-110' : 'opacity-40 group-hover:opacity-55 group-hover:scale-105',
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-midnight via-midnight to-[hsl(206_70%_18%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/85 to-midnight/30" />
      </div>

      {/* Status badge */}
      <div className="relative p-5 flex items-start justify-between">
        <span className="text-[9px] tracking-[0.35em] uppercase text-foreground/75">
          Estação {estacao.numero}
        </span>
        <StatusBadge status={estacao.status} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Content */}
      <div className="relative p-5 space-y-3">
        <div className="space-y-1.5">
          <h3
            className={cn(
              'font-display text-xl leading-tight',
              locked ? 'text-foreground/70' : 'text-foreground',
            )}
          >
            {estacao.livro_titulo}
          </h3>
          {estacao.livro_autor && !locked && (
            <p className="font-serif italic text-xs text-foreground/70">
              {estacao.livro_autor}
            </p>
          )}
        </div>

        {!locked && estacao.essencia_nucleo && (
          <p className="text-[13px] text-foreground/55 line-clamp-2 leading-relaxed">
            {estacao.essencia_nucleo}
          </p>
        )}

        {/* Progress */}
        {!locked && estacao.total_itens > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] tracking-wide text-foreground/70">
              <span>
                {estacao.itens_concluidos}/{estacao.total_itens} fases
              </span>
              <span className="text-gold/80 font-medium">{estacao.progresso_pct}%</span>
            </div>
            <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-700',
                  completed ? 'bg-gold' : 'bg-gradient-to-r from-gold to-gold/40',
                )}
                style={{ width: `${estacao.progresso_pct}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA hint */}
        <div className="pt-2">
          {locked ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-foreground/35">
              <Lock className="w-3 h-3" /> Conclua a anterior
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-gold/80 group-hover:text-gold">
              {completed ? 'Revisitar' : inProgress ? 'Continuar' : 'Iniciar'}
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

interface BoasVindasCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  highlight?: boolean;
}

function BoasVindasCard({ title, description, icon, onClick, label, highlight }: BoasVindasCardProps) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300",
        highlight 
          ? "border-gold/30 bg-gold/[0.04] shadow-[0_10px_30px_-10px_rgba(212,175,55,0.15)]" 
          : "border-foreground/10 bg-foreground/[0.02] hover:border-gold/20"
      )}
    >
      <div className="space-y-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          highlight ? "bg-gold/20 text-gold" : "bg-foreground/5 text-foreground/40 group-hover:bg-gold/10 group-hover:text-gold/60"
        )}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-base text-foreground/90">{title}</h3>
          <p className="text-[11px] leading-relaxed text-foreground/50 line-clamp-2 italic font-serif">
            {description}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase font-bold text-gold/60 group-hover:text-gold transition-colors">
        {label}
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  );
}

function StatusBadge({ status }: { status: EstacaoStatusUI }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-gold">
        <Check className="w-3 h-3" strokeWidth={3} /> Concluída
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-gold/90">
        <Sparkles className="w-3 h-3" /> Você está aqui
      </span>
    );
  }
  if (status === 'locked') {
    return (
      <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-foreground/70">
        <Lock className="w-3 h-3" /> Bloqueada
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-foreground/55">
      <Compass className="w-3 h-3" /> Disponível
    </span>
  );
}
