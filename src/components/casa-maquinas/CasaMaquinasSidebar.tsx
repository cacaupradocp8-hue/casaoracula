import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Wrench,
  BookOpen,
  Flame,
  GraduationCap,
  FlaskConical,
  Settings,
  Eye,
  Crown,
  Calendar,
  Map,
  Sparkles,
  Compass,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  minPortal?: string;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', path: '/casa-das-maquinas', icon: LayoutDashboard },
  { label: 'Clientes', path: '/casa-das-maquinas/clientes', icon: Users },
  { label: 'Sessões', path: '/casa-das-maquinas/sessoes', icon: Calendar },
  { label: 'Grupos', path: '/casa-das-maquinas/grupos', icon: UsersRound },
];

const toolsNav: NavItem[] = [
  { label: 'Ferramentas', path: '/casa-das-maquinas/ferramentas', icon: Wrench },
  { label: 'Biblioteca', path: '/casa-das-maquinas/biblioteca', icon: BookOpen },
  { label: 'Mapa Vivo', path: '/casa-das-maquinas/mapa-vivo', icon: Map },
];

const communityNav: NavItem[] = [
  { label: 'Casa das Tecelãs', path: '/casa-das-maquinas/tecelãs', icon: Flame },
  { label: 'Academia Orácula', path: '/casa-das-maquinas/academia', icon: GraduationCap },
  { label: 'Sala de Treinamento', path: '/casa-das-maquinas/treinamento', icon: FlaskConical },
];

const systemNav: NavItem[] = [
  { label: 'Supervisão', path: '/casa-das-maquinas/supervisao', icon: Eye, minPortal: 'assinante' },
  { label: 'Painel Admin', path: '/casa-das-maquinas/painel', icon: Crown, minPortal: 'admin' },
  { label: 'Configurações', path: '/casa-das-maquinas/config', icon: Settings },
];

export function CasaMaquinasSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  const filterByPortal = (items: NavItem[]) =>
    items.filter(item => {
      if (!item.minPortal) return true;
      if (!user) return false;
      return canAccessFeature(user.portal, item.minPortal as any);
    });

  const renderGroup = (label: string, items: NavItem[]) => {
    const filtered = filterByPortal(items);
    if (filtered.length === 0) return null;

    return (
      <SidebarGroup key={label}>
        <SidebarGroupLabel className="text-[#C9A24A]/60 uppercase text-[10px] tracking-widest font-medium">
          {label}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {filtered.map(item => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  tooltip={item.label}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                      isActive(item.path)
                        ? 'bg-[#C9A24A]/15 text-[#C9A24A] font-medium'
                        : 'text-[#F5F1E8]/60 hover:text-[#F5F1E8] hover:bg-[#F5F1E8]/5'
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#C9A24A]/10 bg-[#0B1B2B]"
    >
      <SidebarHeader className="p-4 border-b border-[#C9A24A]/10">
        <Link to="/casa-das-maquinas" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-[#C9A24A]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F5F1E8] truncate">Casa das Máquinas</p>
              <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-wider">Espaço Profissional</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {renderGroup('Principal', mainNav)}
        {renderGroup('Recursos', toolsNav)}
        {renderGroup('Comunidade', communityNav)}
        {renderGroup('Sistema', systemNav)}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-[#C9A24A]/10">
        <Link to="/jornada">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-[#F5F1E8]/40 hover:text-[#F5F1E8] hover:bg-[#F5F1E8]/5 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {!collapsed && 'Voltar à Formação'}
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
