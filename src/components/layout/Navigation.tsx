import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { getPortal, canAccessFeature, PortalType } from '@/types/portal';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import {
  Home,
  BookOpen,
  Library,
  FolderOpen,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Users,
  Bot,
  Wrench,
  Lock,
  DoorOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems: { path: string; label: string; icon: typeof Home; minPortal: PortalType }[] = [
  { path: '/dashboard', label: 'Salas', icon: DoorOpen, minPortal: 'visitante' },
  { path: '/biblioteca', label: 'Biblioteca', icon: Library, minPortal: 'pre_iniciada' },
  { path: '/casos', label: 'Casos', icon: FolderOpen, minPortal: 'pre_iniciada' },
  { path: '/agentes', label: 'Agentes IA', icon: Bot, minPortal: 'pre_iniciada' },
  { path: '/ferramentas', label: 'Ferramentas', icon: Wrench, minPortal: 'pre_iniciada' },
  { path: '/mentoria', label: 'Mentoria', icon: Users, minPortal: 'iniciada' },
  { path: '/leitura-oracular', label: 'Supervisão', icon: Sparkles, minPortal: 'iniciada' },
  { path: '/admin', label: 'Admin', icon: Settings, minPortal: 'admin' },
];

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  const portal = user ? getPortal(user.portal) : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user can access this item
  const canAccessItem = (minPortal: PortalType) => {
    return user && canAccessFeature(user.portal, minPortal);
  };

  // Handle click on nav item
  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (!canAccessItem(item.minPortal)) {
      e.preventDefault();
      setLockedModalOpen(true);
    }
  };

  // Filter items to show - show all except admin for non-admins
  const visibleItems = navItems.filter(item => 
    item.minPortal !== 'admin' || canAccessItem('admin')
  );

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
              {visibleItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                const isLocked = !canAccessItem(item.minPortal);
                
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
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
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
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const isLocked = !canAccessItem(item.minPortal);
                  
                  return (
                    <Link
                      key={item.path}
                      to={isLocked ? '#' : item.path}
                      onClick={(e) => {
                        if (isLocked) {
                          e.preventDefault();
                          setLockedModalOpen(true);
                        }
                        setMobileMenuOpen(false);
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
                })}
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
