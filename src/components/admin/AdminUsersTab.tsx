import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PortalBadge } from '@/components/shared/PortalBadge';
import { useToast } from '@/hooks/use-toast';
import { PORTALS, PortalType, getPortal } from '@/types/portal';
import { Users, Search, Eye, Crown, Flame, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  portal: PortalType;
  createdAt: Date;
}

export function AdminUsersTab() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPortal, setFilterPortal] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, nome, created_at');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, portal');

      if (rolesError) throw rolesError;

      const usersData: AdminUser[] = (profiles || []).map(profile => {
        const role = roles?.find(r => r.user_id === profile.id);
        return {
          id: profile.id,
          name: profile.nome || 'Sem nome',
          email: profile.email || '',
          portal: (role?.portal as PortalType) || 'visitante',
          createdAt: new Date(profile.created_at),
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erro ao carregar usuárias',
        description: 'Não foi possível carregar a lista de usuárias.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePortalChange = async (userId: string, newPortal: PortalType) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ portal: newPortal })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, portal: newPortal } : user
      ));
      
      const user = users.find(u => u.id === userId);
      const portalData = getPortal(newPortal);
      
      toast({
        title: 'Portal atualizado',
        description: `${user?.name} agora está no ${portalData.name}`,
      });
    } catch (error) {
      console.error('Error updating portal:', error);
      toast({
        title: 'Erro ao atualizar portal',
        description: 'Não foi possível atualizar o portal da usuária.',
        variant: 'destructive',
      });
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
      <div className="glass rounded-xl p-4">
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
  );
}
