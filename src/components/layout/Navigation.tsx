import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { getPortal, canAccessFeature, PortalType } from '@/types/portal';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { supabase } from '@/integrations/supabase/client';
import {
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Lock,
  Star,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types for menu items
interface MenuItem {
  path: string;
  label: string;
  icon: typeof Home;
  minPortal: PortalType;
  requiresMatricula?: 'mentoria' | 'formacao';
}

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  const portal = user ? getPortal(user.portal) : null;
  const isAdmin = user?.portal === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Build menu items with more navigation options
  const buildMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        path: '/jornada',
        label: 'Início',
        icon: Home,
        minPortal: 'visitante',
      },
      {
        path: '/oracula',
        label: 'Formação',
        icon: Star,
        minPortal: 'visitante',
      },
    ];

    // Admin-only link
    if (isAdmin) {
      items.push({
        path: '/admin',
        label: 'Admin',
        icon: Settings,
        minPortal: 'admin',
      });
    }

    return items;
  };

  const menuItems = buildMenuItems();

  // Check if user can access this item based on portal level
  const canAccessItem = (minPortal: PortalType) => {
    return user && canAccessFeature(user.portal, minPortal);
  };

  // Handle click on nav item
  const handleNavClick = (item: MenuItem, e: React.MouseEvent) => {
    if (!canAccessItem(item.minPortal)) {
      e.preventDefault();
      setLockedModalOpen(true);
    }
  };

  // Render desktop menu item
  const renderDesktopItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || 
      (item.path !== '/' && location.pathname.startsWith(item.path));
    const isLocked = !canAccessItem(item.minPortal) && item.minPortal !== 'visitante';

    return (
      <Link 
        key={item.path} 
        to={isLocked ? '#' : item.path}
        onClick={(e) => handleNavClick(item, e)}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-2 transition-all',
            isActive && !isLocked && 'bg-secondary text-gold',
            isLocked && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
          <span>{item.label}</span>
        </Button>
      </Link>
    );
  };

  // Render mobile menu item
  const renderMobileItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const isLocked = !canAccessItem(item.minPortal) && item.minPortal !== 'visitante';

    return (
      <Link
        key={item.path}
        to={isLocked ? '#' : item.path}
        onClick={(e) => {
          if (isLocked) {
            e.preventDefault();
            setLockedModalOpen(true);
          } else {
            setMobileMenuOpen(false);
          }
        }}
      >
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3',
            isActive && !isLocked && 'bg-secondary text-gold',
            isLocked && 'opacity-50'
          )}
        >
          {isLocked ? (
            <Lock className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
          {item.label}
          {isLocked && (
            <span className="ml-auto text-xs text-muted-foreground">Bloqueado</span>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={user ? '/jornada' : '/'}>
              <Logo size="xl" variant="horizontal" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {menuItems.map(item => renderDesktopItem(item))}
            </div>

            {/* User Menu / Login */}
            <div className="flex items-center gap-2">
              {user && <NotificationBell />}
              
              {user && portal && (
                <div className="hidden sm:flex items-center gap-2 mr-2">
                  <span className="px-2 py-0.5 text-xs bg-gold/20 text-gold rounded-full font-medium">
                    {portal.name.split('/')[0].trim()}
                  </span>
                </div>
              )}

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
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Navegação Principal</DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={() => navigate('/jornada')}>
                      <Home className="w-4 h-4 mr-2" />
                      Minha Jornada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/oracula')}>
                      <Star className="w-4 h-4 mr-2" />
                      Formação Orácula
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/salas')}>
                      <Home className="w-4 h-4 mr-2" />
                      Salas
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Ferramentas do Método</DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={() => navigate('/ferramentas-metodo')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Hub de Ferramentas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/labirinto')}>
                      <Star className="w-4 h-4 mr-2" />
                      Labirinto das 39 Portas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/torre-viva')}>
                      <Star className="w-4 h-4 mr-2" />
                      Torre Viva™
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/big5-oracular')}>
                      <Star className="w-4 h-4 mr-2" />
                      Big Five Oracular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/escala-maia')}>
                      <Star className="w-4 h-4 mr-2" />
                      Escala MAIA
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Recursos Clínicos</DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={() => navigate('/narroterapia')}>
                      <Star className="w-4 h-4 mr-2" />
                      Narroterapia Oracular™
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/radiestesia')}>
                      <Star className="w-4 h-4 mr-2" />
                      Radiestesia
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/atlas-arquetipos')}>
                      <Star className="w-4 h-4 mr-2" />
                      Atlas de Arquétipos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/session-room')}>
                      <Star className="w-4 h-4 mr-2" />
                      Sala de Sessão
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Biblioteca & Oráculos</DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={() => navigate('/minha-biblioteca')}>
                      <Star className="w-4 h-4 mr-2" />
                      Minha Biblioteca
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/biblioteca-travessias')}>
                      <Star className="w-4 h-4 mr-2" />
                      Biblioteca das Travessias
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/oraculos')}>
                      <Star className="w-4 h-4 mr-2" />
                      Oráculos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/clube-do-livro')}>
                      <Star className="w-4 h-4 mr-2" />
                      Clube do Livro
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Sustentação</DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={() => navigate('/casa')}>
                      <Home className="w-4 h-4 mr-2" />
                      Casa / Sustentação
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/jardim-da-psique')}>
                      <Star className="w-4 h-4 mr-2" />
                      Jardim da Psique
                    </DropdownMenuItem>
                    
                    {/* Admin link */}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="w-4 h-4 mr-2" />
                          Painel Admin
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
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
              <div className="flex flex-col gap-2">
                {menuItems.map(item => renderMobileItem(item))}
                
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

      <LockedContentModal 
        open={lockedModalOpen} 
        onOpenChange={setLockedModalOpen} 
      />
    </>
  );
}
