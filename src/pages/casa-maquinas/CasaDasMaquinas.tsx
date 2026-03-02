import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import {
  Cog,
  Users,
  Calendar,
  Sparkles,
  Map,
  Clock,
  Plus,
  ChevronRight,
  Loader2,
  Crown,
  Eye,
  UserCheck,
  FileText,
  BookOpen,
} from 'lucide-react';

const TABS = [
  { label: 'Visão Geral', to: '/casa-das-maquinas', icon: Cog, minPortal: 'oracula' as const },
  { label: 'Clientes', to: '/minhas-clientes', icon: Users, minPortal: 'oracula' as const },
  { label: 'Sala de Sessão', to: '/casa-das-maquinas/sessoes', icon: Calendar, minPortal: 'oracula' as const },
  { label: 'Mapa Vivo', to: '/casa-das-maquinas/mapa-vivo', icon: Map, minPortal: 'oracula' as const },
  { label: 'Histórico', to: '/casa-das-maquinas/historico', icon: Clock, minPortal: 'oracula' as const },
  
  { label: 'Supervisão', to: '/casa-das-maquinas/supervisao', icon: Eye, minPortal: 'assinante' as const },
  { label: 'Painel Institucional', to: '/casa-das-maquinas/painel', icon: Crown, minPortal: 'admin' as const },
];

export default function CasaDasMaquinas() {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({ clientes: 0, sessoesMes: 0, gestosAtivos: 0 });
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.portal === 'admin';
  const isMentorada = user ? canAccessFeature(user.portal, 'assinante') : false;

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [clientesRes, sessoesRes, gestosRes] = await Promise.all([
      supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('terapeuta_id', user.id),
      supabase.from('sessoes_casa_maquinas').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).gte('data_sessao', firstOfMonth.split('T')[0]),
      supabase.from('gestos_integracao').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).eq('status', 'ativo'),
    ]);

    setStats({
      clientes: clientesRes.count ?? 0,
      sessoesMes: sessoesRes.count ?? 0,
      gestosAtivos: gestosRes.count ?? 0,
    });
    setLoading(false);
  };

  const visibleTabs = TABS.filter(tab => {
    if (!user) return false;
    return canAccessFeature(user.portal, tab.minPortal);
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cog className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Casa das Máquinas</h1>
              <p className="text-sm text-muted-foreground">Centro administrativo profissional</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto pb-px">
          {visibleTabs.map(tab => {
            const isActive = location.pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Dashboard Content - Visão Geral */}
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to="/minhas-clientes">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Cliente
            </Button>
          </Link>
          <Link to="/casa-das-maquinas/sessoes">
            <Button size="sm" variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Nova Sessão
            </Button>
          </Link>
          <Link to="/casa-das-maquinas/gestos">
            <Button size="sm" variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Gestos de Integração
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.clientes}</p>
                  <p className="text-xs text-muted-foreground">Clientes ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.sessoesMes}</p>
                  <p className="text-xs text-muted-foreground">Sessões este mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.gestosAtivos}</p>
                  <p className="text-xs text-muted-foreground">Gestos ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/minhas-clientes">
            <Card className="hover:border-primary/30 transition-all cursor-pointer h-full border-border">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Clientes</h3>
                  <p className="text-sm text-muted-foreground">Gerencie clientes e acompanhamentos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/casa-das-maquinas/sessoes">
            <Card className="hover:border-primary/30 transition-all cursor-pointer h-full border-border">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Sala de Sessão</h3>
                  <p className="text-sm text-muted-foreground">Registre sessões e observações</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/casa-das-maquinas/gestos">
            <Card className="hover:border-primary/30 transition-all cursor-pointer h-full border-border">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Gestos de Integração</h3>
                  <p className="text-sm text-muted-foreground">Ações de integração terapêutica</p>
                </div>
              </CardContent>
            </Card>
          </Link>


          {/* Supervisão - visível apenas para mentoradas e admin */}
          {isMentorada && (
            <Link to="/casa-das-maquinas/supervisao">
              <Card className="hover:border-primary/30 transition-all cursor-pointer h-full border-border">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Supervisão</h3>
                    <p className="text-sm text-muted-foreground">Reflexões e registros de supervisão</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Painel Institucional - admin only */}
          {isAdmin && (
            <Link to="/casa-das-maquinas/painel">
              <Card className="hover:border-primary/30 transition-all cursor-pointer h-full border-border border-l-4 border-l-primary">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Painel Institucional</h3>
                    <p className="text-sm text-muted-foreground">Métricas e gestão de acessos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
