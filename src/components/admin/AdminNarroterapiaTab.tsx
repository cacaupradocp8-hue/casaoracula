import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpenCheck, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContoClinical {
  id: string;
  slug: string;
  titulo: string;
  texto_conto: string;
  quando_usar: string;
  o_que_observar: string;
  riscos_uso_inadequado: string;
  origem_cultural: string | null;
  ordem: number;
  ativo: boolean;
}

const EMPTY_CONTO: Omit<ContoClinical, 'id'> = {
  slug: '',
  titulo: '',
  texto_conto: '',
  quando_usar: '',
  o_que_observar: '',
  riscos_uso_inadequado: '',
  origem_cultural: '',
  ordem: 0,
  ativo: true,
};

export function AdminNarroterapiaTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConto, setEditingConto] = useState<ContoClinical | null>(null);
  const [formData, setFormData] = useState<Omit<ContoClinical, 'id'>>(EMPTY_CONTO);

  // Fetch clinical tales
  const { data: contos, isLoading } = useQuery({
    queryKey: ['admin-contos-clinicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contos_clinicos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ContoClinical[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<ContoClinical, 'id'>) => {
      const { error } = await supabase.from('contos_clinicos').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contos-clinicos'] });
      toast({ title: 'Conto criado com sucesso!' });
      setIsDialogOpen(false);
      setFormData(EMPTY_CONTO);
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar conto', description: String(error), variant: 'destructive' });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContoClinical> }) => {
      const { error } = await supabase.from('contos_clinicos').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contos-clinicos'] });
      toast({ title: 'Conto atualizado!' });
      setIsDialogOpen(false);
      setEditingConto(null);
      setFormData(EMPTY_CONTO);
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar', description: String(error), variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contos_clinicos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contos-clinicos'] });
      toast({ title: 'Conto removido' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao remover', description: String(error), variant: 'destructive' });
    },
  });

  const handleEdit = (conto: ContoClinical) => {
    setEditingConto(conto);
    setFormData({
      slug: conto.slug,
      titulo: conto.titulo,
      texto_conto: conto.texto_conto,
      quando_usar: conto.quando_usar,
      o_que_observar: conto.o_que_observar,
      riscos_uso_inadequado: conto.riscos_uso_inadequado,
      origem_cultural: conto.origem_cultural || '',
      ordem: conto.ordem,
      ativo: conto.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingConto) {
      updateMutation.mutate({ id: editingConto.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="contos">
        <TabsList>
          <TabsTrigger value="contos" className="gap-2">
            <BookOpenCheck className="w-4 h-4" />
            Contos Clínicos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Contos Clínicos Oficiais</h3>
              <p className="text-sm text-muted-foreground">
                Os 12 contos da Narroterapia Oracular™
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingConto(null);
                setFormData(EMPTY_CONTO);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Conto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingConto ? 'Editar Conto Clínico' : 'Novo Conto Clínico'}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha todos os campos obrigatórios para o uso clínico.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Título *</Label>
                      <Input
                        value={formData.titulo}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            titulo: e.target.value,
                            slug: generateSlug(e.target.value),
                          }));
                        }}
                        placeholder="O Fio de Ouro"
                      />
                    </div>
                    <div>
                      <Label>Slug</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="o-fio-de-ouro"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Origem Cultural</Label>
                      <Input
                        value={formData.origem_cultural || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, origem_cultural: e.target.value }))}
                        placeholder="Tradição oral africana"
                      />
                    </div>
                    <div>
                      <Label>Ordem</Label>
                      <Input
                        type="number"
                        value={formData.ordem}
                        onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Texto do Conto *</Label>
                    <Textarea
                      value={formData.texto_conto}
                      onChange={(e) => setFormData(prev => ({ ...prev, texto_conto: e.target.value }))}
                      placeholder="Era uma vez..."
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label>Quando usar clinicamente *</Label>
                    <Textarea
                      value={formData.quando_usar}
                      onChange={(e) => setFormData(prev => ({ ...prev, quando_usar: e.target.value }))}
                      placeholder="Este conto é indicado quando a cliente apresenta..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>O que observar na reação da cliente *</Label>
                    <Textarea
                      value={formData.o_que_observar}
                      onChange={(e) => setFormData(prev => ({ ...prev, o_que_observar: e.target.value }))}
                      placeholder="Observe se a cliente..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Riscos de uso inadequado *</Label>
                    <Textarea
                      value={formData.riscos_uso_inadequado}
                      onChange={(e) => setFormData(prev => ({ ...prev, riscos_uso_inadequado: e.target.value }))}
                      placeholder="Evitar em casos de..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                    />
                    <Label>Ativo</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                      {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingConto ? 'Salvar' : 'Criar'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </CardContent>
            </Card>
          ) : !contos || contos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpenCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum conto cadastrado</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contos.map((conto) => (
                    <TableRow key={conto.id}>
                      <TableCell className="font-mono text-xs">{conto.ordem}</TableCell>
                      <TableCell className="font-medium">{conto.titulo}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {conto.origem_cultural || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={conto.ativo ? 'secondary' : 'outline'}>
                          {conto.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(conto)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Remover este conto?')) {
                                deleteMutation.mutate(conto.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
