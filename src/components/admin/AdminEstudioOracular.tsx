import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical, Loader2, Play, Mic, Send, Eye, Pencil, Music, Upload } from 'lucide-react';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { AudioUpload } from '@/components/admin/AudioUpload';

// ============ Method Blocks Manager ============
function MethodBlocksManager() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBlock, setNewBlock] = useState({ nome: '', instrucao: '' });

  const fetchBlocks = async () => {
    const { data } = await supabase.from('studio_method_blocks').select('*').order('ordem');
    setBlocks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBlocks(); }, []);

  const addBlock = async () => {
    if (!newBlock.nome) return;
    const ordem = blocks.length;
    await supabase.from('studio_method_blocks').insert({ ...newBlock, ordem });
    setNewBlock({ nome: '', instrucao: '' });
    fetchBlocks();
    toast.success('Bloco adicionado');
  };

  const updateBlock = async (id: string, field: string, value: any) => {
    await supabase.from('studio_method_blocks').update({ [field]: value }).eq('id', id);
    fetchBlocks();
  };

  const deleteBlock = async (id: string) => {
    await supabase.from('studio_method_blocks').delete().eq('id', id);
    fetchBlocks();
    toast.success('Bloco removido');
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Blocos do Método</h3>
      <p className="text-sm text-muted-foreground">Defina a estrutura base da leitura terapêutica. Estes blocos serão combinados com o eixo escolhido para gerar o roteiro.</p>
      
      {blocks.map((block, i) => (
        <Card key={block.id} className="bg-card/50">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <Badge variant="outline" className="shrink-0">{i + 1}</Badge>
              <Input value={block.nome} onChange={(e) => updateBlock(block.id, 'nome', e.target.value)} className="font-medium" />
              <Switch checked={block.ativo} onCheckedChange={(v) => updateBlock(block.id, 'ativo', v)} />
              <Button variant="ghost" size="icon" onClick={() => deleteBlock(block.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Textarea value={block.instrucao} onChange={(e) => updateBlock(block.id, 'instrucao', e.target.value)} placeholder="Instrução para este bloco..." className="min-h-[60px]" />
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed border-2 border-muted">
        <CardContent className="pt-4 space-y-3">
          <Input placeholder="Nome do novo bloco" value={newBlock.nome} onChange={(e) => setNewBlock(p => ({ ...p, nome: e.target.value }))} />
          <Textarea placeholder="Instrução..." value={newBlock.instrucao} onChange={(e) => setNewBlock(p => ({ ...p, instrucao: e.target.value }))} />
          <Button onClick={addBlock} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Adicionar Bloco
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Method Axes Manager ============
function MethodAxesManager() {
  const [axes, setAxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAxis, setNewAxis] = useState({ nome: '', descricao: '', instrucao_especifica: '' });

  const fetchAxes = async () => {
    const { data } = await supabase.from('studio_method_axes').select('*').order('ordem');
    setAxes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAxes(); }, []);

  const addAxis = async () => {
    if (!newAxis.nome) return;
    await supabase.from('studio_method_axes').insert({ ...newAxis, ordem: axes.length });
    setNewAxis({ nome: '', descricao: '', instrucao_especifica: '' });
    fetchAxes();
    toast.success('Eixo adicionado');
  };

  const updateAxis = async (id: string, field: string, value: any) => {
    await supabase.from('studio_method_axes').update({ [field]: value }).eq('id', id);
    fetchAxes();
  };

  const deleteAxis = async (id: string) => {
    await supabase.from('studio_method_axes').delete().eq('id', id);
    fetchAxes();
    toast.success('Eixo removido');
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Eixos do Método</h3>
      <p className="text-sm text-muted-foreground">Cada eixo adiciona instruções específicas à estrutura base, gerando variações na leitura.</p>

      {axes.map((axis) => (
        <Card key={axis.id} className="bg-card/50">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Input value={axis.nome} onChange={(e) => updateAxis(axis.id, 'nome', e.target.value)} className="font-medium" />
              <Switch checked={axis.ativo} onCheckedChange={(v) => updateAxis(axis.id, 'ativo', v)} />
              <Button variant="ghost" size="icon" onClick={() => deleteAxis(axis.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Input value={axis.descricao} onChange={(e) => updateAxis(axis.id, 'descricao', e.target.value)} placeholder="Descrição do eixo..." />
            <Textarea value={axis.instrucao_especifica} onChange={(e) => updateAxis(axis.id, 'instrucao_especifica', e.target.value)} placeholder="Instruções específicas deste eixo..." className="min-h-[80px]" />
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed border-2 border-muted">
        <CardContent className="pt-4 space-y-3">
          <Input placeholder="Nome do eixo" value={newAxis.nome} onChange={(e) => setNewAxis(p => ({ ...p, nome: e.target.value }))} />
          <Input placeholder="Descrição" value={newAxis.descricao} onChange={(e) => setNewAxis(p => ({ ...p, descricao: e.target.value }))} />
          <Textarea placeholder="Instrução específica..." value={newAxis.instrucao_especifica} onChange={(e) => setNewAxis(p => ({ ...p, instrucao_especifica: e.target.value }))} />
          <Button onClick={addAxis} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Adicionar Eixo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Dialogue Voice Blocks Parser ============
function parseDialogueBlocks(text: string): { voice: string; content: string }[] {
  const blocks: { voice: string; content: string }[] = [];
  const regex = /\[(NARRADORA|VOZ_ORACULAR)\]\s*/gi;
  let lastIndex = 0;
  let lastVoice = '';
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (lastVoice && lastIndex < match.index) {
      const content = text.slice(lastIndex, match.index).trim();
      if (content) blocks.push({ voice: lastVoice, content });
    }
    lastVoice = match[1].toUpperCase();
    lastIndex = regex.lastIndex;
  }

  if (lastVoice && lastIndex < text.length) {
    const content = text.slice(lastIndex).trim();
    if (content) blocks.push({ voice: lastVoice, content });
  }

  return blocks;
}

function DialogueBlocksView({ text }: { text: string }) {
  const blocks = parseDialogueBlocks(text);
  if (blocks.length === 0) return <p className="text-sm text-muted-foreground">Nenhum bloco de diálogo encontrado. O roteiro deve conter marcadores [NARRADORA] e [VOZ_ORACULAR].</p>;

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={i} className={`p-3 rounded-lg border-l-4 ${block.voice === 'NARRADORA' ? 'border-l-primary bg-primary/5' : 'border-l-accent bg-accent/10'}`}>
          <Badge variant={block.voice === 'NARRADORA' ? 'default' : 'secondary'} className="mb-2">
            {block.voice === 'NARRADORA' ? '🎙️ Narradora' : '✨ Voz Oracular'}
          </Badge>
          <p className="text-sm whitespace-pre-wrap">{block.content}</p>
        </div>
      ))}
    </div>
  );
}

// ============ Episode Editor ============
function EpisodeEditor({ episode, onSaved }: { episode?: any; onSaved: () => void }) {
  const [form, setForm] = useState({
    livro: episode?.livro || '',
    capitulo: episode?.capitulo || '',
    eixo_id: episode?.eixo_id || '',
    texto_base: episode?.texto_base || '',
    intencao_terapeutica: episode?.intencao_terapeutica || '',
    visibility: episode?.visibility || 'exclusive',
    titulo: episode?.titulo || '',
    descricao: episode?.descricao || '',
    voz_escolhida: episode?.voz_escolhida || 'suave',
    roteiro_completo: episode?.roteiro_completo || '',
    versao_resumida: episode?.versao_resumida || '',
    status: episode?.status || 'draft',
    formato: episode?.formato || 'narrativo',
    trilha_ativa: episode?.trilha_ativa || false,
    trilha_volume: episode?.trilha_volume || 20,
    fade_in_seconds: episode?.fade_in_seconds || 2,
    fade_out_seconds: episode?.fade_out_seconds || 3,
    tipo_episodio: episode?.tipo_episodio || 'podcast',
    ciclo_id: episode?.ciclo_id || '',
  });
  const [axes, setAxes] = useState<any[]>([]);
  const [ciclos, setCiclos] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [audioUrls, setAudioUrls] = useState({
    full: episode?.audio_full_url || null,
    public: episode?.audio_public_url || null,
    narradora: episode?.audio_narradora_url || null,
    oracular: episode?.audio_oracular_url || null,
    final: episode?.audio_final_url || null,
    vinheta_abertura: episode?.vinheta_abertura_url || null,
    vinheta_encerramento: episode?.vinheta_encerramento_url || null,
    trilha_fundo: episode?.trilha_fundo_url || null,
  });
  const [showDialogueView, setShowDialogueView] = useState(false);

  const isDialogo = form.formato === 'dialogo';

  useEffect(() => {
    supabase.from('studio_method_axes').select('*').eq('ativo', true).order('ordem')
      .then(({ data }) => setAxes(data || []));
    supabase.from('clube_livro_ciclos').select('id, titulo, autor_livro, ativo').order('ordem')
      .then(({ data }) => setCiclos(data || []));
  }, []);

  const handleGenerate = async () => {
    if (!form.livro || !form.texto_base) {
      toast.error('Preencha pelo menos o livro e o texto base');
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('studio-generate-episode', {
        body: {
          livro: form.livro,
          capitulo: form.capitulo,
          eixoId: form.eixo_id || null,
          textoBase: form.texto_base,
          intencaoTerapeutica: form.intencao_terapeutica,
          visibility: form.visibility,
          formato: form.formato,
        },
      });
      if (error) throw error;
      setForm(p => ({
        ...p,
        roteiro_completo: data.roteiroCompleto || '',
        versao_resumida: data.versaoResumida || '',
      }));
      toast.success('Roteiro gerado com sucesso!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao gerar roteiro');
    } finally {
      setGenerating(false);
    }
  };

  const extractVoiceText = (voice: 'NARRADORA' | 'VOZ_ORACULAR') => {
    const blocks = parseDialogueBlocks(form.roteiro_completo);
    return blocks.filter(b => b.voice === voice).map(b => b.content).join('\n\n');
  };

  const handleGenerateAudio = async (type: 'full' | 'public') => {
    const text = type === 'full' ? form.roteiro_completo : form.versao_resumida;
    if (!text) {
      toast.error(`Sem ${type === 'full' ? 'roteiro completo' : 'versão resumida'} para gerar áudio`);
      return;
    }
    if (!episode?.id) {
      toast.error('Salve o episódio antes de gerar áudio');
      return;
    }
    setGeneratingAudio(type);
    try {
      const { data, error } = await supabase.functions.invoke('studio-tts', {
        body: { text, voice: form.voz_escolhida, episodeId: episode.id, audioType: type },
      });
      if (error) throw error;
      setAudioUrls(p => ({ ...p, [type]: data.url }));
      toast.success('Áudio gerado com sucesso!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao gerar áudio');
    } finally {
      setGeneratingAudio(null);
    }
  };

  const handleGenerateOracularAudio = async () => {
    const oracularText = extractVoiceText('VOZ_ORACULAR');
    if (!oracularText) {
      toast.error('Nenhum bloco [VOZ_ORACULAR] encontrado no roteiro');
      return;
    }
    if (!episode?.id) {
      toast.error('Salve o episódio antes de gerar áudio');
      return;
    }
    setGeneratingAudio('oracular');
    try {
      const { data, error } = await supabase.functions.invoke('studio-tts', {
        body: { text: oracularText, voice: form.voz_escolhida, episodeId: episode.id, audioType: 'oracular' },
      });
      if (error) throw error;
      setAudioUrls(p => ({ ...p, oracular: data.url }));
      toast.success('Áudio da Voz Oracular gerado!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao gerar áudio oracular');
    } finally {
      setGeneratingAudio(null);
    }
  };

  const handleMergeAudio = async () => {
    if (!episode?.id) {
      toast.error('Salve o episódio antes de finalizar');
      return;
    }
    if (!audioUrls.narradora || !audioUrls.oracular) {
      toast.error('É necessário ter áudio da Narradora e da Voz Oracular');
      return;
    }
    setMerging(true);
    try {
      const { data, error } = await supabase.functions.invoke('studio-merge-audio', {
        body: { episodeId: episode.id },
      });
      if (error) throw error;
      setAudioUrls(p => ({ ...p, final: data.url }));
      toast.success('Episódio finalizado! Áudio combinado gerado.');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao finalizar episódio');
    } finally {
      setMerging(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        livro: form.livro,
        capitulo: form.capitulo,
        eixo_id: form.eixo_id || null,
        texto_base: form.texto_base,
        intencao_terapeutica: form.intencao_terapeutica,
        visibility: form.visibility,
        titulo: form.titulo || form.livro,
        descricao: form.descricao,
        voz_escolhida: form.voz_escolhida,
        roteiro_completo: form.roteiro_completo,
        versao_resumida: form.versao_resumida,
        status: form.status,
        formato: form.formato,
        audio_narradora_url: audioUrls.narradora,
        audio_oracular_url: audioUrls.oracular,
        audio_final_url: audioUrls.final,
        vinheta_abertura_url: audioUrls.vinheta_abertura,
        vinheta_encerramento_url: audioUrls.vinheta_encerramento,
        trilha_fundo_url: audioUrls.trilha_fundo,
        trilha_ativa: form.trilha_ativa,
        trilha_volume: form.trilha_volume,
        fade_in_seconds: form.fade_in_seconds,
        fade_out_seconds: form.fade_out_seconds,
        tipo_episodio: form.tipo_episodio,
        ciclo_id: form.ciclo_id || null,
      };

      if (form.status === 'published' && !episode?.published_at) {
        payload.published_at = new Date().toISOString();
      }

      if (episode?.id) {
        await supabase.from('studio_episodes').update(payload).eq('id', episode.id);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        payload.created_by = user?.id;
        await supabase.from('studio_episodes').insert(payload);
      }
      toast.success('Episódio salvo!');
      onSaved();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título do Episódio</Label>
          <Input value={form.titulo} onChange={(e) => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Título para exibição" />
        </div>
        <div className="space-y-2">
          <Label>Tipo de Episódio</Label>
          <Select value={form.tipo_episodio} onValueChange={(v) => setForm(p => ({ ...p, tipo_episodio: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="clube_livro">📖 Clube do Livro</SelectItem>
              <SelectItem value="podcast">🎙️ Podcast Público</SelectItem>
              <SelectItem value="formacao">🎓 Formação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {form.tipo_episodio === 'clube_livro' && (
          <div className="space-y-2 md:col-span-2">
            <Label>Livro Vinculado (Ciclo)</Label>
            <Select value={form.ciclo_id || "none"} onValueChange={(v) => setForm(p => ({ ...p, ciclo_id: v === "none" ? "" : v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione o livro do Círculo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {ciclos.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.titulo} {c.autor_livro ? `— ${c.autor_livro}` : ''} {c.ativo ? '✅' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Ao publicar, o episódio será inserido automaticamente na Travessia deste livro.</p>
          </div>
        )}
        <div className="space-y-2">
          <Label>Formato do Episódio</Label>
          <Select value={form.formato} onValueChange={(v) => setForm(p => ({ ...p, formato: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="narrativo">🎙️ Narrativo Único</SelectItem>
              <SelectItem value="dialogo">💬 Diálogo Oracular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Livro</Label>
          <Input value={form.livro} onChange={(e) => setForm(p => ({ ...p, livro: e.target.value }))} placeholder="Nome do livro" />
        </div>
        <div className="space-y-2">
          <Label>Capítulo</Label>
          <Input value={form.capitulo} onChange={(e) => setForm(p => ({ ...p, capitulo: e.target.value }))} placeholder="Capítulo ou seção" />
        </div>
        <div className="space-y-2">
          <Label>Eixo</Label>
          <Select value={form.eixo_id || "none"} onValueChange={(v) => setForm(p => ({ ...p, eixo_id: v === "none" ? "" : v }))}>
            <SelectTrigger><SelectValue placeholder="Selecione um eixo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum (apenas estrutura base)</SelectItem>
              {axes.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Visibilidade</Label>
          <Select value={form.visibility} onValueChange={(v) => setForm(p => ({ ...p, visibility: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="exclusive">Exclusivo (membros)</SelectItem>
              <SelectItem value="public">Público (resumido)</SelectItem>
              <SelectItem value="public_full">Público + Completo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{isDialogo ? 'Voz Oracular (IA)' : 'Voz'}</Label>
          <Select value={form.voz_escolhida} onValueChange={(v) => setForm(p => ({ ...p, voz_escolhida: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="suave">🌙 Voz Suave</SelectItem>
              <SelectItem value="contemplativa">🌿 Voz Contemplativa</SelectItem>
              <SelectItem value="casa_oracula">✨ Voz Casa Orácula</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Intenção Terapêutica</Label>
        <Textarea value={form.intencao_terapeutica} onChange={(e) => setForm(p => ({ ...p, intencao_terapeutica: e.target.value }))} placeholder="Qual a intenção terapêutica desta leitura?" className="min-h-[60px]" />
      </div>

      <div className="space-y-2">
        <Label>Texto Base / Ideias-chave</Label>
        <Textarea value={form.texto_base} onChange={(e) => setForm(p => ({ ...p, texto_base: e.target.value }))} placeholder="Texto base, citações, ideias-chave para a geração do roteiro..." className="min-h-[120px]" />
      </div>

      <Button onClick={handleGenerate} disabled={generating} className="gap-2" variant="gold">
        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {generating ? 'Gerando roteiro...' : `Gerar Episódio (${isDialogo ? 'Diálogo' : 'Narrativo'})`}
      </Button>

      {form.roteiro_completo && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Roteiro Completo</Label>
              {isDialogo && (
                <Button variant="outline" size="sm" onClick={() => setShowDialogueView(!showDialogueView)} className="gap-2">
                  <Eye className="w-4 h-4" />
                  {showDialogueView ? 'Ver Texto' : 'Ver Diálogo'}
                </Button>
              )}
            </div>

            {isDialogo && showDialogueView ? (
              <DialogueBlocksView text={form.roteiro_completo} />
            ) : (
              <Textarea value={form.roteiro_completo} onChange={(e) => setForm(p => ({ ...p, roteiro_completo: e.target.value }))} className="min-h-[300px] font-mono text-sm" />
            )}

            {isDialogo ? (
              <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                <h4 className="font-semibold text-foreground">🎙️ Áudio — Diálogo Oracular</h4>
                
                <div className="space-y-2">
                  <Label>Áudio da Narradora (upload manual)</Label>
                  <AudioUpload
                    value={audioUrls.narradora || ''}
                    onChange={(url) => setAudioUrls(p => ({ ...p, narradora: url }))}
                    folder="studio/narradora"
                    label=""
                    showLibrary={false}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Áudio da Voz Oracular (gerado por IA)</Label>
                  <Button onClick={handleGenerateOracularAudio} disabled={!!generatingAudio} size="sm" variant="outline" className="gap-2">
                    {generatingAudio === 'oracular' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                    Gerar Áudio Voz Oracular
                  </Button>
                  {audioUrls.oracular && <UnifiedAudioPlayer audioUrl={audioUrls.oracular} title="Voz Oracular" size="sm" />}
                </div>

                {audioUrls.narradora && audioUrls.oracular && (
                  <div className="space-y-4 pt-3 border-t border-border/50">
                    <h4 className="font-semibold text-foreground">🎬 Finalização do Episódio</h4>

                    {/* Vinhetas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>🔔 Vinheta de Abertura (opcional)</Label>
                        <AudioUpload
                          value={audioUrls.vinheta_abertura || ''}
                          onChange={(url) => setAudioUrls(p => ({ ...p, vinheta_abertura: url }))}
                          folder="studio/vinhetas"
                          label=""
                          showLibrary={false}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>🔔 Vinheta de Encerramento (opcional)</Label>
                        <AudioUpload
                          value={audioUrls.vinheta_encerramento || ''}
                          onChange={(url) => setAudioUrls(p => ({ ...p, vinheta_encerramento: url }))}
                          folder="studio/vinhetas"
                          label=""
                          showLibrary={false}
                        />
                      </div>
                    </div>

                    {/* Trilha de fundo (config salva, mas mixagem requer processamento externo) */}
                    <div className="space-y-3 p-3 rounded-lg border bg-muted/20">
                      <div className="flex items-center justify-between">
                        <Label>🎵 Trilha de Fundo</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Ativar</span>
                          <Switch checked={form.trilha_ativa} onCheckedChange={(v) => setForm(p => ({ ...p, trilha_ativa: v }))} />
                        </div>
                      </div>
                      {form.trilha_ativa && (
                        <div className="space-y-3">
                          <AudioUpload
                            value={audioUrls.trilha_fundo || ''}
                            onChange={(url) => setAudioUrls(p => ({ ...p, trilha_fundo: url }))}
                            folder="studio/trilhas"
                            label=""
                            showLibrary={false}
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Volume ({form.trilha_volume}%)</Label>
                              <Input type="number" min={0} max={40} value={form.trilha_volume} onChange={(e) => setForm(p => ({ ...p, trilha_volume: parseInt(e.target.value) || 0 }))} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Fade In ({form.fade_in_seconds}s)</Label>
                              <Input type="number" min={0} max={10} value={form.fade_in_seconds} onChange={(e) => setForm(p => ({ ...p, fade_in_seconds: parseInt(e.target.value) || 0 }))} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Fade Out ({form.fade_out_seconds}s)</Label>
                              <Input type="number" min={0} max={10} value={form.fade_out_seconds} onChange={(e) => setForm(p => ({ ...p, fade_out_seconds: parseInt(e.target.value) || 0 }))} />
                            </div>
                          </div>
                          <p className="text-xs text-amber-500/80">⚠️ A mixagem de trilha de fundo (loop, volume, fade) requer pós-produção externa. As configurações são salvas para referência.</p>
                        </div>
                      )}
                    </div>

                    {/* Botão Finalizar */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Concatenar: {audioUrls.vinheta_abertura ? 'Vinheta + ' : ''}Narradora ↔ Voz Oracular{audioUrls.vinheta_encerramento ? ' + Vinheta' : ''}</p>
                      <Button onClick={handleMergeAudio} disabled={merging} size="sm" className="gap-2" variant="gold">
                        {merging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                        {merging ? 'Processando...' : 'Finalizar Episódio'}
                      </Button>
                      {audioUrls.final && <UnifiedAudioPlayer audioUrl={audioUrls.final} title="🎬 Áudio Final" size="md" />}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => handleGenerateAudio('full')} disabled={!!generatingAudio} size="sm" variant="outline" className="gap-2">
                  {generatingAudio === 'full' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  Gerar Áudio Completo
                </Button>
              </div>
            )}
            {!isDialogo && audioUrls.full && <UnifiedAudioPlayer audioUrl={audioUrls.full} title="Áudio Completo" size="sm" />}
          </div>

          <div className="space-y-2">
            <Label>Versão Resumida (Público)</Label>
            <Textarea value={form.versao_resumida} onChange={(e) => setForm(p => ({ ...p, versao_resumida: e.target.value }))} className="min-h-[200px] font-mono text-sm" />
            <div className="flex gap-2">
              <Button onClick={() => handleGenerateAudio('public')} disabled={!!generatingAudio} size="sm" variant="outline" className="gap-2">
                {generatingAudio === 'public' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                Gerar Áudio Público
              </Button>
            </div>
            {audioUrls.public && <UnifiedAudioPlayer audioUrl={audioUrls.public} title="Áudio Público" size="sm" />}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea value={form.descricao} onChange={(e) => setForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Descrição curta do episódio" className="min-h-[60px]" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Status:</Label>
          <Select value={form.status} onValueChange={(v) => setForm(p => ({ ...p, status: v }))}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
          Salvar
        </Button>
      </div>
    </div>
  );
}

// ============ Episodes List ============
function EpisodesList() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchEpisodes = async () => {
    const { data } = await supabase.from('studio_episodes').select('*, studio_method_axes(nome)').order('created_at', { ascending: false });
    setEpisodes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEpisodes(); }, []);

  if (editing) {
    return (
      <div>
        <Button variant="ghost" onClick={() => setEditing(null)} className="mb-4">← Voltar</Button>
        <EpisodeEditor episode={editing} onSaved={() => { setEditing(null); fetchEpisodes(); }} />
      </div>
    );
  }

  if (creating) {
    return (
      <div>
        <Button variant="ghost" onClick={() => setCreating(false)} className="mb-4">← Voltar</Button>
        <EpisodeEditor onSaved={() => { setCreating(false); fetchEpisodes(); }} />
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Episódios</h3>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Episódio
        </Button>
      </div>

      {episodes.length === 0 && (
        <p className="text-muted-foreground text-center py-8">Nenhum episódio criado ainda.</p>
      )}

      {episodes.map((ep) => (
        <Card key={ep.id} className="bg-card/50 hover:bg-card/80 transition-colors cursor-pointer" onClick={() => setEditing(ep)}>
          <CardContent className="py-4 flex items-center justify-between">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground truncate">{ep.titulo || ep.livro}</span>
                <Badge variant={ep.status === 'published' ? 'default' : 'secondary'} className="shrink-0">
                  {ep.status === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
                <Badge variant="outline" className="shrink-0">
                  {ep.tipo_episodio === 'clube_livro' ? '📖 Clube' : ep.tipo_episodio === 'formacao' ? '🎓 Formação' : '🎙️ Podcast'}
                </Badge>
                <Badge variant="outline" className="shrink-0">
                  {ep.formato === 'dialogo' ? '💬 Diálogo' : '🎙️ Narrativo'}
                </Badge>
                <Badge variant="outline" className="shrink-0">
                  {ep.visibility === 'exclusive' ? '🔒 Exclusivo' : ep.visibility === 'public' ? '🌐 Público' : '🌐 Público+'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {ep.livro} {ep.capitulo ? `— ${ep.capitulo}` : ''} {ep.studio_method_axes?.nome ? `• Eixo: ${ep.studio_method_axes.nome}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {ep.audio_full_url && <Music className="w-4 h-4 text-gold" />}
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============ Main Admin Tab ============
export function AdminEstudioOracular() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Estúdio Oracular</h2>
        <p className="text-muted-foreground">Produção e distribuição de leituras terapêuticas simbólicas.</p>
      </div>

      <Tabs defaultValue="episodes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="episodes" className="gap-2"><Music className="w-4 h-4" /> Episódios</TabsTrigger>
          <TabsTrigger value="method" className="gap-2"><Pencil className="w-4 h-4" /> Método</TabsTrigger>
          <TabsTrigger value="axes" className="gap-2"><Eye className="w-4 h-4" /> Eixos</TabsTrigger>
        </TabsList>

        <TabsContent value="episodes">
          <EpisodesList />
        </TabsContent>

        <TabsContent value="method">
          <MethodBlocksManager />
        </TabsContent>

        <TabsContent value="axes">
          <MethodAxesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminEstudioOracular;
