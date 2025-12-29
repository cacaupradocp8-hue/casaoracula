import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PortalBadge } from '@/components/shared/PortalBadge';
import { useToast } from '@/hooks/use-toast';
import { PORTALS, PortalType, getPortal } from '@/types/portal';
import { Settings, Users, Search, UserCog, Eye, Crown, Flame, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  portal: PortalType;
  createdAt: Date;
  casesCount: number;
  lastActive: Date;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'Maria Iniciada',
    email: 'maria@email.com',
    portal: 'iniciada',
    createdAt: new Date('2023-06-15'),
    casesCount: 12,
    lastActive: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Ana Pré-Iniciada',
    email: 'ana@email.com',
    portal: 'pre_iniciada',
    createdAt: new Date('2023-11-01'),
    casesCount: 3,
    lastActive: new Date('2024-01-22'),
  },
  {
    id: '3',
    name: 'Carla Buscadora',
    email: 'carla@email.com',
    portal: 'visitante',
    createdAt: new Date('2024-01-10'),
    casesCount: 0,
    lastActive: new Date('2024-01-18'),
  },
  {
    id: '4',
    name: 'Julia Estudante',
    email: 'julia@email.com',
    portal: 'visitante',
    createdAt: new Date('2024-01-19'),
    casesCount: 0,
    lastActive: new Date('2024-01-21'),
  },
];

export default function Admin() {
  const { toast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPortal, setFilterPortal] = useState<string>('all');

  const handlePortalChange = (userId: string, newPortal: PortalType) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, portal: newPortal } : user
    ));
    
    const user = users.find(u => u.id === userId);
    const portalData = getPortal(newPortal);
    
    toast({
      title: 'Portal atualizado',
      description: `${user?.name} agora está no ${portalData.name}`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPortal = filterPortal === 'all' || user.portal === filterPortal;
    
    return matchesSearch && matchesPortal;
  });

  const stats = {
    total: users.length,
    visitante: users.filter(u => u.portal === 'visitante').length,
    pre_iniciada: users.filter(u => u.portal === 'pre_iniciada').length,
    iniciada: users.filter(u => u.portal === 'iniciada').length,
    admin: users.filter(u => u.portal === 'admin').length,
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Painel da Guardiã"
          subtitle="Gerencie usuárias e portais da Casa ORÁCULA"
          icon={<Settings className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-display font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-display font-bold text-foreground">{stats.visitante}</p>
              <p className="text-xs text-muted-foreground">Visitantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-burgundy-light" />
              <p className="text-2xl font-display font-bold text-foreground">{stats.pre_iniciada}</p>
              <p className="text-xs text-muted-foreground">Pré-Iniciadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-gold" />
              <p className="text-2xl font-display font-bold text-foreground">{stats.iniciada}</p>
              <p className="text-xs text-muted-foreground">Iniciadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 mx-auto mb-2 text-accent-foreground" />
              <p className="text-2xl font-display font-bold text-foreground">{stats.admin}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPortal} onValueChange={setFilterPortal}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por Portal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Portais</SelectItem>
                <SelectItem value="visitante">Visitante</SelectItem>
                <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                <SelectItem value="iniciada">Iniciada</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-gold transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-display font-bold text-foreground">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Desde {format(user.createdAt, "MMM yyyy", { locale: ptBR })}</span>
                        <span>•</span>
                        <span>{user.casesCount} casos</span>
                        <span>•</span>
                        <span>Ativo {format(user.lastActive, "d MMM", { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <PortalBadge portal={user.portal} />
                    <Select
                      value={user.portal}
                      onValueChange={(v) => handlePortalChange(user.id, v as PortalType)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PORTALS.map((portal) => (
                          <SelectItem key={portal.type} value={portal.type}>
                            {portal.name.split('/')[0].trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma usuária encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
