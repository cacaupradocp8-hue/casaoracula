import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, BookOpen, Pencil, ImageIcon, Users, Eye, 
  Loader2, Settings, Rocket, Save, Music, Sparkles, Plus, Trash2, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function AdminCentralEstacao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { estacaoId } = useParams<{ estacaoId: string }>();

  const [editStationOpen, setEditStationOpen] = useState(false);
  const [selectedPassoId, setSelectedPassoId] = useState<string | null>(null);
  
  const [stationForm, setStationForm] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    publicada: false,
    ativa: false
  });

  // 1. Fetch Estação
  const { data: estacao, isLoading: loadingEstacao } = useQuery({
    queryKey: ['admin-v3-estacao-detail', estacaoId],
    queryFn: async () => {
      if (!estacaoId) return null;
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .eq('id', estacaoId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!estacaoId,
  });

  // 2. Fetch Passos (Itens da Rota)
  const { data: passos = [], isLoading: loadingPassos } = useQuery({
    queryKey: ['admin-rota-passos', estacaoId],
    queryFn: async () => {
      if (!estacaoId) return [];
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!estacaoId,
  });

  useEffect(() => {
    if (estacao) {
      setStationForm({
        titulo: estacao.titulo || '',
        subtitulo: estacao.subtitulo || '',
        descricao: estacao.descricao || '',
        publicada: estacao.publicada || false,
        ativa: estacao.ativa || false
      });
    }
  }, [estacao]);

  useEffect(() => {
    if (passos.length > 0 && !selectedPassoId) {
      setSelectedPassoId(passos[0].id);
    }
  }, [passos, selectedPassoId]);

  const selectedPasso = passos.find(p => p.id === selectedPassoId) || null;

  // Mutations
  const updateStationMutation = useMutation({
    mutationFn: async (data: typeof stationForm) => {
      const { error } = await supabase
        .from('clube_estacoes')
        .update({
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          descricao: data.descricao,
          publicada: data.publicada,
          ativa: data.ativa
        })
        .eq('id', estacaoId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-v3-estacao-detail', estacaoId] });
      setEditStationOpen(false);
      toast({ title: 'Estação atualizada!' });
    }
  });

  const savePassoMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (payload.id) {
        const { error } = await supabase
          .from('clube_rota_itens')
          .update(payload)
          .eq('id', payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_rota_itens')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rota-passos', estacaoId] });
      toast({ title: 'Conteúdo salvo com sucesso!' });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    }
  });

  const deletePassoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_rota_itens').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rota-passos', estacaoId] });
      setSelectedPassoId(null);
      toast({ title: 'Passo removido' });
    }
  });

  const handleCreatePasso = () => {
    const nextOrdem = passos.length > 0 ? Math.max(...passos.map(p => p.ordem)) + 10 : 10;
    const newPasso = {
      estacao_id: estacaoId,
      titulo: 'Nova Etapa',
      subtitulo: '',
      ordem: nextOrdem,
      tipo: 'escuta',
      tipo_passo: 'escuta',
      publicado: true,
      conteudo_inline: { texto: '' },
      metadata: { audios: [] }
    };
    savePassoMutation.mutate(newPasso);
  };

  if (loadingEstacao || loadingPassos) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!estacao) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Estação não encontrada.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/clube')}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32 max-w-6xl">
      {/* Header Consolidado */}
      <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6 mb-8 p-0 bg-card border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row flex-1 min-w-0">
          <div className="w-full md:w-32 h-32 md:h-auto bg-muted group relative cursor-pointer overflow-hidden" onClick={() => setEditStationOpen(true)}>
            {estacao.banner_url || estacao.livro_capa_url ? (
              <img src={estacao.banner_url || estacao.livro_capa_url} alt="Capa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-muted-foreground p-2 text-center">
                <ImageIcon className="w-6 h-6 mb-1 opacity-20" />
                Sem Capa
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Pencil className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate('/admin/clube/ciclos')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-serif text-foreground truncate">{estacao.titulo}</h1>
                  <Badge variant={estacao.publicada ? 'default' : 'secondary'} className={cn("text-[9px] uppercase tracking-widest", estacao.publicada ? "bg-emerald-500/10 text-emerald-500" : "")}>
                    {estacao.publicada ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  {estacao.livro_titulo}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-6 border-t md:border-t-0 border-primary/5 bg-muted/20">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/clube')}>
            <Eye className="h-3.5 w-3.5" /> Ver como Aluna
          </Button>
          <Button size="sm" className="bg-gold hover:bg-gold/90 text-black font-bold gap-2" onClick={() => setEditStationOpen(true)}>
            <Settings className="h-3.5 w-3.5" /> Estação
          </Button>
        </div>
      </div>

      {/* Unique Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Steps List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs uppercase tracking-widest font-bold text-gold/60">Etapas da Rota</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gold" onClick={handleCreatePasso}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {passos.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-primary/10 rounded-xl text-muted-foreground text-sm">
                Nenhuma etapa criada.
                <Button variant="link" className="text-gold" onClick={handleCreatePasso}>Criar agora</Button>
              </div>
            ) : (
              passos.map((p, idx) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPassoId(p.id)}
                  className={cn(
                    "group relative p-4 rounded-xl border cursor-pointer transition-all",
                    selectedPassoId === p.id 
                      ? "bg-gold/10 border-gold/40 shadow-lg shadow-gold/5" 
                      : "bg-card border-primary/5 hover:border-gold/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                      selectedPassoId === p.id ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                    )}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("text-sm font-semibold truncate", selectedPassoId === p.id ? "text-gold" : "text-foreground")}>
                        {p.titulo}
                      </h3>
                      <p className="text-[10px] text-muted-foreground truncate italic">
                        {p.subtitulo || 'Sem subtítulo'}
                      </p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 transition-transform", selectedPassoId === p.id ? "translate-x-1 text-gold" : "opacity-0")} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Unique Editor */}
        <div className="lg:col-span-8">
          {selectedPasso ? (
            <EditorUnico 
              passo={selectedPasso} 
              onSave={(payload) => savePassoMutation.mutate(payload)}
              onDelete={() => deletePassoMutation.mutate(selectedPasso.id)}
              loading={savePassoMutation.isPending}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-24 bg-muted/10 border-2 border-dashed border-primary/10 rounded-2xl">
              <Rocket className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground">Selecione uma etapa para editar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Station Dialog */}
      <Dialog open={editStationOpen} onOpenChange={setEditStationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações da Estação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={stationForm.titulo} onChange={e => setStationForm({...stationForm, titulo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input value={stationForm.subtitulo} onChange={e => setStationForm({...stationForm, subtitulo: e.target.value})} />
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={stationForm.publicada} onCheckedChange={v => setStationForm({...stationForm, publicada: v})} />
                <Label>Publicada</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={stationForm.ativa} onCheckedChange={v => setStationForm({...stationForm, ativa: v})} />
                <Label>Ativa</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStationOpen(false)}>Cancelar</Button>
            <Button className="bg-gold text-black font-bold" onClick={() => updateStationMutation.mutate(stationForm)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditorUnico({ passo, onSave, onDelete, loading }: { passo: any, onSave: (p: any) => void, onDelete: () => void, loading: boolean }) {
  const [form, setForm] = useState({
    titulo: passo.titulo || '',
    subtitulo: passo.subtitulo || '',
    conteudo_texto: passo.conteudo_inline?.texto || '',
    audio_url: passo.metadata?.audios?.[0]?.url || '',
    audio_titulo: passo.metadata?.audios?.[0]?.titulo || 'Áudio Principal',
    jardim_prompt: passo.jardim_prompt || passo.metadata?.jardim_prompt || '',
    cenario_treinamento: passo.cenario_treinamento || passo.metadata?.simulacao_texto || '',
  });

  useEffect(() => {
    setForm({
      titulo: passo.titulo || '',
      subtitulo: passo.subtitulo || '',
      conteudo_texto: passo.conteudo_inline?.texto || '',
      audio_url: passo.metadata?.audios?.[0]?.url || '',
      audio_titulo: passo.metadata?.audios?.[0]?.titulo || 'Áudio Principal',
      jardim_prompt: passo.jardim_prompt || passo.metadata?.jardim_prompt || '',
      cenario_treinamento: passo.cenario_treinamento || passo.metadata?.simulacao_texto || '',
    });
  }, [passo]);

  const handleSave = () => {
    const payload = {
      ...passo,
      titulo: form.titulo,
      subtitulo: form.subtitulo,
      conteudo_inline: { texto: form.conteudo_texto },
      jardim_prompt: form.jardim_prompt,
      cenario_treinamento: form.cenario_treinamento,
      metadata: {
        ...passo.metadata,
        audios: form.audio_url ? [{
          titulo: form.audio_titulo || 'Áudio Principal',
          url: form.audio_url,
          tipo: 'escuta'
        }] : [],
        jardim_prompt: form.jardim_prompt,
        simulacao_texto: form.cenario_treinamento
      }
    };
    onSave(payload);
  };

  return (
    <Card className="border-gold/20 bg-card/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-primary/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gold/10">
              <Rocket className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-foreground">Editor da Rota</h2>
              <p className="text-xs text-muted-foreground">Cole o conteúdo e a URL do áudio com segurança.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => window.confirm('Deseja remover esta etapa?') && onDelete()}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button 
              className="bg-gold hover:bg-gold/90 text-black font-bold gap-2 px-6" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              SALVAR ETAPA
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-gold/60">Título da Etapa</Label>
            <Input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} className="bg-background/50" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-gold/60">Subtítulo (Opcional)</Label>
            <Input value={form.subtitulo} onChange={e => setForm({...form, subtitulo: e.target.value})} className="bg-background/50" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest font-bold text-gold/60">Conteúdo Principal (Markdown/Texto)</Label>
          <Textarea 
            value={form.conteudo_texto} 
            onChange={e => setForm({...form, conteudo_texto: e.target.value})} 
            className="min-h-[300px] bg-background/50 leading-relaxed text-sm"
            placeholder="Cole aqui o conteúdo da sua jornada..."
          />
        </div>

        <div className="bg-muted/30 p-6 rounded-2xl border border-primary/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80">Áudio do Ritual</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label className="text-[10px]">Título do Áudio</Label>
               <Input value={form.audio_titulo} onChange={e => setForm({...form, audio_titulo: e.target.value})} className="bg-background/50" />
             </div>
             <div className="space-y-2">
               <Label className="text-[10px]">URL do Áudio (.mp3)</Label>
               <Input value={form.audio_url} onChange={e => setForm({...form, audio_url: e.target.value})} placeholder="https://..." className="bg-background/50 font-mono text-xs" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-gold/60 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Jardim da Psique
            </Label>
            <Textarea 
              value={form.jardim_prompt} 
              onChange={e => setForm({...form, jardim_prompt: e.target.value})} 
              className="bg-background/50 text-sm"
              placeholder="Prompt de escrita para a aluna..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-gold/60 flex items-center gap-2">
              <BookOpen className="w-3 h-3" /> Laboratório 80/20
            </Label>
            <Textarea 
              value={form.cenario_treinamento} 
              onChange={e => setForm({...form, cenario_treinamento: e.target.value})} 
              className="bg-background/50 text-sm"
              placeholder="Cenário prático ou caso clínico..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
