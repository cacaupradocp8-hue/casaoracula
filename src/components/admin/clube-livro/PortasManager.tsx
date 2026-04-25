// ============================================
// PORTAS MANAGER — Gerenciar Portas Multipolares de um Ciclo
// Com conteúdo aninhado: Aulas, Áudios, Podcasts por Porta
// ============================================

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  GraduationCap, Headphones, Podcast, Loader2, DoorOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AudioUpload } from '../AudioUpload';
import { AulaBlocosEditor, AulaBloco } from './AulaBlocosEditor';

const JORNADAS_OPTIONS = [
  { value: 'heroina', label: 'Jornada da Heroína', simbolo: '◈', cor: 'text-amber-400' },
  { value: 'sombra', label: 'Jornada da Sombra', simbolo: '◉', cor: 'text-violet-400' },
  { value: 'expressao', label: 'Jornada da Expressão', simbolo: '◎', cor: 'text-teal-400' },
  { value: 'instinto', label: 'Jornada do Instinto', simbolo: '△', cor: 'text-rose-400' },
  { value: 'lideranca', label: 'Jornada da Liderança', simbolo: '⬡', cor: 'text-sky-400' },
];

interface Porta {
  id: string;
  ciclo_id: string;
  jornada: string;
  titulo: string;
  descricao?: string;
  icone?: string;
  cor?: string;
  ordem: number;
  ativo: boolean;
}

interface AulaPorta {
  id: string;
  ciclo_id: string;
  porta_id?: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  duracao?: string;
  media_url?: string;
  media_type?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
}

interface EscutaPorta {
  id: string;
  ciclo_id: string;
  porta_id?: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  audio_url?: string;
  texto_conteudo?: string;
  duracao_segundos?: number;
  ordem: number;
  ativo: boolean;
}

// ============================================
// Main PortasManager
// ============================================
export function PortasManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Porta | null>(null);
  const [expandedPorta, setExpandedPorta] = useState<string | null>(null);

  const { data: portas, isLoading } = useQuery({
    queryKey: ['admin-clube-portas', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_portas')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as Porta[];
    },
  });

  const deletePorta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_portas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-portas', cicloId] });
      toast({ title: 'Porta removida' });
    },
  });

  const toggleAtivo = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from('clube_livro_portas').update({ ativo }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-portas', cicloId] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {portas?.length || 0} porta(s) configurada(s)
        </p>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-1">
          <Plus className="w-3 h-3" />
          Nova Porta
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : portas && portas.length > 0 ? (
        <div className="space-y-3">
          {portas.map((porta) => {
            const jornadaInfo = JORNADAS_OPTIONS.find(j => j.value === porta.jornada);
            const isExpanded = expandedPorta === porta.id;
            return (
              <Card key={porta.id} className={cn(isExpanded && 'border-gold/50')}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <span className={cn('text-lg', jornadaInfo?.cor || 'text-muted-foreground')}>
                      {jornadaInfo?.simbolo || '◇'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{porta.titulo}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {jornadaInfo?.label || porta.jornada}
                        </Badge>
                      </div>
                      {porta.descricao && (
                        <p className="text-xs text-muted-foreground truncate">{porta.descricao}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Switch
                        checked={porta.ativo}
                        onCheckedChange={(v) => toggleAtivo.mutate({ id: porta.id, ativo: v })}
                      />
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(porta); setDialogOpen(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setExpandedPorta(isExpanded ? null : porta.id)}>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deletePorta.mutate(porta.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      <PortaContentTabs cicloId={cicloId} portaId={porta.id} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-lg">
          <DoorOpen className="w-6 h-6 mx-auto mb-2 opacity-50" />
          Nenhuma porta cadastrada. Crie portas para definir trajetórias multipolares.
        </div>
      )}

      <PortaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        porta={editing}
        cicloId={cicloId}
        nextOrdem={(portas?.length || 0) + 1}
      />
    </div>
  );
}

// ============================================
// PortaContentTabs — Aulas, Áudios, Podcasts de uma Porta
// ============================================
function PortaContentTabs({ cicloId, portaId }: { cicloId: string; portaId: string }) {
  return (
    <Tabs defaultValue="aulas" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="aulas" className="gap-1 text-xs">
          <GraduationCap className="w-3 h-3" />
          Aulas
        </TabsTrigger>
        <TabsTrigger value="audios" className="gap-1 text-xs">
          <Headphones className="w-3 h-3" />
          Áudios
        </TabsTrigger>
        <TabsTrigger value="podcasts" className="gap-1 text-xs">
          <Podcast className="w-3 h-3" />
          Podcasts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="aulas" className="pt-3">
        <PortaAulasManager cicloId={cicloId} portaId={portaId} />
      </TabsContent>
      <TabsContent value="audios" className="pt-3">
        <PortaEscutasManager cicloId={cicloId} portaId={portaId} tipoFilter="audio" label="Áudio" />
      </TabsContent>
      <TabsContent value="podcasts" className="pt-3">
        <PortaEscutasManager cicloId={cicloId} portaId={portaId} tipoFilter="podcast" label="Podcast" />
      </TabsContent>
    </Tabs>
  );
}

// ============================================
// PortaAulasManager — Aulas vinculadas a uma porta
// ============================================
function PortaAulasManager({ cicloId, portaId }: { cicloId: string; portaId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AulaPorta | null>(null);

  const { data: aulas, isLoading } = useQuery({
    queryKey: ['admin-clube-aulas-porta', portaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_aulas')
        .select('*')
        .eq('porta_id', portaId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as AulaPorta[];
    },
  });

  const deleteAula = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_aulas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-aulas-porta', portaId] });
      toast({ title: 'Aula removida' });
    },
  });

  const togglePublicado = useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { error } = await supabase.from('clube_livro_aulas').update({ publicado }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-aulas-porta', portaId] });
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{aulas?.length || 0} aula(s)</span>
        <Button size="sm" variant="outline" onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-1 text-xs h-7">
          <Plus className="w-3 h-3" />
          Aula
        </Button>
      </div>

      {isLoading ? <div className="animate-pulse h-10 bg-muted rounded" /> : aulas && aulas.length > 0 ? (
        <div className="space-y-1.5">
          {aulas.map((aula) => (
            <div key={aula.id} className="flex items-center gap-2 p-2 rounded border text-sm bg-card/50">
              <span className="text-xs font-mono text-muted-foreground w-5 text-center">{aula.ordem}</span>
              <span className="flex-1 truncate">{aula.titulo}</span>
              <Switch checked={aula.publicado} onCheckedChange={(v) => togglePublicado.mutate({ id: aula.id, publicado: v })} />
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setEditing(aula); setDialogOpen(true); }}>
                <Pencil className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteAula.mutate(aula.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-3">Nenhuma aula nesta porta.</p>
      )}

      <PortaAulaDialog open={dialogOpen} onOpenChange={setDialogOpen} aula={editing} cicloId={cicloId} portaId={portaId} nextOrdem={(aulas?.length || 0) + 1} />
    </div>
  );
}

// ============================================
// PortaEscutasManager — Áudios ou Podcasts vinculados a uma porta
// ============================================
function PortaEscutasManager({ cicloId, portaId, tipoFilter, label }: { cicloId: string; portaId: string; tipoFilter: string; label: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const qk = ['admin-clube-escutas-porta', portaId, tipoFilter];

  const { data: escutas, isLoading } = useQuery({
    queryKey: qk,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_escutas')
        .select('*')
        .eq('porta_id', portaId)
        .eq('tipo', tipoFilter)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as EscutaPorta[];
    },
  });

  const deleteEscuta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_escutas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk });
      toast({ title: `${label} removido` });
    },
  });

  const save = useMutation({
    mutationFn: async (form: { titulo: string; audio_url: string; descricao: string }) => {
      const { data, error } = await supabase.from('clube_livro_escutas').insert({
        ciclo_id: cicloId,
        porta_id: portaId,
        titulo: form.titulo,
        tipo: tipoFilter,
        audio_url: form.audio_url || null,
        descricao: form.descricao || null,
        ordem: (escutas?.length || 0) + 1,
      }).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk });
      setDialogOpen(false);
      toast({ title: `${label} adicionado` });
    },
    onError: (error) => {
      console.error('Erro ao salvar escuta/podcast:', error);
      toast({ title: `Erro ao salvar ${label.toLowerCase()}`, description: error.message, variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{escutas?.length || 0} {label.toLowerCase()}(s)</span>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)} className="gap-1 text-xs h-7">
          <Plus className="w-3 h-3" />
          {label}
        </Button>
      </div>

      {isLoading ? <div className="animate-pulse h-10 bg-muted rounded" /> : escutas && escutas.length > 0 ? (
        <div className="space-y-1.5">
          {escutas.map((e) => (
            <div key={e.id} className="flex items-center gap-2 p-2 rounded border text-sm bg-card/50">
              {tipoFilter === 'podcast' ? <Podcast className="w-3.5 h-3.5 text-gold shrink-0" /> : <Headphones className="w-3.5 h-3.5 text-gold shrink-0" />}
              <span className="flex-1 truncate">{e.titulo}</span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteEscuta.mutate(e.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-3">Nenhum {label.toLowerCase()} nesta porta.</p>
      )}

      <SimpleEscutaDialog open={dialogOpen} onOpenChange={setDialogOpen} label={label} onSave={(form) => save.mutate(form)} isPending={save.isPending} />
    </div>
  );
}

// ============================================
// Dialogs
// ============================================
function PortaDialog({ open, onOpenChange, porta, cicloId, nextOrdem }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  porta: Porta | null; cicloId: string; nextOrdem: number;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ titulo: '', jornada: 'heroina', descricao: '', icone: '', cor: '', ordem: nextOrdem });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ciclo_id: cicloId,
        titulo: form.titulo,
        jornada: form.jornada,
        descricao: form.descricao || null,
        icone: form.icone || null,
        cor: form.cor || null,
        ordem: form.ordem,
      };
      if (porta?.id) {
        const { error } = await supabase.from('clube_livro_portas').update(payload).eq('id', porta.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clube_livro_portas').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-portas', cicloId] });
      onOpenChange(false);
      toast({ title: porta ? 'Porta atualizada' : 'Porta criada' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar porta', variant: 'destructive' });
    },
  });

  useEffect(() => {
    if (open && porta) {
      setForm({
        titulo: porta.titulo || '',
        jornada: porta.jornada || 'heroina',
        descricao: porta.descricao || '',
        icone: porta.icone || '',
        cor: porta.cor || '',
        ordem: porta.ordem,
      });
    } else if (open) {
      setForm({
        titulo: '',
        jornada: 'heroina',
        descricao: '',
        icone: '',
        cor: '',
        ordem: nextOrdem
      });
    }
  }, [open, porta, nextOrdem]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{porta ? 'Editar Porta' : 'Nova Porta'}</DialogTitle>
          <DialogDescription>Uma porta define uma trajetória de atravessamento do livro.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Porta da Heroína" />
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Jornada *</Label>
            <Select value={form.jornada} onValueChange={(v) => setForm({ ...form, jornada: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JORNADAS_OPTIONS.map((j) => (
                  <SelectItem key={j.value} value={j.value}>
                    <span className="flex items-center gap-2">
                      <span className={j.cor}>{j.simbolo}</span>
                      {j.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="min-h-[60px]" placeholder="Breve descrição da trajetória..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ícone (emoji)</Label>
              <Input value={form.icone} onChange={(e) => setForm({ ...form, icone: e.target.value })} placeholder="◈" />
            </div>
            <div className="space-y-2">
              <Label>Cor (hex)</Label>
              <Input value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} placeholder="#F59E0B" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PortaAulaDialog({ open, onOpenChange, aula, cicloId, portaId, nextOrdem }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  aula: AulaPorta | null; cicloId: string; portaId: string; nextOrdem: number;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ titulo: '', subtitulo: '', descricao: '', duracao: '', media_url: '', media_type: 'video', conteudo: '', ordem: nextOrdem });
  const [blocos, setBlocos] = useState<AulaBloco[]>([]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        ciclo_id: cicloId,
        porta_id: portaId,
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        descricao: form.descricao || null,
        duracao: form.duracao || null,
        media_url: form.media_type !== 'texto' ? (form.media_url || null) : null,
        media_type: form.media_type,
        conteudo: blocos.length > 0 ? JSON.stringify(blocos) : (form.media_type === 'texto' ? (form.conteudo || null) : null),
        ordem: form.ordem,
      } as any;
      if (aula?.id) {
        const { error } = await supabase.from('clube_livro_aulas').update(payload as any).eq('id', aula.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clube_livro_aulas').insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-aulas-porta', portaId] });
      onOpenChange(false);
      toast({ title: aula ? 'Aula atualizada' : 'Aula criada' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar aula', variant: 'destructive' });
    },
  });

  useEffect(() => {
    if (open && aula) {
      setForm({
        titulo: aula.titulo || '',
        subtitulo: aula.subtitulo || '',
        descricao: aula.descricao || '',
        duracao: aula.duracao || '',
        media_url: aula.media_url || '',
        media_type: aula.media_type || 'video',
        conteudo: '',
        ordem: aula.ordem,
      });
      // Parse existing blocos
      try {
        const raw = (aula as any).conteudo;
        if (raw) {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (Array.isArray(parsed)) setBlocos(parsed);
        }
      } catch { setBlocos([]); }
    } else if (open) {
      setForm({
        titulo: '',
        subtitulo: '',
        descricao: '',
        duracao: '',
        media_url: '',
        media_type: 'video',
        conteudo: '',
        ordem: nextOrdem,
      });
      setBlocos([]);
    }
  }, [open, aula, nextOrdem]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{aula ? 'Editar Aula' : 'Nova Aula (Porta)'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração</Label>
              <Input value={form.duracao} onChange={(e) => setForm({ ...form, duracao: e.target.value })} placeholder="45min" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Mídia</Label>
              <Select value={form.media_type} onValueChange={(v) => setForm({ ...form, media_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="texto">Texto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {form.media_type === 'texto' ? (
            <div className="space-y-2">
              <Label>Conteúdo do Texto</Label>
              <Textarea value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} className="min-h-[120px]" placeholder="Digite o conteúdo da aula aqui..." />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>URL da Mídia</Label>
              <Input value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} placeholder="https://..." />
            </div>
          )}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="min-h-[60px]" />
          </div>
          {/* Blocos de conteúdo editáveis */}
          <AulaBlocosEditor blocos={blocos} onChange={setBlocos} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SimpleEscutaDialog({ open, onOpenChange, label, onSave, isPending }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  label: string; onSave: (form: { titulo: string; audio_url: string; descricao: string }) => void; isPending: boolean;
}) {
  const [form, setForm] = useState({ titulo: '', audio_url: '', descricao: '' });

  const handleOpenChange = (v: boolean) => {
    if (!v) setForm({ titulo: '', audio_url: '', descricao: '' });
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar {label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <AudioUpload
            value={form.audio_url}
            onChange={(url) => setForm({ ...form, audio_url: url })}
            folder="clube-livro/escutas"
            label="Arquivo de Áudio / Podcast"
          />
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="min-h-[60px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => { const data = { ...form }; onSave(data); }} disabled={isPending || !form.titulo.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
