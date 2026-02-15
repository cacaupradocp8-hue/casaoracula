import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature, PortalType } from '@/types/portal';
import { useToast } from '@/hooks/use-toast';
import {
  Cog,
  Crown,
  Users,
  Calendar,
  FileText,
  Loader2,
  Map,
  Clock,
  Eye,
  Plus,
  Sparkles,
  UserCheck,
  Shield,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const TABS = [
  { label: 'Visão Geral', to: '/casa-das-maquinas', icon: Cog, minPortal: 'oracula' as const },
  { label: 'Clientes', to: '/minhas-clientes', icon: Users, minPortal: 'oracula' as const },
  { label: 'Sala de Sessão', to: '/casa-das-maquinas/sessoes', icon: Calendar, minPortal: 'oracula' as const },
  { label: 'Mapa Vivo', to: '/casa-das-maquinas/mapa-vivo', icon: Map, minPortal: 'oracula' as const },
  { label: 'Histórico', to: '/casa-das-maquinas/historico', icon: Clock, minPortal: 'oracula' as const },
  { label: 'Supervisão', to: '/casa-das-maquinas/supervisao', icon: Eye, minPortal: 'assinante' as const },
  { label: 'Painel Institucional', to: '/casa-das-maquinas/painel', icon: Crown, minPortal: 'admin' as const },
];

interface UserRow {
  id: string;
  nome: string;
  email: string;
  portal: PortalType;
}

export default function PainelInstitucionalPage() {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsuarias: 0,
    visitantes: 0,
    alunas: 0,
    oraculas: 0,
    assinantes: 0,
    admins: 0,
    totalClientes: 0,
    totalSessoes: 0,
  });
  const [usuarios, setUsuarios] = useState<UserRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.portal !== 'admin') return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);

    const [rolesRes, clientesRes, sessoesRes, profilesRes] = await Promise.all([
      supabase.from('user_roles').select('user_id, portal'),
      supabase.from('clientes').select('id', { count: 'exact', head: true }),
      supabase.from('sessoes_casa_maquinas').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id, nome, email'),
    ]);

    const roles = rolesRes.data || [];
    const profiles = profilesRes.data || [];

    const portalCounts: Record<string, number> = {};
    const roleMap: Record<string, string> = {};
    roles.forEach(r => {
      portalCounts[r.portal] = (portalCounts[r.portal] || 0) + 1;
      roleMap[r.user_id] = r.portal;
    });

    const userList: UserRow[] = profiles.map(p => ({
      id: p.id,
      nome: p.nome || '',
      email: p.email || '',
      portal: (roleMap[p.id] || 'visitante') as PortalType,
    }));

    setStats({
      totalUsuarias: roles.length,
      visitantes: portalCounts['visitante'] || 0,
      alunas: (portalCounts['aluna'] || 0) + (portalCounts['pre_iniciada'] || 0) + (portalCounts['aluna_formacao'] || 0) + (portalCounts['mentorada'] || 0),
      oraculas: (portalCounts['oracula'] || 0) + (portalCounts['iniciada'] || 0),
      assinantes: portalCounts['assinante'] || 0,
      admins: portalCounts['admin'] || 0,
      totalClientes: clientesRes.count ?? 0,
      totalSessoes: sessoesRes.count ?? 0,
    });

    setUsuarios(userList);
    setLoading(false);
  };

  const handleChangeRole = async (userId: string, newPortal: PortalType) => {
    setUpdatingId(userId);
    const { error } = await supabase
      .from('user_roles')
      .update({ portal: newPortal })
      .eq('user_id', userId);

    if (error) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Portal atualizado' });
      setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, portal: newPortal } : u));
    }
    setUpdatingId(null);
  };

  const filteredUsers = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleTabs = TABS.filter(tab => {
    if (!user) return false;
    return canAccessFeature(user.portal, tab.minPortal);
  });

  const portalLabel = (portal: PortalType) => {
    const labels: Record<string, string> = {
      visitante: 'Visitante',
      aluna: 'Aluna',
      oracula: 'Certificada',
      assinante: 'Mentorada',
      admin: 'Admin',
      pre_iniciada: 'Aluna',
      iniciada: 'Certificada',
      mentorada: 'Aluna',
      aluna_formacao: 'Aluna',
    };
    return labels[portal] || portal;
  };

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

        {/* Painel Institucional Content */}
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display font-bold text-foreground">Painel Institucional</h2>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalUsuarias}</p>
              <p className="text-xs text-muted-foreground">Total de Usuárias</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.alunas}</p>
              <p className="text-xs text-muted-foreground">Alunas (Iniciadas)</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.oraculas}</p>
              <p className="text-xs text-muted-foreground">Certificadas</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.assinantes}</p>
              <p className="text-xs text-muted-foreground">Mentoradas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalClientes}</p>
              <p className="text-xs text-muted-foreground">Total de Clientes</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalSessoes}</p>
              <p className="text-xs text-muted-foreground">Total de Sessões</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-primary" />
                Gestão de Acessos
              </CardTitle>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nível Atual</TableHead>
                    <TableHead>Alterar Nível</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice(0, 50).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium text-foreground">{u.nome || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{portalLabel(u.portal)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.portal}
                          onValueChange={(val) => handleChangeRole(u.id, val as PortalType)}
                          disabled={updatingId === u.id}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitante">Visitante</SelectItem>
                            <SelectItem value="aluna">Aluna (Iniciada)</SelectItem>
                            <SelectItem value="oracula">Certificada</SelectItem>
                            <SelectItem value="assinante">Mentorada</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length > 50 && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Mostrando 50 de {filteredUsers.length} resultados. Use a busca para filtrar.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
