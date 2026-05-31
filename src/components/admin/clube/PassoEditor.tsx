import { useEffect, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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
import { Loader2, Plus, Trash2, ExternalLink, AlertCircle, Music, RefreshCw, CheckCircle2, AlertTriangle, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AudiotecaSelector } from './AudiotecaSelector';

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
  const [isAudiotecaOpen, setIsAudiotecaOpen] = useState(false);

  // Sync check helpers
  const { data: allTracks } = useQuery({
    queryKey: ['admin-clube-audio-tracks-sync'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clube_audio_tracks').select('*');
      if (error) throw error;
      return data;
    },
    enabled: open
  });

  const getSyncStatus = (audio: AudioMeta) => {
    if (!allTracks || !audio.url) return 'manual';
    const track = allTracks.find(t => t.audio_url === audio.url);
    if (!track) return 'manual';
    
    // Convert seconds to MM:SS for comparison if needed, but usually we check title/url
    const isSync = track.titulo === audio.titulo;
    return isSync ? 'synced' : 'divergent';
  };

  const formatSecsToDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudiotecaSelect = (track: any) => {
    const newAudio: AudioMeta = {
      titulo: track.titulo,
      url: track.audio_url,
      tipo: track.tipo || 'audio',
      duracao: formatSecsToDuration(track.duracao_segundos)
    };

    // Replace first empty or add new
    const existingAudios = [...form.audios];
    const emptyIdx = existingAudios.findIndex(a => !a.url);
    
    if (emptyIdx > -1) {
      existingAudios[emptyIdx] = newAudio;
    } else {
      existingAudios.push(newAudio);
    }

    setForm({ ...form, audios: existingAudios });
    setIsAudiotecaOpen(false);
    toast.success(`Áudio "${track.titulo}" vinculado.`);
  };

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
      // Conteúdo da travessia (legado/base)
      jardim_prompt: '',
      cenario_treinamento: '',
      leitura_referencia: '',
      // Metadata - Blocos da Travessia (Unificado)
      abertura_imersiva: '',
      caso_simbolico: { texto: '', aviso: '' },
      desafio_terapeuta: { pergunta: '', escolhas: [] as string[] },
      revelacao_estacao: { porta: '', campo: '', torre: '', labirinto: '', pergunta_narrativa: '' },
      erro_comum: { titulo: '', descricao: '', exemplo: '' },
      conducao_justa: '',
      cautela_etica: [] as string[],
      jardim_psique: { pergunta: '', botao: '' },
      jardim_oficio: { pergunta: '', botao: '', aviso_etico: '' },
      missao_campo: { titulo: '', descricao: '', sinais: '', botao: '' },
      oraculo_estacao: { palavra: '', movimento: '', carta_final: '', frase_fechamento: '' },
      fechamento: { texto: '', pergunta: '', botao: '', confirmacao: '' },
      // Metadata - Outros
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
        // Metadata - Blocos da Travessia
        abertura_imersiva: m.abertura_imersiva || '',
        caso_simbolico: { 
          texto: m.caso_simbolico?.texto || '', 
          aviso: m.caso_simbolico?.aviso || '' 
        },
        desafio_terapeuta: { 
          pergunta: m.desafio_terapeuta?.pergunta || (typeof m.desafio_terapeuta === 'string' ? m.desafio_terapeuta : ''), 
          escolhas: Array.isArray(m.desafio_terapeuta?.escolhas) ? m.desafio_terapeuta.escolhas : [] 
        },
        revelacao_estacao: { 
          porta: m.revelacao_estacao?.porta || '', 
          campo: m.revelacao_estacao?.campo || '', 
          torre: m.revelacao_estacao?.torre || '', 
          labirinto: m.revelacao_estacao?.labirinto || '', 
          pergunta_narrativa: m.revelacao_estacao?.pergunta_narrativa || '' 
        },
        erro_comum: { 
          titulo: m.erro_comum?.titulo || '', 
          descricao: m.erro_comum?.descricao || '', 
          exemplo: m.erro_comum?.exemplo || '' 
        },
        conducao_justa: m.conducao_justa || '',
        cautela_etica: Array.isArray(m.cautela_etica) ? m.cautela_etica : [],
        jardim_psique: { 
          pergunta: m.jardim_psique?.pergunta || '', 
          botao: m.jardim_psique?.botao || '' 
        },
        jardim_oficio: { 
          pergunta: m.jardim_oficio?.pergunta || '', 
          botao: m.jardim_oficio?.botao || '', 
          aviso_etico: m.jardim_oficio?.aviso_etico || '' 
        },
        missao_campo: { 
          titulo: m.missao_campo?.titulo || '', 
          descricao: m.missao_campo?.descricao || '', 
          sinais: m.missao_campo?.sinais || '', 
          botao: m.missao_campo?.botao || '' 
        },
        oraculo_estacao: { 
          palavra: m.oraculo_estacao?.palavra || (typeof m.oraculo_estacao === 'string' ? m.oraculo_estacao : ''), 
          movimento: m.oraculo_estacao?.movimento || '', 
          carta_final: m.oraculo_estacao?.carta_final || '', 
          frase_fechamento: m.oraculo_estacao?.frase_fechamento || '' 
        },
        fechamento: { 
          texto: m.fechamento?.texto || '', 
          pergunta: m.fechamento?.pergunta || '', 
          botao: m.fechamento?.botao || '', 
          confirmacao: m.fechamento?.confirmacao || '' 
        },
        // Metadata - Outros
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
      const limparObj = (obj: any) => {
        const result: any = {};
        let hasValue = false;
        Object.keys(obj).forEach(key => {
          if (Array.isArray(obj[key])) {
            const filtered = obj[key].filter(Boolean);
            if (filtered.length > 0) {
              result[key] = filtered;
              hasValue = true;
            }
          } else if (obj[key] && typeof obj[key] === 'object') {
            const sub = limparObj(obj[key]);
            if (sub) {
              result[key] = sub;
              hasValue = true;
            }
          } else if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            result[key] = obj[key];
            hasValue = true;
          }
        });
        return hasValue ? result : undefined;
      };

      const metadata: any = {
        ...(passo?.metadata || {}),
        audios: form.audios,
        perguntas_sugeridas: form.perguntas_sugeridas.filter((p: string) => p.trim()),
        cta_label: form.cta_label || undefined,
        cta_url: form.cta_url || undefined,
        abertura_imersiva: form.abertura_imersiva || undefined,
        caso_simbolico: limparObj(form.caso_simbolico),
        desafio_terapeuta: limparObj(form.desafio_terapeuta),
        revelacao_estacao: limparObj(form.revelacao_estacao),
        erro_comum: limparObj(form.erro_comum),
        conducao_justa: form.conducao_justa || undefined,
        cautela_etica: form.cautela_etica.filter(Boolean).length > 0 ? form.cautela_etica.filter(Boolean) : undefined,
        jardim_psique: limparObj(form.jardim_psique),
        jardim_oficio: limparObj(form.jardim_oficio),
        missao_campo: limparObj(form.missao_campo),
        oraculo_estacao: limparObj(form.oraculo_estacao),
        fechamento: limparObj(form.fechamento),
      };

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
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="basico" className="text-xs">Básico</TabsTrigger>
            <TabsTrigger value="cartografia" className="text-xs">Cartografia</TabsTrigger>
            <TabsTrigger value="conteudo" className="text-xs">Conteúdo</TabsTrigger>
            <TabsTrigger value="travessia" className="text-xs">Travessia</TabsTrigger>
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

            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Áudios da Rota</Label>
                  <span className="text-[10px] text-muted-foreground">Vincule faixas da Audioteca para manter sincronia.</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" type="button" onClick={() => setIsAudiotecaOpen(true)} className="h-7 text-xs gap-1 border-gold/30 text-gold hover:bg-gold/5">
                    <Music className="w-3 h-3" /> Vincular Audioteca
                  </Button>
                  <Button size="sm" variant="ghost" type="button" onClick={addAudio} className="h-7 text-xs gap-1">
                    <Plus className="w-3 h-3" /> Manual
                  </Button>
                </div>
              </div>

              {form.audios.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic">Sem áudios. A seção não aparecerá para a aluna.</p>
              )}

              <div className="space-y-2">
                {form.audios.map((a: AudioMeta, idx: number) => {
                  const status = getSyncStatus(a);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="grid grid-cols-[1fr_1fr_80px_60px_auto] gap-1.5 items-end p-2 border border-border/50 rounded-md bg-white/[0.01]">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-muted-foreground">Título</Label>
                          <Input className="h-8 text-xs" placeholder="Título" value={a.titulo} onChange={e => updateAudio(idx, { titulo: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-muted-foreground">URL</Label>
                          <Input className="h-8 text-xs" placeholder="URL" value={a.url} onChange={e => updateAudio(idx, { url: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-muted-foreground">Tipo</Label>
                          <Input className="h-8 text-xs" placeholder="Tipo" value={a.tipo || ''} onChange={e => updateAudio(idx, { tipo: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-muted-foreground">Duração</Label>
                          <Input className="h-8 text-xs" placeholder="12:30" value={a.duracao || ''} onChange={e => updateAudio(idx, { duracao: e.target.value })} />
                        </div>
                        <Button size="icon" variant="ghost" type="button" onClick={() => removeAudio(idx)} className="h-8 w-8">
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          {status === 'synced' ? (
                            <Badge variant="outline" className="text-[8px] h-4 gap-1 bg-emerald-500/5 text-emerald-500 border-emerald-500/20">
                              <CheckCircle2 className="w-2 h-2" /> Sincronizado
                            </Badge>
                          ) : status === 'divergent' ? (
                            <Badge variant="outline" className="text-[8px] h-4 gap-1 bg-amber-500/5 text-amber-500 border-amber-500/20">
                              <AlertTriangle className="w-2 h-2" /> Divergente
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[8px] h-4 gap-1 text-white/20 border-white/5">
                              <LinkIcon className="w-2 h-2" /> Manual / Externo
                            </Badge>
                          )}
                        </div>
                        {a.url && (
                          <button 
                            type="button" 
                            onClick={() => window.open(a.url, '_blank')}
                            className="text-[9px] text-muted-foreground hover:text-gold flex items-center gap-1"
                          >
                            <ExternalLink className="w-2 h-2" /> Testar Link
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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

          {/* TRAVESSIA — EDITOR DE BLOCOS */}
          <TabsContent value="travessia" className="space-y-4 pt-4">
            <p className="text-[11px] text-muted-foreground italic mb-2">
              Configure os 12 blocos da travessia guiada consumidos pela aluna na Estação.
            </p>
            
            <Accordion type="single" collapsible className="w-full space-y-2">
              {/* 1. Abertura */}
              <AccordionItem value="abertura" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">1. Abertura do Campo</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Texto de Abertura (MD)</Label>
                    <Textarea 
                      value={form.abertura_imersiva} 
                      onChange={e => setForm({...form, abertura_imersiva: e.target.value})} 
                      placeholder="Prepare o campo interno da escuta..."
                      className="text-xs resize-none"
                      rows={3}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. Caso Simbólico */}
              <AccordionItem value="caso" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">2. Caso Simbólico</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Texto do Caso</Label>
                    <Textarea 
                      value={form.caso_simbolico.texto} 
                      onChange={e => setForm({...form, caso_simbolico: {...form.caso_simbolico, texto: e.target.value}})} 
                      placeholder="Apresentar riscos clínicos..."
                      className="text-xs resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Aviso / Alerta</Label>
                    <Input 
                      value={form.caso_simbolico.aviso} 
                      onChange={e => setForm({...form, caso_simbolico: {...form.caso_simbolico, aviso: e.target.value}})} 
                      placeholder="Aviso clínico..."
                      className="h-8 text-xs"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3. Desafio */}
              <AccordionItem value="desafio" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">3. Desafio da Terapeuta</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Pergunta do Desafio</Label>
                    <Textarea 
                      value={form.desafio_terapeuta.pergunta} 
                      onChange={e => setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, pergunta: e.target.value}})} 
                      placeholder="Como você agiria se..."
                      className="text-xs resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Escolhas / Alternativas</Label>
                    {form.desafio_terapeuta.escolhas.map((choice: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <Input 
                          value={choice} 
                          onChange={e => {
                            const next = [...form.desafio_terapeuta.escolhas];
                            next[idx] = e.target.value;
                            setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, escolhas: next}});
                          }} 
                          className="h-8 text-xs" 
                        />
                        <Button size="icon" variant="ghost" type="button" onClick={() => {
                          const next = form.desafio_terapeuta.escolhas.filter((_: any, i: number) => i !== idx);
                          setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, escolhas: next}});
                        }} className="h-8 w-8 shrink-0"><Trash2 className="w-3 h-3 text-destructive" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="ghost" type="button" onClick={() => setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, escolhas: [...form.desafio_terapeuta.escolhas, '']}})} className="h-7 text-xs gap-1">
                      <Plus className="w-3 h-3" /> Adicionar Escolha
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 4. Revelação */}
              <AccordionItem value="revelacao" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">4. Revelação (Mapa Vivo)</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><Label className="text-xs">Porta</Label><Input value={form.revelacao_estacao.porta} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, porta: e.target.value}})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">Campo</Label><Input value={form.revelacao_estacao.campo} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, campo: e.target.value}})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">Torre</Label><Input value={form.revelacao_estacao.torre} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, torre: e.target.value}})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">Labirinto</Label><Input value={form.revelacao_estacao.labirinto} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, labirinto: e.target.value}})} className="h-8 text-xs" /></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Pergunta Narrativa Final</Label>
                    <Input value={form.revelacao_estacao.pergunta_narrativa} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, pergunta_narrativa: e.target.value}})} className="h-8 text-xs" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 5. Erro Comum */}
              <AccordionItem value="erro" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">5. Erro Comum</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Título</Label>
                    <Input value={form.erro_comum.titulo} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, titulo: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Descrição</Label>
                    <Textarea value={form.erro_comum.descricao} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, descricao: e.target.value}})} className="text-xs resize-none" rows={2} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Exemplo Inadequado</Label>
                    <Input value={form.erro_comum.exemplo} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, exemplo: e.target.value}})} className="h-8 text-xs" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 6. Condução & Ética */}
              <AccordionItem value="etica" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">6. Condução & Ética</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Condução Justa (Texto)</Label>
                    <Textarea value={form.conducao_justa} onChange={e => setForm({...form, conducao_justa: e.target.value})} className="text-xs resize-none" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Cautela Ética (Lista)</Label>
                    {form.cautela_etica.map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={item} onChange={e => {
                          const next = [...form.cautela_etica];
                          next[idx] = e.target.value;
                          setForm({...form, cautela_etica: next});
                        }} className="h-8 text-xs" />
                        <Button size="icon" variant="ghost" type="button" onClick={() => setForm({...form, cautela_etica: form.cautela_etica.filter((_: any, i: number) => i !== idx)})} className="h-8 w-8 shrink-0"><Trash2 className="w-3 h-3 text-destructive" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="ghost" type="button" onClick={() => setForm({...form, cautela_etica: [...form.cautela_etica, '']})} className="h-7 text-xs gap-1">
                      <Plus className="w-3 h-3" /> Adicionar Cautela
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 7. Jardim Psique */}
              <AccordionItem value="psique" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">7. Jardim da Psique</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Pergunta-Mãe (Escrita Íntima)</Label>
                    <Input value={form.jardim_psique.pergunta} onChange={e => setForm({...form, jardim_psique: {...form.jardim_psique, pergunta: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Texto do Botão</Label>
                    <Input value={form.jardim_psique.botao} onChange={e => setForm({...form, jardim_psique: {...form.jardim_psique, botao: e.target.value}})} className="h-8 text-xs" placeholder="Registrar Travessia" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 8. Jardim Ofício */}
              <AccordionItem value="oficio" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">8. Jardim do Ofício</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Pergunta de Prática Profissional</Label>
                    <Input value={form.jardim_oficio.pergunta} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, pergunta: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Aviso Ético (Microcopy)</Label>
                    <Input value={form.jardim_oficio.aviso_etico} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, aviso_etico: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Texto do Botão</Label>
                    <Input value={form.jardim_oficio.botao} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, botao: e.target.value}})} className="h-8 text-xs" placeholder="Registrar Prática" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 9. Missão de Campo */}
              <AccordionItem value="missao" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">9. Missão de Campo</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Título da Missão</Label>
                    <Input value={form.missao_campo.titulo} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, titulo: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Descrição da Ação</Label>
                    <Textarea value={form.missao_campo.descricao} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, descricao: e.target.value}})} className="text-xs resize-none" rows={2} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Sinais de Observação</Label>
                    <Input value={form.missao_campo.sinais} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, sinais: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Texto do Botão</Label>
                    <Input value={form.missao_campo.botao} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, botao: e.target.value}})} className="h-8 text-xs" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 10. Oráculo */}
              <AccordionItem value="oraculo" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">10. Oráculo da Estação</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><Label className="text-xs">Palavra-Chave</Label><Input value={form.oraculo_estacao.palavra} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, palavra: e.target.value}})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">Carta Final (ID)</Label><Input value={form.oraculo_estacao.carta_final} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, carta_final: e.target.value}})} className="h-8 text-xs" /></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Movimento Simbólico</Label>
                    <Input value={form.oraculo_estacao.movimento} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, movimento: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Frase de Fechamento</Label>
                    <Input value={form.oraculo_estacao.frase_fechamento} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, frase_fechamento: e.target.value}})} className="h-8 text-xs" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 11. Fechamento */}
              <AccordionItem value="fechamento" className="border rounded-md px-3 bg-white/[0.01]">
                <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">11. Fechamento Final</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Texto Final</Label>
                    <Textarea value={form.fechamento.texto} onChange={e => setForm({...form, fechamento: {...form.fechamento, texto: e.target.value}})} className="text-xs resize-none" rows={2} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Pergunta Final</Label>
                    <Input value={form.fechamento.pergunta} onChange={e => setForm({...form, fechamento: {...form.fechamento, pergunta: e.target.value}})} className="h-8 text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><Label className="text-xs">Botão</Label><Input value={form.fechamento.botao} onChange={e => setForm({...form, fechamento: {...form.fechamento, botao: e.target.value}})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">Microcopy Conclusão</Label><Input value={form.fechamento.confirmacao} onChange={e => setForm({...form, fechamento: {...form.fechamento, confirmacao: e.target.value}})} className="h-8 text-xs" /></div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

      <AudiotecaSelector 
        open={isAudiotecaOpen}
        onClose={() => setIsAudiotecaOpen(false)}
        onSelect={handleAudiotecaSelect}
      />
    </Dialog>
  );
}
