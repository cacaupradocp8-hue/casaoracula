import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, ChevronRight, PanelLeftClose, PanelLeft,
  GraduationCap, BookOpen, Compass, DoorOpen, FolderTree, Castle, Flower2, Moon, Target, Zap,
  Headphones, PenLine, FileText, LayoutGrid, ImageIcon as GalleryIcon,
  Flame, MessageSquare, Users, Sparkles,
  UserCheck, TrendingUp, Gift, RefreshCw, Map as MapIcon,
  Settings, CreditCard, Wrench, ClipboardList, Bot, Brain, Layers, Library, Megaphone, FolderOpen, Video, Cog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface AdminNavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  route?: string; // external route (navigates away from admin tabs)
}

export interface AdminNavGroup {
  key: string;
  label: string;
  emoji: string;
  icon: React.ElementType;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    key: 'clube-premium',
    label: 'Clube Oracular',
    emoji: '✨',
    icon: Sparkles,
    items: [
      { key: 'clube', label: 'Hub Editorial', icon: Sparkles, route: '/admin/clube' },
      { key: 'clube-jornadas', label: 'Estações & Rotas', icon: RefreshCw, route: '/admin/clube/ciclos' },
      { key: 'clube-acervo', label: 'Conteúdos (Acervo)', icon: Library, route: '/admin/clube/conteudos' },
      { key: 'clube-chat', label: 'Converse com o Livro', icon: MessageSquare, route: '/admin/clube/chat' },
      { key: 'clube-treinamento', label: 'Sala de Treinamento', icon: GraduationCap, route: '/admin/clube/treinamento' },
    ],
  },
  {
    key: 'formacao',
    label: 'Casa da Formação',
    emoji: '🎓',
    icon: GraduationCap,
    items: [
      { key: 'cursos', label: 'Cursos & Aulas', icon: Video },
      { key: 'travessias', label: 'Travessias', icon: Compass },
      { key: 'formacao', label: 'Páginas de Vendas', icon: Megaphone },
      { key: 'certificacao', label: 'Certificações', icon: UserCheck },
    ],
  },
  {
    key: 'ferramentas-simbolicas',
    label: 'Ferramentas Simbólicas',
    emoji: '🔮',
    icon: Moon,
    items: [
      { key: 'labirinto', label: 'Labirinto 39P', icon: DoorOpen },
      { key: 'labirinto-heroina', label: 'Heroína Interna®', icon: Compass },
      { key: 'big5-simbolico', label: 'Mapa 5 Territórios', icon: Moon },
      { key: 'eneagrama-feminino', label: 'Oráculo 9 Arquétipos', icon: Flower2 },
      { key: 'jornada-heroina', label: 'Caminho da Mulher', icon: Compass },
      { key: 'torre-viva', label: 'Torre Viva™', icon: Castle },
      { key: 'atlas-feminino', label: 'Atlas Arquétipos', icon: Flower2 },
      { key: 'radiestesia', label: 'Radiestesia', icon: Target },
    ],
  },
  {
    key: 'estudio',
    label: 'Casa do Estúdio',
    emoji: '🎧',
    icon: Headphones,
    items: [
      { key: 'estudio-oracular', label: 'Estúdio Oracular', icon: Headphones },
      { key: 'gerador-semanal', label: 'Ateliê IA', icon: Sparkles },
      { key: 'audios', label: 'Áudios & Sons', icon: Headphones },
      { key: 'galeria', label: 'Galeria de Mídias', icon: GalleryIcon },
      { key: 'vitrine', label: 'Vitrine de Cards', icon: LayoutGrid },
    ],
  },
  {
    key: 'comunidade',
    label: 'Casa da Comunidade',
    emoji: '🤝',
    icon: Users,
    items: [
      { key: 'casa-oracula', label: 'Painel Mestre', icon: Flame },
      { key: 'founder', label: 'Founder Analytics', icon: TrendingUp },
      { key: 'comunicacao', label: 'Comunicação', icon: MessageSquare },
      { key: 'narroterapia', label: 'Narroterapia', icon: BookOpen },
      { key: 'grupos', label: 'Grupos & Tribos', icon: Users },
    ],
  },
  {
    key: 'sistema',
    label: 'Casa do Sistema',
    emoji: '⚙️',
    icon: Settings,
    items: [
      { key: 'users', label: 'Usuárias', icon: Users },
      { key: 'assinaturas', label: 'Assinaturas', icon: CreditCard },
      { key: 'planos-clube', label: 'Planos & Checkout', icon: CreditCard },
      { key: 'settings', label: 'Configurações', icon: Cog },
    ],
  },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    // Auto-expand the group containing the active tab
    const initial: Record<string, boolean> = {};
    for (const group of adminNavGroups) {
      if (group.items.some(item => item.key === activeTab)) {
        initial[group.key] = true;
      }
    }
    return initial;
  });

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  return (
    <aside
      className={cn(
        'sticky top-20 h-[calc(100vh-5rem)] border-r border-primary/10 bg-card/50 backdrop-blur-sm transition-all duration-300 shrink-0',
        collapsed ? 'w-14' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-2 border-b border-primary/10">
        {!collapsed && (
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Administração
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-3rem)]">
        <nav className="p-2 space-y-1">
          {adminNavGroups.map(group => {
            const isExpanded = expandedGroups[group.key] ?? false;
            const hasActiveItem = group.items.some(item => item.key === activeTab);
            const GroupIcon = group.icon;

            return (
              <div key={group.key}>
                <button
                  onClick={() => collapsed ? undefined : toggleGroup(group.key)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-colors',
                    hasActiveItem
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                  )}
                  title={collapsed ? group.label : undefined}
                >
                  <span className="text-base shrink-0">{group.emoji}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{group.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                      )}
                    </>
                  )}
                </button>

                {!collapsed && isExpanded && (
                  <div className="ml-4 mt-1 mb-2 space-y-0.5 border-l border-primary/10 pl-2">
                    {group.items.map(item => {
                      const ItemIcon = item.icon;
                      const isActive = activeTab === item.key;

                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            if (item.route) {
                              navigate(item.route);
                            } else {
                              onTabChange(item.key);
                              // Sync URL for clube sub-tabs to avoid 404/blank screen on direct paths
                              if (item.key === 'clube') navigate('/admin/clube');
                              if (item.key === 'clube-jornadas') navigate('/admin/clube/ciclos');
                              if (item.key === 'clube-portais') navigate('/admin/clube/portais');
                              if (item.key === 'clube-acervo') navigate('/admin/clube/conteudos');
                              if (item.key === 'clube-treinamento') navigate('/admin/clube/treinamento');
                              if (item.key === 'clube-chat') navigate('/admin/clube/chat');
                            }
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors',
                            isActive
                              ? 'bg-primary/15 text-primary font-medium'
                              : 'text-foreground/60 hover:text-foreground hover:bg-muted/40'
                          )}
                        >
                          <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
