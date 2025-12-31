import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { getPortal, canAccessFeature, PortalType } from '@/types/portal';
import {
  Home,
  BookOpen,
  Compass,
  Library,
  FolderOpen,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  User,
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
  { path: '/dashboard', label: 'Início', icon: Home, minPortal: 'visitante' },
  { path: '/travessias', label: 'Travessias', icon: BookOpen, minPortal: 'pre_iniciada' },
  { path: '/metodo', label: 'Método', icon: Compass, minPortal: 'pre_iniciada' },
  { path: '/biblioteca', label: 'Biblioteca', icon: Library, minPortal: 'pre_iniciada' },
  { path: '/casos', label: 'Casos', icon: FolderOpen, minPortal: 'pre_iniciada' },
  { path: '/leitura-oracular', label: 'Leitura Oracular', icon: Sparkles, minPortal: 'iniciada' },
  { path: '/admin', label: 'Admin', icon: Settings, minPortal: 'admin' },
];

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const portal = user ? getPortal(user.portal) : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const accessibleItems = navItems.filter(item => 
    user && canAccessFeature(user.portal, item.minPortal)
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? '/dashboard' : '/'}>
            <Logo size="sm" variant="combined" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {accessibleItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'gap-2 transition-all',
                      isActive && 'bg-secondary text-gold'
                    )}
                  >
                    <Icon className="w-4 h-4" />
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
              {accessibleItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3',
                        isActive && 'bg-secondary text-gold'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
