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
import { Loader2, Edit, DoorOpen } from 'lucide-react';

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

const NIVEL_LABELS: Record<NivelSala, string> = {
  NIVEL_0: 'Visitante (Nível 0)',
  NIVEL_1: 'Pré-Iniciada (Nível 1)',
  NIVEL_2: 'Iniciada (Nível 2)',
  NIVEL_3: 'Guardiã (Nível 3)',
};

export function AdminSalasTab() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSala, setEditingSala] = useState<Sala | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSalas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('salas')
      .select('*')
      .order('ordem');
    
    if (error) {
      toast.error('Erro ao carregar salas');
      console.error(error);
    } else {
      setSalas(data as Sala[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const handleSave = async () => {
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
      toast.success('Sala atualizada com sucesso');
      setEditingSala(null);
      fetchSalas();
    }
    setSaving(false);
  };

  const toggleAtiva = async (sala: Sala) => {
    const { error } = await supabase
      .from('salas')
      .update({ ativa: !sala.ativa })
      .eq('id', sala.id);

    if (error) {
      toast.error('Erro ao alterar status');
    } else {
      toast.success(sala.ativa ? 'Sala desativada' : 'Sala ativada');
      fetchSalas();
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
                  <Switch
                    checked={sala.ativa}
                    onCheckedChange={() => toggleAtiva(sala)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSala({ ...sala })}
                      >
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
                                  setEditingSala({
                                    ...editingSala,
                                    nome_exibicao: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Nível Mínimo</Label>
                              <Select
                                value={editingSala.nivel_minimo}
                                onValueChange={(value: NivelSala) =>
                                  setEditingSala({
                                    ...editingSala,
                                    nivel_minimo: value,
                                  })
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
                                  setEditingSala({
                                    ...editingSala,
                                    ordem: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2 flex items-end">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={editingSala.ativa}
                                  onCheckedChange={(checked) =>
                                    setEditingSala({
                                      ...editingSala,
                                      ativa: checked,
                                    })
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
                                setEditingSala({
                                  ...editingSala,
                                  texto_entrada: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Texto de Bloqueio (quando não tem acesso)</Label>
                            <Textarea
                              value={editingSala.texto_bloqueio}
                              onChange={(e) =>
                                setEditingSala({
                                  ...editingSala,
                                  texto_bloqueio: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setEditingSala(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="gold"
                              onClick={handleSave}
                              disabled={saving}
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Salvar'
                              )}
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
  );
}
