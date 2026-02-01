import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Loader2,
  GripVertical,
  Star,
  Gift,
  CreditCard,
  GraduationCap
} from 'lucide-react';

interface Oferta {
  id: string;
  nome: string;
  subtitulo: string | null;
  tipo: 'gratuito' | 'formacao' | 'assinatura';
  preco: string | null;
  gratuito: boolean;
  texto_botao: string;
  link_botao: string;
  badge: string | null;
  inclusoes: string[];
  simbolo: string;
  ordem: number;
  ativo: boolean;
  destaque: boolean;
}

const TIPOS_OFERTA = [
  { value: 'gratuito', label: 'Gratuito', icon: Gift },
  { value: 'formacao', label: 'Formação', icon: GraduationCap },
  { value: 'assinatura', label: 'Assinatura', icon: CreditCard },
];

const emptyOferta: Omit<Oferta, 'id'> = {
  nome: '',
  subtitulo: '',
  tipo: 'gratuito',
  preco: '',
  gratuito: true,
  texto_botao: 'Começar',
  link_botao: '/',
  badge: '',
  inclusoes: [],
  simbolo: '🜂',
  ordem: 0,
  ativo: true,
  destaque: false,
};

export function AdminOfertasTab() {
  const { toast } = useToast();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOferta, setEditingOferta] = useState<Oferta | null>(null);
  const [formData, setFormData] = useState<Omit<Oferta, 'id'>>(emptyOferta);
  const [inclusoesText, setInclusoesText] = useState('');

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ofertas')
      .select('*')
      .order('ordem');

    if (error) {
      console.error('Erro ao carregar ofertas:', error);
      toast({ title: 'Erro ao carregar ofertas', variant: 'destructive' });
    } else {
      // Cast tipo to ensure correct type
      const typedData = (data || []).map(item => ({
        ...item,
        tipo: item.tipo as 'gratuito' | 'formacao' | 'assinatura'
      }));
      setOfertas(typedData);
    }
    setLoading(false);
  };

  const openDialog = (oferta?: Oferta) => {
    if (oferta) {
      setEditingOferta(oferta);
      setFormData({
        nome: oferta.nome,
        subtitulo: oferta.subtitulo || '',
        tipo: oferta.tipo,
        preco: oferta.preco || '',
        gratuito: oferta.gratuito,
        texto_botao: oferta.texto_botao,
        link_botao: oferta.link_botao,
        badge: oferta.badge || '',
        inclusoes: oferta.inclusoes,
        simbolo: oferta.simbolo,
        ordem: oferta.ordem,
        ativo: oferta.ativo,
        destaque: oferta.destaque,
      });
      setInclusoesText(oferta.inclusoes.join('\n'));
    } else {
      setEditingOferta(null);
      setFormData({ ...emptyOferta, ordem: ofertas.length + 1 });
      setInclusoesText('');
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast({ title: 'Nome é obrigatório', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const inclusoes = inclusoesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      subtitulo: formData.subtitulo || null,
      preco: formData.preco || null,
      badge: formData.badge || null,
      inclusoes,
    };

    if (editingOferta) {
      const { error } = await supabase
        .from('ofertas')
        .update(payload)
        .eq('id', editingOferta.id);

      if (error) {
        toast({ title: 'Erro ao atualizar', variant: 'destructive' });
      } else {
        toast({ title: 'Oferta atualizada!' });
        setDialogOpen(false);
        fetchOfertas();
      }
    } else {
      const { error } = await supabase
        .from('ofertas')
        .insert([payload]);

      if (error) {
        toast({ title: 'Erro ao criar', variant: 'destructive' });
      } else {
        toast({ title: 'Oferta criada!' });
        setDialogOpen(false);
        fetchOfertas();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta oferta?')) return;

    const { error } = await supabase
      .from('ofertas')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Oferta excluída!' });
      fetchOfertas();
    }
  };

  const handleToggle = async (id: string, field: 'ativo' | 'destaque', value: boolean) => {
    const { error } = await supabase
      .from('ofertas')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    } else {
      fetchOfertas();
    }
  };

  const getTipoBadge = (tipo: string) => {
    const t = TIPOS_OFERTA.find(t => t.value === tipo);
    if (!t) return <Badge variant="outline">{tipo}</Badge>;
    const Icon = t.icon;
    return (
      <Badge variant={tipo === 'formacao' ? 'default' : 'secondary'} className="gap-1">
        <Icon className="w-3 h-3" />
        {t.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Ofertas da Página de Planos
          </CardTitle>
          <Button onClick={() => openDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Oferta
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Gerencie os cards exibidos na página <code>/planos</code>. 
              Cada oferta aparece como um card com seu texto, preço e botão configurados aqui.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ofertas.map((oferta) => (
                <TableRow key={oferta.id}>
                  <TableCell className="text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    {oferta.ordem}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{oferta.simbolo}</span>
                      <div>
                        <p className="font-medium">{oferta.nome}</p>
                        {oferta.badge && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {oferta.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTipoBadge(oferta.tipo)}</TableCell>
                  <TableCell>
                    {oferta.gratuito ? (
                      <span className="text-green-500">Grátis</span>
                    ) : (
                      oferta.preco || '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={oferta.destaque}
                      onCheckedChange={(v) => handleToggle(oferta.id, 'destaque', v)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={oferta.ativo}
                      onCheckedChange={(v) => handleToggle(oferta.id, 'ativo', v)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(oferta)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(oferta.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOferta ? 'Editar Oferta' : 'Nova Oferta'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Formação Orácula"
                />
              </div>
              <div className="space-y-2">
                <Label>Símbolo</Label>
                <Input
                  value={formData.simbolo}
                  onChange={(e) => setFormData({ ...formData, simbolo: e.target.value })}
                  placeholder="🜂"
                  className="text-center text-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input
                value={formData.subtitulo || ''}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                placeholder="Para quem é esta oferta..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(v: 'gratuito' | 'formacao' | 'assinatura') => 
                    setFormData({ ...formData, tipo: v, gratuito: v === 'gratuito' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_OFERTA.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preço</Label>
                <Input
                  value={formData.preco || ''}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  placeholder="R$ 1.997"
                  disabled={formData.gratuito}
                />
              </div>
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto do Botão</Label>
                <Input
                  value={formData.texto_botao}
                  onChange={(e) => setFormData({ ...formData, texto_botao: e.target.value })}
                  placeholder="Começar Agora"
                />
              </div>
              <div className="space-y-2">
                <Label>Link do Botão</Label>
                <Input
                  value={formData.link_botao}
                  onChange={(e) => setFormData({ ...formData, link_botao: e.target.value })}
                  placeholder="/oracula"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Badge (opcional)</Label>
              <Input
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Recomendado"
              />
            </div>

            <div className="space-y-2">
              <Label>Inclusões (uma por linha)</Label>
              <Textarea
                value={inclusoesText}
                onChange={(e) => setInclusoesText(e.target.value)}
                placeholder="Acesso ao Quiz Oracular&#10;Ferramentas Big Five&#10;Supervisão no Círculo"
                rows={6}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.destaque}
                  onCheckedChange={(v) => setFormData({ ...formData, destaque: v })}
                />
                <Label className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold" />
                  Destacar card
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.ativo}
                  onCheckedChange={(v) => setFormData({ ...formData, ativo: v })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
