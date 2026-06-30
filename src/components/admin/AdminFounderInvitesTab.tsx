import { useState, useEffect } from 'react';
import { 
  Gift, Plus, Trash2, CheckCircle, XCircle, 
  Copy, Loader2, Search, Filter, Calendar, Users, 
  Clock, Hash, Power, PowerOff, Footprints
} from 'lucide-react';
import { FounderRastrosDialog } from './FounderRastrosDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConviteFundadora {
  id: string;
  codigo: string;
  limite_uso: number;
  usos_realizados: number;
  ativo: boolean;
  expira_em?: string | null;
  dias_acesso?: number;
  created_at: string;
}

interface AtivacaoFundadora {
  id: string;
  user_id: string;
  data_ativacao: string;
  data_expiracao: string;
  status: string;
  codigo_utilizado: string;
  profiles: {
    nome: string | null;
    email: string | null;
  } | null;
}

export function AdminFounderInvitesTab() {
  const [invites, setInvites] = useState<ConviteFundadora[]>([]);
  const [activations, setActivations] = useState<AtivacaoFundadora[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    codigo: '',
    limite_uso: 50,
    ativo: true
  });
  const [rastrosOpen, setRastrosOpen] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<AtivacaoFundadora | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: invitesData, error: invitesError } = await supabase
        .from('convites_fundadora')
        .select('*')
        .order('created_at', { ascending: false });

      if (invitesError) throw invitesError;
      setInvites(invitesData || []);

      const { data: activationsData, error: activationsError } = await supabase
        .from('acessos_fundadora')
        .select('*')
        .order('data_ativacao', { ascending: false })
        .limit(50);

      if (activationsError) throw activationsError;

      const userIds = Array.from(new Set((activationsData || []).map((a: any) => a.user_id).filter(Boolean)));
      let profilesMap: Record<string, { nome: string | null; email: string | null }> = {};
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, nome, email')
          .in('id', userIds);
        if (profilesError) throw profilesError;
        profilesMap = Object.fromEntries(
          (profilesData || []).map((p: any) => [p.id, { nome: p.nome, email: p.email }])
        );
      }

      const merged = (activationsData || []).map((a: any) => ({
        ...a,
        profiles: profilesMap[a.user_id] || null,
      }));
      setActivations(merged as any);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      toast.error('Erro ao carregar convites.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvite = async () => {
    if (!newInvite.codigo) {
      toast.error('Informe um código.');
      return;
    }

    try {
      const { error } = await supabase
        .from('convites_fundadora')
        .insert({
          codigo: newInvite.codigo.trim().toUpperCase(),
          limite_uso: newInvite.limite_uso,
          ativo: newInvite.ativo
        });

      if (error) throw error;
      
      toast.success('Convite criado com sucesso!');
      setIsModalOpen(false);
      setNewInvite({ codigo: '', limite_uso: 50, ativo: true });
      fetchData();
    } catch (err) {
      console.error('Erro ao criar convite:', err);
      toast.error('Erro ao criar convite.');
    }
  };

  const toggleInviteStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('convites_fundadora')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchData();
      toast.success('Status atualizado.');
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      toast.error('Erro ao atualizar status.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Código copiado!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary">Convites Fundadora</h2>
          <p className="text-muted-foreground">Gerencie os códigos de acesso temporário (7 dias)</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary">
          <Plus className="w-4 h-4" />
          Novo Código
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Códigos */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5 text-primary" />
                Códigos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
              ) : invites.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Nenhum convite cadastrado.</p>
              ) : (
                <div className="space-y-4">
                  {invites.map(invite => (
                    <div key={invite.id} className="flex items-center justify-between p-4 rounded-xl border border-primary/5 bg-background/40 hover:bg-background/60 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <code className="bg-primary/10 px-2 py-1 rounded font-bold text-primary">{invite.codigo}</code>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(invite.codigo)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {invite.usos_realizados} / {invite.limite_uso} usos
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(invite.created_at), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={invite.ativo ? 'outline' : 'secondary'} className={invite.ativo ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : 'opacity-50'}>
                          {invite.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => toggleInviteStatus(invite.id, invite.ativo)}>
                          {invite.ativo ? <PowerOff className="w-4 h-4 text-amber-500" /> : <Power className="w-4 h-4 text-emerald-500" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Últimas Ativações */}
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Ativações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
              ) : activations.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Nenhuma ativação ainda.</p>
              ) : (
                <div className="space-y-4">
                  {activations.map(act => (
                    <div key={act.id} className="text-sm p-3 rounded-lg bg-background/20 border border-primary/5">
                      <div className="font-medium text-foreground truncate">{act.profiles?.nome || 'Anônima'}</div>
                      <div className="text-xs text-muted-foreground truncate">{act.profiles?.email}</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-[10px] py-0">{act.codigo_utilizado}</Badge>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(act.data_ativacao), 'dd/MM HH:mm')}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full h-7 gap-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setSelectedFounder(act);
                          setRastrosOpen(true);
                        }}
                      >
                        <Footprints className="w-3 h-3" />
                        Ver rastros
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Novo Convite */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
          <DialogHeader>
            <DialogTitle>Novo Código de Convite</DialogTitle>
            <DialogDescription>Crie um código para ser distribuído às futuras fundadoras.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Código (Texto)</label>
              <Input 
                placeholder="EX: LOBA2025" 
                value={newInvite.codigo}
                onChange={(e) => setNewInvite({...newInvite, codigo: e.target.value.toUpperCase()})}
                className="uppercase font-bold tracking-widest"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Limite de Usos</label>
              <Input 
                type="number" 
                value={newInvite.limite_uso}
                onChange={(e) => setNewInvite({...newInvite, limite_uso: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateInvite} className="bg-primary">Criar Convite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FounderRastrosDialog
        open={rastrosOpen}
        onOpenChange={setRastrosOpen}
        founder={
          selectedFounder
            ? {
                user_id: selectedFounder.user_id,
                nome: selectedFounder.profiles?.nome ?? null,
                email: selectedFounder.profiles?.email ?? null,
                data_ativacao: selectedFounder.data_ativacao,
              }
            : null
        }
      />
    </div>
  );
}
