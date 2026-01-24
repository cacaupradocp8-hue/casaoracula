import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { BookOpen, BookOpenCheck, Headphones, Plus, Edit, Trash2, Loader2, DoorOpen, ShieldAlert, AlertTriangle, Users, Ban, ClipboardPen, Headphones as AudioIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ============ TYPES ============

type NivelRisco = 'baixo' | 'medio' | 'alto';
type TipoUso = 'estudo' | 'clinico_autorizado';

interface ContoClinical {
  id: string;
  slug: string;
  titulo: string;
  texto_conto: string;
  quando_usar: string;
  o_que_observar: string;
  riscos_uso_inadequado: string;
  origem_cultural: string | null;
  porta_psiquica: string | null;
  eixo_simbolico: string | null;
  nivel_risco: NivelRisco;
  tipo_uso: TipoUso;
  exige_certificacao: boolean;
  permite_grupo: boolean;
  permite_crise_aguda: boolean;
  restricoes_combinacao: string[];
  exige_cartografia: boolean;
  audio_padrao_disponivel: boolean;
  audio_padrao_id: string | null;
  aviso_etico: string | null;
  ordem: number;
  ativo: boolean;
}

interface AudioNarracao {
  id: string;
  titulo: string;
  descricao: string | null;
  porta_psiquica: string | null;
  ordem: number | null;
  publicado: boolean | null;
}

type PortalLevel = 'admin' | 'aluna_formacao' | 'assinante' | 'iniciada' | 'mentorada' | 'oracula' | 'pre_iniciada' | 'visitante';

interface AcervoItem {
  id: string;
  title: string;
  content: string | null;
  type: string;
  tags: string[] | null;
  origem_cultural: string | null;
  observacoes_leitura: string | null;
  portal_level_required: PortalLevel | null;
  created_at: string;
}

// ============ EMPTY STATES ============

const EMPTY_CONTO: Omit<ContoClinical, 'id'> = {
  slug: '',
  titulo: '',
  texto_conto: '',
  quando_usar: '',
  o_que_observar: '',
  riscos_uso_inadequado: '',
  origem_cultural: '',
  porta_psiquica: '',
  eixo_simbolico: '',
  nivel_risco: 'baixo',
  tipo_uso: 'estudo',
  exige_certificacao: false,
  permite_grupo: true,
  permite_crise_aguda: false,
  restricoes_combinacao: [],
  exige_cartografia: false,
  audio_padrao_disponivel: false,
  audio_padrao_id: null,
  aviso_etico: '',
  ordem: 0,
  ativo: true,
};

const EMPTY_ACERVO: Omit<AcervoItem, 'id' | 'created_at'> = {
  title: '',
  content: '',
  type: 'conto',
  tags: [],
  origem_cultural: '',
  observacoes_leitura: '',
  portal_level_required: 'visitante' as PortalLevel,
};

export function AdminNarroterapiaTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ============ CONTOS CLÍNICOS STATE ============
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConto, setEditingConto] = useState<ContoClinical | null>(null);
  const [formData, setFormData] = useState<Omit<ContoClinical, 'id'>>(EMPTY_CONTO);

  // ============ ACERVO SIMBÓLICO STATE ============
  const [isAcervoDialogOpen, setIsAcervoDialogOpen] = useState(false);
  const [editingAcervo, setEditingAcervo] = useState<AcervoItem | null>(null);
  const [acervoFormData, setAcervoFormData] = useState<Omit<AcervoItem, 'id' | 'created_at'>>(EMPTY_ACERVO);

  // ============ QUERIES ============

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

  // Fetch narration audios
  const { data: audios, isLoading: isLoadingAudios } = useQuery({
    queryKey: ['admin-audios-narracao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_assets')
        .select('id, titulo, descricao, porta_psiquica, ordem, publicado')
        .eq('categoria', 'Narração Padrão Oracular')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as AudioNarracao[];
    },
  });

  // Fetch acervo simbólico (study tales)
  const { data: acervoItems, isLoading: isLoadingAcervo } = useQuery({
    queryKey: ['admin-acervo-simbolico'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('type', 'conto')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AcervoItem[];
    },
  });

  // ============ CONTOS CLÍNICOS MUTATIONS ============

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

  // ============ AUDIO MUTATIONS ============

  const updateAudioMutation = useMutation({
    mutationFn: async ({ id, porta_psiquica }: { id: string; porta_psiquica: string }) => {
      const { error } = await supabase
        .from('audio_assets')
        .update({ porta_psiquica })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audios-narracao'] });
      toast({ title: 'Áudio atualizado!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar', description: String(error), variant: 'destructive' });
    },
  });

  // ============ ACERVO SIMBÓLICO MUTATIONS ============

  const createAcervoMutation = useMutation({
    mutationFn: async (data: Omit<AcervoItem, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('library_items').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-acervo-simbolico'] });
      toast({ title: 'Conto de estudo criado!' });
      setIsAcervoDialogOpen(false);
      setAcervoFormData(EMPTY_ACERVO);
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar', description: String(error), variant: 'destructive' });
    },
  });

  const updateAcervoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<AcervoItem, 'id' | 'created_at'> }) => {
      const { error } = await supabase.from('library_items').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-acervo-simbolico'] });
      toast({ title: 'Conto atualizado!' });
      setIsAcervoDialogOpen(false);
      setEditingAcervo(null);
      setAcervoFormData(EMPTY_ACERVO);
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar', description: String(error), variant: 'destructive' });
    },
  });

  const deleteAcervoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('library_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-acervo-simbolico'] });
      toast({ title: 'Conto removido' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao remover', description: String(error), variant: 'destructive' });
    },
  });

  // ============ HANDLERS ============

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
      porta_psiquica: conto.porta_psiquica || '',
      eixo_simbolico: conto.eixo_simbolico || '',
      nivel_risco: conto.nivel_risco || 'baixo',
      tipo_uso: conto.tipo_uso || 'estudo',
      exige_certificacao: conto.exige_certificacao || false,
      permite_grupo: conto.permite_grupo ?? true,
      permite_crise_aguda: conto.permite_crise_aguda || false,
      restricoes_combinacao: conto.restricoes_combinacao || [],
      exige_cartografia: conto.exige_cartografia || false,
      audio_padrao_disponivel: conto.audio_padrao_disponivel || false,
      audio_padrao_id: conto.audio_padrao_id,
      aviso_etico: conto.aviso_etico || '',
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

  const handleEditAcervo = (item: AcervoItem) => {
    setEditingAcervo(item);
    setAcervoFormData({
      title: item.title,
      content: item.content || '',
      type: 'conto',
      tags: item.tags || [],
      origem_cultural: item.origem_cultural || '',
      observacoes_leitura: item.observacoes_leitura || '',
      portal_level_required: (item.portal_level_required || 'visitante') as PortalLevel,
    });
    setIsAcervoDialogOpen(true);
  };

  const handleSubmitAcervo = () => {
    if (editingAcervo) {
      updateAcervoMutation.mutate({ id: editingAcervo.id, data: acervoFormData });
    } else {
      createAcervoMutation.mutate(acervoFormData);
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
  const isAcervoPending = createAcervoMutation.isPending || updateAcervoMutation.isPending;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="acervo">
        <TabsList>
          <TabsTrigger value="acervo" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Acervo Simbólico
          </TabsTrigger>
          <TabsTrigger value="contos" className="gap-2">
            <BookOpenCheck className="w-4 h-4" />
            Contos Clínicos
          </TabsTrigger>
          <TabsTrigger value="audios" className="gap-2">
            <Headphones className="w-4 h-4" />
            Áudios de Narração
          </TabsTrigger>
        </TabsList>

        {/* ============ ACERVO SIMBÓLICO TAB ============ */}
        <TabsContent value="acervo" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Acervo Simbólico de Referência</h3>
              <p className="text-sm text-muted-foreground">
                Contos de estudo abertos a todos os portais
              </p>
            </div>
            <Dialog open={isAcervoDialogOpen} onOpenChange={(open) => {
              setIsAcervoDialogOpen(open);
              if (!open) {
                setEditingAcervo(null);
                setAcervoFormData(EMPTY_ACERVO);
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
                    {editingAcervo ? 'Editar Conto de Estudo' : 'Novo Conto de Estudo'}
                  </DialogTitle>
                  <DialogDescription>
                    Contos do acervo simbólico para estudo e referência.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Título *</Label>
                    <Input
                      value={acervoFormData.title}
                      onChange={(e) => setAcervoFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="A Donzela Sem Mãos"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Origem Cultural</Label>
                      <Input
                        value={acervoFormData.origem_cultural || ''}
                        onChange={(e) => setAcervoFormData(prev => ({ ...prev, origem_cultural: e.target.value }))}
                        placeholder="Tradição europeia"
                      />
                    </div>
                    <div>
                      <Label>Tags (separadas por vírgula)</Label>
                      <Input
                        value={acervoFormData.tags?.join(', ') || ''}
                        onChange={(e) => setAcervoFormData(prev => ({
                          ...prev,
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        }))}
                        placeholder="feminino, sombra, integração"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Conteúdo / Texto do Conto</Label>
                    <Textarea
                      value={acervoFormData.content || ''}
                      onChange={(e) => setAcervoFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Era uma vez..."
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label>Observações de Leitura</Label>
                    <Textarea
                      value={acervoFormData.observacoes_leitura || ''}
                      onChange={(e) => setAcervoFormData(prev => ({ ...prev, observacoes_leitura: e.target.value }))}
                      placeholder="Notas sobre os símbolos e camadas de interpretação..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAcervoDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmitAcervo} disabled={isAcervoPending}>
                      {isAcervoPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingAcervo ? 'Salvar' : 'Criar'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingAcervo ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </CardContent>
            </Card>
          ) : !acervoItems || acervoItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum conto de estudo cadastrado</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Origem Cultural</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acervoItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.origem_cultural || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(item.tags?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(item.tags?.length || 0) - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          Ativo
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAcervo(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Remover este conto de estudo?')) {
                                deleteAcervoMutation.mutate(item.id);
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

        {/* ============ CONTOS CLÍNICOS TAB ============ */}
        <TabsContent value="contos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Contos Clínicos Oficiais</h3>
              <p className="text-sm text-muted-foreground">
                Os 12 contos da Câmara de Narração Oracular™
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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Porta Psíquica</Label>
                      <Input
                        value={formData.porta_psiquica || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, porta_psiquica: e.target.value }))}
                        placeholder="Porta da Origem"
                      />
                    </div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Eixo Simbólico</Label>
                      <Input
                        value={formData.eixo_simbolico || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, eixo_simbolico: e.target.value }))}
                        placeholder="Feminino Ancestral"
                      />
                    </div>
                    <div>
                      <Label>Nível de Risco *</Label>
                      <Select
                        value={formData.nivel_risco}
                        onValueChange={(value: NivelRisco) => setFormData(prev => ({ ...prev, nivel_risco: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixo">🟢 Baixo</SelectItem>
                          <SelectItem value="medio">🟡 Médio</SelectItem>
                          <SelectItem value="alto">🔴 Alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Uso *</Label>
                      <Select
                        value={formData.tipo_uso}
                        onValueChange={(value: TipoUso) => setFormData(prev => ({ ...prev, tipo_uso: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estudo">📚 Estudo</SelectItem>
                          <SelectItem value="clinico_autorizado">🏥 Clínico Autorizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Restrições de Combinação</Label>
                      <Input
                        value={formData.restricoes_combinacao?.join(', ') || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          restricoes_combinacao: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }))}
                        placeholder="Porta do Luto, Porta da Sombra"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Portas Psíquicas separadas por vírgula
                      </p>
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

                  <div>
                    <Label>Aviso Ético (exibido para conto de alto risco)</Label>
                    <Textarea
                      value={formData.aviso_etico || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, aviso_etico: e.target.value }))}
                      placeholder="Este conto possui conteúdo que pode mobilizar camadas psíquicas profundas..."
                      rows={2}
                    />
                  </div>

                  {/* Boolean switches grid */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.exige_certificacao}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, exige_certificacao: checked }))}
                      />
                      <Label className="flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" />
                        Exige Certificação
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.exige_cartografia}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, exige_cartografia: checked }))}
                      />
                      <Label className="flex items-center gap-1">
                        <ClipboardPen className="w-4 h-4" />
                        Exige Cartografia
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.permite_grupo}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, permite_grupo: checked }))}
                      />
                      <Label className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Permite Grupo
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.permite_crise_aguda}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, permite_crise_aguda: checked }))}
                      />
                      <Label className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Permite Crise Aguda
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.audio_padrao_disponivel}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, audio_padrao_disponivel: checked }))}
                      />
                      <Label className="flex items-center gap-1">
                        <AudioIcon className="w-4 h-4" />
                        Áudio Padrão Disponível
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.ativo}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                      />
                      <Label>Ativo</Label>
                    </div>
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
                    <TableHead>Porta Psíquica</TableHead>
                    <TableHead>Risco</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contos.map((conto) => {
                    const riskColors = {
                      baixo: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50',
                      medio: 'bg-amber-500/10 text-amber-500 border-amber-500/50',
                      alto: 'bg-destructive/10 text-destructive border-destructive/50',
                    };
                    return (
                    <TableRow key={conto.id}>
                      <TableCell className="font-mono text-xs">{conto.ordem}</TableCell>
                      <TableCell className="font-medium">{conto.titulo}</TableCell>
                      <TableCell>
                        {conto.porta_psiquica ? (
                          <Badge variant="outline" className="gap-1">
                            <DoorOpen className="w-3 h-3" />
                            {conto.porta_psiquica}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={riskColors[conto.nivel_risco || 'baixo']}>
                          {conto.nivel_risco === 'alto' ? '🔴 Alto' : 
                           conto.nivel_risco === 'medio' ? '🟡 Médio' : '🟢 Baixo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {conto.tipo_uso === 'clinico_autorizado' ? '🏥 Clínico' : '📚 Estudo'}
                        </Badge>
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
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* ============ ÁUDIOS TAB ============ */}
        <TabsContent value="audios" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Áudios de Narração</h3>
            <p className="text-sm text-muted-foreground">
              Associar Porta Psíquica aos áudios da categoria "Narração Padrão Oracular"
            </p>
          </div>

          {isLoadingAudios ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </CardContent>
            </Card>
          ) : !audios || audios.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Headphones className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum áudio encontrado</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Adicione áudios na aba Áudios com categoria "Narração Padrão Oracular"
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Porta Psíquica</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audios.map((audio) => (
                    <TableRow key={audio.id}>
                      <TableCell className="font-mono text-xs">{audio.ordem || '-'}</TableCell>
                      <TableCell className="font-medium">{audio.titulo}</TableCell>
                      <TableCell>
                        <Input
                          className="max-w-[200px] h-8 text-sm"
                          value={audio.porta_psiquica || ''}
                          placeholder="Porta da Origem"
                          onChange={(e) => {
                            updateAudioMutation.mutate({
                              id: audio.id,
                              porta_psiquica: e.target.value,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={audio.publicado ? 'secondary' : 'outline'}>
                          {audio.publicado ? 'Publicado' : 'Rascunho'}
                        </Badge>
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
