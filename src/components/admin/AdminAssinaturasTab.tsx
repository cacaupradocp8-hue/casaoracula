import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, CreditCard, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Subscription {
  id: string;
  user_id: string;
  provider: string;
  plan_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  next_billing_date: string | null;
  external_subscription_id: string | null;
  created_at: string;
  user_email?: string;
  user_nome?: string;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  active: { label: 'Ativa', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-sage/20 text-sage-light' },
  past_due: { label: 'Vencida', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-gold/20 text-gold' },
  canceled: { label: 'Cancelada', icon: <XCircle className="w-4 h-4" />, color: 'bg-destructive/20 text-destructive' },
  expired: { label: 'Expirada', icon: <Clock className="w-4 h-4" />, color: 'bg-muted text-muted-foreground' },
};

export function AdminAssinaturasTab() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar assinaturas:', error);
    } else {
      const subscriptionsWithUsers = await Promise.all(
        (data || []).map(async (s) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, nome')
            .eq('id', s.user_id)
            .single();
          
          return {
            ...s,
            user_email: profile?.email || 'N/A',
            user_nome: profile?.nome || 'Sem nome',
          };
        })
      );
      setSubscriptions(subscriptionsWithUsers);
    }
    setLoading(false);
  };

  const filteredSubscriptions = subscriptions.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      s.user_email?.toLowerCase().includes(term) ||
      s.user_nome?.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    past_due: subscriptions.filter(s => s.status === 'past_due').length,
    canceled: subscriptions.filter(s => s.status === 'canceled').length,
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-display font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-sage-light" />
            <p className="text-2xl font-display font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gold" />
            <p className="text-2xl font-display font-bold">{stats.past_due}</p>
            <p className="text-xs text-muted-foreground">Vencidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-display font-bold">{stats.canceled}</p>
            <p className="text-xs text-muted-foreground">Canceladas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {filteredSubscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhuma assinatura encontrada.' : 'Nenhuma assinatura cadastrada.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuária</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Próx. Cobrança</TableHead>
                <TableHead>Provider</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => {
                const config = statusConfig[sub.status] || statusConfig.expired;
                return (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sub.user_nome}</p>
                        <p className="text-sm text-muted-foreground">{sub.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${config.color} gap-1`}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sub.current_period_end ? (
                        <span className="text-sm">
                          Até {format(new Date(sub.current_period_end), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {sub.next_billing_date ? (
                        <span className="text-sm">
                          {format(new Date(sub.next_billing_date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.provider}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
