import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Pencil, Sun, Play, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface Season {
  id: string;
  nome_estacao: string;
  simbolo: string | null;
  periodo: string | null;
  foco_travessia: string | null;
  aplicacao_profissional: string | null;
  ordem: number;
  status: string | null;
  visivel: boolean | null;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  planejada: { label: 'Planejada', color: 'bg-muted text-muted-foreground' },
  ativa: { label: 'Ativa', color: 'bg-primary/20 text-primary' },
  concluida: { label: 'Concluída', color: 'bg-accent/20 text-accent-foreground' },
};

const emptyForm = {
  nome_estacao: '',
  simbolo: '',
  periodo: '',
  foco_travessia: '',
  aplicacao_profissional: '',
  ordem: 0,
  status: 'planejada',
  visivel: false,
};

export function AdminEstacoesTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: seasons, isLoading } = useQuery({
    queryKey: ['admin-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oracular_seasons')
        .select('*')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as Season[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        nome_estacao: form.nome_estacao,
        simbolo: form.simbolo || null,
        periodo: form.periodo || null,
        foco_travessia: form.foco_travessia || null,
        aplicacao_profissional: form.aplicacao_profissional || null,
        ordem: form.ordem,
        status: form.status,
        visivel: form.visivel,
      };

      if (editingId) {
        const { error } = await supabase
          .from('oracular_seasons')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('oracular_seasons')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-estacoes'] });
      toast({ title: editingId ? 'Estação atualizada' : 'Estação criada' });
      closeDialog();
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('oracular_seasons')
        .update({ status: 'ativa' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-estacoes'] });
      toast({ title: 'Estação ativada — a anterior foi concluída automaticamente' });
    },
    onError: () => {
      toast({ title: 'Erro ao ativar', variant: 'destructive' });
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, ordem: (seasons?.length || 0) + 1 });
    setDialogOpen(true);
  };

  const openEdit = (s: Season) => {
    setEditingId(s.id);
    setForm({
      nome_estacao: s.nome_estacao,
      simbolo: s.simbolo || '',
      periodo: s.periodo || '',
      foco_travessia: s.foco_travessia || '',
      aplicacao_profissional: s.aplicacao_profissional || '',
      ordem: s.ordem,
      status: s.status || 'planejada',
      visivel: s.visivel ?? false,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display text-foreground">Estações Oráculares</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os períodos sazonais do Ano Oracular
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Nova Estação
        </Button>
      </div>

      {!seasons?.length ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sun className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma estação cadastrada</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={openCreate}>
              Criar primeira estação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {seasons.map(s => {
            const statusInfo = STATUS_MAP[s.status || 'planejada'] || STATUS_MAP.planejada;
            return (
              <Card
                key={s.id}
                className={s.status === 'ativa' ? 'border-primary/30 bg-primary/5' : ''}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="text-2xl w-10 text-center shrink-0">
                    {s.simbolo || '☀️'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground truncate">
                        {s.nome_estacao}
                      </span>
                      <Badge className={`text-[10px] ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                      {s.visivel ? (
                        <Eye className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground/40" />
                      )}
                    </div>
                    {s.periodo && (
                      <p className="text-xs text-muted-foreground mt-0.5">{s.periodo}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {s.status === 'planejada' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs h-7"
                        onClick={() => activateMutation.mutate(s.id)}
                        disabled={activateMutation.isPending}
                      >
                        <Play className="w-3 h-3" />
                        Ativar
                      </Button>
                    )}
                    {s.status === 'ativa' && (
                      <Badge variant="outline" className="text-[10px] gap-1 border-primary/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Em curso
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(s)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Estação' : 'Nova Estação Oracular'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nome da Estação</Label>
                <Input
                  value={form.nome_estacao}
                  onChange={e => update('nome_estacao', e.target.value)}
                  placeholder="Ex: Primavera Interior"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Símbolo</Label>
                <Input
                  value={form.simbolo}
                  onChange={e => update('simbolo', e.target.value)}
                  placeholder="🌸"
                  className="text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Período</Label>
                <Input
                  value={form.periodo}
                  onChange={e => update('periodo', e.target.value)}
                  placeholder="Ex: Mar–Mai 2026"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={e => update('ordem', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => update('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejada">Planejada</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Foco da Travessia</Label>
              <Textarea
                value={form.foco_travessia}
                onChange={e => update('foco_travessia', e.target.value)}
                placeholder="O eixo temático desta estação..."
                className="min-h-[60px] resize-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Aplicação Profissional</Label>
              <Textarea
                value={form.aplicacao_profissional}
                onChange={e => update('aplicacao_profissional', e.target.value)}
                placeholder="Como aplicar este tema na prática clínica..."
                className="min-h-[60px] resize-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.visivel}
                onCheckedChange={v => update('visivel', v)}
              />
              <Label className="text-xs">Visível no Mapa do Ano</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.nome_estacao.trim()}
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
