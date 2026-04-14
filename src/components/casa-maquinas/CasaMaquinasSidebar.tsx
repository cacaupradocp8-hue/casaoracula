import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard, Users, UsersRound, Wrench, BookOpen, Flame, GraduationCap,
  FlaskConical, Settings, Eye, Crown, Calendar, Map, Sparkles, Compass, ChevronLeft, AudioLines, Layers, Brain,
  Armchair,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem { label: string; path: string; icon: React.ElementType; minPortal?: string; }

const mainNav: NavItem[] = [
  { label: 'Casa das Máquinas', path: '/casa-das-maquinas', icon: LayoutDashboard },
  { label: 'Cabine da Terapeuta', path: '/casa-das-maquinas/cabine', icon: Armchair },
  { label: 'Clientes', path: '/casa-das-maquinas/clientes', icon: Users },
  { label: 'Sessões', path: '/casa-das-maquinas/nova-sessao', icon: Calendar },
  { label: 'Grupos', path: '/casa-das-maquinas/grupos', icon: UsersRound },
];
const toolsNav: NavItem[] = [
  { label: 'Jardim do Ofício', path: '/casa-das-maquinas/jardim-oficio', icon: Sparkles },
  { label: 'Evolução Clínica', path: '/casa-das-maquinas/treinamento', icon: Brain },
  { label: 'Biblioteca de Intervenções', path: '/casa-das-maquinas/biblioteca', icon: BookOpen },
  { label: 'Ferramentas', path: '/casa-das-maquinas/ferramentas', icon: Wrench },
  { label: '7 Vozes', path: '/casa-das-maquinas/7-vozes', icon: AudioLines },
  { label: 'Painel Clínico', path: '/casa-das-maquinas/painel-clinico', icon: Compass },
  { label: 'Mapa Vivo', path: '/casa-das-maquinas/mapa-vivo', icon: Map },
  { label: 'Variações', path: '/casa-das-maquinas/variacoes-ferramentas', icon: Layers },
];
const communityNav: NavItem[] = [
  { label: 'Casa das Tecelãs', path: '/casa-das-maquinas/tecelãs', icon: Flame },
  { label: 'Academia Orácula', path: '/casa-das-maquinas/academia', icon: GraduationCap },
];
const systemNav: NavItem[] = [
  { label: 'Supervisão', path: '/casa-das-maquinas/supervisao', icon: Eye, minPortal: 'assinante' },
  { label: 'Painel Admin', path: '/casa-das-maquinas/painel', icon: Crown, minPortal: 'admin' },
  { label: 'QA Jardim+Sessões', path: '/casa-das-maquinas/qa-jardim-sessoes', icon: FlaskConical, minPortal: 'admin' },
  { label: 'Configurações', path: '/casa-das-maquinas/config', icon: Settings },
];

export function CasaMaquinasSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;
  const filterByPortal = (items: NavItem[]) =>
    items.filter(item => !item.minPortal || (user && canAccessFeature(user.portal, item.minPortal as any)));

  const renderGroup = (label: string, items: NavItem[]) => {
    const filtered = filterByPortal(items);
    if (filtered.length === 0) return null;
    return (
      <SidebarGroup key={label}>
        <SidebarGroupLabel className="text-primary/70 uppercase text-[10px] tracking-widest font-medium">
          {label}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {filtered.map(item => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.label}>
                  <Link to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                      isActive(item.path)
                        ? 'bg-primary/15 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    )}>
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
    <Sidebar collapsible="icon" className="border-r border-border/30">
      <SidebarHeader className="p-4 border-b border-border/30">
        <Link to="/casa-das-maquinas" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-display font-semibold truncate">Casa das Máquinas</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cartografia Profissional</p>
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
      <SidebarFooter className="p-3 border-t border-border/30">
        <Link to="/jornada">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 opacity-50 hover:opacity-100 text-xs">
            <ChevronLeft className="w-3.5 h-3.5" />
            {!collapsed && 'Voltar à Formação'}
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
