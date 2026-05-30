import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Rocket, 
  Loader2, 
  Music, 
  BookOpen, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Save
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  estacao: any;
  passo?: any; // Se for edição
}

export function PublicadorRapido({ open, onClose, estacao, passo }: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  // Estado local do formulário simplificado
  const [form, setForm] = useState({
    titulo: passo?.titulo || '',
    subtitulo: passo?.subtitulo || '',
    slug: passo?.slug || '',
    jardim_prompt: passo?.jardim_prompt || passo?.metadata?.jardim_prompt || '',
    cenario_treinamento: passo?.cenario_treinamento || passo?.metadata?.simulacao_texto || '',
    audio_url: passo?.metadata?.audios?.[0]?.url || passo?.conteudo_inline?.audio_url || '',
    perguntas: (passo?.metadata?.perguntas_sugeridas || []).join('\n')
  });

  const slugify = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const handlePublish = async () => {
    if (!form.titulo) {
      toast.error("Título é obrigatório");
      return;
    }

    setLoading(true);
    try {
      const finalSlug = form.slug || slugify(form.titulo);
      
      const metadata = {
        audios: form.audio_url ? [{
          titulo: "Áudio Principal",
          url: form.audio_url,
          tipo: "escuta"
        }] : [],
        perguntas_sugeridas: form.perguntas.split('\n').filter(p => p.trim()),
        jardim_prompt: form.jardim_prompt,
        simulacao_texto: form.cenario_treinamento
      };

      const payload = {
        estacao_id: estacao.id,
        titulo: form.titulo,
        subtitulo: form.subtitulo,
        slug: finalSlug,
        tipo: passo?.tipo || 'escuta', // Default para escuta se for novo
        tipo_passo: passo?.tipo_passo || 'escuta',
        jardim_prompt: form.jardim_prompt,
        cenario_treinamento: form.cenario_treinamento,
        publicado: true,
        ordem: passo?.ordem || 1,
        metadata: metadata,
        updated_at: new Date().toISOString()
      };

      let error;
      if (passo?.id) {
        const { error: err } = await supabase
          .from('clube_rota_itens')
          .update(payload)
          .eq('id', passo.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('clube_rota_itens')
          .insert({
            ...payload,
            ordem: (estacao.passos_count || 0) + 1
          });
        error = err;
      }

      if (error) throw error;

      toast.success("Publicado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['admin-clube-estacoes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-clube-passos'] });
      queryClient.invalidateQueries({ queryKey: ['rota-oracular'] });
      
      onClose();
      
      // Abre a visão da aluna em nova aba se for uma rota válida
      if (finalSlug) {
        window.open(`/clube/rota/${finalSlug}`, '_blank');
      }

    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao publicar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-midnight border-white/10 text-white max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold font-display text-xl">
            <Rocket className="w-5 h-5" /> 
            {passo ? 'Editor Rápido' : 'Publicador Rápido'} — {estacao.titulo}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Fluxo simplificado para edição operacional da Rota dos Lobos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-gold/60">Título do Passo</Label>
              <Input 
                value={form.titulo} 
                onChange={e => setForm({...form, titulo: e.target.value})}
                placeholder="Ex: O Chamado da Mulher Selvagem"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-gold/60">Subtítulo (Frase de Impacto)</Label>
              <Input 
                value={form.subtitulo} 
                onChange={e => setForm({...form, subtitulo: e.target.value})}
                placeholder="Ex: Recuperando os ossos da alma"
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-gold/60 flex items-center gap-2">
              <Music className="w-3 h-3" /> URL do Áudio (Audioteca ou Externo)
            </Label>
            <Input 
              value={form.audio_url} 
              onChange={e => setForm({...form, audio_url: e.target.value})}
              placeholder="https://storage.googleapis.com/..."
              className="bg-white/5 border-white/10 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-gold/60 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Jardim da Psique (Escrita)
              </Label>
              <Textarea 
                value={form.jardim_prompt} 
                onChange={e => setForm({...form, jardim_prompt: e.target.value})}
                placeholder="Prompt para a aluna escrever hoje..."
                className="min-h-[100px] bg-white/5 border-white/10 resize-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-gold/60 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Laboratório 80/20 (Caso/Cenário)
              </Label>
              <Textarea 
                value={form.cenario_treinamento} 
                onChange={e => setForm({...form, cenario_treinamento: e.target.value})}
                placeholder="Caso ou cenário para aplicação prática..."
                className="min-h-[100px] bg-white/5 border-white/10 resize-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-gold/60 flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Perguntas Sugeridas (Uma por linha)
            </Label>
            <Textarea 
              value={form.perguntas} 
              onChange={e => setForm({...form, perguntas: e.target.value})}
              placeholder="Pergunta 1&#10;Pergunta 2&#10;Pergunta 3"
              className="min-h-[100px] bg-white/5 border-white/10 resize-none text-sm"
            />
          </div>

          <div className="space-y-2 opacity-50">
            <Label className="text-xs uppercase tracking-widest text-white/40">Slug (URL amigável)</Label>
            <Input 
              value={form.slug} 
              onChange={e => setForm({...form, slug: e.target.value})}
              placeholder="auto-gerado-se-vazio"
              className="bg-white/5 border-white/10 h-8 text-xs font-mono"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-white/5 pt-6 gap-3">
          <Button variant="ghost" onClick={onClose} className="text-white/40 hover:text-white">
            Cancelar
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={loading}
            className="bg-gold text-midnight hover:bg-gold/90 px-8 gap-2 font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> SALVAR E PUBLICAR</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
