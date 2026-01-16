import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageUpload } from './ImageUpload';
import { toast } from 'sonner';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Grid3X3, 
  Gem, 
  Settings,
  Save,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

interface Grafico {
  id: string;
  nome: string;
  autor: string | null;
  origem: string;
  categoria: string;
  tipo_leitura: string;
  para_que_serve: string | null;
  quando_nao_usar: string | null;
  observacoes_simbolicas: string | null;
  imagem_url: string | null;
  combinacoes: string[];
  ordem: number;
  ativo: boolean;
  // Campos da loja
  link_loja: string | null;
  imagem_fisica_url: string | null;
  disponivel_loja: boolean;
}

interface Cristal {
  id: string;
  nome: string;
  explicacao_simbolica: string | null;
  quando_usar: string | null;
  quando_evitar: string | null;
  alerta_excesso: string | null;
  campos: string[];
  estados: string[];
  graficos_associados: string[];
  link_externo: string | null;
  imagem_url: string | null;
  ordem: number;
  ativo: boolean;
}

interface ConfigItem {
  id: string;
  chave: string;
  valor: any;
  ativo: boolean;
}

const ORIGEM_OPTIONS = [
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'autoral', label: 'Autoral' },
  { value: 'alquimico', label: 'Alquímico' },
];

const CATEGORIA_OPTIONS = [
  { value: 'clinico', label: 'Clínico' },
  { value: 'oracular', label: 'Oracular' },
  { value: 'estudo', label: 'Estudo' },
];

const TIPO_LEITURA_OPTIONS = [
  { value: 'campo', label: 'Campo' },
  { value: 'frequencia', label: 'Frequência' },
  { value: 'narrativa', label: 'Narrativa' },
  { value: 'apoio', label: 'Apoio' },
];

export function AdminRadiestesiaTab() {
  const [activeTab, setActiveTab] = useState('graficos');
  const [graficos, setGraficos] = useState<Grafico[]>([]);
  const [cristais, setCristais] = useState<Cristal[]>([]);
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Grafico dialog
  const [graficoDialogOpen, setGraficoDialogOpen] = useState(false);
  const [editingGrafico, setEditingGrafico] = useState<Grafico | null>(null);
  const [graficoForm, setGraficoForm] = useState({
    nome: '',
    autor: '',
    origem: 'tradicional',
    categoria: 'clinico',
    tipo_leitura: 'campo',
    para_que_serve: '',
    quando_nao_usar: '',
    observacoes_simbolicas: '',
    imagem_url: '',
    combinacoes: '',
    ordem: 0,
    ativo: true,
    // Campos da loja
    link_loja: '',
    imagem_fisica_url: '',
    disponivel_loja: false,
  });

  // Cristal dialog
  const [cristalDialogOpen, setCristalDialogOpen] = useState(false);
  const [editingCristal, setEditingCristal] = useState<Cristal | null>(null);
  const [cristalForm, setCristalForm] = useState({
    nome: '',
    explicacao_simbolica: '',
    quando_usar: '',
    quando_evitar: '',
    alerta_excesso: '',
    campos: '',
    estados: '',
    graficos_associados: '',
    link_externo: '',
    imagem_url: '',
    ordem: 0,
    ativo: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchGraficos(), fetchCristais(), fetchConfigs()]);
    setLoading(false);
  };

  const fetchGraficos = async () => {
    const { data, error } = await supabase
      .from('radiestesia_graficos')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Error fetching graficos:', error);
    } else {
      setGraficos(data || []);
    }
  };

  const fetchCristais = async () => {
    const { data, error } = await supabase
      .from('radiestesia_cristais')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Error fetching cristais:', error);
    } else {
      setCristais(data || []);
    }
  };

  const fetchConfigs = async () => {
    const { data, error } = await supabase
      .from('radiestesia_config')
      .select('*');

    if (error) {
      console.error('Error fetching configs:', error);
    } else {
      setConfigs(data || []);
    }
  };

  // Grafico CRUD
  const openGraficoDialog = (grafico?: Grafico) => {
    if (grafico) {
      setEditingGrafico(grafico);
      setGraficoForm({
        nome: grafico.nome,
        autor: grafico.autor || '',
        origem: grafico.origem,
        categoria: grafico.categoria,
        tipo_leitura: grafico.tipo_leitura,
        para_que_serve: grafico.para_que_serve || '',
        quando_nao_usar: grafico.quando_nao_usar || '',
        observacoes_simbolicas: grafico.observacoes_simbolicas || '',
        imagem_url: grafico.imagem_url || '',
        combinacoes: grafico.combinacoes?.join(', ') || '',
        ordem: grafico.ordem,
        ativo: grafico.ativo,
        // Campos da loja
        link_loja: grafico.link_loja || '',
        imagem_fisica_url: grafico.imagem_fisica_url || '',
        disponivel_loja: grafico.disponivel_loja || false,
      });
    } else {
      setEditingGrafico(null);
      setGraficoForm({
        nome: '',
        autor: '',
        origem: 'tradicional',
        categoria: 'clinico',
        tipo_leitura: 'campo',
        para_que_serve: '',
        quando_nao_usar: '',
        observacoes_simbolicas: '',
        imagem_url: '',
        combinacoes: '',
        ordem: graficos.length,
        ativo: true,
        // Campos da loja
        link_loja: '',
        imagem_fisica_url: '',
        disponivel_loja: false,
      });
    }
    setGraficoDialogOpen(true);
  };

  const saveGrafico = async () => {
    if (!graficoForm.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setSaving(true);
    const dataToSave = {
      nome: graficoForm.nome,
      autor: graficoForm.autor || null,
      origem: graficoForm.origem,
      categoria: graficoForm.categoria,
      tipo_leitura: graficoForm.tipo_leitura,
      para_que_serve: graficoForm.para_que_serve || null,
      quando_nao_usar: graficoForm.quando_nao_usar || null,
      observacoes_simbolicas: graficoForm.observacoes_simbolicas || null,
      imagem_url: graficoForm.imagem_url || null,
      combinacoes: graficoForm.combinacoes ? graficoForm.combinacoes.split(',').map(s => s.trim()).filter(Boolean) : [],
      ordem: graficoForm.ordem,
      ativo: graficoForm.ativo,
      // Campos da loja
      link_loja: graficoForm.link_loja || null,
      imagem_fisica_url: graficoForm.imagem_fisica_url || null,
      disponivel_loja: graficoForm.disponivel_loja,
    };

    if (editingGrafico) {
      const { error } = await supabase
        .from('radiestesia_graficos')
        .update(dataToSave)
        .eq('id', editingGrafico.id);

      if (error) {
        toast.error('Erro ao atualizar gráfico');
      } else {
        toast.success('Gráfico atualizado');
        setGraficoDialogOpen(false);
        fetchGraficos();
      }
    } else {
      const { error } = await supabase
        .from('radiestesia_graficos')
        .insert(dataToSave);

      if (error) {
        toast.error('Erro ao criar gráfico');
      } else {
        toast.success('Gráfico criado');
        setGraficoDialogOpen(false);
        fetchGraficos();
      }
    }
    setSaving(false);
  };

  const deleteGrafico = async (id: string) => {
    if (!confirm('Excluir este gráfico?')) return;

    const { error } = await supabase
      .from('radiestesia_graficos')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir');
    } else {
      toast.success('Gráfico excluído');
      fetchGraficos();
    }
  };

  const toggleGraficoAtivo = async (grafico: Grafico) => {
    const { error } = await supabase
      .from('radiestesia_graficos')
      .update({ ativo: !grafico.ativo })
      .eq('id', grafico.id);

    if (error) {
      toast.error('Erro ao atualizar');
    } else {
      setGraficos(prev => prev.map(g => g.id === grafico.id ? { ...g, ativo: !g.ativo } : g));
    }
  };

  // Cristal CRUD
  const openCristalDialog = (cristal?: Cristal) => {
    if (cristal) {
      setEditingCristal(cristal);
      setCristalForm({
        nome: cristal.nome,
        explicacao_simbolica: cristal.explicacao_simbolica || '',
        quando_usar: cristal.quando_usar || '',
        quando_evitar: cristal.quando_evitar || '',
        alerta_excesso: cristal.alerta_excesso || '',
        campos: cristal.campos?.join(', ') || '',
        estados: cristal.estados?.join(', ') || '',
        graficos_associados: cristal.graficos_associados?.join(', ') || '',
        link_externo: cristal.link_externo || '',
        imagem_url: cristal.imagem_url || '',
        ordem: cristal.ordem,
        ativo: cristal.ativo,
      });
    } else {
      setEditingCristal(null);
      setCristalForm({
        nome: '',
        explicacao_simbolica: '',
        quando_usar: '',
        quando_evitar: '',
        alerta_excesso: '',
        campos: '',
        estados: '',
        graficos_associados: '',
        link_externo: '',
        imagem_url: '',
        ordem: cristais.length,
        ativo: true,
      });
    }
    setCristalDialogOpen(true);
  };

  const saveCristal = async () => {
    if (!cristalForm.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setSaving(true);
    const dataToSave = {
      nome: cristalForm.nome,
      explicacao_simbolica: cristalForm.explicacao_simbolica || null,
      quando_usar: cristalForm.quando_usar || null,
      quando_evitar: cristalForm.quando_evitar || null,
      alerta_excesso: cristalForm.alerta_excesso || null,
      campos: cristalForm.campos ? cristalForm.campos.split(',').map(s => s.trim()).filter(Boolean) : [],
      estados: cristalForm.estados ? cristalForm.estados.split(',').map(s => s.trim()).filter(Boolean) : [],
      graficos_associados: cristalForm.graficos_associados ? cristalForm.graficos_associados.split(',').map(s => s.trim()).filter(Boolean) : [],
      link_externo: cristalForm.link_externo || null,
      imagem_url: cristalForm.imagem_url || null,
      ordem: cristalForm.ordem,
      ativo: cristalForm.ativo,
    };

    if (editingCristal) {
      const { error } = await supabase
        .from('radiestesia_cristais')
        .update(dataToSave)
        .eq('id', editingCristal.id);

      if (error) {
        toast.error('Erro ao atualizar cristal');
      } else {
        toast.success('Cristal atualizado');
        setCristalDialogOpen(false);
        fetchCristais();
      }
    } else {
      const { error } = await supabase
        .from('radiestesia_cristais')
        .insert(dataToSave);

      if (error) {
        toast.error('Erro ao criar cristal');
      } else {
        toast.success('Cristal criado');
        setCristalDialogOpen(false);
        fetchCristais();
      }
    }
    setSaving(false);
  };

  const deleteCristal = async (id: string) => {
    if (!confirm('Excluir este cristal?')) return;

    const { error } = await supabase
      .from('radiestesia_cristais')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir');
    } else {
      toast.success('Cristal excluído');
      fetchCristais();
    }
  };

  // Config update
  const updateConfig = async (chave: string, valor: Record<string, any>) => {
    setSaving(true);
    const { error } = await supabase
      .from('radiestesia_config')
      .update({ valor })
      .eq('chave', chave);

    if (error) {
      toast.error('Erro ao salvar configuração');
    } else {
      toast.success('Configuração salva');
      fetchConfigs();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Radiestesia Oracular</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie gráficos, cristais e configurações do portal
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="graficos" className="gap-2">
            <Grid3X3 className="w-4 h-4" />
            Gráficos ({graficos.length})
          </TabsTrigger>
          <TabsTrigger value="cristais" className="gap-2">
            <Gem className="w-4 h-4" />
            Cristais ({cristais.length})
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* GRÁFICOS TAB */}
        <TabsContent value="graficos" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openGraficoDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Gráfico
            </Button>
          </div>

          {graficos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum gráfico cadastrado. Adicione o primeiro!
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead className="w-20">Ativo</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {graficos.map((g) => (
                  <TableRow key={g.id} className={!g.ativo ? 'opacity-50' : ''}>
                    <TableCell>{g.ordem}</TableCell>
                    <TableCell className="font-medium">{g.nome}</TableCell>
                    <TableCell>{g.autor || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {CATEGORIA_OPTIONS.find(c => c.value === g.categoria)?.label || g.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {ORIGEM_OPTIONS.find(o => o.value === g.origem)?.label || g.origem}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleGraficoAtivo(g)}
                      >
                        {g.ativo ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openGraficoDialog(g)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteGrafico(g.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* CRISTAIS TAB */}
        <TabsContent value="cristais" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openCristalDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Cristal
            </Button>
          </div>

          {cristais.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum cristal cadastrado. Adicione o primeiro!
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Campos</TableHead>
                  <TableHead className="w-20">Ativo</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cristais.map((c) => (
                  <TableRow key={c.id} className={!c.ativo ? 'opacity-50' : ''}>
                    <TableCell>{c.ordem}</TableCell>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {c.campos?.slice(0, 2).map((campo, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{campo}</Badge>
                        ))}
                        {c.campos?.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{c.campos.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={c.ativo} disabled />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openCristalDialog(c)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCristal(c.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* CONFIG TAB */}
        <TabsContent value="config" className="space-y-4">
          {configs.map((config) => (
            <ConfigEditor 
              key={config.id} 
              config={config} 
              onSave={updateConfig}
              saving={saving}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* GRAFICO DIALOG */}
      <Dialog open={graficoDialogOpen} onOpenChange={setGraficoDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGrafico ? 'Editar Gráfico' : 'Novo Gráfico'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={graficoForm.nome}
                  onChange={(e) => setGraficoForm({ ...graficoForm, nome: e.target.value })}
                  placeholder="Nome do gráfico"
                />
              </div>
              <div className="space-y-2">
                <Label>Autor / Origem</Label>
                <Input
                  value={graficoForm.autor}
                  onChange={(e) => setGraficoForm({ ...graficoForm, autor: e.target.value })}
                  placeholder="Ex: Mássimo Frizari"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={graficoForm.categoria} onValueChange={(v) => setGraficoForm({ ...graficoForm, categoria: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIA_OPTIONS.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Origem</Label>
                <Select value={graficoForm.origem} onValueChange={(v) => setGraficoForm({ ...graficoForm, origem: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ORIGEM_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Leitura</Label>
                <Select value={graficoForm.tipo_leitura} onValueChange={(v) => setGraficoForm({ ...graficoForm, tipo_leitura: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPO_LEITURA_OPTIONS.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Para que serve</Label>
              <Textarea
                value={graficoForm.para_que_serve}
                onChange={(e) => setGraficoForm({ ...graficoForm, para_que_serve: e.target.value })}
                placeholder="Descreva o uso recomendado..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Quando NÃO usar</Label>
              <Textarea
                value={graficoForm.quando_nao_usar}
                onChange={(e) => setGraficoForm({ ...graficoForm, quando_nao_usar: e.target.value })}
                placeholder="Contraindicações e alertas..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Observações simbólicas</Label>
              <Textarea
                value={graficoForm.observacoes_simbolicas}
                onChange={(e) => setGraficoForm({ ...graficoForm, observacoes_simbolicas: e.target.value })}
                placeholder="Texto curto sobre significado simbólico..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Combinações (separadas por vírgula)</Label>
              <Input
                value={graficoForm.combinacoes}
                onChange={(e) => setGraficoForm({ ...graficoForm, combinacoes: e.target.value })}
                placeholder="Ametista, Chakra frontal, Meditação"
              />
            </div>

            <ImageUpload
              value={graficoForm.imagem_url}
              onChange={(url) => setGraficoForm({ ...graficoForm, imagem_url: url })}
              folder="radiestesia"
              label="Imagem do Gráfico (Digital)"
            />

            {/* Seção Versão Física (Loja) */}
            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">📦 Versão Física (Loja)</h4>
                  <p className="text-sm text-muted-foreground">Configure a disponibilidade na loja física</p>
                </div>
                <Switch
                  checked={graficoForm.disponivel_loja}
                  onCheckedChange={(checked) => setGraficoForm({ ...graficoForm, disponivel_loja: checked })}
                />
              </div>
              
              {graficoForm.disponivel_loja && (
                <>
                  <div className="space-y-2">
                    <Label>Link do Produto na Loja</Label>
                    <Input
                      value={graficoForm.link_loja}
                      onChange={(e) => setGraficoForm({ ...graficoForm, link_loja: e.target.value })}
                      placeholder="https://casaoracula.com.br/loja/produto/..."
                    />
                  </div>
                  
                  <ImageUpload
                    value={graficoForm.imagem_fisica_url}
                    onChange={(url) => setGraficoForm({ ...graficoForm, imagem_fisica_url: url })}
                    folder="radiestesia"
                    label="Imagem do Produto Físico"
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={graficoForm.ordem}
                  onChange={(e) => setGraficoForm({ ...graficoForm, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={graficoForm.ativo}
                  onCheckedChange={(checked) => setGraficoForm({ ...graficoForm, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGraficoDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveGrafico} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CRISTAL DIALOG */}
      <Dialog open={cristalDialogOpen} onOpenChange={setCristalDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCristal ? 'Editar Cristal' : 'Novo Cristal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={cristalForm.nome}
                onChange={(e) => setCristalForm({ ...cristalForm, nome: e.target.value })}
                placeholder="Nome do cristal"
              />
            </div>

            <div className="space-y-2">
              <Label>Explicação Simbólica</Label>
              <Textarea
                value={cristalForm.explicacao_simbolica}
                onChange={(e) => setCristalForm({ ...cristalForm, explicacao_simbolica: e.target.value })}
                placeholder="Significado simbólico do cristal..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quando Usar</Label>
                <Textarea
                  value={cristalForm.quando_usar}
                  onChange={(e) => setCristalForm({ ...cristalForm, quando_usar: e.target.value })}
                  placeholder="Situações recomendadas..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Quando Evitar</Label>
                <Textarea
                  value={cristalForm.quando_evitar}
                  onChange={(e) => setCristalForm({ ...cristalForm, quando_evitar: e.target.value })}
                  placeholder="Contraindicações..."
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alerta de Excesso</Label>
              <Textarea
                value={cristalForm.alerta_excesso}
                onChange={(e) => setCristalForm({ ...cristalForm, alerta_excesso: e.target.value })}
                placeholder="O que pode acontecer com uso excessivo..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campos (separados por vírgula)</Label>
                <Input
                  value={cristalForm.campos}
                  onChange={(e) => setCristalForm({ ...cristalForm, campos: e.target.value })}
                  placeholder="emocional, espiritual"
                />
              </div>
              <div className="space-y-2">
                <Label>Estados (separados por vírgula)</Label>
                <Input
                  value={cristalForm.estados}
                  onChange={(e) => setCristalForm({ ...cristalForm, estados: e.target.value })}
                  placeholder="emocao, protecao"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link Externo (opcional)</Label>
              <Input
                value={cristalForm.link_externo}
                onChange={(e) => setCristalForm({ ...cristalForm, link_externo: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <ImageUpload
              value={cristalForm.imagem_url}
              onChange={(url) => setCristalForm({ ...cristalForm, imagem_url: url })}
              folder="radiestesia"
              label="Imagem do Cristal"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={cristalForm.ordem}
                  onChange={(e) => setCristalForm({ ...cristalForm, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={cristalForm.ativo}
                  onCheckedChange={(checked) => setCristalForm({ ...cristalForm, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCristalDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveCristal} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Config Editor Component
function ConfigEditor({ 
  config, 
  onSave, 
  saving 
}: { 
  config: ConfigItem; 
  onSave: (chave: string, valor: Record<string, any>) => Promise<void>;
  saving: boolean;
}) {
  const [localValue, setLocalValue] = useState(config.valor);
  const [dirty, setDirty] = useState(false);

  const handleChange = (key: string, value: any) => {
    setLocalValue(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    await onSave(config.chave, localValue);
    setDirty(false);
  };

  const getLabel = (chave: string) => {
    const labels: Record<string, string> = {
      intro_pedagogica: 'Introdução Pedagógica',
      secao_clinica: 'Seção Clínica',
      secao_oracular: 'Seção Oracular',
      secao_estudo: 'Seção Estudo & Pesquisa',
      amplificador_destaque: 'Amplificador de Sensibilidade',
    };
    return labels[chave] || chave;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{getLabel(config.chave)}</CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={localValue.ativo !== false}
              onCheckedChange={(checked) => handleChange('ativo', checked)}
            />
            <span className="text-xs text-muted-foreground">Ativo</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {localValue.titulo !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs">Título</Label>
            <Input
              value={localValue.titulo || ''}
              onChange={(e) => handleChange('titulo', e.target.value)}
            />
          </div>
        )}
        {localValue.texto !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs">Texto</Label>
            <Textarea
              value={localValue.texto || ''}
              onChange={(e) => handleChange('texto', e.target.value)}
              rows={3}
            />
          </div>
        )}
        {localValue.descricao !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs">Descrição</Label>
            <Textarea
              value={localValue.descricao || ''}
              onChange={(e) => handleChange('descricao', e.target.value)}
              rows={2}
            />
          </div>
        )}
        {localValue.uso_recomendado !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs">Uso Recomendado</Label>
            <Textarea
              value={localValue.uso_recomendado || ''}
              onChange={(e) => handleChange('uso_recomendado', e.target.value)}
              rows={2}
            />
          </div>
        )}
        {localValue.contexto_simbolico !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs">Contexto Simbólico</Label>
            <Textarea
              value={localValue.contexto_simbolico || ''}
              onChange={(e) => handleChange('contexto_simbolico', e.target.value)}
              rows={2}
            />
          </div>
        )}

        {dirty && (
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Alterações
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
