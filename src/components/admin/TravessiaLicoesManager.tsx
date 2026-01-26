import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalType } from '@/types/portal';
import { AudioUpload } from './AudioUpload';
interface Licao {
  id: string;
  travessia_id: string;
  titulo: string;
  descricao_curta: string;
  texto_aula: string | null;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  materiais_url: string | null;
  ordem: number;
  publicado: boolean;
  portal_minimo: PortalType;
}

interface TravessiaLicoesManagerProps {
  travessiaId: string;
  travessiaTitle: string;
}

export function TravessiaLicoesManager({ travessiaId, travessiaTitle }: TravessiaLicoesManagerProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLicao, setEditingLicao] = useState<Licao | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao_curta: '',
    texto_aula: '',
    video_url: '',
    audio_url: '',
    pdf_url: '',
    materiais_url: '',
    ordem: 1,
    publicado: true,
    portal_minimo: 'visitante' as PortalType,
  });

  // Fetch lições for this travessia
  const { data: licoes = [], isLoading } = useQuery({
    queryKey: ['admin-licoes', travessiaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conteudo_aulas')
        .select('*')
        .eq('travessia_id', travessiaId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Licao[];
    },
    enabled: !!travessiaId,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('conteudo_aulas')
          .update({
            titulo: data.titulo,
            descricao_curta: data.descricao_curta,
            texto_aula: data.texto_aula || null,
            video_url: data.video_url || null,
            audio_url: data.audio_url || null,
            pdf_url: data.pdf_url || null,
            materiais_url: data.materiais_url || null,
            ordem: data.ordem,
            publicado: data.publicado,
            portal_minimo: data.portal_minimo,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('conteudo_aulas')
          .insert({
            travessia_id: travessiaId,
            titulo: data.titulo,
            descricao_curta: data.descricao_curta,
            texto_aula: data.texto_aula || null,
            video_url: data.video_url || null,
            audio_url: data.audio_url || null,
            pdf_url: data.pdf_url || null,
            materiais_url: data.materiais_url || null,
            ordem: data.ordem,
            publicado: data.publicado,
            portal_minimo: data.portal_minimo,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-licoes', travessiaId] });
      toast.success(editingLicao ? 'Lição atualizada!' : 'Lição criada!');
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error saving licao:', error);
      toast.error('Erro ao salvar lição');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('conteudo_aulas')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-licoes', travessiaId] });
      toast.success('Lição excluída!');
    },
    onError: (error) => {
      console.error('Error deleting licao:', error);
      toast.error('Erro ao excluir lição');
    },
  });

  const togglePublicadoMutation = useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { error } = await supabase
        .from('conteudo_aulas')
        .update({ publicado })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-licoes', travessiaId] });
      toast.success('Status atualizado!');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrdem }: { id: string; newOrdem: number }) => {
      const { error } = await supabase
        .from('conteudo_aulas')
        .update({ ordem: newOrdem })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-licoes', travessiaId] });
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao_curta: '',
      texto_aula: '',
      video_url: '',
      audio_url: '',
      pdf_url: '',
      materiais_url: '',
      ordem: (licoes?.length || 0) + 1,
      publicado: true,
      portal_minimo: 'visitante',
    });
    setEditingLicao(null);
  };

  const handleEdit = (licao: Licao) => {
    setEditingLicao(licao);
    setFormData({
      titulo: licao.titulo,
      descricao_curta: licao.descricao_curta || '',
      texto_aula: licao.texto_aula || '',
      video_url: licao.video_url || '',
      audio_url: licao.audio_url || '',
      pdf_url: licao.pdf_url || '',
      materiais_url: licao.materiais_url || '',
      ordem: licao.ordem,
      publicado: licao.publicado,
      portal_minimo: licao.portal_minimo || 'visitante',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingLicao?.id,
    });
  };

  const handleMoveUp = (licao: Licao, index: number) => {
    if (index === 0 || !licoes) return;
    const prevLicao = licoes[index - 1];
    reorderMutation.mutate({ id: licao.id, newOrdem: prevLicao.ordem });
    reorderMutation.mutate({ id: prevLicao.id, newOrdem: licao.ordem });
  };

  const handleMoveDown = (licao: Licao, index: number) => {
    if (!licoes || index === licoes.length - 1) return;
    const nextLicao = licoes[index + 1];
    reorderMutation.mutate({ id: licao.id, newOrdem: nextLicao.ordem });
    reorderMutation.mutate({ id: nextLicao.id, newOrdem: licao.ordem });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Lições / Dias ({licoes.length})
        </h4>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 h-7 text-xs">
              <Plus className="w-3 h-3" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLicao ? 'Editar Lição' : 'Nova Lição'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Dia 1 — O Silêncio"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição curta *</Label>
                <Input
                  value={formData.descricao_curta}
                  onChange={(e) => setFormData({ ...formData, descricao_curta: e.target.value })}
                  placeholder="Pergunta ou tema do dia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Conteúdo da aula</Label>
                <Textarea
                  value={formData.texto_aula}
                  onChange={(e) => setFormData({ ...formData, texto_aula: e.target.value })}
                  rows={4}
                  placeholder="Texto completo da lição..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL do Vídeo</Label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <AudioUpload
                  value={formData.audio_url}
                  onChange={(url) => setFormData({ ...formData, audio_url: url })}
                  label="Áudio"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL do PDF</Label>
                  <Input
                    value={formData.pdf_url}
                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                    placeholder="https://..."
                  />
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

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.publicado}
                    onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
                  />
                  <Label className="text-sm">Publicada</Label>
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

      {licoes.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          Nenhuma lição cadastrada ainda.
        </p>
      ) : (
        <div className="space-y-2">
          {licoes.map((licao, index) => (
            <div
              key={licao.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg bg-secondary/30 text-sm",
                !licao.publicado && "opacity-50"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => handleMoveUp(licao, index)}
                  disabled={index === 0}
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => handleMoveDown(licao, index)}
                  disabled={index === licoes.length - 1}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>

              <Badge variant="outline" className="text-xs shrink-0">
                {licao.ordem}
              </Badge>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{licao.titulo}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {licao.descricao_curta}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => togglePublicadoMutation.mutate({ 
                    id: licao.id, 
                    publicado: !licao.publicado 
                  })}
                >
                  {licao.publicado ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleEdit(licao)}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => {
                    if (confirm(`Excluir "${licao.titulo}"?`)) {
                      deleteMutation.mutate(licao.id);
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
