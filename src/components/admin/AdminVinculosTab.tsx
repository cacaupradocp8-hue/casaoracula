import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Users, Search, UserCheck, UserX, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Vinculo {
  id: string;
  terapeuta_id: string;
  cliente_id: string;
  ativo: boolean;
  created_at: string;
  terapeuta_nome?: string;
  terapeuta_email?: string;
  cliente_nome?: string;
  cliente_email?: string;
}

interface UserOption {
  id: string;
  nome: string;
  email: string;
}

export function AdminVinculosTab() {
  const { toast } = useToast();
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newVinculo, setNewVinculo] = useState({
    terapeuta_id: '',
    cliente_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch all vinculos - Admin RLS policy allows this
      const { data: vinculosData, error: vinculosError } = await supabase
        .from('terapeuta_clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (vinculosError) {
        console.error('Erro ao carregar vínculos:', vinculosError);
        toast({ title: 'Erro ao carregar vínculos', description: vinculosError.message, variant: 'destructive' });
        setLoading(false);
        return;
      }

      // Fetch all profiles for dropdowns and display - Admin RLS policy allows this
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .order('nome', { ascending: true });

      if (profilesError) {
        console.error('Erro ao carregar perfis:', profilesError);
        toast({ title: 'Erro ao carregar perfis', description: profilesError.message, variant: 'destructive' });
        setLoading(false);
        return;
      }

      const usersMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      // Enrich vinculos with names
      const enrichedVinculos = (vinculosData || []).map(v => ({
        ...v,
        terapeuta_nome: usersMap.get(v.terapeuta_id)?.nome || 'Desconhecido',
        terapeuta_email: usersMap.get(v.terapeuta_id)?.email || '',
        cliente_nome: usersMap.get(v.cliente_id)?.nome || 'Desconhecido',
        cliente_email: usersMap.get(v.cliente_id)?.email || '',
      }));

      setVinculos(enrichedVinculos);
      setUsers(profiles || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({ title: 'Erro inesperado', variant: 'destructive' });
    }
    
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newVinculo.terapeuta_id || !newVinculo.cliente_id) {
      toast({ title: 'Selecione terapeuta e cliente', variant: 'destructive' });
      return;
    }

    if (newVinculo.terapeuta_id === newVinculo.cliente_id) {
      toast({ title: 'Terapeuta e cliente devem ser diferentes', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('terapeuta_clientes')
      .insert({
        terapeuta_id: newVinculo.terapeuta_id,
        cliente_id: newVinculo.cliente_id,
        ativo: true,
      });

    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Vínculo já existe', variant: 'destructive' });
      } else {
        toast({ title: 'Erro ao criar vínculo', description: error.message, variant: 'destructive' });
      }
      return;
    }

    toast({ title: 'Vínculo criado com sucesso!' });
    setDialogOpen(false);
    setNewVinculo({ terapeuta_id: '', cliente_id: '' });
    fetchData();
  };

  const toggleAtivo = async (vinculoId: string, ativo: boolean) => {
    const { error } = await supabase
      .from('terapeuta_clientes')
      .update({ ativo })
      .eq('id', vinculoId);

    if (error) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
      return;
    }

    setVinculos(prev => 
      prev.map(v => v.id === vinculoId ? { ...v, ativo } : v)
    );
    toast({ title: ativo ? 'Vínculo ativado' : 'Vínculo desativado' });
  };

  const handleDelete = async (vinculoId: string) => {
    const { error } = await supabase
      .from('terapeuta_clientes')
      .delete()
      .eq('id', vinculoId);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
      return;
    }

    setVinculos(prev => prev.filter(v => v.id !== vinculoId));
    toast({ title: 'Vínculo excluído' });
  };

  const filteredVinculos = vinculos.filter(v => {
    const search = searchTerm.toLowerCase();
    return (
      v.terapeuta_nome?.toLowerCase().includes(search) ||
      v.terapeuta_email?.toLowerCase().includes(search) ||
      v.cliente_nome?.toLowerCase().includes(search) ||
      v.cliente_email?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-display font-bold">{vinculos.length}</p>
            <p className="text-xs text-muted-foreground">Total de Vínculos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-display font-bold">{vinculos.filter(v => v.ativo).length}</p>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserX className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-display font-bold">{vinculos.filter(v => !v.ativo).length}</p>
            <p className="text-xs text-muted-foreground">Inativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Vínculo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Vínculo Terapeuta ↔ Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Terapeuta</Label>
                <Select
                  value={newVinculo.terapeuta_id}
                  onValueChange={(v) => setNewVinculo(prev => ({ ...prev, terapeuta_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a terapeuta" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nome || 'Sem nome'} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select
                  value={newVinculo.cliente_id}
                  onValueChange={(v) => setNewVinculo(prev => ({ ...prev, cliente_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(u => u.id !== newVinculo.terapeuta_id)
                      .map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nome || 'Sem nome'} ({u.email})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} variant="gold" className="w-full">
                Criar Vínculo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vínculos Terapeuta ↔ Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVinculos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum vínculo encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terapeuta</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVinculos.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{v.terapeuta_nome}</p>
                        <p className="text-xs text-muted-foreground">{v.terapeuta_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{v.cliente_nome}</p>
                        <p className="text-xs text-muted-foreground">{v.cliente_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(v.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={v.ativo}
                        onCheckedChange={(checked) => toggleAtivo(v.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(v.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
