import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Loader2, Sparkles, Eye, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OracularReading {
  id: string;
  user_id: string;
  axes_professional: string | null;
  projection_shadow: string | null;
  symbolic_narrative: string | null;
  portal_readiness: string | null;
  status: string;
  admin_response: string | null;
  created_at: string;
  user_email?: string;
  user_nome?: string;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  new: { label: 'Nova', icon: <Clock className="w-4 h-4" />, color: 'bg-gold/20 text-gold' },
  reviewing: { label: 'Em Análise', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-burgundy/20 text-burgundy-light' },
  answered: { label: 'Respondida', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-sage/20 text-sage-light' },
};

export function AdminLeiturasTab() {
  const [readings, setReadings] = useState<OracularReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<OracularReading | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('oracular_readings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar leituras:', error);
      toast.error('Erro ao carregar leituras oraculares');
    } else {
      const readingsWithUsers = await Promise.all(
        (data || []).map(async (r) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, nome')
            .eq('id', r.user_id)
            .single();
          
          return {
            ...r,
            user_email: profile?.email || 'N/A',
            user_nome: profile?.nome || 'Sem nome',
          };
        })
      );
      setReadings(readingsWithUsers);
    }
    setLoading(false);
  };

  const handleOpenDetail = (reading: OracularReading) => {
    setSelectedReading(reading);
    setAdminResponse(reading.admin_response || '');
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedReading) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('oracular_readings')
      .update({ 
        status: newStatus,
        admin_response: adminResponse || null,
      })
      .eq('id', selectedReading.id);

    if (error) {
      toast.error('Erro ao atualizar leitura');
      console.error(error);
    } else {
      toast.success('Leitura atualizada');
      setReadings(prev =>
        prev.map(r =>
          r.id === selectedReading.id
            ? { ...r, status: newStatus, admin_response: adminResponse }
            : r
        )
      );
      setDetailDialogOpen(false);
    }
    setSaving(false);
  };

  const filteredReadings = readings.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      r.user_email?.toLowerCase().includes(term) ||
      r.user_nome?.toLowerCase().includes(term);
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: readings.length,
    new: readings.filter(r => r.status === 'new').length,
    reviewing: readings.filter(r => r.status === 'reviewing').length,
    answered: readings.filter(r => r.status === 'answered').length,
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
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-display font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-gold" />
            <p className="text-2xl font-display font-bold">{stats.new}</p>
            <p className="text-xs text-muted-foreground">Novas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-burgundy-light" />
            <p className="text-2xl font-display font-bold">{stats.reviewing}</p>
            <p className="text-xs text-muted-foreground">Em Análise</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-sage-light" />
            <p className="text-2xl font-display font-bold">{stats.answered}</p>
            <p className="text-xs text-muted-foreground">Respondidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="new">Novas</SelectItem>
            <SelectItem value="reviewing">Em Análise</SelectItem>
            <SelectItem value="answered">Respondidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredReadings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'Nenhuma leitura encontrada.' 
                : 'Nenhuma leitura oracular recebida.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuária</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReadings.map((reading) => {
                const config = statusConfig[reading.status] || statusConfig.new;
                return (
                  <TableRow key={reading.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{reading.user_nome}</p>
                        <p className="text-sm text-muted-foreground">{reading.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(reading.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${config.color} gap-1`}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDetail(reading)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-display">Leitura Oracular</DialogTitle>
          </DialogHeader>
          
          {selectedReading && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedReading.user_nome}</p>
                    <p className="text-sm text-muted-foreground">{selectedReading.user_email}</p>
                  </div>
                  <Badge className={statusConfig[selectedReading.status]?.color}>
                    {statusConfig[selectedReading.status]?.label}
                  </Badge>
                </div>
                
                <Separator />
                
                {/* Responses */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Eixo Profissional
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedReading.axes_professional || '-'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Projeção e Sombra
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedReading.projection_shadow || '-'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Narrativa Simbólica
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedReading.symbolic_narrative || '-'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Prontidão para o Portal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedReading.portal_readiness || '-'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                {/* Admin Response */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resposta da Guardiã</label>
                  <Textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Escreva sua resposta para a solicitante..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleUpdateStatus('reviewing')}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              Marcar Em Análise
            </Button>
            <Button 
              onClick={() => handleUpdateStatus('answered')}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Responder e Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
