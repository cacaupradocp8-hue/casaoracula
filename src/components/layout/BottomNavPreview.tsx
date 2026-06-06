import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Wrench, Flower2, GraduationCap, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';


export function BottomNavPreview() {
  const { user } = useAuth();
  const isFounder = !!user?.founder_beta;

  const NAV_ITEMS = isFounder ? [
    { key: 'inicio', icon: Home, label: 'CidadELA', path: '/dashboard-membro' },
    { key: 'clube', icon: BookOpen, label: 'Rota Lobos', path: '/clube/rotas/rota-dos-lobos' },
    { key: 'jardim', icon: Flower2, label: 'Jardim', path: '/jardim-da-psique' },
    { key: 'feedback', icon: MessageCircle, label: 'Feedback', path: '/clube/founder-feedback' },
  ] : [
    { key: 'inicio', icon: Home, label: 'Início', path: '/dashboard-membro' },
    { key: 'clube', icon: BookOpen, label: 'Rotas', path: '/clube/rotas' },
    { key: 'ferramentas', icon: Wrench, label: 'Práticas', path: '/ferramentas' },
    { key: 'jardim', icon: Flower2, label: 'Jardim', path: '/jardim-da-psique' },
    { key: 'formacao', icon: GraduationCap, label: 'Formação', path: '/cursos' },
  ];

  const [mounted, setMounted] = useState(false);
  const [navItems, setNavItems] = useState(NAV_ITEMS);

  useEffect(() => {
    setNavItems(NAV_ITEMS);
    setMounted(true);
  }, [isFounder]);
  const navigate = useNavigate();
  const location = useLocation();

  const activeIndex = NAV_ITEMS.findIndex(
    (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;

  if (!mounted) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none pb-[env(safe-area-inset-bottom,1rem)]">
      <div className="flex justify-center w-full px-4">
        <div className={cn(
          "relative h-[68px] w-full max-w-[460px] backdrop-blur-2xl rounded-2xl border shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto",
        location.pathname.startsWith('/clube/rotas') 
          ? "bg-blue-950/40 border-blue-400/20" 
          : "bg-card/95 border-border/40"
      )}>
        {/* Indicador animado */}
        <motion.div
          className="absolute -top-[22px] h-[64px] flex items-center justify-center pointer-events-none"
          style={{ width: `${100 / NAV_ITEMS.length}%` }}
          animate={{ left: `${currentIndex * (100 / NAV_ITEMS.length)}%` }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        >
          <div className="w-14 h-14 rounded-full bg-primary border-[5px] border-background shadow-[0_0_20px_hsl(var(--primary)/0.4)]" />
        </motion.div>

        {/* Botões */}
        <ul className="flex w-full h-full">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = i === currentIndex;

            return (
              <li key={item.key} className="flex-1 relative z-10">
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full h-full flex flex-col items-center justify-center gap-0.5 transition-all duration-300"
                >
                  <motion.div
                    animate={{ y: isActive ? -14 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors duration-300',
                        isActive ? 'text-primary-foreground' : 'text-foreground/50'
                      )}
                      strokeWidth={isActive ? 2.2 : 1.5}
                    />
                  </motion.div>
                  <span
                    className={cn(
                      'text-[9px] tracking-wide transition-all duration-300',
                      isActive
                        ? 'text-primary font-semibold opacity-100'
                        : 'text-foreground/40 opacity-80'
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </nav>
  );
}
