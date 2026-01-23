import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical, Compass, Moon, BookOpen, Shield, Sparkles, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalType } from '@/types/portal';

interface Travessia {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  closing_ritual: string | null;
  icone: string;
  cor_acento: string;
  temas: string[];
  portal_minimo: PortalType;
  requer_profissional: boolean;
  ativa: boolean;
  ordem: number;
}

const ICON_OPTIONS = [
  { value: 'Compass', label: 'Bússola', icon: Compass },
  { value: 'Moon', label: 'Lua', icon: Moon },
  { value: 'BookOpen', label: 'Livro', icon: BookOpen },
  { value: 'Shield', label: 'Escudo', icon: Shield },
  { value: 'Sparkles', label: 'Brilho', icon: Sparkles },
];

const COLOR_OPTIONS = [
  { value: 'amber', label: 'Âmbar', class: 'bg-amber-500' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
  { value: 'gold', label: 'Dourado', class: 'bg-gold' },
  { value: 'emerald', label: 'Esmeralda', class: 'bg-emerald-500' },
  { value: 'rose', label: 'Rosa', class: 'bg-rose-500' },
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
];

const PORTAL_OPTIONS: { value: PortalType; label: string }[] = [
  { value: 'visitante', label: 'Visitante' },
  { value: 'mentorada', label: 'Mentorada' },
  { value: 'aluna_formacao', label: 'Aluna Formação' },
  { value: 'assinante', label: 'Assinante' },
  { value: 'oracula', label: 'Orácula' },
];

const ICON_MAP: Record<string, typeof Compass> = {
  Compass,
  Moon,
  BookOpen,
  Shield,
  Sparkles,
};

export function AdminTravessiasTab() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTravessia, setEditingTravessia] = useState<Travessia | null>(null);
  const [temasInput, setTemasInput] = useState('');

  const [formData, setFormData] = useState({
    number: 1,
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    closing_ritual: '',
    icone: 'Compass',
    cor_acento: 'amber',
    temas: [] as string[],
    portal_minimo: 'visitante' as PortalType,
    requer_profissional: false,
    ativa: true,
    ordem: 0,
  });

  const { data: travessias, isLoading } = useQuery({
    queryKey: ['admin-travessias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travessias')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Travessia[];
    },
  });

  // Helper to get next available number
  const getNextAvailableNumber = () => {
    if (!travessias || travessias.length === 0) return 1;
    const usedNumbers = travessias.map(t => t.number);
    let next = 0;
    while (usedNumbers.includes(next)) {
      next++;
    }
    return next;
  };

  // Check if number is already in use by another travessia
  const isNumberInUse = (num: number, excludeId?: string) => {
    if (!travessias) return false;
    return travessias.some(t => t.number === num && t.id !== excludeId);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      // Pre-validate: check for duplicate number
      if (isNumberInUse(data.number, data.id)) {
        throw new Error(`DUPLICATE_NUMBER:${data.number}`);
      }

      if (data.id) {
        const { error } = await supabase
          .from('travessias')
          .update({
            number: data.number,
            slug: data.slug,
            title: data.title,
            subtitle: data.subtitle || null,
            description: data.description || null,
            closing_ritual: data.closing_ritual || null,
            icone: data.icone,
            cor_acento: data.cor_acento,
            temas: data.temas,
            portal_minimo: data.portal_minimo,
            requer_profissional: data.requer_profissional,
            ativa: data.ativa,
            ordem: data.ordem,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('travessias')
          .insert({
            number: data.number,
            slug: data.slug,
            title: data.title,
            subtitle: data.subtitle || null,
            description: data.description || null,
            closing_ritual: data.closing_ritual || null,
            icone: data.icone,
            cor_acento: data.cor_acento,
            temas: data.temas,
            portal_minimo: data.portal_minimo,
            requer_profissional: data.requer_profissional,
            ativa: data.ativa,
            ordem: data.ordem,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-travessias'] });
      toast.success(editingTravessia ? 'Travessia atualizada!' : 'Travessia criada!');
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error saving travessia:', error);
      
      // Handle duplicate number error with friendly message
      if (error.message?.startsWith('DUPLICATE_NUMBER:')) {
        const num = error.message.split(':')[1];
        const existing = travessias?.find(t => t.number === parseInt(num));
        const suggestion = getNextAvailableNumber();
        toast.error(
          `Já existe uma travessia com o número ${num}${existing ? ` ("${existing.title}")` : ''}. Próximo disponível: ${suggestion}`,
          { duration: 6000 }
        );
        return;
      }
      
      // Handle database constraint error
      if (error.message?.includes('23505') || error.message?.includes('unique constraint')) {
        const suggestion = getNextAvailableNumber();
        toast.error(`Número já em uso. Próximo disponível: ${suggestion}`, { duration: 5000 });
        return;
      }
      
      toast.error('Erro ao salvar travessia');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('travessias')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-travessias'] });
      toast.success('Travessia excluída!');
    },
    onError: (error) => {
      console.error('Error deleting travessia:', error);
      toast.error('Erro ao excluir travessia');
    },
  });

  const toggleAtivaMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: string; ativa: boolean }) => {
      const { error } = await supabase
        .from('travessias')
        .update({ ativa })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-travessias'] });
      toast.success('Status atualizado!');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrdem }: { id: string; newOrdem: number }) => {
      const { error } = await supabase
        .from('travessias')
        .update({ ordem: newOrdem })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-travessias'] });
    },
  });

  const resetForm = () => {
    const nextNumber = getNextAvailableNumber();
    setFormData({
      number: nextNumber,
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      closing_ritual: '',
      icone: 'Compass',
      cor_acento: 'amber',
      temas: [],
      portal_minimo: 'visitante',
      requer_profissional: false,
      ativa: true,
      ordem: (travessias?.length || 0) + 1,
    });
    setTemasInput('');
    setEditingTravessia(null);
  };

  const handleEdit = (travessia: Travessia) => {
    setEditingTravessia(travessia);
    setFormData({
      number: travessia.number,
      slug: travessia.slug,
      title: travessia.title,
      subtitle: travessia.subtitle || '',
      description: travessia.description || '',
      closing_ritual: travessia.closing_ritual || '',
      icone: travessia.icone,
      cor_acento: travessia.cor_acento,
      temas: travessia.temas || [],
      portal_minimo: travessia.portal_minimo,
      requer_profissional: travessia.requer_profissional,
      ativa: travessia.ativa,
      ordem: travessia.ordem,
    });
    setTemasInput(travessia.temas?.join(', ') || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from title if empty
    const slug = formData.slug || formData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const temas = temasInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    saveMutation.mutate({
      ...formData,
      slug,
      temas,
      id: editingTravessia?.id,
    });
  };

  const handleMoveUp = (travessia: Travessia, index: number) => {
    if (index === 0 || !travessias) return;
    const prevTravessia = travessias[index - 1];
    
    reorderMutation.mutate({ id: travessia.id, newOrdem: prevTravessia.ordem });
    reorderMutation.mutate({ id: prevTravessia.id, newOrdem: travessia.ordem });
  };

  const handleMoveDown = (travessia: Travessia, index: number) => {
    if (!travessias || index === travessias.length - 1) return;
    const nextTravessia = travessias[index + 1];
    
    reorderMutation.mutate({ id: travessia.id, newOrdem: nextTravessia.ordem });
    reorderMutation.mutate({ id: nextTravessia.id, newOrdem: travessia.ordem });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display">Gerenciar Travessias</h2>
          <p className="text-sm text-muted-foreground">
            Crie, edite e organize as Travessias da formação
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Travessia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTravessia ? 'Editar Travessia' : 'Nova Travessia'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                    required
                  />
                  {isNumberInUse(formData.number, editingTravessia?.id) && (
                    <p className="text-xs text-destructive">
                      Número já em uso. Próximo disponível: {getNextAvailableNumber()}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-gerado do título"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Ritual de Fechamento</Label>
                <Textarea
                  value={formData.closing_ritual}
                  onChange={(e) => setFormData({ ...formData, closing_ritual: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <Select
                    value={formData.icone}
                    onValueChange={(value) => setFormData({ ...formData, icone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((opt) => {
                        const IconComp = opt.icon;
                        return (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <IconComp className="w-4 h-4" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cor de Acento</Label>
                  <Select
                    value={formData.cor_acento}
                    onValueChange={(value) => setFormData({ ...formData, cor_acento: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn('w-4 h-4 rounded-full', opt.class)} />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Temas (separados por vírgula)</Label>
                <Input
                  value={temasInput}
                  onChange={(e) => setTemasInput(e.target.value)}
                  placeholder="Ética, Limites, Glossário"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Portal Mínimo</Label>
                  <Select
                    value={formData.portal_minimo}
                    onValueChange={(value) => setFormData({ ...formData, portal_minimo: value as PortalType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PORTAL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.requer_profissional}
                    onCheckedChange={(checked) => setFormData({ ...formData, requer_profissional: checked })}
                  />
                  <Label>Requer confirmação profissional</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.ativa}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativa: checked })}
                  />
                  <Label>Ativa</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {travessias?.map((travessia, index) => {
          const Icon = ICON_MAP[travessia.icone] || Compass;
          return (
            <Card
              key={travessia.id}
              className={cn(
                'transition-opacity',
                !travessia.ativa && 'opacity-60'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveUp(travessia, index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveDown(travessia, index)}
                      disabled={index === (travessias?.length || 0) - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>

                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center border',
                      `text-${travessia.cor_acento}-500 bg-${travessia.cor_acento}-500/10 border-${travessia.cor_acento}-500/20`
                    )}
                    style={{
                      color: `var(--${travessia.cor_acento}, var(--gold))`,
                      backgroundColor: `color-mix(in srgb, var(--${travessia.cor_acento}, var(--gold)) 10%, transparent)`,
                      borderColor: `color-mix(in srgb, var(--${travessia.cor_acento}, var(--gold)) 20%, transparent)`,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{travessia.number}
                      </Badge>
                      <h3 className="font-medium truncate">{travessia.title}</h3>
                      {!travessia.ativa && (
                        <Badge variant="secondary" className="text-xs">
                          Inativa
                        </Badge>
                      )}
                      {travessia.requer_profissional && (
                        <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                          Profissional
                        </Badge>
                      )}
                    </div>
                    {travessia.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {travessia.subtitle}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {travessia.portal_minimo}
                      </Badge>
                      {travessia.temas?.slice(0, 3).map((tema) => (
                        <span
                          key={tema}
                          className="text-xs px-1.5 py-0.5 bg-secondary/50 rounded text-muted-foreground"
                        >
                          {tema}
                        </span>
                      ))}
                      {(travessia.temas?.length || 0) > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{(travessia.temas?.length || 0) - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAtivaMutation.mutate({ id: travessia.id, ativa: !travessia.ativa })}
                    >
                      {travessia.ativa ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(travessia)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm(`Excluir travessia "${travessia.title}"?`)) {
                          deleteMutation.mutate(travessia.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {(!travessias || travessias.length === 0) && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Compass className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Nenhuma travessia cadastrada</p>
              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Criar primeira Travessia
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
