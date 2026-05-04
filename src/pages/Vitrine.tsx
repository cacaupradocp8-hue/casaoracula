import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, GraduationCap, BookOpen, Wrench, Sparkles, Compass, Brain, Castle, Key, Flower2, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

interface VitrineItem {
  id: string;
  titulo: string;
  descricao: string;
  icon: React.ElementType;
  rota: string;
  minPortal: string;
  cta: string;
  ctaBloqueado: string;
  destaque?: boolean;
}

// Clube do Livro em destaque para visitantes
const DESTAQUE_VISITANTE: VitrineItem = {
  id: 'clube',
  titulo: 'Clube do Livro Oracular',
  descricao: 'Sistema de leitura como intervenção psíquica guiada. Travessias semanais com aulas-álbum, práticas simbólicas e reflexões coletivas. Aqui a leitura se torna ferramenta clínica — e cada livro abre uma Porta Simbólica.',
  icon: BookOpen,
  rota: '/app/clube',
  minPortal: 'assinante',
  cta: 'Acessar o Clube',
  ctaBloqueado: 'Assinar o Clube',
  destaque: true,
};

const VITRINE_ITEMS: VitrineItem[] = [
  {
    id: 'formacao',
    titulo: 'Formação Orácula',
    descricao: 'Método completo de formação em psicologia simbólica aplicada. Portais progressivos, Travessias guiadas e certificação profissional para terapeutas, psicólogas e facilitadoras.',
    icon: GraduationCap,
    rota: '/oracula',
    minPortal: 'aluna_formacao',
    cta: 'Acessar Formação',
    ctaBloqueado: 'Conhecer a Formação',
  },
  {
    id: 'leitura-oracula',
    titulo: 'Sistema de Leitura Oracular',
    descricao: 'Leitura simbólica como prática clínica. Cada obra é atravessada pela lente das Portas Simbólicas, transformando literatura em ferramenta de escuta e intervenção terapêutica.',
    icon: Sparkles,
    rota: '/app/clube',
    minPortal: 'assinante',
    cta: 'Acessar',
    ctaBloqueado: 'Assinar',
  },
  {
    id: 'formacao-junguiana',
    titulo: 'Portal de Formação Junguiana',
    descricao: 'Estudo aprofundado dos fundamentos junguianos aplicados à clínica simbólica. Sombra, individuação, complexos e arquétipos como ferramentas vivas de trabalho.',
    icon: Compass,
    rota: '/oracula',
    minPortal: 'aluna_formacao',
    cta: 'Acessar Portal',
    ctaBloqueado: 'Entrar na Formação',
  },
  {
    id: 'deusas',
    titulo: 'Despertando as Deusas: Arquétipos Femininos na CidaDELA',
    descricao: 'Mapeamento dos arquétipos femininos que habitam sua CidaDELA interior. Descubra quais forças simbólicas estão ativas, adormecidas ou em conflito no seu campo psíquico.',
    icon: Castle,
    rota: '/cidadela/revelacao',
    minPortal: 'pre_iniciada',
    cta: 'Explorar CidaDELA',
    ctaBloqueado: 'Entrar na Formação',
  },
  {
    id: 'chave-onirica',
    titulo: 'A Chave Onírica: Interpretação de Sonhos pela Cabala',
    descricao: 'Sistema de interpretação simbólica dos sonhos utilizando a árvore da Cabala como mapa. Transforme material onírico em direção clínica e autoconhecimento profundo.',
    icon: Key,
    rota: '/ferramentas',
    minPortal: 'aluna_formacao',
    cta: 'Acessar Ferramenta',
    ctaBloqueado: 'Entrar na Formação',
  },
  {
    id: 'jardins',
    titulo: 'Jardins Simbólicos',
    descricao: 'Seus espaços de cultivo interior. O Jardim da Psique guarda suas reflexões e registros simbólicos. O Jardim do Ofício documenta sua evolução como terapeuta e facilitadora.',
    icon: Flower2,
    rota: '/jardim-da-psique',
    minPortal: 'visitante',
    cta: 'Acessar Jardins',
    ctaBloqueado: '',
  },
  {
    id: 'casa-maquinas',
    titulo: 'Casa das Máquinas',
    descricao: 'O SaaS profissional da terapeuta. Gerencie clientes, sessões, prontuários simbólicos, ferramentas clínicas (Big Five, Eneagrama, Cartografia) e acompanhe a evolução de cada caso.',
    icon: Cog,
    rota: '/casa-das-maquinas',
    minPortal: 'pre_iniciada',
    cta: 'Acessar Casa das Máquinas',
    ctaBloqueado: 'Entrar na Formação',
  },
  {
    id: 'cartografia',
    titulo: 'Cartografia Psíquica Orácula',
    descricao: 'Mapeamento gratuito do seu campo simbólico. Descubra seus territórios internos dominantes e receba seu GPS interior.',
    icon: Brain,
    rota: '/ferramenta/cartografia-psiquica-oracula',
    minPortal: 'visitante',
    cta: 'Fazer Cartografia',
    ctaBloqueado: '',
  },
];

function DestaqueCard({ item, canAccess, onAction }: { item: VitrineItem; canAccess: boolean; onAction: () => void }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'relative rounded-2xl border-2 p-8 md:p-10 flex flex-col gap-5 transition-all duration-300',
        canAccess
          ? 'bg-primary/5 border-primary/30 hover:border-primary/50 hover:shadow-xl cursor-pointer'
          : 'bg-primary/5 border-primary/20'
      )}
      onClick={canAccess ? onAction : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium">Destaque</span>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">
          {item.titulo}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
          {item.descricao}
        </p>
      </div>

      <Button
        variant="gold"
        size="lg"
        className="gap-2 w-fit"
        onClick={(e) => {
          e.stopPropagation();
          onAction();
        }}
      >
        {canAccess ? item.cta : item.ctaBloqueado}
        {canAccess ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
}

function VitrineCard({ item, canAccess, onAction }: { item: VitrineItem; canAccess: boolean; onAction: () => void }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className={cn(
        'relative rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300',
        canAccess
          ? 'bg-card/70 border-border/30 hover:border-primary/30 hover:shadow-lg cursor-pointer'
          : 'bg-muted/20 border-border/10 grayscale'
      )}
      onClick={canAccess ? onAction : undefined}
    >
      {!canAccess && (
        <div className="absolute top-4 right-4">
          <Lock className="w-4 h-4 text-muted-foreground/50" />
        </div>
      )}

      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center',
        canAccess ? 'bg-primary/10' : 'bg-muted/30'
      )}>
        <Icon className={cn('w-6 h-6', canAccess ? 'text-primary' : 'text-muted-foreground/40')} />
      </div>

      <div className="flex-1 space-y-2">
        <h3 className={cn(
          'font-display text-lg font-medium',
          canAccess ? 'text-foreground' : 'text-muted-foreground/60'
        )}>
          {item.titulo}
        </h3>
        <p className={cn(
          'text-sm leading-relaxed',
          canAccess ? 'text-muted-foreground' : 'text-muted-foreground/40'
        )}>
          {item.descricao}
        </p>
      </div>

      <Button
        variant={canAccess ? 'gold' : 'outline'}
        size="sm"
        className={cn('gap-2 w-full', !canAccess && 'border-border/20 text-muted-foreground/50')}
        onClick={(e) => {
          e.stopPropagation();
          onAction();
        }}
      >
        {canAccess ? item.cta : item.ctaBloqueado}
        {canAccess ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
      </Button>
    </motion.div>
  );
}

export default function Vitrine() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userPortal = user?.portal || 'visitante';

  const checkAccess = (minPortal: string) => {
    if (userPortal === 'admin') return true;
    return canAccessFeature(userPortal, minPortal as any);
  };

  const handleAction = (item: VitrineItem, canAccess: boolean) => {
    if (canAccess) {
      navigate(item.rota);
    } else {
      navigate(user ? '/planos' : '/auth');
    }
  };

  const clubeAccess = checkAccess(DESTAQUE_VISITANTE.minPortal);

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="py-16 md:py-24 xl:py-32">
          <ResponsiveContainer size="default" className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Vitrine da Casa Orácula
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto"
            >
              Todo o ecossistema em um só lugar. Explore, descubra e escolha seu caminho.
            </motion.p>
          </ResponsiveContainer>
        </section>

        {/* Destaque: Clube do Livro */}
        <section className="pb-10">
          <ResponsiveContainer size="default">
            <DestaqueCard
              item={DESTAQUE_VISITANTE}
              canAccess={clubeAccess}
              onAction={() => handleAction(DESTAQUE_VISITANTE, clubeAccess)}
            />
          </ResponsiveContainer>
        </section>

        {/* Grid */}
        <section className="pb-24">
          <ResponsiveContainer size="wide" className="grid-adaptive">
            {VITRINE_ITEMS.map((item) => {
              const canAccess = checkAccess(item.minPortal);
              return (
                <VitrineCard
                  key={item.id}
                  item={item}
                  canAccess={canAccess}
                  onAction={() => handleAction(item, canAccess)}
                />
              );
            })}
          </ResponsiveContainer>
        </section>
      </div>
    </AppLayout>
  );
}
