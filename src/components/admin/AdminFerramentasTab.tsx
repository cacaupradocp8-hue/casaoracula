import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Brain, Compass, HelpCircle, Save, ClipboardList, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Type for Ferramenta (from sala_ferramentas)
interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_chave: string;
  ferramenta_descricao: string | null;
  rota: string | null;
  icone: string | null;
  sala_id: string | null;
  ordem: number;
  ativa: boolean;
}

interface Sala {
  id: string;
  nome_exibicao: string;
}

// Types
interface Big5Dimensao {
  id: string;
  chave: string;
  nome: string;
  descricao: string;
  perguntas_reflexao: string[];
  ativo: boolean;
  ordem: number;
}

interface Big5Pergunta {
  id: string;
  dimensao: 'abertura' | 'conscienciosidade' | 'extroversao' | 'amabilidade' | 'neuroticismo';
  texto_pergunta: string;
  tipo: 'escala_1_5' | 'texto';
  ativo: boolean;
  ordem: number;
}

interface EneagramaTipo {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  palavras_chave: string[];
  virtude: string | null;
  fixacao: string | null;
  ativo: boolean;
}

interface EneagramaInstinto {
  id: string;
  chave: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

type PortalType = 'visitante' | 'pre_iniciada' | 'iniciada' | 'admin';
type AgenteStatus = 'ativo' | 'inativo';

interface OraculoPergunta {
  id: string;
  pergunta: string;
  tema: string;
  tags: string[] | null;
  nivel_intensidade: number | null;
  status: AgenteStatus;
  portal_minimo: PortalType;
}

export function AdminFerramentasTab() {
  return (
    <Tabs defaultValue="catalogo" className="space-y-4">
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1">
        <TabsTrigger value="catalogo" className="gap-2">
          <Wrench className="w-4 h-4" />
          Catálogo
        </TabsTrigger>
        <TabsTrigger value="big5" className="gap-2">
          <Brain className="w-4 h-4" />
          Big Five
        </TabsTrigger>
        <TabsTrigger value="big5-questionario" className="gap-2">
          <ClipboardList className="w-4 h-4" />
          Big5 Questionário
        </TabsTrigger>
        <TabsTrigger value="eneagrama" className="gap-2">
          <Compass className="w-4 h-4" />
          Eneagrama
        </TabsTrigger>
        <TabsTrigger value="oraculo" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          Oráculo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="catalogo">
        <CatalogoFerramentasSection />
      </TabsContent>

      <TabsContent value="big5">
        <Big5Section />
      </TabsContent>

      <TabsContent value="big5-questionario">
        <Big5QuestionarioSection />
      </TabsContent>

      <TabsContent value="eneagrama">
        <EneagramaSection />
      </TabsContent>

      <TabsContent value="oraculo">
        <OraculoSection />
      </TabsContent>
    </Tabs>
  );
}

// Catálogo de Ferramentas - CRUD completo
function CatalogoFerramentasSection() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFerramenta, setEditingFerramenta] = useState<Ferramenta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ferramentasRes, salasRes] = await Promise.all([
      supabase.from('sala_ferramentas').select('*').order('ordem'),
      supabase.from('salas').select('id, nome_exibicao').eq('ativa', true).order('ordem')
    ]);

    if (ferramentasRes.data) setFerramentas(ferramentasRes.data);
    if (salasRes.data) setSalas(salasRes.data);
    setLoading(false);
  };

  const getSalaNome = (salaId: string | null) => {
    if (!salaId) return 'Sem sala';
    const sala = salas.find(s => s.id === salaId);
    return sala?.nome_exibicao || 'Sala não encontrada';
  };

  const handleSave = async (ferramenta: Ferramenta) => {
    if (isCreating) {
      const { error } = await supabase
        .from('sala_ferramentas')
        .insert([{
          ferramenta_nome: ferramenta.ferramenta_nome,
          ferramenta_chave: ferramenta.ferramenta_chave,
          ferramenta_descricao: ferramenta.ferramenta_descricao,
          rota: ferramenta.rota,
          icone: ferramenta.icone,
          sala_id: ferramenta.sala_id,
          ordem: ferramenta.ordem,
          ativa: ferramenta.ativa
        }]);

      if (error) {
        toast({ title: 'Erro ao criar ferramenta', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Ferramenta criada com sucesso' });
        fetchData();
        setDialogOpen(false);
        setIsCreating(false);
      }
    } else {
      const { error } = await supabase
        .from('sala_ferramentas')
        .update({
          ferramenta_nome: ferramenta.ferramenta_nome,
          ferramenta_chave: ferramenta.ferramenta_chave,
          ferramenta_descricao: ferramenta.ferramenta_descricao,
          rota: ferramenta.rota,
          icone: ferramenta.icone,
          sala_id: ferramenta.sala_id,
          ordem: ferramenta.ordem,
          ativa: ferramenta.ativa
        })
        .eq('id', ferramenta.id);

      if (error) {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Ferramenta atualizada' });
        fetchData();
        setDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ferramenta?')) return;
    
    const { error } = await supabase.from('sala_ferramentas').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Ferramenta excluída' });
      fetchData();
    }
  };

  const toggleAtiva = async (ferramenta: Ferramenta) => {
    const { error } = await supabase
      .from('sala_ferramentas')
      .update({ ativa: !ferramenta.ativa })
      .eq('id', ferramenta.id);

    if (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } else {
      fetchData();
    }
  };

  const openCreateDialog = () => {
    setEditingFerramenta({
      id: '',
      ferramenta_nome: '',
      ferramenta_chave: '',
      ferramenta_descricao: '',
      rota: '/ferramentas/',
      icone: 'sparkles',
      sala_id: salas[0]?.id || null,
      ordem: ferramentas.length + 1,
      ativa: false
    });
    setIsCreating(true);
    setDialogOpen(true);
  };

  if (loading) return <div className="text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Catálogo de Ferramentas</h3>
          <p className="text-sm text-muted-foreground">Gerencie todas as ferramentas do sistema</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Ferramenta
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingFerramenta(null);
          setIsCreating(false);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Nova Ferramenta' : 'Editar Ferramenta'}</DialogTitle>
          </DialogHeader>
          {editingFerramenta && (
            <FerramentaForm 
              ferramenta={editingFerramenta} 
              salas={salas}
              onSave={handleSave}
              onChange={setEditingFerramenta}
            />
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ordem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Rota</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ferramentas.map((f) => (
                <TableRow key={f.id} className={!f.ativa ? 'opacity-50' : ''}>
                  <TableCell className="font-mono text-xs">{f.ordem}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{f.ferramenta_nome}</span>
                      {f.icone && (
                        <span className="ml-2 text-xs text-muted-foreground">({f.icone})</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{f.ferramenta_chave}</TableCell>
                  <TableCell className="text-sm">{getSalaNome(f.sala_id)}</TableCell>
                  <TableCell className="font-mono text-xs">{f.rota || '-'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={f.ativa}
                      onCheckedChange={() => toggleAtiva(f)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingFerramenta(f);
                        setIsCreating(false);
                        setDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {ferramentas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma ferramenta cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Form para Criar/Editar Ferramenta
function FerramentaForm({ ferramenta, salas, onSave, onChange }: { 
  ferramenta: Ferramenta;
  salas: Sala[];
  onSave: (f: Ferramenta) => void;
  onChange: (f: Ferramenta) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Nome da Ferramenta</Label>
        <Input 
          value={ferramenta.ferramenta_nome} 
          onChange={(e) => onChange({ ...ferramenta, ferramenta_nome: e.target.value })}
          placeholder="Ex: Chakras"
        />
      </div>
      <div>
        <Label>Chave (identificador único)</Label>
        <Input 
          value={ferramenta.ferramenta_chave} 
          onChange={(e) => onChange({ ...ferramenta, ferramenta_chave: e.target.value.toLowerCase().replace(/\s/g, '_') })}
          placeholder="Ex: chakras"
        />
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea 
          value={ferramenta.ferramenta_descricao || ''} 
          onChange={(e) => onChange({ ...ferramenta, ferramenta_descricao: e.target.value })}
          placeholder="Descrição breve da ferramenta..."
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rota</Label>
          <Input 
            value={ferramenta.rota || ''} 
            onChange={(e) => onChange({ ...ferramenta, rota: e.target.value })}
            placeholder="/ferramentas/chakras"
          />
        </div>
        <div>
          <Label>Ícone (nome Lucide)</Label>
          <Input 
            value={ferramenta.icone || ''} 
            onChange={(e) => onChange({ ...ferramenta, icone: e.target.value })}
            placeholder="sparkles, brain, heart..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Sala</Label>
          <Select 
            value={ferramenta.sala_id || ''} 
            onValueChange={(v) => onChange({ ...ferramenta, sala_id: v || null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a sala" />
            </SelectTrigger>
            <SelectContent>
              {salas.map(sala => (
                <SelectItem key={sala.id} value={sala.id}>{sala.nome_exibicao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Ordem</Label>
          <Input 
            type="number" 
            value={ferramenta.ordem} 
            onChange={(e) => onChange({ ...ferramenta, ordem: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={ferramenta.ativa} 
          onCheckedChange={(checked) => onChange({ ...ferramenta, ativa: checked })}
        />
        <Label>Ativa (visível para usuárias)</Label>
      </div>
      <Button onClick={() => onSave(ferramenta)} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar
      </Button>
    </div>
  );
}

// Big5 Dimensões Section
function Big5Section() {
  const [dimensoes, setDimensoes] = useState<Big5Dimensao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDimensao, setEditingDimensao] = useState<Big5Dimensao | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDimensoes();
  }, []);

  const fetchDimensoes = async () => {
    const { data, error } = await supabase
      .from('big5_dimensoes')
      .select('*')
      .order('ordem');
    
    if (error) {
      toast({ title: 'Erro ao carregar dimensões', variant: 'destructive' });
    } else {
      setDimensoes(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (dimensao: Big5Dimensao) => {
    const { error } = await supabase
      .from('big5_dimensoes')
      .update({
        nome: dimensao.nome,
        descricao: dimensao.descricao,
        perguntas_reflexao: dimensao.perguntas_reflexao,
        ativo: dimensao.ativo,
        ordem: dimensao.ordem
      })
      .eq('id', dimensao.id);

    if (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } else {
      toast({ title: 'Dimensão atualizada' });
      fetchDimensoes();
      setDialogOpen(false);
    }
  };

  if (loading) return <div className="text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dimensões Big Five (OCEAN)</h3>
      </div>

      <div className="grid gap-4">
        {dimensoes.map((dim) => (
          <Card key={dim.id} className={!dim.ativo ? 'opacity-50' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{dim.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{dim.descricao}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog open={dialogOpen && editingDimensao?.id === dim.id} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setEditingDimensao(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingDimensao(dim)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Editar Dimensão</DialogTitle>
                      </DialogHeader>
                      {editingDimensao && (
                        <Big5EditForm 
                          dimensao={editingDimensao} 
                          onSave={handleSave}
                          onChange={setEditingDimensao}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <strong>Perguntas reflexivas:</strong>
                <ul className="list-disc list-inside mt-1">
                  {dim.perguntas_reflexao?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Big5EditForm({ dimensao, onSave, onChange }: { 
  dimensao: Big5Dimensao; 
  onSave: (d: Big5Dimensao) => void;
  onChange: (d: Big5Dimensao) => void;
}) {
  const [perguntas, setPerguntas] = useState(dimensao.perguntas_reflexao?.join('\n') || '');

  return (
    <div className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input 
          value={dimensao.nome} 
          onChange={(e) => onChange({ ...dimensao, nome: e.target.value })}
        />
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea 
          value={dimensao.descricao} 
          onChange={(e) => onChange({ ...dimensao, descricao: e.target.value })}
        />
      </div>
      <div>
        <Label>Perguntas reflexivas (uma por linha)</Label>
        <Textarea 
          value={perguntas}
          onChange={(e) => {
            setPerguntas(e.target.value);
            onChange({ ...dimensao, perguntas_reflexao: e.target.value.split('\n').filter(p => p.trim()) });
          }}
          rows={4}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={dimensao.ativo} 
          onCheckedChange={(checked) => onChange({ ...dimensao, ativo: checked })}
        />
        <Label>Ativo</Label>
      </div>
      <div>
        <Label>Ordem</Label>
        <Input 
          type="number" 
          value={dimensao.ordem} 
          onChange={(e) => onChange({ ...dimensao, ordem: parseInt(e.target.value) || 0 })}
        />
      </div>
      <Button onClick={() => onSave(dimensao)} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar
      </Button>
    </div>
  );
}

// Big5 Questionário Section - CRUD completo
function Big5QuestionarioSection() {
  const [perguntas, setPerguntas] = useState<Big5Pergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPergunta, setEditingPergunta] = useState<Big5Pergunta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPerguntas();
  }, []);

  const fetchPerguntas = async () => {
    const { data, error } = await supabase
      .from('big5_questionario')
      .select('*')
      .order('dimensao')
      .order('ordem');
    
    if (error) {
      toast({ title: 'Erro ao carregar perguntas', variant: 'destructive' });
    } else {
      setPerguntas(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (pergunta: Big5Pergunta) => {
    if (isCreating) {
      const { error } = await supabase
        .from('big5_questionario')
        .insert([{
          dimensao: pergunta.dimensao,
          texto_pergunta: pergunta.texto_pergunta,
          tipo: pergunta.tipo,
          ativo: pergunta.ativo,
          ordem: pergunta.ordem
        }]);

      if (error) {
        toast({ title: 'Erro ao criar pergunta', variant: 'destructive' });
      } else {
        toast({ title: 'Pergunta criada' });
        fetchPerguntas();
        setDialogOpen(false);
        setIsCreating(false);
      }
    } else {
      const { error } = await supabase
        .from('big5_questionario')
        .update({
          dimensao: pergunta.dimensao,
          texto_pergunta: pergunta.texto_pergunta,
          tipo: pergunta.tipo,
          ativo: pergunta.ativo,
          ordem: pergunta.ordem
        })
        .eq('id', pergunta.id);

      if (error) {
        toast({ title: 'Erro ao salvar', variant: 'destructive' });
      } else {
        toast({ title: 'Pergunta atualizada' });
        fetchPerguntas();
        setDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;
    
    const { error } = await supabase.from('big5_questionario').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Pergunta excluída' });
      fetchPerguntas();
    }
  };

  const openCreateDialog = () => {
    setEditingPergunta({
      id: '',
      dimensao: 'abertura',
      texto_pergunta: '',
      tipo: 'escala_1_5',
      ativo: true,
      ordem: perguntas.length + 1
    });
    setIsCreating(true);
    setDialogOpen(true);
  };

  const toggleAtivo = async (pergunta: Big5Pergunta) => {
    const { error } = await supabase
      .from('big5_questionario')
      .update({ ativo: !pergunta.ativo })
      .eq('id', pergunta.id);

    if (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } else {
      fetchPerguntas();
    }
  };

  const dimensaoLabels: Record<string, string> = {
    abertura: 'Abertura',
    conscienciosidade: 'Conscienciosidade',
    extroversao: 'Extroversão',
    amabilidade: 'Amabilidade',
    neuroticismo: 'Neuroticismo'
  };

  if (loading) return <div className="text-muted-foreground">Carregando...</div>;

  // Agrupar perguntas por dimensão
  const perguntasPorDimensao = perguntas.reduce((acc, p) => {
    if (!acc[p.dimensao]) acc[p.dimensao] = [];
    acc[p.dimensao].push(p);
    return acc;
  }, {} as Record<string, Big5Pergunta[]>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Perguntas do Questionário Big5</h3>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Pergunta
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingPergunta(null);
          setIsCreating(false);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Nova Pergunta' : 'Editar Pergunta'}</DialogTitle>
          </DialogHeader>
          {editingPergunta && (
            <Big5PerguntaForm 
              pergunta={editingPergunta} 
              onSave={handleSave}
              onChange={setEditingPergunta}
            />
          )}
        </DialogContent>
      </Dialog>

      {Object.entries(dimensaoLabels).map(([key, label]) => (
        <div key={key} className="space-y-2">
          <h4 className="font-medium text-primary">{label}</h4>
          <div className="grid gap-2">
            {(perguntasPorDimensao[key] || []).map((p) => (
              <Card key={p.id} className={!p.ativo ? 'opacity-50' : ''}>
                <CardContent className="py-3">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm">{p.texto_pergunta}</p>
                      <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                        <span>Tipo: {p.tipo === 'escala_1_5' ? 'Escala 1-5' : 'Texto'}</span>
                        <span>•</span>
                        <span>Ordem: {p.ordem}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={p.ativo}
                        onCheckedChange={() => toggleAtivo(p)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingPergunta(p);
                        setIsCreating(false);
                        setDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!perguntasPorDimensao[key] || perguntasPorDimensao[key].length === 0) && (
              <p className="text-sm text-muted-foreground italic">Nenhuma pergunta cadastrada</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Big5PerguntaForm({ pergunta, onSave, onChange }: { 
  pergunta: Big5Pergunta; 
  onSave: (p: Big5Pergunta) => void;
  onChange: (p: Big5Pergunta) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Pergunta</Label>
        <Textarea 
          value={pergunta.texto_pergunta} 
          onChange={(e) => onChange({ ...pergunta, texto_pergunta: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label>Dimensão</Label>
        <Select 
          value={pergunta.dimensao} 
          onValueChange={(v) => onChange({ ...pergunta, dimensao: v as Big5Pergunta['dimensao'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="abertura">Abertura</SelectItem>
            <SelectItem value="conscienciosidade">Conscienciosidade</SelectItem>
            <SelectItem value="extroversao">Extroversão</SelectItem>
            <SelectItem value="amabilidade">Amabilidade</SelectItem>
            <SelectItem value="neuroticismo">Neuroticismo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tipo</Label>
          <Select 
            value={pergunta.tipo} 
            onValueChange={(v) => onChange({ ...pergunta, tipo: v as Big5Pergunta['tipo'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="escala_1_5">Escala 1-5</SelectItem>
              <SelectItem value="texto">Texto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Ordem</Label>
          <Input 
            type="number" 
            value={pergunta.ordem} 
            onChange={(e) => onChange({ ...pergunta, ordem: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={pergunta.ativo} 
          onCheckedChange={(checked) => onChange({ ...pergunta, ativo: checked })}
        />
        <Label>Ativo</Label>
      </div>
      <Button onClick={() => onSave(pergunta)} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar
      </Button>
    </div>
  );
}

// Eneagrama Section
function EneagramaSection() {
  const [tipos, setTipos] = useState<EneagramaTipo[]>([]);
  const [instintos, setInstintos] = useState<EneagramaInstinto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTipo, setEditingTipo] = useState<EneagramaTipo | null>(null);
  const [editingInstinto, setEditingInstinto] = useState<EneagramaInstinto | null>(null);
  const [tipoDialogOpen, setTipoDialogOpen] = useState(false);
  const [instintoDialogOpen, setInstintoDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [tiposRes, instintosRes] = await Promise.all([
      supabase.from('eneagrama_tipos').select('*').order('numero'),
      supabase.from('eneagrama_instintos').select('*').order('chave')
    ]);

    if (tiposRes.data) setTipos(tiposRes.data);
    if (instintosRes.data) setInstintos(instintosRes.data);
    setLoading(false);
  };

  const handleSaveTipo = async (tipo: EneagramaTipo) => {
    const { error } = await supabase
      .from('eneagrama_tipos')
      .update({
        nome: tipo.nome,
        descricao: tipo.descricao,
        palavras_chave: tipo.palavras_chave,
        virtude: tipo.virtude,
        fixacao: tipo.fixacao,
        ativo: tipo.ativo
      })
      .eq('id', tipo.id);

    if (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } else {
      toast({ title: 'Tipo atualizado' });
      fetchData();
      setTipoDialogOpen(false);
    }
  };

  const handleSaveInstinto = async (instinto: EneagramaInstinto) => {
    const { error } = await supabase
      .from('eneagrama_instintos')
      .update({
        nome: instinto.nome,
        descricao: instinto.descricao,
        ativo: instinto.ativo
      })
      .eq('id', instinto.id);

    if (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } else {
      toast({ title: 'Instinto atualizado' });
      fetchData();
      setInstintoDialogOpen(false);
    }
  };

  if (loading) return <div className="text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Tipos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">9 Tipos do Eneagrama</h3>
        <div className="grid gap-3">
          {tipos.map((tipo) => (
            <Card key={tipo.id} className={!tipo.ativo ? 'opacity-50' : ''}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{tipo.numero}</span>
                      <span className="font-medium">{tipo.nome}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{tipo.descricao}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tipo.palavras_chave?.map((p, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{p}</span>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="text-green-600">Virtude: {tipo.virtude}</span>
                      <span className="mx-2">•</span>
                      <span className="text-red-600">Fixação: {tipo.fixacao}</span>
                    </div>
                  </div>
                  <Dialog open={tipoDialogOpen && editingTipo?.id === tipo.id} onOpenChange={(open) => {
                    setTipoDialogOpen(open);
                    if (!open) setEditingTipo(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingTipo(tipo)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Editar Tipo {tipo.numero}</DialogTitle>
                      </DialogHeader>
                      {editingTipo && (
                        <EnegramaTipoForm 
                          tipo={editingTipo} 
                          onSave={handleSaveTipo}
                          onChange={setEditingTipo}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Instintos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Instintos</h3>
        <div className="grid gap-3">
          {instintos.map((inst) => (
            <Card key={inst.id} className={!inst.ativo ? 'opacity-50' : ''}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{inst.nome}</div>
                    <p className="text-sm text-muted-foreground">{inst.descricao}</p>
                  </div>
                  <Dialog open={instintoDialogOpen && editingInstinto?.id === inst.id} onOpenChange={(open) => {
                    setInstintoDialogOpen(open);
                    if (!open) setEditingInstinto(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingInstinto(inst)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Instinto</DialogTitle>
                      </DialogHeader>
                      {editingInstinto && (
                        <EnegramaInstintoForm 
                          instinto={editingInstinto} 
                          onSave={handleSaveInstinto}
                          onChange={setEditingInstinto}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnegramaTipoForm({ tipo, onSave, onChange }: { 
  tipo: EneagramaTipo; 
  onSave: (t: EneagramaTipo) => void;
  onChange: (t: EneagramaTipo) => void;
}) {
  const [palavras, setPalavras] = useState(tipo.palavras_chave?.join(', ') || '');

  return (
    <div className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input 
          value={tipo.nome} 
          onChange={(e) => onChange({ ...tipo, nome: e.target.value })}
        />
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea 
          value={tipo.descricao} 
          onChange={(e) => onChange({ ...tipo, descricao: e.target.value })}
        />
      </div>
      <div>
        <Label>Palavras-chave (separadas por vírgula)</Label>
        <Input 
          value={palavras}
          onChange={(e) => {
            setPalavras(e.target.value);
            onChange({ ...tipo, palavras_chave: e.target.value.split(',').map(p => p.trim()).filter(p => p) });
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Virtude</Label>
          <Input 
            value={tipo.virtude || ''} 
            onChange={(e) => onChange({ ...tipo, virtude: e.target.value })}
          />
        </div>
        <div>
          <Label>Fixação</Label>
          <Input 
            value={tipo.fixacao || ''} 
            onChange={(e) => onChange({ ...tipo, fixacao: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={tipo.ativo} 
          onCheckedChange={(checked) => onChange({ ...tipo, ativo: checked })}
        />
        <Label>Ativo</Label>
      </div>
      <Button onClick={() => onSave(tipo)} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar
      </Button>
    </div>
  );
}

function EnegramaInstintoForm({ instinto, onSave, onChange }: { 
  instinto: EneagramaInstinto; 
  onSave: (i: EneagramaInstinto) => void;
  onChange: (i: EneagramaInstinto) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input 
          value={instinto.nome} 
          onChange={(e) => onChange({ ...instinto, nome: e.target.value })}
        />
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea 
          value={instinto.descricao} 
          onChange={(e) => onChange({ ...instinto, descricao: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={instinto.ativo} 
          onCheckedChange={(checked) => onChange({ ...instinto, ativo: checked })}
        />
        <Label>Ativo</Label>
      </div>
      <Button onClick={() => onSave(instinto)} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar
      </Button>
    </div>
  );
}

// Oráculo Section
function OraculoSection() {
  const [perguntas, setPerguntas] = useState<OraculoPergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPergunta, setEditingPergunta] = useState<OraculoPergunta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPerguntas();
  }, []);

  const fetchPerguntas = async () => {
    const { data, error } = await supabase
      .from('oraculo_perguntas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Erro ao carregar perguntas', variant: 'destructive' });
    } else {
      setPerguntas(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (pergunta: OraculoPergunta) => {
    if (isCreating) {
      const { error } = await supabase
        .from('oraculo_perguntas')
        .insert([{
          pergunta: pergunta.pergunta,
          tema: pergunta.tema,
          tags: pergunta.tags,
          nivel_intensidade: pergunta.nivel_intensidade,
          status: pergunta.status,
          portal_minimo: pergunta.portal_minimo
        }]);

      if (error) {
        toast({ title: 'Erro ao criar pergunta', variant: 'destructive' });
      } else {
        toast({ title: 'Pergunta criada' });
        fetchPerguntas();
        setDialogOpen(false);
        setIsCreating(false);
      }
    } else {
      const { error } = await supabase
        .from('oraculo_perguntas')
        .update({
          pergunta: pergunta.pergunta,
          tema: pergunta.tema,
          tags: pergunta.tags,
          nivel_intensidade: pergunta.nivel_intensidade,
          status: pergunta.status,
          portal_minimo: pergunta.portal_minimo
        })
        .eq('id', pergunta.id);

      if (error) {
        toast({ title: 'Erro ao salvar', variant: 'destructive' });
      } else {
        toast({ title: 'Pergunta atualizada' });
        fetchPerguntas();
        setDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;
    
    const { error } = await supabase.from('oraculo_perguntas').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Pergunta excluída' });
      fetchPerguntas();
    }
  };

  const openCreateDialog = () => {
    setEditingPergunta({
      id: '',
      pergunta: '',
      tema: '',
      tags: [],
      nivel_intensidade: 3,
      status: 'ativo' as AgenteStatus,
      portal_minimo: 'pre_iniciada' as PortalType
    });
    setIsCreating(true);
    setDialogOpen(true);
  };

  if (loading) return <div className="text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Perguntas Desafiadoras</h3>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Pergunta
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingPergunta(null);
          setIsCreating(false);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Nova Pergunta' : 'Editar Pergunta'}</DialogTitle>
          </DialogHeader>
          {editingPergunta && (
            <OraculoPerguntaForm 
              pergunta={editingPergunta} 
              onSave={handleSave}
              onChange={setEditingPergunta}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-3">
        {perguntas.map((p) => (
          <Card key={p.id} className={p.status === 'inativo' ? 'opacity-50' : ''}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium">{p.pergunta}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{p.tema}</span>
                    <span className="bg-muted px-2 py-0.5 rounded">Intensidade: {p.nivel_intensidade || 1}/5</span>
                    <span className={`px-2 py-0.5 rounded ${p.status === 'ativo' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingPergunta(p);
                    setIsCreating(false);
                    setDialogOpen(true);
                  }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OraculoPerguntaForm({ pergunta, onSave, onChange }: { 
  pergunta: OraculoPergunta; 
  onSave: (p: OraculoPergunta) => void;
  onChange: (p: OraculoPergunta) => void;
}) {
  const [tags, setTags] = useState(pergunta.tags?.join(', ') || '');

  return (
    <div className="space-y-4">
      <div>
        <Label>Pergunta</Label>
        <Textarea 
          value={pergunta.pergunta} 
          onChange={(e) => onChange({ ...pergunta, pergunta: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label>Tema</Label>
        <Input 
          value={pergunta.tema} 
          onChange={(e) => onChange({ ...pergunta, tema: e.target.value })}
          placeholder="Ex: sombra, limite, verdade, decisão"
        />
      </div>
      <div>
        <Label>Tags (separadas por vírgula)</Label>
        <Input 
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
            onChange({ ...pergunta, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) });
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nível de Intensidade (1-5)</Label>
          <Select 
            value={String(pergunta.nivel_intensidade || 3)} 
            onValueChange={(v) => onChange({ ...pergunta, nivel_intensidade: parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select 
            value={pergunta.status} 
            onValueChange={(v) => onChange({ ...pergunta, status: v as AgenteStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Portal Mínimo</Label>
        <Select 
          value={pergunta.portal_minimo} 
          onValueChange={(v) => onChange({ ...pergunta, portal_minimo: v as PortalType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visitante">Visitante</SelectItem>
            <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
            <SelectItem value="iniciada">Iniciada</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => onSave(pergunta)} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar
      </Button>
    </div>
  );
}
