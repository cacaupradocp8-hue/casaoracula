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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ImpactoCidadelaForm, ImpactoCidadela } from './ImpactoCidadelaForm';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, ExternalLink, AlertCircle } from 'lucide-react';

const TIPOS_PASSO = [
  { value: 'portal', label: '1. Portal — abertura simbólica' },
  { value: 'escuta', label: '2. Escuta — áudio formativo' },
  { value: 'aplicacao', label: '3. Aplicação — gesto/ação' },
  { value: 'registro', label: '4. Registro — escrita íntima' },
  { value: 'integracao', label: '5. Integração — selo da rota' },
] as const;

const REF_TIPOS = [
  { value: 'none', label: '— Nenhuma —' },
  { value: 'portal', label: 'Portal (Travessia)' },
  { value: 'escuta', label: 'Escuta (Áudio)' },
  { value: 'aula', label: 'Aula' },
  { value: 'encontro', label: 'Encontro' },
  { value: 'laboratorio', label: 'Laboratório' },
  { value: 'integracao', label: 'Integração' },
] as const;

interface AudioMeta {
  titulo: string;
  url: string;
  tipo?: string;
  duracao?: string;
}

interface Props {
  estacaoId: string;
  passo: any | null;
  open: boolean;
  onClose: () => void;
  proximaOrdem: number;
}

export function PassoEditor({ estacaoId, passo, open, onClose, proximaOrdem }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(makeInitial(proximaOrdem));

  function makeInitial(ordem: number) {
    return {
      tipo_passo: 'portal',
      titulo: '',
      subtitulo: '',
      slug: '',
      icone: '',
      image_url: '',
      ordem,
      obrigatorio: true,
      publicado: false,
      ref_tipo: 'none',
      ref_id: '',
      rota_custom: '',
      conteudo_texto: '',
      conteudo_audio_url: '',
      // Cartografia
      porta: '',
      campo: '',
      torre: '',
      labirinto: '',
      frase_guia: '',
      // Conteúdo da travessia
      jardim_prompt: '',
      cenario_treinamento: '',
      leitura_referencia: '',
      // Metadata
      audios: [] as AudioMeta[],
      perguntas_sugeridas: [] as string[],
      cta_label: '',
      cta_url: '',
      // Impacto
      impacto_cidadela: [] as ImpactoCidadela[],
    };
  }

  useEffect(() => {
    if (passo) {
      const c = passo.conteudo_inline || {};
      const m = passo.metadata || {};
      setForm({
        tipo_passo: passo.tipo_passo || passo.tipo || 'portal',
        titulo: passo.titulo || '',
        subtitulo: passo.subtitulo || '',
        slug: passo.slug || '',
        icone: passo.icone || '',
        image_url: passo.image_url || '',
        ordem: passo.ordem ?? proximaOrdem,
        obrigatorio: passo.obrigatorio ?? true,
        publicado: passo.publicado ?? false,
        ref_tipo: passo.ref_tipo || 'none',
        ref_id: passo.ref_id || '',
        rota_custom: passo.rota_custom || '',
        conteudo_texto: c.texto || '',
        conteudo_audio_url: c.audio_url || '',
        porta: passo.porta || '',
        campo: passo.campo || '',
        torre: passo.torre || '',
        labirinto: passo.labirinto || '',
        frase_guia: passo.frase_guia || '',
        jardim_prompt: passo.jardim_prompt || m.jardim_prompt || '',
        cenario_treinamento: passo.cenario_treinamento || m.simulacao_texto || '',
        leitura_referencia: passo.leitura_referencia || '',
        audios: Array.isArray(m.audios) ? m.audios : [],
        perguntas_sugeridas: Array.isArray(m.perguntas_sugeridas) ? m.perguntas_sugeridas : [],
        cta_label: m.cta_label || '',
        cta_url: m.cta_url || '',
        impacto_cidadela: Array.isArray(passo.impacto_cidadela) ? passo.impacto_cidadela : [],
      });
    } else {
      setForm(makeInitial(proximaOrdem));
    }
  }, [passo, proximaOrdem, open]);

  const slugify = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.titulo.trim()) errs.push('Título é obrigatório');
    if (form.ref_tipo !== 'none' && !form.ref_id && !form.rota_custom) {
      errs.push('Quando há tipo de referência, informe ref_id ou rota custom');
    }
    return errs;
  };

  const errors = validate();

  const save = useMutation({
    mutationFn: async () => {
      const slug = form.slug?.trim() || slugify(form.titulo);
      const metadata: any = {
        audios: form.audios,
        perguntas_sugeridas: form.perguntas_sugeridas.filter((p: string) => p.trim()),
      };
      if (form.cta_label) metadata.cta_label = form.cta_label;
      if (form.cta_url) metadata.cta_url = form.cta_url;

      const payload: any = {
        estacao_id: estacaoId,
        tipo_passo: form.tipo_passo,
        tipo: form.tipo_passo,
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        slug,
        icone: form.icone || null,
        image_url: form.image_url || null,
        ordem: form.ordem,
        obrigatorio: form.obrigatorio,
        publicado: form.publicado,
        ref_tipo: form.ref_tipo === 'none' ? null : form.ref_tipo,
        ref_id: form.ref_id || null,
        rota_custom: form.rota_custom || null,
        conteudo_inline: {
          texto: form.conteudo_texto || null,
          audio_url: form.conteudo_audio_url || null,
        },
        porta: form.porta || null,
        campo: form.campo || null,
        torre: form.torre || null,
        labirinto: form.labirinto || null,
        frase_guia: form.frase_guia || null,
        jardim_prompt: form.jardim_prompt || null,
        cenario_treinamento: form.cenario_treinamento || null,
        leitura_referencia: form.leitura_referencia || null,
        metadata,
        impacto_cidadela: form.impacto_cidadela,
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
      qc.invalidateQueries({ queryKey: ['rota-oracular'] });
      onClose();
    },
    onError: (e: any) => toast.error('Erro ao salvar', { description: e.message }),
  });

  // ---- Audios helpers ----
  const addAudio = () => setForm({ ...form, audios: [...form.audios, { titulo: '', url: '', tipo: 'integracao', duracao: '' }] });
  const updateAudio = (idx: number, patch: Partial<AudioMeta>) => {
    const next = [...form.audios];
    next[idx] = { ...next[idx], ...patch };
    setForm({ ...form, audios: next });
  };
  const removeAudio = (idx: number) => setForm({ ...form, audios: form.audios.filter((_: any, i: number) => i !== idx) });

  // ---- Perguntas helpers ----
  const addPergunta = () => setForm({ ...form, perguntas_sugeridas: [...form.perguntas_sugeridas, ''] });
  const updatePergunta = (idx: number, val: string) => {
    const next = [...form.perguntas_sugeridas];
    next[idx] = val;
    setForm({ ...form, perguntas_sugeridas: next });
  };
  const removePergunta = (idx: number) =>
    setForm({ ...form, perguntas_sugeridas: form.perguntas_sugeridas.filter((_: any, i: number) => i !== idx) });

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>{passo ? 'Editar Passo' : 'Novo Passo da Rota'}</span>
            {passo?.slug && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => window.open(`/clube/rota/${passo.slug}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3" /> Ver como aluna
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basico" className="py-2">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basico" className="text-xs">Básico</TabsTrigger>
            <TabsTrigger value="cartografia" className="text-xs">Cartografia</TabsTrigger>
            <TabsTrigger value="conteudo" className="text-xs">Conteúdo</TabsTrigger>
            <TabsTrigger value="referencia" className="text-xs">Referência</TabsTrigger>
            <TabsTrigger value="impacto" className="text-xs">Impacto</TabsTrigger>
          </TabsList>

          {/* BÁSICO */}
          <TabsContent value="basico" className="space-y-4 pt-4">
            <div className="space-y-1">
              <Label className="text-xs">Tipo de passo</Label>
              <Select value={form.tipo_passo} onValueChange={v => setForm({ ...form, tipo_passo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_PASSO.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
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
              <Label className="text-xs">Subtítulo</Label>
              <Input value={form.subtitulo} onChange={e => setForm({ ...form, subtitulo: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Slug (auto se vazio)</Label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="o-chamado-selvagem" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Imagem (URL)</Label>
                <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
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
          </TabsContent>

          {/* CARTOGRAFIA */}
          <TabsContent value="cartografia" className="space-y-3 pt-4">
            <p className="text-[11px] text-muted-foreground italic">
              Eixos simbólicos da Cartografia Unificada. Aparecem no Mapa Vivo da rota.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Porta</Label>
                <Input value={form.porta} onChange={e => setForm({ ...form, porta: e.target.value })} placeholder="Ex: Sombra Devorada" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Campo</Label>
                <Input value={form.campo} onChange={e => setForm({ ...form, campo: e.target.value })} placeholder="Ex: Tensão Selvagem" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Torre</Label>
                <Input value={form.torre} onChange={e => setForm({ ...form, torre: e.target.value })} placeholder="Ex: Vigília" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Labirinto</Label>
                <Input value={form.labirinto} onChange={e => setForm({ ...form, labirinto: e.target.value })} placeholder="Ex: Espelho do Lobo" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Frase-guia</Label>
              <Textarea
                value={form.frase_guia}
                onChange={e => setForm({ ...form, frase_guia: e.target.value })}
                rows={2}
                className="text-sm resize-none"
                placeholder="Frase central que costura a travessia..."
              />
            </div>
          </TabsContent>

          {/* CONTEÚDO */}
          <TabsContent value="conteudo" className="space-y-4 pt-4">
            <div className="space-y-1">
              <Label className="text-xs">Texto / Roteiro</Label>
              <Textarea
                value={form.conteudo_texto}
                onChange={e => setForm({ ...form, conteudo_texto: e.target.value })}
                rows={4}
                className="text-sm resize-none"
                placeholder="Texto do portal, roteiro do áudio, instruções..."
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Áudio principal (URL)</Label>
              <Input
                value={form.conteudo_audio_url}
                onChange={e => setForm({ ...form, conteudo_audio_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Lista de áudios */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Áudios da Rota</Label>
                <Button size="sm" variant="ghost" type="button" onClick={addAudio} className="h-7 text-xs gap-1">
                  <Plus className="w-3 h-3" /> Adicionar
                </Button>
              </div>
              {form.audios.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic">Sem áudios. A seção não aparecerá para a aluna.</p>
              )}
              {form.audios.map((a: AudioMeta, idx: number) => (
                <div key={idx} className="grid grid-cols-[1fr_1fr_80px_60px_auto] gap-1.5 items-end p-2 border border-border/50 rounded-md">
                  <Input className="h-8 text-xs" placeholder="Título" value={a.titulo} onChange={e => updateAudio(idx, { titulo: e.target.value })} />
                  <Input className="h-8 text-xs" placeholder="URL" value={a.url} onChange={e => updateAudio(idx, { url: e.target.value })} />
                  <Input className="h-8 text-xs" placeholder="Tipo" value={a.tipo || ''} onChange={e => updateAudio(idx, { tipo: e.target.value })} />
                  <Input className="h-8 text-xs" placeholder="12:30" value={a.duracao || ''} onChange={e => updateAudio(idx, { duracao: e.target.value })} />
                  <Button size="icon" variant="ghost" type="button" onClick={() => removeAudio(idx)} className="h-8 w-8">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Jardim / Treinamento / Leitura */}
            <div className="space-y-3 border-t pt-3">
              <div className="space-y-1">
                <Label className="text-xs">Prompt do Jardim</Label>
                <Textarea
                  value={form.jardim_prompt}
                  onChange={e => setForm({ ...form, jardim_prompt: e.target.value })}
                  rows={2}
                  className="text-sm resize-none"
                  placeholder="Escreva hoje sobre..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Cenário de Treinamento</Label>
                <Textarea
                  value={form.cenario_treinamento}
                  onChange={e => setForm({ ...form, cenario_treinamento: e.target.value })}
                  rows={2}
                  className="text-sm resize-none"
                  placeholder="Caso simbólico para a Sala de Treinamento..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Leitura de Referência</Label>
                <Input
                  value={form.leitura_referencia}
                  onChange={e => setForm({ ...form, leitura_referencia: e.target.value })}
                  placeholder="Capítulo X, p. 42–58"
                />
              </div>
            </div>

            {/* Perguntas sugeridas */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Perguntas — Converse com o Livro</Label>
                <Button size="sm" variant="ghost" type="button" onClick={addPergunta} className="h-7 text-xs gap-1">
                  <Plus className="w-3 h-3" /> Adicionar
                </Button>
              </div>
              {form.perguntas_sugeridas.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic">Sem perguntas. A seção não aparecerá.</p>
              )}
              {form.perguntas_sugeridas.map((p: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <Input className="h-8 text-xs" value={p} onChange={e => updatePergunta(idx, e.target.value)} placeholder="O que o lobo pede de mim?" />
                  <Button size="icon" variant="ghost" type="button" onClick={() => removePergunta(idx)} className="h-8 w-8 shrink-0">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              <div className="space-y-1">
                <Label className="text-xs">CTA — texto</Label>
                <Input value={form.cta_label} onChange={e => setForm({ ...form, cta_label: e.target.value })} placeholder="Quero saber mais" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">CTA — link</Label>
                <Input value={form.cta_url} onChange={e => setForm({ ...form, cta_url: e.target.value })} placeholder="https://..." className="h-8 text-xs" />
              </div>
            </div>
          </TabsContent>

          {/* REFERÊNCIA */}
          <TabsContent value="referencia" className="space-y-3 pt-4">
            <p className="text-[11px] text-muted-foreground italic">
              Vincular este passo a um conteúdo já existente (portal, áudio, aula...) ou a uma rota custom.
            </p>
            <div className="space-y-1">
              <Label className="text-xs">Tipo de referência</Label>
              <Select value={form.ref_tipo} onValueChange={v => setForm({ ...form, ref_tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REF_TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {form.ref_tipo !== 'none' && (
              <div className="space-y-1">
                <Label className="text-xs">ID da referência (UUID)</Label>
                <Input
                  value={form.ref_id}
                  onChange={e => setForm({ ...form, ref_id: e.target.value })}
                  placeholder="uuid do conteúdo referenciado"
                  className="font-mono text-xs"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs">Rota custom (opcional)</Label>
              <Input
                value={form.rota_custom}
                onChange={e => setForm({ ...form, rota_custom: e.target.value })}
                placeholder="/clube/sala/escuta"
              />
            </div>
          </TabsContent>

          {/* IMPACTO */}
          <TabsContent value="impacto" className="space-y-3 pt-4">
            <ImpactoCidadelaForm
              value={form.impacto_cidadela}
              onChange={v => setForm({ ...form, impacto_cidadela: v })}
            />
          </TabsContent>
        </Tabs>

        {errors.length > 0 && (
          <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/5 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {errors.map((err, i) => (
                <p key={i} className="text-[11px] text-destructive">{err}</p>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || errors.length > 0}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
