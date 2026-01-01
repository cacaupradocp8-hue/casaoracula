import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Edit, DoorOpen, Plus, Trash2, Wrench } from 'lucide-react';

type NivelSala = 'NIVEL_0' | 'NIVEL_1' | 'NIVEL_2' | 'NIVEL_3';

interface Sala {
  id: string;
  nivel_minimo: NivelSala;
  nome_exibicao: string;
  texto_entrada: string;
  texto_bloqueio: string;
  ativa: boolean;
  ordem: number;
}

interface Ferramenta {
  id: string;
  sala_id: string;
  ferramenta_chave: string;
  ferramenta_nome: string;
  ferramenta_descricao: string;
  icone: string;
  rota: string;
  ordem: number;
  ativa: boolean;
}

const NIVEL_LABELS: Record<NivelSala, string> = {
  NIVEL_0: 'Visitante (Nível 0)',
  NIVEL_1: 'Pré-Iniciada (Nível 1)',
  NIVEL_2: 'Iniciada (Nível 2)',
  NIVEL_3: 'Guardiã (Nível 3)',
};

export function AdminSalasTab() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSala, setEditingSala] = useState<Sala | null>(null);
  const [managingFerramentas, setManagingFerramentas] = useState<Sala | null>(null);
  const [editingFerramenta, setEditingFerramenta] = useState<Ferramenta | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [salasRes, ferramentasRes] = await Promise.all([
      supabase.from('salas').select('*').order('ordem'),
      supabase.from('sala_ferramentas').select('*').order('ordem'),
    ]);

    if (salasRes.error) {
      toast.error('Erro ao carregar salas');
      console.error(salasRes.error);
    } else {
      setSalas(salasRes.data as Sala[]);
    }

    if (ferramentasRes.error) {
      console.error(ferramentasRes.error);
    } else {
      setFerramentas(ferramentasRes.data as Ferramenta[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSala = async () => {
    if (!editingSala) return;

    setSaving(true);
    const { error } = await supabase
      .from('salas')
      .update({
        nome_exibicao: editingSala.nome_exibicao,
        texto_entrada: editingSala.texto_entrada,
        texto_bloqueio: editingSala.texto_bloqueio,
        nivel_minimo: editingSala.nivel_minimo,
        ativa: editingSala.ativa,
        ordem: editingSala.ordem,
      })
      .eq('id', editingSala.id);

    if (error) {
      toast.error('Erro ao salvar sala');
      console.error(error);
    } else {
      toast.success('Sala atualizada');
      setEditingSala(null);
      fetchData();
    }
    setSaving(false);
  };

  const toggleSalaAtiva = async (sala: Sala) => {
    const { error } = await supabase
      .from('salas')
      .update({ ativa: !sala.ativa })
      .eq('id', sala.id);

    if (error) {
      toast.error('Erro ao alterar status');
    } else {
      toast.success(sala.ativa ? 'Sala desativada' : 'Sala ativada');
      fetchData();
    }
  };

  const getFerramentasForSala = (salaId: string) => {
    return ferramentas.filter((f) => f.sala_id === salaId).sort((a, b) => a.ordem - b.ordem);
  };

  const handleAddFerramenta = async () => {
    if (!managingFerramentas) return;

    const salaFerramentas = getFerramentasForSala(managingFerramentas.id);
    const novaOrdem = salaFerramentas.length > 0 ? Math.max(...salaFerramentas.map((f) => f.ordem)) + 1 : 1;

    const { error } = await supabase.from('sala_ferramentas').insert({
      sala_id: managingFerramentas.id,
      ferramenta_chave: `nova_ferramenta_${Date.now()}`,
      ferramenta_nome: 'Nova Ferramenta',
      ferramenta_descricao: '',
      icone: 'wrench',
      rota: '/salas/nova',
      ordem: novaOrdem,
      ativa: true,
    });

    if (error) {
      toast.error('Erro ao adicionar ferramenta');
      console.error(error);
    } else {
      toast.success('Ferramenta adicionada');
      fetchData();
    }
  };

  const handleSaveFerramenta = async () => {
    if (!editingFerramenta) return;

    setSaving(true);
    const { error } = await supabase
      .from('sala_ferramentas')
      .update({
        ferramenta_chave: editingFerramenta.ferramenta_chave,
        ferramenta_nome: editingFerramenta.ferramenta_nome,
        ferramenta_descricao: editingFerramenta.ferramenta_descricao,
        icone: editingFerramenta.icone,
        rota: editingFerramenta.rota,
        ordem: editingFerramenta.ordem,
        ativa: editingFerramenta.ativa,
      })
      .eq('id', editingFerramenta.id);

    if (error) {
      toast.error('Erro ao salvar ferramenta');
      console.error(error);
    } else {
      toast.success('Ferramenta atualizada');
      setEditingFerramenta(null);
      fetchData();
    }
    setSaving(false);
  };

  const handleDeleteFerramenta = async (id: string) => {
    if (!confirm('Remover esta ferramenta?')) return;

    const { error } = await supabase.from('sala_ferramentas').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao remover ferramenta');
      console.error(error);
    } else {
      toast.success('Ferramenta removida');
      fetchData();
    }
  };

  const toggleFerramentaAtiva = async (ferramenta: Ferramenta) => {
    const { error } = await supabase
      .from('sala_ferramentas')
      .update({ ativa: !ferramenta.ativa })
      .eq('id', ferramenta.id);

    if (error) {
      toast.error('Erro ao alterar status');
    } else {
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Salas Table */}
      <Card className="glass border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-gold" />
            Gerenciar Salas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Nível Mínimo</TableHead>
                <TableHead>Ferramentas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salas.map((sala) => (
                <TableRow key={sala.id}>
                  <TableCell className="font-medium">{sala.ordem}</TableCell>
                  <TableCell>{sala.nome_exibicao}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gold/50 text-gold">
                      {NIVEL_LABELS[sala.nivel_minimo]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getFerramentasForSala(sala.id).length} ferramentas
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={sala.ativa} onCheckedChange={() => toggleSalaAtiva(sala)} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setManagingFerramentas(sala)}
                    >
                      <Wrench className="w-4 h-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingSala({ ...sala })}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Sala</DialogTitle>
                        </DialogHeader>
                        {editingSala && (
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Nome de Exibição</Label>
                                <Input
                                  value={editingSala.nome_exibicao}
                                  onChange={(e) =>
                                    setEditingSala({ ...editingSala, nome_exibicao: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Nível Mínimo</Label>
                                <Select
                                  value={editingSala.nivel_minimo}
                                  onValueChange={(value: NivelSala) =>
                                    setEditingSala({ ...editingSala, nivel_minimo: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(NIVEL_LABELS).map(([key, label]) => (
                                      <SelectItem key={key} value={key}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Ordem</Label>
                                <Input
                                  type="number"
                                  value={editingSala.ordem}
                                  onChange={(e) =>
                                    setEditingSala({ ...editingSala, ordem: parseInt(e.target.value) || 0 })
                                  }
                                />
                              </div>
                              <div className="space-y-2 flex items-end">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={editingSala.ativa}
                                    onCheckedChange={(checked) =>
                                      setEditingSala({ ...editingSala, ativa: checked })
                                    }
                                  />
                                  <Label>Sala Ativa</Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Texto de Entrada (quando desbloqueada)</Label>
                              <Textarea
                                value={editingSala.texto_entrada}
                                onChange={(e) =>
                                  setEditingSala({ ...editingSala, texto_entrada: e.target.value })
                                }
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Texto de Bloqueio (quando não tem acesso)</Label>
                              <Textarea
                                value={editingSala.texto_bloqueio}
                                onChange={(e) =>
                                  setEditingSala({ ...editingSala, texto_bloqueio: e.target.value })
                                }
                                rows={3}
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                              <Button variant="outline" onClick={() => setEditingSala(null)}>
                                Cancelar
                              </Button>
                              <Button variant="gold" onClick={handleSaveSala} disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ferramentas Management Dialog */}
      <Dialog open={!!managingFerramentas} onOpenChange={(open) => !open && setManagingFerramentas(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-gold" />
              Ferramentas: {managingFerramentas?.nome_exibicao}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex justify-end mb-4">
              <Button variant="gold" size="sm" onClick={handleAddFerramenta}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Ferramenta
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Rota</TableHead>
                  <TableHead>Ativa</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managingFerramentas &&
                  getFerramentasForSala(managingFerramentas.id).map((ferramenta) => (
                    <TableRow key={ferramenta.id}>
                      <TableCell>{ferramenta.ordem}</TableCell>
                      <TableCell>{ferramenta.ferramenta_nome}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{ferramenta.rota}</TableCell>
                      <TableCell>
                        <Switch
                          checked={ferramenta.ativa}
                          onCheckedChange={() => toggleFerramentaAtiva(ferramenta)}
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingFerramenta({ ...ferramenta })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFerramenta(ferramenta.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {managingFerramentas && getFerramentasForSala(managingFerramentas.id).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhuma ferramenta vinculada a esta sala.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Ferramenta Dialog */}
      <Dialog open={!!editingFerramenta} onOpenChange={(open) => !open && setEditingFerramenta(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Ferramenta</DialogTitle>
          </DialogHeader>
          {editingFerramenta && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={editingFerramenta.ferramenta_nome}
                  onChange={(e) =>
                    setEditingFerramenta({ ...editingFerramenta, ferramenta_nome: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Chave (identificador único)</Label>
                <Input
                  value={editingFerramenta.ferramenta_chave}
                  onChange={(e) =>
                    setEditingFerramenta({ ...editingFerramenta, ferramenta_chave: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={editingFerramenta.ferramenta_descricao}
                  onChange={(e) =>
                    setEditingFerramenta({ ...editingFerramenta, ferramenta_descricao: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ícone (Lucide)</Label>
                  <Input
                    value={editingFerramenta.icone}
                    onChange={(e) =>
                      setEditingFerramenta({ ...editingFerramenta, icone: e.target.value })
                    }
                    placeholder="brain, compass, sparkles..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={editingFerramenta.ordem}
                    onChange={(e) =>
                      setEditingFerramenta({ ...editingFerramenta, ordem: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rota</Label>
                <Input
                  value={editingFerramenta.rota}
                  onChange={(e) =>
                    setEditingFerramenta({ ...editingFerramenta, rota: e.target.value })
                  }
                  placeholder="/salas/big5"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingFerramenta.ativa}
                  onCheckedChange={(checked) =>
                    setEditingFerramenta({ ...editingFerramenta, ativa: checked })
                  }
                />
                <Label>Ferramenta Ativa</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingFerramenta(null)}>
                  Cancelar
                </Button>
                <Button variant="gold" onClick={handleSaveFerramenta} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
