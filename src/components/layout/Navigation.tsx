import { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDomain } from '@/contexts/AppDomainContext';
import { RitualSaidaDialog, type RitualSaidaAudioPlayback } from '@/components/ritual/RitualSaidaDialog';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { canAccessFeature } from '@/types/portal';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { forceFullRefresh } from '@/components/pwa/ServiceWorkerUpdateToast';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getPublicAudioUrl } from '@/lib/audioUtils';
import {
  Home, Settings, LogOut, Menu, X, User, LogIn, RefreshCw,
  BookOpen, Compass, Wrench, Flower2, GraduationCap, ChevronDown,
  Cog, Users, Calendar, Sparkles, Map, Clock, Eye, Crown, ArrowLeftRight,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub,
  DropdownMenuSubTrigger, DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

// ── VISITANTE / GRATUITO ─────────────────────────────────────────────────────
const visitanteMenuGroups = () => [
  { key: 'explorar', label: 'Explorar a Casa', icon: Compass, path: '/explorar-a-casa', subitems: [] },
  { key: 'formacao', label: 'Formação Orácula', icon: GraduationCap, path: '/oracula', subitems: [] },
  { key: 'clube', label: 'Clube do Livro', icon: BookOpen, path: '/app/clube', subitems: [] },
  { key: 'vitrine', label: 'Vitrine', icon: Sparkles, path: '/vitrine', subitems: [] },
];

// ── ASSINANTE DO CLUBE ──────────────────────────────────────────────────────
const assinanteMenuGroups = () => [
  { key: 'inicio', label: 'Dashboard', icon: Home, path: '/dashboard-membro', subitems: [] },
  { key: 'formacao', label: 'Formação', icon: GraduationCap, path: '/cursos', subitems: [] },
  { key: 'clube', label: 'Clube', icon: BookOpen, path: '/app/clube', subitems: [] },
  { key: 'ferramentas', label: 'Ferramentas', icon: Wrench, path: '/ferramentas', subitems: [] },
  { key: 'jardim', label: 'Jardins', icon: Flower2, path: '/jardim-da-psique', subitems: [] },
  { key: 'vitrine', label: 'Vitrine', icon: Sparkles, path: '/vitrine', subitems: [] },
];

// ── ALUNA DE FORMAÇÃO ───────────────────────────────────────────────────────
const alunaMenuGroups = () => [
  { key: 'inicio', label: 'Dashboard', icon: Home, path: '/dashboard-membro', subitems: [] },
  { key: 'formacao', label: 'Formação', icon: GraduationCap, path: '/cursos', subitems: [] },
  { key: 'clube', label: 'Clube', icon: BookOpen, path: '/app/clube', subitems: [] },
  { key: 'ferramentas', label: 'Ferramentas', icon: Wrench, path: '/ferramentas', subitems: [] },
  { key: 'jardim', label: 'Jardins', icon: Flower2, path: '/jardim-da-psique', subitems: [] },
  { key: 'vitrine', label: 'Vitrine', icon: Sparkles, path: '/vitrine', subitems: [] },
];

// ── MUNDO 2: Casa das Máquinas (Espaço Profissional) ────────────────────────
const profissionalMenuGroups = (isAdmin: boolean, isMentorada: boolean) => [
  { key: 'visao-geral', label: 'Casa das Máquinas', icon: Cog, path: '/casa-das-maquinas', subitems: [] },
  { key: 'clientes', label: 'Clientes', icon: Users, path: '/casa-das-maquinas/clientes', subitems: [] },
  {
    key: 'sessoes', label: 'Sessões', icon: Calendar, path: '/casa-das-maquinas/nova-sessao',
    subitems: [
      { label: 'Nova Sessão', path: '/casa-das-maquinas/nova-sessao' },
      { label: 'Mapa Vivo', path: '/casa-das-maquinas/mapa-vivo' },
      { label: 'Gestos de Integração', path: '/casa-das-maquinas/gestos' },
    ],
  },
  { key: 'jardim-oficio', label: 'Jardim do Ofício', icon: Flower2, path: '/casa-das-maquinas/jardim-oficio', subitems: [] },
  { key: 'evolucao', label: 'Evolução Clínica', icon: GraduationCap, path: '/casa-das-maquinas/treinamento', subitems: [] },
  { key: 'biblioteca', label: 'Biblioteca de Intervenções', icon: BookOpen, path: '/casa-das-maquinas/biblioteca', subitems: [] },
  { key: 'ferramentas', label: 'Ferramentas', icon: Wrench, path: '/casa-das-maquinas/ferramentas', subitems: [] },
  { key: '7vozes', label: '7 Vozes', icon: Headphones, path: '/casa-das-maquinas/7-vozes', subitems: [] },
  ...(isMentorada ? [{
    key: 'supervisao', label: 'Supervisão', icon: Eye, path: '/casa-das-maquinas/supervisao', subitems: [],
  }] : []),
  ...(isAdmin ? [{
    key: 'painel-institucional', label: 'Painel Admin', icon: Crown, path: '/casa-das-maquinas/painel', subitems: [],
  }] : []),
];

export function Navigation() {
  const { user, logout } = useAuth();
  const { domain, toggleDomain } = useAppDomain();
  const { getSetting } = useAppSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [ritualSaidaOpen, setRitualSaidaOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const [ritualAudioPlayback, setRitualAudioPlayback] = useState<RitualSaidaAudioPlayback | null>(null);
  const ritualAudioRef = useRef<HTMLAudioElement | null>(null);

  const isAdmin = user?.portal === 'admin';
  const hasOracula = user ? canAccessFeature(user.portal, 'oracula') : false;
  const isMentorada = user ? canAccessFeature(user.portal, 'assinante') : false;
  const isHybrid = hasOracula || isAdmin;
  const activeDomain = (isHybrid && domain === 'profissional') ? 'profissional' : 'aluna';

  // Profile-based menu selection
  const getMenuForProfile = () => {
    if (activeDomain === 'profissional') return profissionalMenuGroups(isAdmin, isMentorada);
    if (isAdmin || hasOracula) return alunaMenuGroups(); // Aluna de formação
    const isAssinante = user ? canAccessFeature(user.portal, 'assinante') : false;
    const isAluna = user ? canAccessFeature(user.portal, 'aluna') : false;
    if (isAssinante) return assinanteMenuGroups();
    if (isAluna) return alunaMenuGroups();
    return visitanteMenuGroups(); // Visitante / Gratuito
  };
  const menuGroups = getMenuForProfile();

  const ritualAudioUrl = useMemo(() => {
    return getPublicAudioUrl(getSetting('ritual_saida_audio_url', ''));
  }, [getSetting]);

  const handleLogout = () => {
    let nextPlayback: RitualSaidaAudioPlayback | null = null;

    if (ritualAudioUrl) {
      try {
        ritualAudioRef.current?.pause();

        const audio = new Audio(ritualAudioUrl);
        audio.preload = 'auto';
        audio.volume = 0.22;

        const playbackStarted = audio.play()
          .then(() => true)
          .catch(() => false);

        ritualAudioRef.current = audio;
        nextPlayback = { audio, playbackStarted };
      } catch {
        ritualAudioRef.current = null;
      }
    }

    setRitualAudioPlayback(nextPlayback);
    setRitualSaidaOpen(true);
  };

  const handleConfirmExit = () => {
    setRitualSaidaOpen(false);
    setRitualAudioPlayback(null);
    ritualAudioRef.current = null;
    logout();
    navigate('/');
  };

  const handleToggleDomain = () => {
    const next = activeDomain === 'aluna' ? 'profissional' : 'aluna';
    toggleDomain();
    if (next === 'profissional') navigate('/casa-das-maquinas');
    else navigate('/dashboard-membro');
    setMobileMenuOpen(false);
  };

  const isActive = (paths: string[]) =>
    paths.some(p => location.pathname === p || (p !== '/' && location.pathname.startsWith(p)));

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to={user ? (activeDomain === 'profissional' ? '/casa-das-maquinas' : '/dashboard-membro') : '/'} className="h-full flex items-center py-2">
              <span className="font-display text-2xl md:text-3xl text-primary tracking-wider font-semibold" style={{ letterSpacing: '0.08em' }}>Casa <span className="uppercase font-bold">Orácula</span></span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-0.5">
              {menuGroups.map(group => {
                const Icon = group.icon;
                const active = isActive(group.subitems.length ? group.subitems.map(s => s.path) : [group.path]);

                if (!group.subitems.length) {
                  return (
                    <Link key={group.key} to={group.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'gap-1.5 transition-all rounded-lg text-foreground/70 hover:text-foreground hover:bg-primary/5',
                          active && 'bg-primary/10 text-primary border border-primary/15'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{group.label}</span>
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
                        className={cn(
                          'gap-1.5 transition-all rounded-lg text-foreground/70 hover:text-foreground hover:bg-primary/5',
                          active && 'bg-primary/10 text-primary border border-primary/15'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{group.label}</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card/95 backdrop-blur-xl border-primary/10">
                      {group.subitems.map(item => (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="text-foreground/80 hover:text-foreground focus:bg-primary/10 cursor-pointer"
                        >
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user && <NotificationBell />}

              {user && isHybrid && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleDomain}
                  className={cn(
                    'hidden md:flex gap-1.5 text-xs transition-all rounded-lg',
                    activeDomain === 'profissional'
                      ? 'border-primary/40 text-primary bg-primary/5 hover:bg-primary/10'
                      : 'border-border/50 text-muted-foreground hover:border-primary/30'
                  )}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  {activeDomain === 'profissional' ? '🧠 Profissional' : '🌿 Aluna'}
                </Button>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full border border-primary/10 hover:border-primary/30 hover:bg-primary/5">
                      <User className="w-5 h-5 text-foreground/70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-primary/10">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-xs text-primary">{user.portal}</p>
                      </div>
                    </div>

                    <DropdownMenuSeparator className="bg-primary/10" />

                    {isHybrid && (
                      <>
                        <DropdownMenuItem onClick={handleToggleDomain} className="cursor-pointer">
                          <ArrowLeftRight className="w-4 h-4 mr-2" />
                          {activeDomain === 'profissional' ? 'Ir para Modo Aluna 🌿' : 'Ir para Espaço Profissional 🧠'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary/10" />
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Painel Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary/10" />
                      </>
                    )}

                    <DropdownMenuItem onClick={() => navigate('/minha-conta')} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/suporte')} className="cursor-pointer">
                      <Headphones className="w-4 h-4 mr-2" />
                      Ajuda
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={() => forceFullRefresh()} className="cursor-pointer">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Forçar Atualização
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="gold" size="sm" className="gap-2 shadow-gold">
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
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/10 animate-slide-up">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {user && isHybrid && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 mb-3 border-primary/20 hover:bg-primary/5"
                    onClick={handleToggleDomain}
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                    {activeDomain === 'profissional' ? 'Modo Aluna 🌿' : 'Espaço Profissional 🧠'}
                  </Button>
                )}

                {menuGroups.map(group => {
                  const Icon = group.icon;
                  const expanded = mobileExpandedGroup === group.key;

                  if (!group.subitems.length) {
                    return (
                      <Link key={group.key} to={group.path} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-foreground/80 hover:text-foreground hover:bg-primary/5">
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
                        className="w-full justify-start gap-3 text-foreground/80 hover:text-foreground hover:bg-primary/5"
                        onClick={() => setMobileExpandedGroup(expanded ? null : group.key)}
                      >
                        <Icon className="w-5 h-5" />
                        {group.label}
                        <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform', expanded && 'rotate-180')} />
                      </Button>

                      {expanded && (
                        <div className="ml-8 flex flex-col gap-1 mt-1 mb-2">
                          {group.subitems.map(item => (
                            <Link key={item.path} to={item.path} onClick={() => { setMobileMenuOpen(false); setMobileExpandedGroup(null); }}>
                              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-foreground/60 hover:text-foreground hover:bg-primary/5">
                                {item.label}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {user && (
                  <>
                    <div className="h-px bg-primary/10 my-2" />
                    <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                      <LogOut className="w-5 h-5" />
                      Sair
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <RitualSaidaDialog open={ritualSaidaOpen} onClose={() => setRitualSaidaOpen(false)} onConfirmExit={handleConfirmExit} audioPlayback={ritualAudioPlayback} />
      <LockedContentModal open={lockedModalOpen} onOpenChange={setLockedModalOpen} />
    </>
  );
}
