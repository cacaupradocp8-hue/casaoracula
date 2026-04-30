import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Pencil, Trash2, GripVertical, Loader2, Sparkles, 
  Headphones, PenTool, ClipboardList, Zap, ArrowRight,
  Info, Image as ImageIcon, Map as MapIcon, BookOpen, Compass
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface PassoRota {
  id: string;
  estacao_id: string;
  titulo: string;
  subtitulo: string | null;
  tipo: string;
  tipo_passo: 'portal' | 'escuta' | 'aplicacao' | 'registro' | 'integracao';
  ordem: number;
  publicado: boolean;
  icone: string | null;
  impacto_cidadela: any;
  conteudo_inline: any;
  metadata: any;
}

interface Props {
  estacaoId: string;
}

const TIPO_LABELS: Record<string, string> = {
  portal: 'Portal de Abertura',
  escuta: 'Escuta Contemplativa',
  aplicacao: 'Aplicação Prática',
  registro: 'Registro no Jardim',
  integracao: 'Integração Oracular',
};

const TIPO_ICONS: Record<string, any> = {
  portal: Sparkles,
  escuta: Headphones,
  aplicacao: PenTool,
  registro: ClipboardList,
  integracao: Zap,
};

export function PassosRotaTab({ estacaoId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PassoRota | null>(null);
  const [form, setForm] = useState<{
    titulo: string;
    subtitulo: string;
    tipo_passo: 'portal' | 'escuta' | 'aplicacao' | 'registro' | 'integracao';
    ordem: number;
    icone: string;
    image_url: string;
    porta: string;
    campo: string;
    torre: string;
    labirinto: string;
    frase_guia: string;
    impacto_cidadela: string;
    conteudo_texto: string;
    proximo_passo_label: string;
    audios: string;
    jardim_prompt: string;
    simulacao_texto: string;
    perguntas_sugeridas: string;
    cta_label: string;
    cta_url: string;
  }>({
    titulo: '',
    subtitulo: '',
    tipo_passo: 'portal',
    ordem: 0,
    icone: '',
    image_url: '',
    porta: '',
    campo: '',
    torre: '',
    labirinto: '',
    frase_guia: '',
    impacto_cidadela: '[]',
    conteudo_texto: '',
    proximo_passo_label: '',
    audios: '[]',
    jardim_prompt: '',
    simulacao_texto: '',
    perguntas_sugeridas: '[]',
    cta_label: '',
    cta_url: '',
  });

  const { data: passos = [], isLoading } = useQuery({
    queryKey: ['admin-rota-passos', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as PassoRota[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      let impactoJson = [];
      let audiosJson = [];
      let perguntasJson = [];
      
      try {
        impactoJson = JSON.parse(data.impacto_cidadela || '[]');
        audiosJson = JSON.parse(data.audios || '[]');
        perguntasJson = JSON.parse(data.perguntas_sugeridas || '[]');
      } catch (e) {
        throw new Error('Certifique-se que os campos JSON (Impacto, Áudios, Perguntas) são válidos.');
      }

      const payload = {
        estacao_id: estacaoId,
        titulo: data.titulo,
        subtitulo: data.subtitulo || null,
        tipo_passo: data.tipo_passo,
        tipo: data.tipo_passo,
        ordem: data.ordem,
        icone: data.icone || null,
        image_url: data.image_url || null,
        porta: data.porta || null,
        campo: data.campo || null,
        torre: data.torre || null,
        labirinto: data.labirinto || null,
        frase_guia: data.frase_guia || null,
        jardim_prompt: data.jardim_prompt || null,
        cenario_treinamento: data.simulacao_texto || null,
        impacto_cidadela: impactoJson,
        conteudo_inline: { texto: data.conteudo_texto },
        metadata: { 
          proximo_passo: data.proximo_passo_label,
          audios: audiosJson,
          jardim_prompt: data.jardim_prompt,
          simulacao_texto: data.simulacao_texto,
          perguntas_sugeridas: perguntasJson,
          cta_label: data.cta_label,
          cta_url: data.cta_url
        },
        slug: data.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };

      if (data.id) {
        const { error } = await supabase.from('clube_rota_itens').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clube_rota_itens').insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['admin-rota-passos', estacaoId] });
      toast({ title: editing ? 'Passo atualizado' : 'Passo criado' });
      
      // If requested to stay open for "Add Another"
      if ((variables as any).addAnother) {
        setEditing(null);
        setForm(prev => ({
          ...prev,
          titulo: '',
          subtitulo: '',
          conteudo_texto: '',
          ordem: prev.ordem + 10,
        }));
      } else {
        setDialogOpen(false);
      }
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_rota_itens').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rota-passos', estacaoId] });
      toast({ title: 'Passo removido' });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      titulo: '',
      subtitulo: '',
      tipo_passo: 'portal',
      ordem: passos.length > 0 ? passos[passos.length - 1].ordem + 10 : 10,
      icone: '',
      image_url: '',
      porta: '',
      campo: '',
      torre: '',
      labirinto: '',
      frase_guia: '',
      impacto_cidadela: '[]',
      conteudo_texto: '',
      proximo_passo_label: '',
      audios: '[]',
      jardim_prompt: '',
      simulacao_texto: '',
      perguntas_sugeridas: '[]',
      cta_label: '',
      cta_url: '',
    });
    setDialogOpen(true);
  };

  const openEdit = (p: PassoRota) => {
    setEditing(p);
    setForm({
      titulo: p.titulo,
      subtitulo: p.subtitulo || '',
      tipo_passo: p.tipo_passo || 'portal',
      ordem: p.ordem,
      icone: p.icone || '',
      image_url: (p as any).image_url || '',
      porta: (p as any).porta || '',
      campo: (p as any).campo || '',
      torre: (p as any).torre || '',
      labirinto: (p as any).labirinto || '',
      frase_guia: (p as any).frase_guia || '',
      impacto_cidadela: JSON.stringify(p.impacto_cidadela || [], null, 2),
      conteudo_texto: p.conteudo_inline?.texto || '',
      proximo_passo_label: p.metadata?.proximo_passo || '',
      audios: JSON.stringify(p.metadata?.audios || [], null, 2),
      jardim_prompt: (p as any).jardim_prompt || p.metadata?.jardim_prompt || '',
      simulacao_texto: (p as any).cenario_treinamento || p.metadata?.simulacao_texto || '',
      perguntas_sugeridas: JSON.stringify(p.metadata?.perguntas_sugeridas || [], null, 2),
      cta_label: p.metadata?.cta_label || '',
      cta_url: p.metadata?.cta_url || '',
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif">Fluxo da Estrada</h2>
          <p className="text-xs text-muted-foreground">
            Defina a sequência exata que a aluna percorrerá nesta estação.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2 bg-gold hover:bg-gold/90 text-black font-semibold">
          <Plus className="w-4 h-4" /> Novo Passo
        </Button>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 flex gap-3 items-start">
        <Info className="w-4 h-4 text-amber-500 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          O sistema agora é <strong>sequencial</strong>. A aluna verá apenas um passo por vez. 
          Use a <strong>ordem</strong> para definir o caminho e o <strong>tipo</strong> para habilitar as ferramentas corretas.
        </div>
      </div>

      {passos.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            Nenhum passo definido para esta estrada. Comece criando um Portal de Abertura.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 relative">
          {/* Vertical connector line */}
          <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-border/40" />

          {passos.map((p, idx) => {
            const Icon = TIPO_ICONS[p.tipo_passo] || Sparkles;
            return (
              <Card key={p.id} className="hover:border-gold/30 transition-all group relative ml-4">
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Step counter / indicator */}
                  <div className="absolute -left-[24px] z-10 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center text-[10px] font-bold group-hover:border-gold transition-colors">
                    {idx + 1}
                  </div>

                  <div className="p-2 rounded bg-muted/50 group-hover:bg-gold/10 transition-colors">
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-gold" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">{p.titulo}</span>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-4 px-1">
                        {TIPO_LABELS[p.tipo_passo]}
                      </Badge>
                      {p.impacto_cidadela && p.impacto_cidadela.length > 0 && (
                        <Badge className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 h-4">
                          Impacto OK
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate italic">
                      {p.subtitulo || 'Sem subtítulo'} • Ordem: {p.ordem}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (window.confirm(`Remover o passo "${p.titulo}"?`)) {
                          deleteMutation.mutate(p.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto p-6">
          <DialogHeader className="pb-2">
            <DialogTitle>{editing ? 'Editar Passo' : 'Novo Passo da Estrada'}</DialogTitle>
            <DialogDescription>Configure o conteúdo e o impacto deste passo na jornada.</DialogDescription>
          </DialogHeader>

          <div className="pt-2">
            <div className="space-y-6 pb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Título do Passo</label>
                  <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="A voz silenciada" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Subtítulo / Tema</label>
                  <Input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} placeholder="Portal Semanal" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Tipo de Passo</label>
                  <Select value={form.tipo_passo} onValueChange={(v: 'portal' | 'escuta' | 'aplicacao' | 'registro' | 'integracao') => setForm({ ...form, tipo_passo: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portal">Portal de Abertura</SelectItem>
                      <SelectItem value="escuta">Escuta Contemplativa</SelectItem>
                      <SelectItem value="aplicacao">Aplicação Prática</SelectItem>
                      <SelectItem value="registro">Registro no Jardim</SelectItem>
                      <SelectItem value="integracao">Integração Oracular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Ordem (Peso)</label>
                  <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Emoji / Ícone</label>
                  <Input value={form.icone} onChange={(e) => setForm({ ...form, icone: e.target.value })} placeholder="🌀" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Conteúdo / Texto (Markdown)</label>
                <Textarea 
                  value={form.conteudo_texto} 
                  onChange={(e) => setForm({ ...form, conteudo_texto: e.target.value })} 
                  rows={6} 
                  placeholder="Texto que será exibido para a aluna..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Impacto Cidadela (JSON)</label>
                  <Textarea 
                    value={form.impacto_cidadela} 
                    onChange={(e) => setForm({ ...form, impacto_cidadela: e.target.value })} 
                    className="font-mono text-[10px]"
                    rows={4}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Rótulo Próximo Passo</label>
                  <Input 
                    value={form.proximo_passo_label} 
                    onChange={(e) => setForm({ ...form, proximo_passo_label: e.target.value })} 
                    placeholder="Ex: A adaptação invisível"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gold">Botão CTA (Texto)</label>
                  <Input 
                    value={form.cta_label} 
                    onChange={(e) => setForm({ ...form, cta_label: e.target.value })} 
                    placeholder="Ex: Começar Formação"
                    className="border-gold/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gold">Link do CTA</label>
                  <Input 
                    value={form.cta_url} 
                    onChange={(e) => setForm({ ...form, cta_url: e.target.value })} 
                    placeholder="Ex: https://..."
                    className="border-gold/20"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <label className="text-xs font-bold uppercase text-gold flex items-center gap-2">
                  <MapIcon className="w-4 h-4" /> Cartografia & Conteúdo Premium
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <ImageUpload 
                    label="Imagem/Banner da Rota" 
                    value={form.image_url} 
                    onChange={url => setForm({...form, image_url: url})} 
                    folder="rotas"
                    aspectRatio="video"
                  />
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Frase-Guia</label>
                      <Input value={form.frase_guia} onChange={e => setForm({...form, frase_guia: e.target.value})} placeholder="O lobo que uiva na noite..." />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Porta</label>
                        <Input value={form.porta} onChange={e => setForm({...form, porta: e.target.value})} placeholder="Iniciação" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Campo</label>
                        <Input value={form.campo} onChange={e => setForm({...form, campo: e.target.value})} placeholder="Selvagem" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Torre</label>
                        <Input value={form.torre} onChange={e => setForm({...form, torre: e.target.value})} placeholder="Vigilância" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Labirinto</label>
                        <Input value={form.labirinto} onChange={e => setForm({...form, labirinto: e.target.value})} placeholder="Sombras" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-2"><Headphones className="w-3.5 h-3.5" /> Áudios (JSON)</label>
                    <Textarea 
                      value={form.audios} 
                      onChange={(e) => setForm({ ...form, audios: e.target.value })} 
                      placeholder='[{"titulo": "Escuta 1", "url": "...", "duracao": "10:00"}]'
                      className="font-mono text-[10px]"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-2"><Compass className="w-3.5 h-3.5" /> Prompt do Jardim</label>
                    <Textarea 
                      value={form.jardim_prompt} 
                      onChange={(e) => setForm({ ...form, jardim_prompt: e.target.value })} 
                      placeholder="Prompt para o registro no jardim..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Cenário da Simulação</label>
                    <Textarea 
                      value={form.simulacao_texto} 
                      onChange={(e) => setForm({ ...form, simulacao_texto: e.target.value })} 
                      rows={2}
                      placeholder="Contexto da câmara de simulação..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Perguntas Sugeridas (JSON)</label>
                    <Input 
                      value={form.perguntas_sugeridas} 
                      onChange={(e) => setForm({ ...form, perguntas_sugeridas: e.target.value })} 
                      placeholder='["Pergunta 1", "Pergunta 2"]'
                      className="font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 sticky bottom-0 bg-background pt-4 border-t mt-4">
                {!editing && (
                  <Button
                    variant="outline"
                    className="flex-1 border-gold/30 text-gold hover:bg-gold/5 font-semibold"
                    disabled={!form.titulo || saveMutation.isPending}
                    onClick={() => saveMutation.mutate({ ...form, addAnother: true } as any)}
                  >
                    Salvar e +1
                  </Button>
                )}
                <Button
                  className={cn("flex-1 bg-gold hover:bg-gold/90 text-black font-bold", editing ? "w-full" : "")}
                  disabled={!form.titulo || saveMutation.isPending}
                  onClick={() => saveMutation.mutate({ ...form, id: editing?.id })}
                >
                  {saveMutation.isPending ? 'Salvando...' : editing ? 'Salvar Alterações' : 'Criar Passo'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
