import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Compass, ShoppingBag, GraduationCap, BookOpen, Wrench, Flower2, ArrowRight } from 'lucide-react';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface QuickSection {
  title: string;
  icon: React.ElementType;
  route: string;
  desc: string;
}

const SECTIONS: QuickSection[] = [
  { title: 'Formações', icon: GraduationCap, route: '/cursos', desc: 'Cursos e formação profissional' },
  { title: 'Clube do Livro', icon: BookOpen, route: '/app/clube', desc: 'Travessias semanais com livros' },
  { title: 'Ferramentas', icon: Wrench, route: '/ferramentas', desc: 'Instrumentos de sessão e autoleitura' },
  { title: 'Jardins', icon: Flower2, route: '/jardim-da-psique', desc: 'Seus registros e reflexões' },
];

export default function DashboardReorganizado() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const welcomeName = user?.name?.split(' ')[0] || 'Membro';

  return (
    <AppLayout>
      <div className="container mx-auto px-5 py-8 pb-24 max-w-3xl">
        {/* Welcome */}
        <motion.div {...fadeIn(0)} className="mb-10">
          <h1 className="font-display text-2xl md:text-3xl font-light text-foreground mb-2">
            Bem-vinda à Casa, {welcomeName}.
          </h1>
          <p className="text-muted-foreground text-base">
            Escolha por onde começar.
          </p>
        </motion.div>

        {/* 3 Cards Principais */}
        <div className="grid gap-4 mb-12">
          {/* Card 1 — Comece por Aqui */}
          <motion.div
            {...fadeIn(0.1)}
            onClick={() => navigate('/mapa-casa')}
            className="p-5 rounded-2xl bg-card/70 border border-border/30 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-base font-medium text-foreground">Comece por Aqui</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Conheça o mapa da Casa e entenda como a plataforma funciona.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
          </motion.div>

          {/* Card 2 — Sua Jornada */}
          <motion.div
            {...fadeIn(0.2)}
            onClick={() => navigate('/minha-jornada')}
            className="p-5 rounded-2xl bg-card/70 border border-border/30 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-base font-medium text-foreground">Sua Jornada Agora</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Veja onde você está e qual o próximo passo na sua formação.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
          </motion.div>

          {/* Card 3 — Vitrine */}
          <motion.div
            {...fadeIn(0.3)}
            onClick={() => navigate('/vitrine')}
            className="p-5 rounded-2xl bg-card/70 border border-border/30 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-base font-medium text-foreground">Explorar a Casa</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Veja tudo que a plataforma oferece e o que está disponível para você.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
          </motion.div>
        </div>

        {/* Seções rápidas */}
        <motion.div {...fadeIn(0.4)}>
          <h2 className="font-display text-lg font-medium text-foreground mb-4">Acesso rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                {...fadeIn(0.45 + i * 0.05)}
                onClick={() => navigate(section.route)}
                className="p-4 rounded-xl bg-card/50 border border-border/20 cursor-pointer hover:border-primary/20 hover:bg-card/80 transition-all"
              >
                <section.icon className="w-5 h-5 text-primary/60 mb-2" />
                <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{section.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
