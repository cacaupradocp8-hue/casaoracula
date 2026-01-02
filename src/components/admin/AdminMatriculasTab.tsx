import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, UserCheck, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Matricula {
  id: string;
  user_id: string;
  curso_id: string;
  ativa: boolean;
  data_inicio: string;
  data_fim: string | null;
  user_email?: string;
  user_nome?: string;
}

interface Profile {
  id: string;
  email: string | null;
  nome: string | null;
}

export function AdminMatriculasTab() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCurso, setSelectedCurso] = useState('formacao_oracula');
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Matricula | null>(null);

  useEffect(() => {
    fetchMatriculas();
    fetchProfiles();
  }, []);

  const fetchMatriculas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('matriculas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar matrículas');
      console.error(error);
    } else {
      // Fetch user info for each matricula
      const matriculasWithUsers = await Promise.all(
        (data || []).map(async (m) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, nome')
            .eq('id', m.user_id)
            .single();
          
          return {
            ...m,
            user_email: profile?.email || 'N/A',
            user_nome: profile?.nome || 'Sem nome',
          };
        })
      );
      setMatriculas(matriculasWithUsers);
    }
    setLoading(false);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, nome')
      .order('nome');

    if (error) {
      console.error('Erro ao carregar perfis:', error);
    } else {
      setProfiles(data || []);
    }
  };

  const handleCreateMatricula = async () => {
    if (!selectedUserId) {
      toast.error('Selecione uma usuária');
      return;
    }

    // Check if already enrolled
    const existing = matriculas.find(
      m => m.user_id === selectedUserId && m.curso_id === selectedCurso
    );
    if (existing) {
      toast.error('Usuária já possui matrícula neste curso');
      return;
    }

    const { error } = await supabase
      .from('matriculas')
      .insert({
        user_id: selectedUserId,
        curso_id: selectedCurso,
        ativa: true,
      });

    if (error) {
      toast.error('Erro ao criar matrícula');
      console.error(error);
    } else {
      toast.success('Matrícula criada com sucesso');
      setDialogOpen(false);
      setSelectedUserId('');
      fetchMatriculas();
    }
  };

  const handleToggleAtiva = async (matricula: Matricula) => {
    const { error } = await supabase
      .from('matriculas')
      .update({ ativa: !matricula.ativa })
      .eq('id', matricula.id);

    if (error) {
      toast.error('Erro ao atualizar matrícula');
    } else {
      setMatriculas(prev =>
        prev.map(m =>
          m.id === matricula.id ? { ...m, ativa: !m.ativa } : m
        )
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { error } = await supabase
      .from('matriculas')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      toast.error('Erro ao excluir matrícula');
      console.error(error);
    } else {
      toast.success('Matrícula excluída');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchMatriculas();
    }
  };

  const filteredMatriculas = matriculas.filter(m => {
    const term = searchTerm.toLowerCase();
    return (
      m.user_email?.toLowerCase().includes(term) ||
      m.user_nome?.toLowerCase().includes(term) ||
      m.curso_id.toLowerCase().includes(term)
    );
  });

  // Profiles without active enrollment
  const availableProfiles = profiles.filter(
    p => !matriculas.some(m => m.user_id === p.id && m.curso_id === selectedCurso && m.ativa)
  );

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Matrículas</h3>
          <p className="text-sm text-muted-foreground">
            Controle quem tem acesso ao curso
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Matrícula
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {filteredMatriculas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhuma matrícula encontrada.' : 'Nenhuma matrícula cadastrada.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuária</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatriculas.map((matricula) => (
                <TableRow key={matricula.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{matricula.user_nome}</p>
                      <p className="text-sm text-muted-foreground">{matricula.user_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {matricula.curso_id === 'formacao_oracula' ? 'Formação ORÁCULA' : matricula.curso_id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(matricula.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={matricula.ativa ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleToggleAtiva(matricula)}
                    >
                      {matricula.ativa ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteTarget(matricula);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Matrícula</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Curso</label>
              <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formacao_oracula">Formação ORÁCULA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Usuária</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma usuária..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.nome || 'Sem nome'} ({profile.email || 'sem email'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMatricula}>
              Criar Matrícula
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Matrícula</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a matrícula de {deleteTarget?.user_nome}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}