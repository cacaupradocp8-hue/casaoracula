import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Bell, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface MessageLog {
  id: string;
  user_id: string;
  channel: 'email' | 'in_app';
  type: string;
  template_id: string | null;
  campaign_id: string | null;
  sent_at: string;
  success: boolean;
  error_message: string | null;
}

const typeLabels: Record<string, string> = {
  pre_expiracao: 'Pré-expiração',
  expiracao: 'Expiração',
  retorno: 'Retorno',
  manual: 'Manual',
  info: 'Info',
  boas_vindas: 'Boas-vindas'
};

export function CommunicationLogs() {
  const [filters, setFilters] = useState({
    channel: 'all',
    type: 'all',
    success: 'all',
    search: ''
  });

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['message-logs', filters],
    queryFn: async () => {
      let query = supabase
        .from('message_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(100);
      
      if (filters.channel !== 'all') {
        query = query.eq('channel', filters.channel);
      }
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.success !== 'all') {
        query = query.eq('success', filters.success === 'true');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as MessageLog[];
    }
  });

  const filteredLogs = logs.filter(log => {
    if (filters.search) {
      return log.user_id.toLowerCase().includes(filters.search.toLowerCase());
    }
    return true;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.success).length,
    failed: logs.filter(l => !l.success).length,
    email: logs.filter(l => l.channel === 'email').length,
    in_app: logs.filter(l => l.channel === 'in_app').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Sucesso</p>
            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Falhas</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">E-mails</p>
            <p className="text-2xl font-bold">{stats.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">In-App</p>
            <p className="text-2xl font-bold">{stats.in_app}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Logs de Envio</CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Select
              value={filters.channel}
              onValueChange={(value) => setFilters({ ...filters, channel: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos canais</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="in_app">In-App</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                <SelectItem value="pre_expiracao">Pré-expiração</SelectItem>
                <SelectItem value="expiracao">Expiração</SelectItem>
                <SelectItem value="retorno">Retorno</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.success}
              onValueChange={(value) => setFilters({ ...filters, success: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Sucesso</SelectItem>
                <SelectItem value="false">Falha</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Buscar por user_id..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-[250px]"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Carregando logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum log encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.sent_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {log.channel === 'email' ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                          <span className="capitalize">{log.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {typeLabels[log.type] || log.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs text-red-500">
                        {log.error_message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
