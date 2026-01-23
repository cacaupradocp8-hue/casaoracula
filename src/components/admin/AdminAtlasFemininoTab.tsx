import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useAtlasArquetipos, 
  useUpdateArquetipo, 
  useCreateArquetipo, 
  useDeleteArquetipo,
  AtlasArquetipo,
  TERRITORIOS
} from '@/hooks/useAtlasArquetipos';
import { 
  Flower2, Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Shield, Heart, Mountain, Bird, Compass, Flame, Moon, 
  Sparkles, Zap, Flower2 as FlowerIcon, Palette, Sunrise 
} from 'lucide-react';
import { toast } from 'sonner';

const ICON_OPTIONS = [
  { value: 'Shield', label: 'Escudo', Icon: Shield },
  { value: 'Heart', label: 'Coração', Icon: Heart },
  { value: 'Mountain', label: 'Montanha', Icon: Mountain },
  { value: 'Bird', label: 'Pássaro', Icon: Bird },
  { value: 'Compass', label: 'Bússola', Icon: Compass },
  { value: 'Flame', label: 'Chama', Icon: Flame },
  { value: 'Moon', label: 'Lua', Icon: Moon },
  { value: 'Sparkles', label: 'Brilhos', Icon: Sparkles },
  { value: 'Zap', label: 'Raio', Icon: Zap },
  { value: 'Flower2', label: 'Flor', Icon: FlowerIcon },
  { value: 'Palette', label: 'Paleta', Icon: Palette },
  { value: 'Sunrise', label: 'Nascer', Icon: Sunrise },
];

const COR_OPTIONS = [
  'gold', 'amber', 'rose', 'slate', 'violet', 'sky', 'orange', 
  'purple', 'fuchsia', 'red', 'pink', 'emerald'
];

export function AdminAtlasFemininoTab() {
  const { data: arquetipos, isLoading } = useAtlasArquetipos();
  const updateMutation = useUpdateArquetipo();
  const createMutation = useCreateArquetipo();
  const deleteMutation = useDeleteArquetipo();
  
  const [editingArquetipo, setEditingArquetipo] = useState<AtlasArquetipo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<AtlasArquetipo>>({});
  
  const handleEdit = (arq: AtlasArquetipo) => {
    setEditingArquetipo(arq);
    setFormData(arq);
  };
  
  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      chave: '',
      nome: '',
      territorio: 'sustentacao',
      descricao_clinica: '',
      manifestacoes_frequentes: [],
      perguntas_sessao: [],
      riscos_projecao: [],
      trabalhar_forca_sem_reforcar_ferida: '',
      icone: 'Sparkles',
      cor_acento: 'gold',
      ordem: (arquetipos?.length || 0) + 1,
      ativo: true,
    });
  };
  
  const handleSave = async () => {
    if (!formData.chave || !formData.nome || !formData.descricao_clinica) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    
    if (isCreating) {
      await createMutation.mutateAsync(formData as any);
    } else if (editingArquetipo) {
      await updateMutation.mutateAsync({ id: editingArquetipo.id, ...formData });
    }
    
    setEditingArquetipo(null);
    setIsCreating(false);
    setFormData({});
  };
  
  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteConfirm(null);
  };
  
  const handleToggleAtivo = async (arq: AtlasArquetipo) => {
    await updateMutation.mutateAsync({ id: arq.id, ativo: !arq.ativo });
  };
  
  const handleMoveOrder = async (arq: AtlasArquetipo, direction: 'up' | 'down') => {
    const sameTerritory = arquetipos?.filter(a => a.territorio === arq.territorio) || [];
    const currentIndex = sameTerritory.findIndex(a => a.id === arq.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= sameTerritory.length) return;
    
    const target = sameTerritory[targetIndex];
    
    await Promise.all([
      updateMutation.mutateAsync({ id: arq.id, ordem: target.ordem }),
      updateMutation.mutateAsync({ id: target.id, ordem: arq.ordem }),
    ]);
  };
  
  const parseArrayField = (value: string): string[] => {
    return value.split('\n').filter(v => v.trim());
  };
  
  const formatArrayField = (arr: string[] | undefined): string => {
    return arr?.join('\n') || '';
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flower2 className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-semibold">Atlas de Arquétipos Femininos</h2>
          <Badge variant="outline">{arquetipos?.length || 0} arquétipos</Badge>
        </div>
        <Button onClick={handleCreate} className="bg-gold hover:bg-gold/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Arquétipo
        </Button>
      </div>
      
      {/* Tabela por Território */}
      {Object.entries(TERRITORIOS).map(([key, territorio]) => {
        const arqsDoTerritorio = arquetipos?.filter(a => a.territorio === key) || [];
        if (arqsDoTerritorio.length === 0) return null;
        
        return (
          <Card key={key}>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className={`bg-${territorio.color}-500/20 text-${territorio.color}-400 border-${territorio.color}-500/30`}>
                  {territorio.label}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  ({arqsDoTerritorio.length} arquétipos)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Ordem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Chave</TableHead>
                    <TableHead className="w-20">Ativo</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arqsDoTerritorio.sort((a, b) => a.ordem - b.ordem).map((arq, idx) => {
                    const IconComponent = ICON_OPTIONS.find(i => i.value === arq.icone)?.Icon || Sparkles;
                    
                    return (
                      <TableRow key={arq.id}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={idx === 0}
                              onClick={() => handleMoveOrder(arq, 'up')}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={idx === arqsDoTerritorio.length - 1}
                              onClick={() => handleMoveOrder(arq, 'down')}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full bg-${arq.cor_acento}-500/20`}>
                              <IconComponent className={`w-4 h-4 text-${arq.cor_acento}-400`} />
                            </div>
                            <span className="font-medium">{arq.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {arq.chave}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={arq.ativo}
                            onCheckedChange={() => handleToggleAtivo(arq)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(arq)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setDeleteConfirm(arq.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Modal de Edição/Criação */}
      <Dialog open={!!editingArquetipo || isCreating} onOpenChange={(open) => {
        if (!open) {
          setEditingArquetipo(null);
          setIsCreating(false);
          setFormData({});
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Novo Arquétipo' : `Editar: ${editingArquetipo?.nome}`}
            </DialogTitle>
            <DialogDescription>
              Configure a lâmina clínica do arquétipo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Chave (única)</Label>
                <Input
                  value={formData.chave || ''}
                  onChange={(e) => setFormData({ ...formData, chave: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                  placeholder="ex: guardia"
                />
              </div>
              <div>
                <Label>Nome</Label>
                <Input
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="ex: A Guardiã"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Território</Label>
                <Select
                  value={formData.territorio}
                  onValueChange={(v: any) => setFormData({ ...formData, territorio: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TERRITORIOS).map(([key, t]) => (
                      <SelectItem key={key} value={key}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ícone</Label>
                <Select
                  value={formData.icone}
                  onValueChange={(v) => setFormData({ ...formData, icone: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <opt.Icon className="w-4 h-4" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cor</Label>
                <Select
                  value={formData.cor_acento}
                  onValueChange={(v) => setFormData({ ...formData, cor_acento: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COR_OPTIONS.map((cor) => (
                      <SelectItem key={cor} value={cor}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full bg-${cor}-500`} />
                          {cor}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Descrição Clínica *</Label>
              <Textarea
                value={formData.descricao_clinica || ''}
                onChange={(e) => setFormData({ ...formData, descricao_clinica: e.target.value })}
                placeholder="Descrição simbólica da força arquetípica..."
                rows={4}
              />
            </div>
            
            <div>
              <Label>Manifestações Frequentes (uma por linha)</Label>
              <Textarea
                value={formatArrayField(formData.manifestacoes_frequentes)}
                onChange={(e) => setFormData({ ...formData, manifestacoes_frequentes: parseArrayField(e.target.value) })}
                placeholder="Dificuldade em delegar&#10;Hipervigilância emocional&#10;..."
                rows={4}
              />
            </div>
            
            <div>
              <Label>Perguntas de Sessão (uma por linha)</Label>
              <Textarea
                value={formatArrayField(formData.perguntas_sessao)}
                onChange={(e) => setFormData({ ...formData, perguntas_sessao: parseArrayField(e.target.value) })}
                placeholder="O que aconteceria se você não estivesse vigiando?&#10;..."
                rows={3}
              />
            </div>
            
            <div>
              <Label>Riscos de Projeção (um por linha)</Label>
              <Textarea
                value={formatArrayField(formData.riscos_projecao)}
                onChange={(e) => setFormData({ ...formData, riscos_projecao: parseArrayField(e.target.value) })}
                placeholder="Identificar-se com a força da cliente&#10;..."
                rows={3}
              />
            </div>
            
            <div>
              <Label>Como Trabalhar a Força sem Reforçar a Ferida</Label>
              <Textarea
                value={formData.trabalhar_forca_sem_reforcar_ferida || ''}
                onChange={(e) => setFormData({ ...formData, trabalhar_forca_sem_reforcar_ferida: e.target.value })}
                placeholder="Orientações de postura clínica..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingArquetipo(null);
              setIsCreating(false);
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gold hover:bg-gold/90"
            >
              {(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmação de Exclusão */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este arquétipo? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
