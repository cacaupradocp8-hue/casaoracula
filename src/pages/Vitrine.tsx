import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, GraduationCap, BookOpen, Wrench, Sparkles, Compass, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitrineItem {
  id: string;
  titulo: string;
  descricao: string;
  icon: React.ElementType;
  rota: string;
  minPortal: string;
  cta: string;
  ctaBloqueado: string;
  imagem?: string;
}

const VITRINE_ITEMS: VitrineItem[] = [
  {
    id: 'formacao',
    titulo: 'Formação Orácula',
    descricao: 'Método completo de formação em psicologia simbólica. Portais, Travessias e Aulas com certificação.',
    icon: GraduationCap,
    rota: '/oracula',
    minPortal: 'aluna_formacao',
    cta: 'Acessar Formação',
    ctaBloqueado: 'Entrar na Formação',
  },
  {
    id: 'clube',
    titulo: 'Clube do Livro Oracular',
    descricao: 'Travessias semanais com livros simbólicos. Aulas-álbum, práticas e reflexões coletivas.',
    icon: BookOpen,
    rota: '/app/clube',
    minPortal: 'assinante',
    cta: 'Acessar Clube',
    ctaBloqueado: 'Assinar',
  },
  {
    id: 'ferramentas',
    titulo: 'Ferramentas Clínicas',
    descricao: 'Big Five Simbólico, Eneagrama Feminino, Cartografia Psíquica e mais instrumentos de sessão.',
    icon: Wrench,
    rota: '/ferramentas',
    minPortal: 'pre_iniciada',
    cta: 'Acessar Ferramentas',
    ctaBloqueado: 'Entrar na Formação',
  },
  {
    id: 'cartografia',
    titulo: 'Cartografia Psíquica',
    descricao: 'Mapeamento gratuito do seu campo simbólico. Descubra seus territórios internos dominantes.',
    icon: Compass,
    rota: '/ferramenta/cartografia-psiquica-oracula',
    minPortal: 'visitante',
    cta: 'Fazer Cartografia',
    ctaBloqueado: '',
  },
  {
    id: 'ia',
    titulo: 'IA Simbólica',
    descricao: 'Agentes inteligentes para apoio em leitura oracular, análise clínica e supervisão simbólica.',
    icon: Sparkles,
    rota: '/syntheia',
    minPortal: 'mentorada',
    cta: 'Acessar IA',
    ctaBloqueado: 'Entrar na Formação',
  },
  {
    id: 'jornada',
    titulo: 'Jornada da Heroína',
    descricao: 'Experiência guiada para clientes. Mapeamento simbólico e práticas de integração.',
    icon: Brain,
    rota: '/meu-jardim',
    minPortal: 'visitante',
    cta: 'Acessar Jornada',
    ctaBloqueado: '',
  },
];

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

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="py-16 md:py-24 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl md:text-4xl font-light text-foreground mb-4"
            >
              Vitrine da Casa Orácula
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-base max-w-lg mx-auto"
            >
              Explore tudo que a plataforma oferece. Itens bloqueados ficam disponíveis ao avançar na jornada.
            </motion.p>
          </div>
        </section>

        {/* Grid */}
        <section className="px-5 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
