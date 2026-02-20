import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RitualSaidaDialog } from '@/components/ritual/RitualSaidaDialog';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { canAccessFeature } from '@/types/portal';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { forceFullRefresh } from '@/components/pwa/ServiceWorkerUpdateToast';
import {
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Star,
  LogIn,
  RefreshCw,
  BookOpen,
  Compass,
  Wrench,
  Flower2,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [ritualSaidaOpen, setRitualSaidaOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);

  const isAdmin = user?.portal === 'admin';
  const hasOracula = user && canAccessFeature(user.portal, 'oracula');

  const handleLogout = () => setRitualSaidaOpen(true);
  const handleConfirmExit = () => {
    setRitualSaidaOpen(false);
    logout();
    navigate('/');
  };

  const isActive = (paths: string[]) =>
    paths.some(p => location.pathname === p || (p !== '/' && location.pathname.startsWith(p)));

  // ── 6 grupos do menu da aluna ────────────────────────────────────────────

  const menuGroups = [
    {
      key: 'inicio',
      label: 'Início',
      icon: Home,
      path: '/jornada',
      subitems: [],
    },
    {
      key: 'formacao',
      label: 'Formação',
      icon: GraduationCap,
      path: '/oracula',
      subitems: [
        { label: 'Formação Orácula', path: '/oracula' },
        { label: 'Salas', path: '/salas' },
        { label: 'Portal Junguiano', path: '/portal-junguiano' },
        { label: 'Travessias', path: '/travessias' },
        { label: 'Oráculos', path: '/oraculos' },
        { label: 'Labirinto das 39 Portas', path: '/labirinto' },
        { label: 'Labirinto da Heroína Interna®', path: '/labirinto-heroina' },
        { label: 'Mapa da Heroína', path: '/mapa-heroina' },
        { label: 'Cartas da Jornada', path: '/cartas-jornada' },
      ],
    },
    {
      key: 'travessias',
      label: 'Travessias',
      icon: Compass,
      path: '/biblioteca-travessias',
      subitems: [
        { label: 'Biblioteca das Travessias', path: '/biblioteca-travessias' },
        { label: 'Família das Travessias', path: '/biblioteca-travessias/familias' },
        { label: 'Portais', path: '/portais' },
        { label: 'Clube do Livro', path: '/clube-livro' },
        { label: 'Torre Viva™', path: '/torre-viva' },
      ],
    },
    {
      key: 'ferramentas',
      label: 'Ferramentas',
      icon: Wrench,
      path: '/ferramentas',
      subitems: [
        { label: 'Hub do Método', path: '/ferramentas-metodo' },
        { label: 'Sala de Ferramentas', path: '/ferramentas' },
        { label: 'Big Five Oracular', path: '/ferramenta/big5-oracular' },
        { label: 'Escala MAIA', path: '/ferramentas/escala-maia' },
        { label: 'Atlas de Arquétipos', path: '/atlas-arquetipos' },
        { label: 'Narroterapia Oracular™', path: '/narroterapia' },
        { label: 'Radiestesia', path: '/radiestesia' },
        { label: 'Sala de Sessão', path: '/session-room' },
        { label: 'Vitrine', path: '/ferramentas-vitrine' },
      ],
    },
    {
      key: 'biblioteca',
      label: 'Biblioteca',
      icon: BookOpen,
      path: '/minha-biblioteca',
      subitems: [
        { label: 'Minha Biblioteca', path: '/minha-biblioteca' },
        { label: 'Áudios', path: '/audios' },
      ],
    },
    {
      key: 'jardim',
      label: 'Meu Jardim',
      icon: Flower2,
      path: '/jardim-da-psique',
      subitems: [
        { label: 'Jardim da Psique', path: '/jardim-da-psique' },
        { label: 'Casa / Sustentação', path: '/casa' },
        { label: 'Mapas Simbólicos', path: '/mapas-simbolicos' },
        { label: 'Mapas Vivos', path: '/mapas-vivos' },
        ...(hasOracula
          ? [
              { label: 'Casa das Máquinas', path: '/casa-das-maquinas' },
              { label: 'Jardim do Ofício', path: '/casa-das-maquinas/jardim-oficio' },
            ]
          : []),
      ],
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to={user ? '/jornada' : '/'} className="h-full flex items-center py-2">
              <Logo size="xl" variant="combined" className="md:hidden" />
              <Logo size="xl" variant="horizontal" className="hidden md:flex" />
            </Link>

            {/* Desktop — 6 grupos */}
            <div className="hidden md:flex items-center gap-1">
              {menuGroups.map(group => {
                const Icon = group.icon;
                const active = isActive(
                  group.subitems.length ? group.subitems.map(s => s.path) : [group.path]
                );

                if (!group.subitems.length) {
                  return (
                    <Link key={group.key} to={group.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn('gap-1.5 transition-all', active && 'bg-secondary text-gold')}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{group.label}</span>
                      </Button>
                    </Link>
                  );
                }

                return (
                  <DropdownMenu key={group.key}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn('gap-1.5 transition-all', active && 'bg-secondary text-gold')}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{group.label}</span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      {group.subitems.map(item => (
                        <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
            </div>

            {/* Right side: notifications + user menu */}
            <div className="flex items-center gap-2">
              {user && <NotificationBell />}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 max-h-[80vh] overflow-y-auto">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-gold mt-1">Portal: {user.portal}</p>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Admin link */}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="w-4 h-4 mr-2" />
                          Painel Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {menuGroups.map(group => (
                      <div key={group.key}>
                        {group.subitems.length ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <group.icon className="w-4 h-4 mr-2" />
                              {group.label}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-48">
                              {group.subitems.map(item => (
                                <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        ) : (
                          <DropdownMenuItem onClick={() => navigate(group.path)}>
                            <group.icon className="w-4 h-4 mr-2" />
                            {group.label}
                          </DropdownMenuItem>
                        )}
                      </div>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => forceFullRefresh()}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Forçar Atualização
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Entrar</span>
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border animate-slide-up">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {menuGroups.map(group => {
                  const Icon = group.icon;
                  const expanded = mobileExpandedGroup === group.key;

                  if (!group.subitems.length) {
                    return (
                      <Link
                        key={group.key}
                        to={group.path}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full justify-start gap-3">
                          <Icon className="w-5 h-5" />
                          {group.label}
                        </Button>
                      </Link>
                    );
                  }

                  return (
                    <div key={group.key}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={() =>
                          setMobileExpandedGroup(expanded ? null : group.key)
                        }
                      >
                        <Icon className="w-5 h-5" />
                        {group.label}
                        <ChevronDown
                          className={cn('w-4 h-4 ml-auto transition-transform', expanded && 'rotate-180')}
                        />
                      </Button>

                      {expanded && (
                        <div className="ml-8 flex flex-col gap-1 mt-1">
                          {group.subitems.map(item => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileExpandedGroup(null);
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-sm text-muted-foreground"
                              >
                                {item.label}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Settings className="w-5 h-5" />
                      Admin
                    </Button>
                  </Link>
                )}

                {!user && (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full gap-2 mt-2">
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <LockedContentModal open={lockedModalOpen} onOpenChange={setLockedModalOpen} />
      <RitualSaidaDialog
        open={ritualSaidaOpen}
        onClose={() => setRitualSaidaOpen(false)}
        onConfirmExit={handleConfirmExit}
      />
    </>
  );
}
