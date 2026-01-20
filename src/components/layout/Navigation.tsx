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
  Compass,
  Sparkles,
  GraduationCap,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

// Types for menu items
interface MenuItem {
  path: string;
  label: string;
  icon: typeof Home;
  minPortal: PortalType;
  requiresMatricula?: 'mentoria' | 'formacao';
}

interface MenuBlock {
  id: string;
  label: string;
  items: MenuItem[];
}

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [hasMentoriaAccess, setHasMentoriaAccess] = useState(false);
  const [hasFormacaoAccess, setHasFormacaoAccess] = useState(false);
  const [isProfessionalVerified, setIsProfessionalVerified] = useState(false);

  const portal = user ? getPortal(user.portal) : null;
  const isAdmin = user?.portal === 'admin';
  const isProfessionalLevel = user && canAccessFeature(user.portal, 'pre_iniciada');

  // Check matriculas for mentoria and formação, and professional status
  useEffect(() => {
    const checkAccessAndProfessionalStatus = async () => {
      if (!user) {
        setHasMentoriaAccess(false);
        setHasFormacaoAccess(false);
        setIsProfessionalVerified(false);
        return;
      }

      // Admin has access to everything
      if (user.portal === 'admin') {
        setHasMentoriaAccess(true);
        setHasFormacaoAccess(true);
        setIsProfessionalVerified(true);
        return;
      }

      try {
        // Check matriculas
        const { data: matriculas } = await supabase
          .from('matriculas')
          .select('curso_id')
          .eq('user_id', user.id)
          .eq('ativa', true);

        if (matriculas) {
          const cursoIds = matriculas.map(m => m.curso_id);
          setHasMentoriaAccess(cursoIds.includes('mentoria_oracula') || cursoIds.includes('mentoria'));
          setHasFormacaoAccess(cursoIds.includes('formacao_oracula') || cursoIds.includes('formacao'));
        }

        // Check professional status from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_professional_verified, role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsProfessionalVerified(
            profile.is_professional_verified === true || 
            profile.role === 'terapeuta'
          );
        }
      } catch (error) {
        console.error('Error checking access:', error);
      }
    };

    checkAccessAndProfessionalStatus();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user can access this item based on portal level
  const canAccessItem = (minPortal: PortalType) => {
    return user && canAccessFeature(user.portal, minPortal);
  };

  // Check if user can access item with matricula requirement
  const canAccessWithMatricula = (item: MenuItem): boolean => {
    if (!canAccessItem(item.minPortal)) return false;
    
    if (item.requiresMatricula === 'mentoria') return hasMentoriaAccess;
    if (item.requiresMatricula === 'formacao') return hasFormacaoAccess;
    
    return true;
  };

  // Build menu blocks based on role and portal
  // ═══════════════════════════════════════════════════════════════
  // MENU FIXO: 5 ITENS DEFINITIVOS
  // 1. Casa Orácula (home/dashboard)
  // 2. Meu Caminho (jornada)
  // 3. Formação (salas)
  // 4. Ferramentas do Método (ferramentas)
  // 5. Sustentação (casa - Casa das Tecelãs)
  // ═══════════════════════════════════════════════════════════════
  const buildMenuBlocks = (): MenuBlock[] => {
    const blocks: MenuBlock[] = [];

    // ═══════════════════════════════════════════════════════════════
    // MENU PRINCIPAL (5 itens fixos)
    // ═══════════════════════════════════════════════════════════════
    const mainItems: MenuItem[] = [
      {
        path: '/dashboard',
        label: 'Casa Orácula',
        icon: Home,
        minPortal: 'visitante',
      },
      {
        path: '/jornada',
        label: 'Meu Caminho',
        icon: Compass,
        minPortal: 'visitante',
      },
      {
        path: '/salas',
        label: 'Formação',
        icon: GraduationCap,
        minPortal: 'pre_iniciada',
      },
      {
        path: '/ferramentas',
        label: 'Ferramentas do Método',
        icon: Sparkles,
        minPortal: 'pre_iniciada',
      },
      {
        path: '/casa',
        label: 'Sustentação',
        icon: Heart,
        minPortal: 'iniciada',
      },
    ];

    blocks.push({
      id: 'principal',
      label: 'Menu',
      items: mainItems,
    });

    // ═══════════════════════════════════════════════════════════════
    // ADMIN (somente para admin - separado do menu principal)
    // ═══════════════════════════════════════════════════════════════
    if (isAdmin) {
      blocks.push({
        id: 'admin',
        label: 'Admin',
        items: [
          {
            path: '/admin',
            label: 'Admin',
            icon: Settings,
            minPortal: 'admin',
          },
        ],
      });
    }

    return blocks;
  };

  const menuBlocks = buildMenuBlocks();
  
  // Flatten all items for mobile and simple rendering
  const allVisibleItems = menuBlocks.flatMap(block => block.items);

  // Handle click on nav item
  const handleNavClick = (item: MenuItem, e: React.MouseEvent) => {
    if (!canAccessWithMatricula(item)) {
      e.preventDefault();
      setLockedModalOpen(true);
    }
  };

  // Render desktop menu item
  const renderDesktopItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || 
      (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
    const isLocked = !canAccessWithMatricula(item);

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
          <span className="hidden lg:inline">{item.label}</span>
        </Button>
      </Link>
    );
  };

  // Render desktop navigation with visual separators between blocks
  const renderDesktopNavigation = () => {
    return (
      <div className="hidden md:flex items-center gap-1">
        {menuBlocks.map((block, blockIndex) => (
          <div key={block.id} className="flex items-center">
            {/* Separator between blocks */}
            {blockIndex > 0 && (
              <div className="h-4 w-px bg-border/50 mx-2" />
            )}
            
            {/* Block items */}
            <div className="flex items-center gap-1">
              {block.items.map(item => renderDesktopItem(item))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render mobile menu item
  const renderMobileItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const isLocked = !canAccessWithMatricula(item);

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

  // Render mobile navigation with block labels
  const renderMobileNavigation = () => {
    return (
      <div className="flex flex-col gap-4">
        {menuBlocks.map(block => (
          <div key={block.id}>
            {/* Block label */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              {block.label}
            </p>
            
            {/* Block items */}
            <div className="flex flex-col gap-1">
              {block.items.map(item => renderMobileItem(item))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={user ? '/dashboard' : '/'}>
              <Logo size="xl" variant="horizontal" />
            </Link>

            {/* Desktop Navigation */}
            {renderDesktopNavigation()}

            {/* User Menu */}
            <div className="flex items-center gap-2">
              {user && <NotificationBell />}
              
              {user && portal && (
                <div className="hidden sm:flex items-center gap-2 mr-2">
                  <span className="px-2 py-0.5 text-xs bg-gold/20 text-gold rounded-full font-medium">
                    {portal.name.split('/')[0].trim()}
                  </span>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user && (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
              {renderMobileNavigation()}
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
