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
  Library,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Users,
  Lock,
  GraduationCap,
  Compass,
  Sparkles,
  Brain,
  Target,
  Bot,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';

// Types for menu items
interface MenuItem {
  path: string;
  label: string;
  icon: typeof Home;
  minPortal: PortalType;
  requiresMatricula?: 'mentoria' | 'formacao';
  children?: MenuItem[];
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

  // Build menu items dynamically based on access
  const buildMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [];

    // 1. Início - always visible for logged users
    items.push({
      path: '/dashboard',
      label: 'Início',
      icon: Home,
      minPortal: 'visitante',
    });

    // 1.5. Minha Jornada - always visible
    items.push({
      path: '/jornada',
      label: 'Minha Jornada',
      icon: Compass,
      minPortal: 'visitante',
    });

    // 2. Mentoria ORÁCULA - only if has matricula
    if (hasMentoriaAccess) {
      items.push({
        path: '/mentoria',
        label: 'Mentoria',
        icon: Compass,
        minPortal: 'pre_iniciada',
        requiresMatricula: 'mentoria',
      });
    }

    // 3. Formação ORÁCULA - only if has matricula
    if (hasFormacaoAccess) {
      items.push({
        path: '/formacao',
        label: 'Formação',
        icon: GraduationCap,
        minPortal: 'pre_iniciada',
        requiresMatricula: 'formacao',
      });
    }

    // 4. Ferramentas (with submenu) - pre_iniciada+
    if (canAccessItem('pre_iniciada')) {
      items.push({
        path: '/ferramentas',
        label: 'Ferramentas',
        icon: Sparkles,
        minPortal: 'pre_iniciada',
        children: [
          { path: '/salas/big5', label: 'Big5', icon: Brain, minPortal: 'pre_iniciada' },
          { path: '/salas/eneagrama', label: 'Eneagrama', icon: Target, minPortal: 'pre_iniciada' },
          { path: '/salas/mapa-oracula', label: 'Oráculos', icon: Sparkles, minPortal: 'pre_iniciada' },
        ],
      });
    }

    // 5. Minhas Clientes - only for verified professionals
    if (canAccessItem('pre_iniciada') && isProfessionalVerified) {
      items.push({
        path: '/minhas-clientes',
        label: 'Minhas Clientes',
        icon: Users,
        minPortal: 'pre_iniciada',
      });
    }

    // 6. Biblioteca - everyone
    items.push({
      path: '/biblioteca',
      label: 'Biblioteca',
      icon: Library,
      minPortal: 'visitante',
    });

    // 7. Casos de Estudo
    if (canAccessItem('pre_iniciada')) {
      items.push({
        path: '/casos',
        label: 'Casos de Estudo',
        icon: BookOpen,
        minPortal: 'pre_iniciada',
      });
    }

    // 8. Agentes
    if (canAccessItem('pre_iniciada')) {
      items.push({
        path: '/agentes',
        label: 'Agentes',
        icon: Bot,
        minPortal: 'pre_iniciada',
      });
    }

    // 9. Admin - only for admins
    if (canAccessItem('admin')) {
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

    // Item with children (dropdown)
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenu key={item.path}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'gap-2 transition-all',
                isActive && !isLocked && 'bg-secondary text-gold',
                isLocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{item.label}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {item.children.map(child => {
              const ChildIcon = child.icon;
              const childActive = location.pathname === child.path;
              return (
                <DropdownMenuItem
                  key={child.path}
                  onClick={() => navigate(child.path)}
                  className={cn(childActive && 'bg-secondary text-gold')}
                >
                  <ChildIcon className="w-4 h-4 mr-2" />
                  {child.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Simple item
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

  // Render mobile menu item
  const renderMobileItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const isLocked = !canAccessWithMatricula(item);

    return (
      <div key={item.path}>
        <Link
          to={isLocked ? '#' : item.path}
          onClick={(e) => {
            if (isLocked) {
              e.preventDefault();
              setLockedModalOpen(true);
            }
            if (!item.children) {
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
        
        {/* Render children as sub-items */}
        {item.children && !isLocked && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map(child => {
              const ChildIcon = child.icon;
              const childActive = location.pathname === child.path;
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'w-full justify-start gap-2',
                      childActive && 'bg-secondary text-gold'
                    )}
                  >
                    <ChildIcon className="w-4 h-4" />
                    {child.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
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
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map(item => renderDesktopItem(item))}
            </div>

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
              <div className="flex flex-col gap-2">
                {menuItems.map(item => renderMobileItem(item))}
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
