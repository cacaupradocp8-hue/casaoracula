import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ImpactoCidadelaForm, ImpactoCidadela } from './ImpactoCidadelaForm';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const TIPOS = [
  { value: 'portal', label: '1. Portal — abertura simbólica' },
  { value: 'escuta', label: '2. Escuta — áudio formativo' },
  { value: 'aplicacao', label: '3. Aplicação — gesto/ação' },
  { value: 'registro', label: '4. Registro — escrita íntima' },
  { value: 'integracao', label: '5. Integração — selo da rota' },
] as const;

interface Props {
  estacaoId: string;
  passo: any | null; // null = novo
  open: boolean;
  onClose: () => void;
  proximaOrdem: number;
}

export function PassoEditor({ estacaoId, passo, open, onClose, proximaOrdem }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({
    tipo_passo: 'portal',
    titulo: '',
    subtitulo: '',
    icone: '',
    ordem: proximaOrdem,
    obrigatorio: true,
    publicado: false,
    conteudo_texto: '',
    conteudo_audio_url: '',
    impacto_cidadela: [] as ImpactoCidadela[],
    metadata: {
      audios: [],
      jardim_prompt: '',
      simulacao_texto: '',
      perguntas_sugeridas: []
    }
  });

  useEffect(() => {
    if (passo) {
      const c = passo.conteudo_inline || {};
      const m = passo.metadata || {};
      setForm({
        tipo_passo: passo.tipo_passo || passo.tipo || 'portal',
        titulo: passo.titulo || '',
        subtitulo: passo.subtitulo || '',
        icone: passo.icone || '',
        ordem: passo.ordem ?? proximaOrdem,
        obrigatorio: passo.obrigatorio ?? true,
        publicado: passo.publicado ?? false,
        conteudo_texto: c.texto || '',
        conteudo_audio_url: c.audio_url || '',
        impacto_cidadela: Array.isArray(passo.impacto_cidadela) ? passo.impacto_cidadela : [],
        metadata: {
          audios: m.audios || [],
          jardim_prompt: m.jardim_prompt || '',
          simulacao_texto: m.simulacao_texto || '',
          perguntas_sugeridas: m.perguntas_sugeridas || []
        }
      });
    } else {
      setForm({
        tipo_passo: 'portal', titulo: '', subtitulo: '', icone: '',
        ordem: proximaOrdem, obrigatorio: true, publicado: false,
        conteudo_texto: '', conteudo_audio_url: '', impacto_cidadela: [],
        metadata: { audios: [], jardim_prompt: '', simulacao_texto: '', perguntas_sugeridas: [] }
      });
    }
  }, [passo, proximaOrdem, open]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        estacao_id: estacaoId,
        tipo_passo: form.tipo_passo,
        tipo: form.tipo_passo,
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        icone: form.icone || null,
        ordem: form.ordem,
        obrigatorio: form.obrigatorio,
        publicado: form.publicado,
        conteudo_inline: {
          texto: form.conteudo_texto || null,
          audio_url: form.conteudo_audio_url || null,
        },
        impacto_cidadela: form.impacto_cidadela,
        metadata: form.metadata,
        slug: form.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };
      if (passo?.id) {
        const { error } = await supabase.from('clube_rota_itens').update(payload).eq('id', passo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clube_rota_itens').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(passo ? 'Passo atualizado' : 'Passo criado');
      qc.invalidateQueries({ queryKey: ['admin-clube-passos'] });
      onClose();
    },
    onError: (e: any) => toast.error('Erro ao salvar', { description: e.message }),
  });

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{passo ? 'Editar Passo' : 'Novo Passo da Rota'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-xs">Tipo de passo</Label>
            <Select value={form.tipo_passo} onValueChange={v => setForm({ ...form, tipo_passo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1fr_80px_60px] gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Título</Label>
              <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="A voz silenciada" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ordem</Label>
              <Input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ícone</Label>
              <Input value={form.icone} onChange={e => setForm({ ...form, icone: e.target.value })} placeholder="🌙" className="text-center" />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Subtítulo (opcional)</Label>
            <Input value={form.subtitulo} onChange={e => setForm({ ...form, subtitulo: e.target.value })} />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Texto / Roteiro do conteúdo</Label>
            <Textarea
              value={form.conteudo_texto}
              onChange={e => setForm({ ...form, conteudo_texto: e.target.value })}
              rows={4}
              className="text-sm resize-none"
              placeholder="Texto do portal, roteiro do áudio, instruções da ação..."
            />
          </div>

          <div className="space-y-3 border-t pt-3">
             <Label className="text-xs font-bold text-gold">Campos Premium (Metadata)</Label>
             
             <div className="space-y-1">
                <Label className="text-[10px]">Prompt do Jardim</Label>
                <Input 
                  value={form.metadata.jardim_prompt} 
                  onChange={e => setForm({...form, metadata: {...form.metadata, jardim_prompt: e.target.value}})} 
                  placeholder="Escreva hoje sobre..."
                />
             </div>
             
             <div className="space-y-1">
                <Label className="text-[10px]">Texto da Simulação</Label>
                <Textarea 
                  value={form.metadata.simulacao_texto} 
                  onChange={e => setForm({...form, metadata: {...form.metadata, simulacao_texto: e.target.value}})} 
                  rows={2}
                  className="text-xs"
                />
             </div>

             <div className="space-y-1">
                <Label className="text-[10px]">Áudios (JSON array)</Label>
                <Textarea 
                  value={JSON.stringify(form.metadata.audios, null, 2)} 
                  onChange={e => {
                    try {
                      const val = JSON.parse(e.target.value);
                      setForm({...form, metadata: {...form.metadata, audios: val}});
                    } catch(e) {}
                  }} 
                  rows={3}
                  className="text-[10px] font-mono"
                />
             </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <ImpactoCidadelaForm
              value={form.impacto_cidadela}
              onChange={v => setForm({ ...form, impacto_cidadela: v })}
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={form.obrigatorio} onCheckedChange={v => setForm({ ...form, obrigatorio: v })} />
              <Label className="text-xs">Obrigatório</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.publicado} onCheckedChange={v => setForm({ ...form, publicado: v })} />
              <Label className="text-xs">Publicado</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
